<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公共信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>患者管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="query" class="query" clearable @clear="getPatient">
            <el-button slot="append" icon="el-icon-search" @click="getPatientLikeName"></el-button>
          </el-input>
          <el-button type="success" @click="dialogAddPatient = true" plain v-if="role === '1'">添加患者</el-button>
        </el-col>
      </el-row>
      <el-table :data="patient" stripe style="width: 100%">
        <el-table-column align="center" type="index" label="编号" width="80px"></el-table-column>
        <el-table-column align="center" prop="idCard" label="身份证号"></el-table-column>
        <el-table-column align="center" prop="uName" label="姓名"></el-table-column>
        <el-table-column align="center" prop="sex" label="性别"></el-table-column>
        <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
        <el-table-column align="center" prop="age" label="年龄"></el-table-column>
        <el-table-column align="center" prop="telphone" label="电话"></el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="light"
              content="授予登录权限"
              :enterable="false"
              placement="top"
            >
              <el-button
                @click="addLogin(scope.row)"
                type="warning"
                icon="el-icon-star-off"
                circle
                plain
                v-if="role === '1'"
              ></el-button>
            </el-tooltip>
            <el-button
              @click="updatePatient(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              plain
            ></el-button>
            <el-button
              @click="deletePatirnt(scope.row)"
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              v-if="role === '1'"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog title="添加患者" :visible.sync="dialogAddPatient" @close="closeAddDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="身份证号" prop="idCard" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.idCard"
            oninput="value=value.replace(/[^\d]/g, '')"
            maxlength="18"
            show-word-limit
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="uName" :label-width="formLabelWidth">
          <el-input v-model="addForm.uName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" :label-width="formLabelWidth">
          <el-radio-group v-model="addForm.sex">
            <el-radio-button label="男"></el-radio-button>
            <el-radio-button label="女"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="照片" prop="uphoto" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:3000/api/upload/upload_image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" style="height: 50px" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.age"
            oninput="value=value.replace(/[^\d]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telphone" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.telphone"
            maxlength="11"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="staAddress" :label-width="formLabelWidth">
          <el-input v-model="addForm.staAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="病史" prop="history" :label-width="formLabelWidth">
          <el-input v-model="addForm.history" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDis()">取 消</el-button>
        <el-button type="primary" @click="addPatient('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加用户登录对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogAddUser" @close="closeAddUserDis()">
      <el-form :model="userForm" ref="userForm" :rules="rules" status-icon>
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input
            type="password"
            clearable
            show-password
            v-model="userForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" :label-width="formLabelWidth">
          <el-input
            type="password"
            clearable
            show-password
            v-model="userForm.password2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddUserDis()">取 消</el-button>
        <el-button type="primary" @click="addUser('userForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改患者信息" :visible.sync="dialogUpPatient" @close="closeUpDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="身份证号" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.idCard"
            readonly
            maxlength="18"
            show-word-limit
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="addForm.uName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" :label-width="formLabelWidth">
          <el-radio-group v-model="addForm.sex">
            <el-radio-button label="男"></el-radio-button>
            <el-radio-button label="女"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="照片" prop="uphoto" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:3000/api/upload/upload_image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" style="height: 50px" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.age"
            oninput="value=value.replace(/[^\d]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telphone" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.telphone"
            maxlength="11"
            show-word-limit
            oninput="value=value.replace(/[^\d]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="staAddress" :label-width="formLabelWidth">
          <el-input v-model="addForm.staAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="病史" prop="history" :label-width="formLabelWidth">
          <el-input v-model="addForm.history" type="textarea" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpDis()">取 消</el-button>
        <el-button type="primary" @click="upPatient('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'PatientList',
  data() {
    var validateidCard = async (rule, value, callback) => {
      const { data: res } = await await this._http.get(
        `patient/patientlistva?idCard=${value}`
      )
      console.log(res)
      if (res.statusCode === 0) {
        callback(new Error('身份证号码已存在'))
      }
    }
    return {
      role: localStorage.getItem('role'),
      uName: localStorage.getItem('uName'),
      query: '',
      dialogAddPatient: false,
      dialogUpPatient: false,
      dialogAddUser: false,
      patient: [],
      addForm: {
        sex: '男'
      },
      userForm: {},
      uploadData: {},
      formLabelWidth: '120px',
      value: '',
      sexOp: [
        {
          value: '男',
          label: '男'
        },
        {
          value: '女',
          label: '女'
        }
      ],
      rules: {
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          {
            min: 18,
            max: 18,
            message: '请输入正确的身份证号码',
            trigger: 'blur'
          },
          { validator: validateidCard, trigger: 'blur' }
        ],
        uName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        telphone: [
          { min: 11, max: 11, message: '请输入正确的电话号码', trigger: 'blur' }
        ]
      },
      imageUrl: '',
      imgPath: '',
      total: 0,
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getPatient()
  },
  // mounted() {
  //   this.getPatient()
  // },
  methods: {
    async getPatient() {
      if (this.uName === null || this.uName === '') {
        const { data: res } = await this._http.get(
          `patient/patientlist?pageNum=${this.queryInfo.pageNum}&pageSize=${this.queryInfo.pageSize}`
        )
        this.patient = res.patient
        this.total = res.num
      } else {
        const { data: res } = await this._http.get(
          `patient/patientlistname?uName=${this.uName}`
        )
        this.patient = res.patient
        this.total = res.patient.length
      }
    },
    addPatient(patient) {
      this.$refs[patient].validate(async valid => {
        if (valid) {
          this.addForm.uphoto = this.imgPath
          const { data: res } = await this._http.post(
            'patient/patientadd',
            this.addForm
          )
          if (res.statusCode === 0) {
            this.$message.success('添加成功')
            this.dialogAddPatient = false
            this.addForm = {}
            this.getPatient()
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },
    addLogin(patient) {
      this.dialogAddUser = true
      this.userForm.idCard = patient.idCard
    },
    addUser(user) {
      this.$refs[user].validate(async valid => {
        if (valid) {
          console.log(this.userForm)
          const { data: res } = await this._http.post(
            'patient/useradd',
            this.userForm
          )
          if (res.statusCode === 0) {
            this.dialogAddUser = false
            this.$message.success('添加成功')
            this.addForm = {}
            this.getPatient()
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },
    upPatient(patient) {
      this.$refs[patient].validate(async valid => {
        if (valid) {
          this.addForm.uphoto = this.imgPath
          const { data: res } = await this._http.post(
            'patient/patientup',
            this.addForm
          )
          if (res.statusCode === 0) {
            this.$message.success('修改成功')
            this.dialogUpPatient = false
            this.addForm = {}
            this.getPatient()
          } else {
            this.$message.error('修改失败')
          }
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.imgPath = file.response.imgPath
    },
    beforeAvatarUpload(file) {
      const isIMG = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isIMG) {
        this.$message.error('上传头像图片只能是图片格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isIMG && isLt2M
    },
    updatePatient(patient) {
      this.dialogUpPatient = true
      this.addForm = patient
      this.addForm.telphone = +patient.telphone
    },
    async getPatientLikeName() {
      if (this.query === '') {
        this.getPatient()
        return
      }
      const { data: res } = await this._http.get(
        `patient/patientlistname?uName=${this.query}`
      )
      if (res.statusCode === 0) {
        this.patient = res.patient
        this.total = res.patient.length
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getPatient()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getPatient()
    },
    closeAddDis() {
      this.dialogAddPatient = false
      this.addForm = {}
    },
    closeUpDis() {
      this.dialogUpPatient = false
      this.addForm = {}
    },
    deletePatirnt(user) {
      this.$confirm(`确定要删除${user.uName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this._http.delete(
            `patient/patientlistdel?idCard=${user.idCard}`
          )
          this.getPatient()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style scoped>
.box-card {
  margin-top: 20px;
  /* height: 96%; */
  min-height: 96%;
}
.query {
  width: 30%;
  margin: 20px 20px 20px 0px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
