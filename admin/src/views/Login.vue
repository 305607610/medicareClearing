<template>
  <div class="out-form">
    <el-form
      class="form"
      :rules="rules"
      ref="formData"
      label-position="right"
      label-width="80px"
      :model="formData"
      status-icon
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input clearable placeholder="请输入用户名" v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input clearable placeholder="请输入密码" v-model="formData.password" show-password></el-input>
      </el-form-item>
      <el-form-item class="out-btn">
        <el-button class="btn" @click="toLogin('formData')" type="primary" plain>登录</el-button>
        <el-button class="btn" @click="resetData('formData')" type="warning" plain>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      name: '',
      formData: {
        username: 'admin',
        password: 'admin'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度要大于3位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 20, message: '长度要大于6位', trigger: 'blur' }
        ]
      },
      admin: []
    }
  },
  methods: {
    toLogin(ruleForm) {
      this.$refs[ruleForm].validate(async valid => {
        if (valid) {
          const { data: res } = await this._http.post(
            'user/login',
            this.formData
          )
          if (res.statusCode === 0 && res.login[0].status === 1) {
            localStorage.setItem('token', res.token)
            localStorage.setItem('name', this.formData.username)
            if (this.formData.username === 'admin') {
              localStorage.setItem('role', '1')
              await this.$router.push({ path: '/' })
            } else {
              this.getName(this.formData.username)
              localStorage.setItem('role', '2')
              await this.$router.push({ path: 'patientlist' })
            }
            this.$message.success('登录成功')
          } else {
            this.$message.error('登录失败')
          }
        }
      })
    },
    async getName(username) {
      const { data: res } = await this._http.get(`patient/patientname?username=${username}`)
      this.name = res.uName
      localStorage.setItem('uName', this.name[0].uName)
    },
    resetData(formData) {
      this.$refs[formData].resetFields()
    }
  }
}
</script>

<style scoped>
.out-form {
  display: flex;
  height: 100%;
  background-image: url('../assets/img/bg.jpg');
  background-size: 100% 100%;
  justify-content: center;
  align-items: center;
}

.btn {
  width: 40%;
}

h2 {
  margin-bottom: 20px;
  margin-left: 30px;
}

.form {
  background-color: #d7fffd;
  width: 400px;
  padding: 30px 30px 30px 10px;
  border-radius: 10px;
}
</style>
