<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销管理</el-breadcrumb-item>
      <el-breadcrumb-item>费用结算</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="query" class="query" clearable @clear="getClear">
            <el-button slot="append" icon="el-icon-search" @click="getClearLikeName"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="clear" stripe style="width: 100%">
        <el-table-column align="center" type="index" label="编号" width="80px"></el-table-column>
        <el-table-column align="center" type="expand">
          <template v-slot="props">
            <el-alert title="药品详情" type="success" :closable="false"></el-alert>
            <el-table :data="props.row.drug">
              <el-table-column align="center" prop="dNum" label="药品编号"></el-table-column>
              <el-table-column align="center" prop="dName" label="药品名称"></el-table-column>
              <el-table-column align="center" prop="price" label="单价">
                <template v-slot="scope">
                  <span>{{ scope.row.price | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="drugNum" label="数量"></el-table-column>
              <el-table-column align="center" prop="biPrice" label="总价">
                <template v-slot="scope">
                  <span>{{ scope.row.biPrice | rounding }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-alert title="检查详情" type="success" :closable="false"></el-alert>
            <el-table :data="props.row.exam">
              <el-table-column align="center" prop="eNum" label="检查编号"></el-table-column>
              <el-table-column align="center" prop="eName" label="检查名称"></el-table-column>
              <el-table-column align="center" prop="price" label="单价">
                <template v-slot="scope">
                  <span>{{ scope.row.price | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="examNum" label="次数"></el-table-column>
              <el-table-column align="center" prop="biPrice" label="总价">
                <template v-slot="scope">
                  <span>{{ scope.row.biPrice | rounding }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-alert title="住院详情" type="success" :closable="false"></el-alert>
            <el-table :data="props.row.inhos">
              <el-table-column align="center" prop="hNum" label="医院编号"></el-table-column>
              <el-table-column align="center" prop="hName" label="医院名称"></el-table-column>
              <el-table-column align="center" prop="inhMoney" label="住院费用">
                <template v-slot="scope">
                  <span>{{ scope.row.inhMoney | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="inHosDay" label="住院天数"></el-table-column>
              <el-table-column align="center" prop="inHosMon" label="总价">
                <template v-slot="scope">
                  <span>{{ scope.row.inHosMon | rounding }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="iName" label="费用单编号"></el-table-column> -->
        <el-table-column align="center" prop="idName" label="患者"></el-table-column>
        <el-table-column align="center" prop="hName" label="医院"></el-table-column>
        <el-table-column align="center" prop="drugMoney" label="药品费用">
          <template v-slot="scope">
            <span>{{ scope.row.drugMoney | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="texaMoney" label="检查费用">
          <template v-slot="scope">
            <span>{{ scope.row.texaMoney | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="inHosMon" label="住院费用">
          <template v-slot="scope">
            <span>{{ scope.row.inHosMon | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="allMoney" label="总费用">
          <template v-slot="scope">
            <span>{{ scope.row.allMoney | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="clearMoney" label="报销费用">
          <template v-slot="scope">
            <span>{{ scope.row.clearMoney | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="myMoney" label="实付费用">
          <template v-slot="scope">
            <span>{{ scope.row.myMoney | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="175px" label="备注">
          <template v-slot="scope">
            <el-tag v-if="scope.row.remark.substr(0,1) === '1'" type="success">住院</el-tag>
            <el-tag v-else type="danger">未住院</el-tag>&nbsp;
            <el-tag v-if="scope.row.remark.substr(1,2) === '1'" type="success">已参保</el-tag>
            <el-tag v-else type="danger">未参保</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button
              @click="deleteClear(scope.row)"
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
  </div>
</template>
<script>
export default {
  name: 'ClearList',
  filters: {
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      query: '',
      imageUrl: '',
      imgPath: '',
      dialogAddClear: false,
      dialogUpClear: false,
      clear: [],
      patient: [],
      exam: [],
      addForm: {},
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
    this.getClear()
    this.getPatient()
    this.getExamine()
  },
  methods: {
    async getClear() {
      const { data: res } = await this._http.get(
        `clear/clearorder?pageNum=${this.queryInfo.pageNum}&pageSize=${this.queryInfo.pageSize}`
      )
      this.clear = res.clear
      this.total = res.num
    },
    async getPatient() {
      const { data: res } = await this._http.get('patient/allpatient')
      this.patient = res.patient
    },
    async getExamine() {
      const { data: res } = await this._http.get('examine/allexam')
      this.exam = res.exam
    },
    async getClearLikeName() {
      if (this.query === '') {
        this.getClear()
        return
      }
      const { data: res } = await this._http.get(
        `inhospital/clearname?name=${this.query}`
      )
      if (res.statusCode === 0) {
        this.clear = res.clear
        this.total = res.clear.length
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getClear()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getClear()
    },
    async toPay(clear) {
      const { data: res } = await this._http.post('clearclear/toPay', clear)
      if (res.statusCode === 0) {
        this.$message.success('结算成功')
      } else {
        this.$message.error('已结算')
      }
      this.getClear()
    },
    deleteClear(clear) {
      this.$confirm(`确定要删除${clear.uName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this._http.delete(`clear/cleardel?cNum=${clear.cNum}`)
          this.getClear()
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
