<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销管理</el-breadcrumb-item>
      <el-breadcrumb-item>费用录入</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-steps class="steps" align-center :active="+active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="选择药品"></el-step>
        <el-step title="选择检查"></el-step>
        <el-step title="住院信息"></el-step>
      </el-steps>
      <el-form
        label-position="top"
        label-width="80px"
        :rules="rules"
        :model="addForm"
        ref="addForm"
      >
        <el-tabs @tab-click="handleClick" v-model="active" tab-position="left">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="选择患者" prop="idCard">
              <el-select clearable v-model="addForm.idCard" placeholder="请选择">
                <el-option
                  v-for="item in patient"
                  :key="item.idCard"
                  :label="item.uName"
                  :value="item.idCard"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择医院" prop="hNum">
              <el-select clearable v-model="addForm.hNum" placeholder="请选择">
                <el-option
                  v-for="item in hospital"
                  :key="item.hNum"
                  :label="item.hName"
                  :value="item.hNum"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="选择药品">
            <el-input placeholder="请输入内容" v-model="query" class="query" clearable @clear="getDrug">
              <el-button slot="append" icon="el-icon-search" @click="getDrugLikeName"></el-button>
            </el-input>
            <el-table ref="multipleTable" :data="drug" @selection-change="drugSelectionChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column align="center" label="编号" type="index" width="80"></el-table-column>
              <el-table-column align="center" prop="dNum" label="药品编号"></el-table-column>
              <el-table-column align="center" prop="dName" label="药品名称"></el-table-column>
              <el-table-column align="center" prop="dPrice" label="价格">
                <template v-slot="scoped">
                  <span>{{ scoped.row.dPrice | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="address" label="数量">
                <template v-slot="scoped">
                  <el-input-number v-model="scoped.row.num" :min="0"></el-input-number>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="drugSizeChange"
              @current-change="drugCurrentChange"
              :current-page="drugInfo.pageNum"
              :page-sizes="[2, 4, 6, 8]"
              :page-size="drugInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="drugTotal"
              background
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane name="2" label="选择检查">
            <el-input
              placeholder="请输入内容"
              v-model="query"
              class="query"
              clearable
              @clear="getExamine"
            >
              <el-button slot="append" icon="el-icon-search" @click="getExamineLikeName"></el-button>
            </el-input>
            <el-table ref="multipleTable" :data="exam" @selection-change="examSelectionChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column align="center" label="编号" type="index" width="80"></el-table-column>
              <el-table-column align="center" prop="eNum" label="检查编号"></el-table-column>
              <el-table-column align="center" prop="eName" label="检查名称"></el-table-column>
              <el-table-column align="center" prop="ePrice" label="价格">
                <template v-slot="scoped">
                  <span>{{ scoped.row.ePrice | rounding }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="address" label="数量">
                <template v-slot="scoped">
                  <el-input-number v-model="scoped.row.num" :min="0"></el-input-number>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="examSizeChange"
              @current-change="examCurrentChange"
              :current-page="examInfo.pageNum"
              :page-sizes="[2, 4, 6, 8]"
              :page-size="examInfo.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="examTotal"
              background
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane name="3" label="住院信息">
            <el-form-item label="是否住院" prop="isInHos">
              <el-switch v-model="addForm.isInHos"></el-switch>
            </el-form-item>
            <el-form-item label="住院天数" prop="inHosDay">
              <el-input
                class="input"
                v-model="addForm.inHosDay"
                oninput="value=value.replace(/[^\d]/g, '')"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('addForm')">录入</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'CostEntry',
  filters: {
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      active: '0',
      addForm: {},
      patient: [],
      hospital: [],
      drug: [],
      query: '',
      exam: [],
      checkDrug: [],
      checkExam: [],
      drugTotal: 0,
      formLabelWidth: '120px',
      examTotal: 0,
      drugInfo: {
        query: '',
        pageNum: 1,
        pageSize: 8
      },
      examInfo: {
        query: '',
        pageNum: 1,
        pageSize: 8
      },
      rules: {
        idCard: [{ required: true, message: '请选择姓名', trigger: 'blur' }],
        hNum: [{ required: true, message: '请选择医院', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getPatient()
    this.getHospital()
    this.getDrug()
    this.getExamine()
  },
  methods: {
    async getPatient() {
      const { data: res } = await this._http.get('patient/allpatient')
      this.patient = res.patient
    },
    async getHospital() {
      const { data: res } = await this._http.get('hospital/allhospital')
      this.hospital = res.hos
    },
    async getDrug() {
      const { data: res } = await this._http.get(
        `drug/druglist?pageNum=${this.drugInfo.pageNum}&pageSize=${this.drugInfo.pageSize}`
      )
      this.drug = res.drug
      this.drugTotal = res.num
    },
    async getExamine() {
      const { data: res } = await this._http.get(
        `examine/examinelist?pageNum=${this.examInfo.pageNum}&pageSize=${this.examInfo.pageSize}`
      )
      this.exam = res.examine
      this.examTotal = res.num
    },
    handleClick() {
      if (this.active !== '0') {
        if (!this.addForm.idCard || !this.addForm.hNum) {
          this.$message.warning('请填写基本信息')
          return
        }
      }
      this.query = ''
    },
    submitForm(info) {
      this.$refs[info].validate(async valid => {
        if (valid) {
          this.addForm.ihNum =
            'Inh-' +
            new Date().getTime() +
            '-' +
            Math.random()
              .toString()
              .substr(2, 5)
          this.addForm.drug = this.checkDrug
          this.addForm.exam = this.checkExam
          if (!this.addForm.inHosDay) {
            this.addForm.inHosDay = 0
          }
          const { data: res } = await this._http.post(
            'inhospital/inhosadd',
            this.addForm
          )
          if (res.statusCode === 0) {
            this.$message.success('录入成功')
            this.addForm = {}
            this.getDrug()
            this.getExamine()
            await this.$router.push({ path: '/payorder' })
          } else {
            this.$message.error('录入失败')
          }
        }
      })
    },
    drugSelectionChange(val) {
      this.checkDrug = val
    },
    examSelectionChange(val) {
      this.checkExam = val
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
        this.drugTotal = res.drug.length
      }
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
        this.exam = res.examine
        this.examTotal = res.examine.length
      }
    },
    drugSizeChange(newSize) {
      this.drugInfo.pageSize = newSize
      this.getDrug()
    },
    drugCurrentChange(newPage) {
      this.drugInfo.pageNum = newPage
      this.getDrug()
    },
    examSizeChange(newSize) {
      this.examInfo.pageSize = newSize
      this.getExamine()
    },
    examCurrentChange(newPage) {
      this.examInfo.pageNum = newPage
      this.getExamine()
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
.steps {
  margin: 20px 0 30px;
}
.query {
  width: 30%;
  margin: 20px 20px 20px 0px;
}
.el-pagination {
  margin-top: 20px;
}
.input {
  width: 400px;
}
</style>
