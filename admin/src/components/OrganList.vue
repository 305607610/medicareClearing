<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公共信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="query" class="query" clearable @clear="getInsu">
            <el-button slot="append" icon="el-icon-search" @click="getInsuLikeName"></el-button>
          </el-input>
          <el-button type="success" @click="dialogAddInsu = true" plain v-if="role === '1'">添加机构</el-button>
        </el-col>
      </el-row>
      <el-table :data="insu" stripe style="width: 100%">
        <el-table-column align="center" type="index" label="编号" width="80px"></el-table-column>
        <el-table-column align="center" prop="iNum" width="220px" label="机构编号"></el-table-column>
        <el-table-column align="center" prop="iName" label="机构名称"></el-table-column>
        <el-table-column align="center" label="缴费金额">
          <template v-slot="scope">
            <span>{{scope.row.biMoney | rounding}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="inHosBao" label="住院报销率"></el-table-column>
        <el-table-column align="center" prop="noHosBao" label="未住院报销率"></el-table-column>\
        <el-table-column label="操作" align="center" v-if="role === '1'">
          <template v-slot="scope">
            <el-button
              @click="updateInsu(scope.row)"
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
    <el-dialog title="添加机构" :visible.sync="dialogAddInsu" @close="closeAddDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="机构名称" prop="iName" :label-width="formLabelWidth">
          <el-input v-model="addForm.iName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="缴费金额" prop="biMoney" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.biMoney"
            oninput="value=value.replace(/[^\d.]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="住院报销率" prop="inHosBao" :label-width="formLabelWidth">
          <el-input v-model="addForm.inHosBao" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="未住院报销率" prop="noHosBao" :label-width="formLabelWidth">
          <el-input v-model="addForm.noHosBao" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDis()">取 消</el-button>
        <el-button type="primary" @click="addInsu('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改患者信息" :visible.sync="dialogUpInsu" @close="closeUpDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="机构名称" prop="iName" :label-width="formLabelWidth">
          <el-input v-model="addForm.iName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="缴费金额" prop="biMoney" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.biMoney"
            oninput="value=value.replace(/[^\d.]/g, '')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="住院报销率" prop="inHosBao" :label-width="formLabelWidth">
          <el-input v-model="addForm.inHosBao" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="未住院报销率" prop="noHosBao" :label-width="formLabelWidth">
          <el-input v-model="addForm.noHosBao" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpDis()">取 消</el-button>
        <el-button type="primary" @click="upInsu('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'OrganList',
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
        this.addForm.biMoney = value
        callback()
      }
    }
    return {
      role: localStorage.getItem('role'),
      query: '',
      dialogAddInsu: false,
      dialogUpInsu: false,
      insu: [],
      addForm: {},
      rules: {
        iName: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' }
        ],
        biMoney: [{ required: true, validator: validateMoney, trigger: 'blur' }]
      },
      uploadData: {},
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
    this.getInsu()
  },
  methods: {
    async getInsu() {
      const { data: res } = await this._http.get(
        `insu/insulist?pageNum=${this.queryInfo.pageNum}&pageSize=${this.queryInfo.pageSize}`
      )
      this.insu = res.insu
      this.total = res.num
    },
    addInsu(insu) {
      this.$refs[insu].validate(async valid => {
        if (valid) {
          this.addForm.iNum =
            'Ins-' +
            new Date().getTime() +
            '-' +
            Math.random()
              .toString()
              .substr(2, 5)
          const { data: res } = await this._http.post(
            'insu/insuadd',
            this.addForm
          )
          if (res.statusCode === 0) {
            this.$message.success('添加成功')
            this.dialogAddInsu = false
            this.addForm = {}
            this.getInsu()
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },
    upInsu(insu) {
      this.$refs[insu].validate(async valid => {
        if (valid) {
          const { data: res } = await this._http.post(
            'insu/insuup',
            this.addForm
          )
          if (res.statusCode === 0) {
            this.$message.success('修改成功')
            this.dialogUpInsu = false
            this.addForm = {}
            this.getInsu()
          } else {
            this.$message.error('修改失败')
          }
        }
      })
    },
    updateInsu(insu) {
      this.dialogUpInsu = true
      this.addForm = insu
    },
    async getInsuLikeName() {
      if (this.query === '') {
        this.getInsu()
        return
      }
      const { data: res } = await this._http.get(
        `insu/insulistname?iName=${this.query}`
      )
      if (res.statusCode === 0) {
        this.insu = res.insu
        this.total = res.insu.length
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getInsu()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getInsu()
    },
    closeAddDis() {
      this.dialogAddInsu = false
      this.addForm = {}
    },
    closeUpDis() {
      this.dialogUpInsu = false
      this.addForm = {}
    },
    deletePatirnt(insu) {
      this.$confirm(`确定要删除${insu.iName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this._http.delete(`insu/insulistdel?iNum=${insu.iNum}`)
          this.getInsu()
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
