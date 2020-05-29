<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公共信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>医院管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input
            placeholder="请输入内容"
            v-model="query"
            class="query"
            clearable
            @clear="getHospital"
          >
            <el-button slot="append" icon="el-icon-search" @click="getHospitalLikeName"></el-button>
          </el-input>
          <el-button type="success" @click="dialogAddHospital = true" plain v-if="role === '1'">添加医院</el-button>
        </el-col>
      </el-row>
      <el-table :data="hospital" stripe style="width: 100%">
        <el-table-column align="center" type="index" label="编号" width="80px"></el-table-column>
        <el-table-column align="center" prop="hNum" width="220px" label="医院编号"></el-table-column>
        <el-table-column align="center" prop="hName" label="医院名称"></el-table-column>
        <el-table-column align="center" prop="hType" label="医院类型"></el-table-column>
        <el-table-column align="center" prop="hAddress" label="地址"></el-table-column>
        <el-table-column align="center" label="住院价格">
          <template v-slot="scope">
            <span>{{scope.row.inhMoney | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="role === '1'">
          <template v-slot="scope">
            <el-button
              @click="updateHospital(scope.row)"
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
    <el-dialog title="添加医院" :visible.sync="dialogAddHospital" @close="closeAddDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="医院名称" prop="hName" :label-width="formLabelWidth">
          <el-input v-model="addForm.hName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="医院类型" prop="hType" :label-width="formLabelWidth">
          <el-input v-model="addForm.hType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="hAddress" :label-width="formLabelWidth">
          <el-input v-model="addForm.hAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="住院价格" prop="inhMoney" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.inhMoney"
            oninput="value=value.replace(/[^\d.]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDis()">取 消</el-button>
        <el-button type="primary" @click="addHospital('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改医院信息" :visible.sync="dialogUpHospital" @close="closeUpDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="医院名称" prop="hName" :label-width="formLabelWidth">
          <el-input v-model="addForm.hName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="医院类型" prop="hType" :label-width="formLabelWidth">
          <el-input v-model="addForm.hType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="hAddress" :label-width="formLabelWidth">
          <el-input v-model="addForm.hAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="住院价格" prop="inhMoney" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.inhMoney"
            oninput="value=value.replace(/[^\d.]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpDis()">取 消</el-button>
        <el-button type="primary" @click="upHospital('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'HosList',
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
        this.addForm.inhMoney = value
        callback()
      }
    }
    return {
      role: localStorage.getItem('role'),
      query: '',
      dialogAddHospital: false,
      dialogUpHospital: false,
      hospital: [],
      addForm: {},
      formLabelWidth: '120px',
      total: 0,
      rules: {
        inhMoney: [{ validator: validateMoney, trigger: 'blur' }]
      },
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getHospital()
  },
  methods: {
    async getHospital() {
      const { data: res } = await this._http.get(
        `hospital/hospitallist?pageNum=${this.queryInfo.pageNum}&pageSize=${this.queryInfo.pageSize}`
      )
      this.hospital = res.hos
      this.total = res.num
    },
    addHospital(hospital) {
      this.$refs[hospital].validate(async valid => {
        if (valid) {
          this.addForm.hNum =
            'Hos-' +
            new Date().getTime() +
            '-' +
            Math.random()
              .toString()
              .substr(2, 5)
          const { data: res } = await this._http.post(
            'hospital/hospitaladd',
            this.addForm
          )
          if (res.statusCode === 0) {
            this.$message.success('添加成功')
            this.dialogAddHospital = false
            this.addForm = {}
            this.getHospital()
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },
    upHospital(hospital) {
      this.$refs[hospital].validate(async valid => {
        if (valid) {
          const { data: res } = await this._http.post(
            'hospital/hospitalup',
            this.addForm
          )
          console.log(res)
          if (res.statusCode === 0) {
            this.$message.success('修改成功')
            this.dialogUpHospital = false
            this.addForm = {}
            this.getHospital()
          } else {
            this.$message.error('修改失败')
          }
        }
      })
    },
    updateHospital(hospital) {
      this.dialogUpHospital = true
      this.addForm = hospital
    },
    async getHospitalLikeName() {
      if (this.query === '') {
        this.getHospital()
        return
      }
      const { data: res } = await this._http.get(
        `hospital/hospitallistname?hName=${this.query}`
      )
      if (res.statusCode === 0) {
        this.hospital = res.hos
        this.total = res.hos.length
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getHospital()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getHospital()
    },
    closeAddDis() {
      this.dialogAddHospital = false
      this.addForm = {}
    },
    closeUpDis() {
      this.dialogUpHospital = false
      this.addForm = {}
    },
    deletePatirnt(hospital) {
      this.$confirm(`确定要删除${hospital.hName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this._http.delete(
            `hospital/hospitallistdel?hNum=${hospital.hNum}`
          )
          this.getHospital()
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
