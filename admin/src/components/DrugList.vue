<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>医保管理</el-breadcrumb-item>
      <el-breadcrumb-item>药品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="query" class="query" clearable @clear="getDrug">
            <el-button slot="append" icon="el-icon-search" @click="getDrugLikeName"></el-button>
          </el-input>
          <el-button type="success" @click="dialogAddDrug = true" plain v-if="role === '1'">添加药品</el-button>
        </el-col>
      </el-row>
      <el-table :data="drug" stripe style="width: 100%">
        <el-table-column align="center" type="index" label="编号" width="80px"></el-table-column>
        <el-table-column align="center" prop="dName" label="药品名称"></el-table-column>
        <el-table-column align="center" label="价格">
          <template v-slot="scope">
            <span>{{scope.row.dPrice | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="spec" label="规格"></el-table-column>
        <el-table-column align="center" prop="madePe" label="生产厂家"></el-table-column>
        <el-table-column align="center" prop="madeDate" label="生产日期"></el-table-column>
        <el-table-column align="center" prop="dFunction" label="功能主治"></el-table-column>
        <el-table-column label="操作" align="center" v-if="role === '1'">
          <template v-slot="scope">
            <el-button
              @click="updateDrug(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              plain
            ></el-button>
            <el-button
              @click="deleteDrug(scope.row)"
              type="danger"
              icon="el-icon-delete"
              circle
              plain
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
    <el-dialog title="添加药品" :visible.sync="dialogAddDrug" @close="closeAddDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="药品名称" prop="dName" :label-width="formLabelWidth">
          <el-input v-model="addForm.dName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="dPrice" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.dPrice"
            oninput="value=value.replace(/[^\d.]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="dPic" :label-width="formLabelWidth">
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
        <el-form-item label="规格" prop="spec" :label-width="formLabelWidth">
          <el-input v-model="addForm.spec" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家" prop="madePe" :label-width="formLabelWidth">
          <el-input v-model="addForm.madePe" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生产日期" prop="madeDate" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.madeDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="功能主治" prop="dFunction" :label-width="formLabelWidth">
          <el-input v-model="addForm.dFunction" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="禁忌" prop="taboo" :label-width="formLabelWidth">
          <el-input v-model="addForm.taboo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保质期" prop="expi" :label-width="formLabelWidth">
          <el-input v-model="addForm.expi" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDis()">取 消</el-button>
        <el-button type="primary" @click="addDrug('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改药品信息" :visible.sync="dialogUpDrug" @close="closeUpDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="药品名称" prop="dName" :label-width="formLabelWidth">
          <el-input v-model="addForm.dName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="dPrice" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.dPrice"
            oninput="value=value.replace(/[^\d.]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="dPic" :label-width="formLabelWidth">
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
        <el-form-item label="规格" prop="spec" :label-width="formLabelWidth">
          <el-input v-model="addForm.spec" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家" prop="madePe" :label-width="formLabelWidth">
          <el-input v-model="addForm.madePe" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生产日期" prop="madeDate" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.madeDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="功能主治" prop="dFunction" :label-width="formLabelWidth">
          <el-input v-model="addForm.dFunction" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="禁忌" prop="taboo" :label-width="formLabelWidth">
          <el-input v-model="addForm.taboo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保质期" prop="expi" :label-width="formLabelWidth">
          <el-input v-model="addForm.expi" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpDis()">取 消</el-button>
        <el-button type="primary" @click="upDrug('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'DrugList',
  filters: {
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    const validateMoney = (rule, value, callback) => {
      if (!value) {
        callback(new Error('金额不能为空'))
      } else if (value.split('.').length > 2) {
        callback(new Error('输入正确格式的金额')) // 防止输入多个小数点
      } else {
        value = Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2) // 四舍五入
        value = Number(value).toFixed(2) // 不足补位
        this.addForm.dPrice = value
        callback()
      }
    }
    return {
      role: localStorage.getItem('role'),
      query: '',
      imageUrl: '',
      imgPath: '',
      dialogAddDrug: false,
      dialogUpDrug: false,
      drug: [],
      addForm: {},
      rules: {
        dName: [
          { required: true, message: '药品名称不能为空', trigger: 'blur' }
        ],
        dPrice: [{ required: true, validator: validateMoney, trigger: 'blur' }]
      },
      formLabelWidth: '120px',
      total: 0,
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getDrug()
  },
  methods: {
    async getDrug() {
      const { data: res } = await this._http.get(
        `drug/druglist?pageNum=${this.queryInfo.pageNum}&pageSize=${this.queryInfo.pageSize}`
      )
      this.drug = res.drug
      this.total = res.num
    },
    addDrug(drug) {
      this.addForm.dPic = this.imgPath
      this.$refs[drug].validate(async valid => {
        if (valid) {
          this.addForm.dNum =
            'Dru-' +
            new Date().getTime() +
            '-' +
            Math.random()
              .toString()
              .substr(2, 5)
          const { data: res } = await this._http.post(
            'drug/drugadd',
            this.addForm
          )
          if (res.statusCode === 0) {
            this.$message.success('添加成功')
            this.dialogAddDrug = false
            this.addForm = {}
            this.getDrug()
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },
    upDrug(drug) {
      this.addForm.dPic = this.imgPath
      this.$refs[drug].validate(async valid => {
        if (valid) {
          const { data: res } = await this._http.post(
            'drug/drugup',
            this.addForm
          )
          console.log(res)
          if (res.statusCode === 0) {
            this.$message.success('修改成功')
            this.dialogUpDrug = false
            this.addForm = {}
            this.getDrug()
          } else {
            this.$message.error('修改失败')
          }
        }
      })
    },
    updateDrug(drug) {
      this.dialogUpDrug = true
      this.addForm = drug
    },
    async getDrugLikeName() {
      if (this.query === '') {
        this.getDrug()
        return
      }
      const { data: res } = await this._http.get(
        `drug/druglistname?dName=${this.query}`
      )
      if (res.statusCode === 0) {
        this.drug = res.drug
        this.total = res.drug.length
      }
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
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getDrug()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getDrug()
    },
    closeAddDis() {
      this.dialogAddDrug = false
      this.addForm = {}
    },
    closeUpDis() {
      this.dialogUpDrug = false
      this.addForm = {}
    },
    deleteDrug(drug) {
      this.$confirm(`确定要删除${drug.dName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this._http.delete(`drug/druglistdel?dNum=${drug.dNum}`)
          this.getDrug()
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
