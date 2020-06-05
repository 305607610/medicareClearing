<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>医保管理</el-breadcrumb-item>
      <el-breadcrumb-item>缴费管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="query" class="query" clearable @clear="getICard">
            <el-button slot="append" icon="el-icon-search" @click="getICardLikeName"></el-button>
          </el-input>
          <el-button type="success" @click="dialogAddICard = true" plain v-if="role === '1'">添加信息</el-button>
        </el-col>
      </el-row>
      <el-table :data="iCard" stripe style="width: 100%">
        <el-table-column align="center" type="index" label="编号" width="80px"></el-table-column>
        <el-table-column align="center" prop="icNum" width="220px" label="医保卡编号"></el-table-column>
        <el-table-column align="center" prop="idName" label="姓名"></el-table-column>
        <el-table-column align="center" prop="iName" label="机构名称"></el-table-column>
        <el-table-column align="center" prop="inStatus" label="缴费状态">
          <template v-slot="scope">
            <el-tag v-if="scope.row.inStatus === 1" type="success">已缴费</el-tag>
            <el-tag v-else type="danger">未缴费</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="inMoney" label="缴费金额">
          <template v-slot="scope">
            <span>{{ scope.row.inMoney | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="缴费时间">
          <template v-slot="scope">
            <span v-if="scope.row.inDate === '0000-00-00 00:00:00'"></span>
            <span v-else>{{ scope.row.inDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-tooltip class="item" effect="light" content="缴费" :enterable="false" placement="top">
              <el-button @click="toPay(scope.row)" type="success" icon="el-icon-check" circle plain></el-button>
            </el-tooltip>
            <el-button
              @click="updateICard(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              v-if="role === '1'"
            ></el-button>
            <el-button
              @click="deleteICard(scope.row)"
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
    <el-dialog title="添加信息" :visible.sync="dialogAddICard" @close="closeAddDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="姓名" prop="idCard" :label-width="formLabelWidth">
          <el-select v-model="addForm.idCard" placeholder="请选择">
            <el-option
              v-for="item in patient"
              :key="item.idCard"
              :label="item.uName"
              :value="item.idCard"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构名称" prop="iNum" :label-width="formLabelWidth">
          <el-select v-model="addForm.iNum" placeholder="请选择">
            <el-option v-for="item in insu" :key="item.iNum" :label="item.iName" :value="item.iNum"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDis()">取 消</el-button>
        <el-button type="primary" @click="addICard('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改信息" :visible.sync="dialogUpICard" @close="closeUpDis">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="姓名" prop="idCard" :label-width="formLabelWidth">
          <el-select v-model="addForm.idCard" placeholder="请选择">
            <el-option
              v-for="item in patient"
              :key="item.idCard"
              :label="item.uName"
              :value="item.idCard"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构名称" prop="iNum" :label-width="formLabelWidth">
          <el-select v-model="addForm.iNum" placeholder="请选择">
            <el-option v-for="item in insu" :key="item.iNum" :label="item.iName" :value="item.iNum"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpDis()">取 消</el-button>
        <el-button type="primary" @click="upICard('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ICardList',
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
      uName: localStorage.getItem('uName'),
      dialogAddICard: false,
      dialogUpICard: false,
      iCard: [],
      patient: [],
      insu: [],
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
    this.getICard()
    this.getPatient()
    this.getInsu()
  },
  methods: {
    async getICard() {
      if (this.uName === '' || this.uName === null) {
        const { data: res } = await this._http.get(
          `iCard/iCardlist?pageNum=${this.queryInfo.pageNum}&pageSize=${this.queryInfo.pageSize}`
        )
        this.iCard = res.iCard
        this.total = res.num
      } else {
        const { data: res } = await this._http.get(
          `iCard/iCardlistname?idName=${this.uName}`
        )
        this.iCard = res.iCard
        this.total = res.iCard.length
      }
    },
    async getPatient() {
      const { data: res } = await this._http.get('patient/allpatient')
      this.patient = res.patient
    },
    async getInsu() {
      const { data: res } = await this._http.get('insu/allinsu')
      this.insu = res.insu
    },
    async toPay(iCard) {
      const { data: res } = await this._http.post('iCard/toPay', iCard)
      if (res.statusCode === 0) {
        this.$message.success('支付成功')
        this.getICard()
        await this._ubuntu.post('insuCard', res.insuCardApp)
      } else {
        this.$message.error('已支付')
      }
    },
    addICard(iCard) {
      this.$refs[iCard].validate(async valid => {
        if (valid) {
          this.addForm.icNum =
            'ICa-' +
            new Date().getTime() +
            '-' +
            Math.random()
              .toString()
              .substr(2, 5)
          const { data: res } = await this._http.post(
            'iCard/iCardadd',
            this.addForm
          )
          if (res.statusCode === 0) {
            this.$message.success('添加成功')
            this.dialogAddICard = false
            this.addForm = {}
            this.getICard()
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },
    upICard(iCard) {
      this.$refs[iCard].validate(async valid => {
        if (valid) {
          const { data: res } = await this._http.post(
            'iCard/iCardup',
            this.addForm
          )
          console.log(res)
          if (res.statusCode === 0) {
            this.$message.success('修改成功')
            this.dialogUpICard = false
            this.addForm = {}
            this.getICard()
          } else {
            this.$message.error('修改失败')
          }
        }
      })
    },
    updateICard(iCard) {
      this.dialogUpICard = true
      this.addForm = iCard
    },
    async getICardLikeName() {
      if (this.query === '') {
        this.getICard()
        return
      }
      const { data: res } = await this._http.get(
        `iCard/iCardlistname?idName=${this.query}`
      )
      if (res.statusCode === 0) {
        this.iCard = res.iCard
        this.total = res.iCard.length
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getICard()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getICard()
    },
    closeAddDis() {
      this.dialogAddICard = false
      this.addForm = {}
    },
    closeUpDis() {
      this.dialogUpICard = false
      this.addForm = {}
    },
    deleteICard(iCard) {
      this.$confirm(`确定要删除${iCard.idName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this._http.delete(`iCard/iCardlistdel?icNum=${iCard.icNum}`)
          this.getICard()
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
