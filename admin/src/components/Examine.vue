<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>医保管理</el-breadcrumb-item>
      <el-breadcrumb-item>检查管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="query" class="query" clearable @clear="getExamine">
            <el-button slot="append" icon="el-icon-search" @click="getExamineLikeName"></el-button>
          </el-input>
          <el-button type="success" @click="dialogAddExamine = true" plain>添加检查</el-button>
        </el-col>
      </el-row>
      <el-table :data="examine" stripe style="width: 100%">
        <el-table-column align="center" type="index" label="编号" width="80px"></el-table-column>
        <el-table-column align="center" prop="eNum" width="220px" label="检查编号"></el-table-column>
        <el-table-column align="center" prop="eName" label="检查名称"></el-table-column>
        <el-table-column align="center" label="检查价格">
          <template v-slot="scope">
            <span>{{scope.row.ePrice | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button
              @click="updateExamine(scope.row)"
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
    <el-dialog title="添加检查" :visible.sync="dialogAddExamine" @close="closeAddDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="检查名称" prop="eName" :label-width="formLabelWidth">
          <el-input v-model="addForm.eName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="检查价格" prop="ePrice" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.ePrice"
            oninput="value=value.replace(/[^\d.]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDis()">取 消</el-button>
        <el-button type="primary" @click="addExamine('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改医院信息" :visible.sync="dialogUpExamine" @close="closeUpDis">
      <el-form :model="addForm" ref="addForm" status-icon>
        <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
          <el-form-item label="检查名称" prop="eName" :label-width="formLabelWidth">
            <el-input v-model="addForm.eName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="检查价格" prop="ePrice" :label-width="formLabelWidth">
            <el-input
              v-model="addForm.ePrice"
              oninput="value=value.replace(/[^\d.]/g, '')"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpDis()">取 消</el-button>
        <el-button type="primary" @click="upExamine('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Examine',
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
        this.addForm.ePrice = value
        callback()
      }
    }
    return {
      query: '',
      dialogAddExamine: false,
      dialogUpExamine: false,
      examine: [],
      addForm: {},
      rules: {
        eName: [
          { required: true, message: '检查名称不能为空', trigger: 'blur' }
        ],
        ePrice: [{ required: true, validator: validateMoney, trigger: 'blur' }]
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
    this.getExamine()
  },
  methods: {
    async getExamine() {
      const { data: res } = await this._http.get(
        `examine/examinelist?pageNum=${this.queryInfo.pageNum}&pageSize=${this.queryInfo.pageSize}`
      )
      this.examine = res.examine
      this.total = res.num
    },
    addExamine(examine) {
      this.$refs[examine].validate(async valid => {
        if (valid) {
          this.addForm.eNum =
            'Exa-' +
            new Date().getTime() +
            '-' +
            Math.random()
              .toString()
              .substr(2, 5)
          const { data: res } = await this._http.post(
            'examine/examineadd',
            this.addForm
          )
          if (res.statusCode === 0) {
            this.$message.success('添加成功')
            this.dialogAddExamine = false
            this.addForm = {}
            this.getExamine()
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },
    upExamine(examine) {
      this.$refs[examine].validate(async valid => {
        if (valid) {
          const { data: res } = await this._http.post(
            'examine/examineup',
            this.addForm
          )
          console.log(res)
          if (res.statusCode === 0) {
            this.$message.success('修改成功')
            this.dialogUpExamine = false
            this.addForm = {}
            this.getExamine()
          } else {
            this.$message.error('修改失败')
          }
        }
      })
    },
    updateExamine(examine) {
      this.dialogUpExamine = true
      this.addForm = examine
    },
    async getExamineLikeName() {
      if (this.query === '') {
        this.getExamine()
        return
      }
      const { data: res } = await this._http.get(
        `examine/examinename?eName=${this.query}`
      )
      if (res.statusCode === 0) {
        this.examine = res.examine
        this.total = res.examine.length
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getExamine()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getExamine()
    },
    closeAddDis() {
      this.dialogAddExamine = false
      this.addForm = {}
    },
    closeUpDis() {
      this.dialogUpExamine = false
      this.addForm = {}
    },
    deletePatirnt(examine) {
      this.$confirm(`确定要删除${examine.eName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this._http.delete(`examine/examinelistdel?eNum=${examine.eNum}`)
          this.getExamine()
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
