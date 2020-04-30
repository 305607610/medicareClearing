<template>
  <div class="container">
    <img src="../assets/img/404.png">
    <el-row>
      <el-col>
        <el-button type="primary" @click="toIndex">返回首页</el-button>
        <el-button type="success" @click="toQQ">咨询站长</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    toIndex () {
      this.$router.push({ path: '/' })
    },
    toQQ () {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=305607610&site=qq&menu=yes')
    }
  }
}
</script>

<style scoped>
  .container {
    text-align: center;
  }

  .container img {
    margin-top: 200px;
    margin-bottom: 50px;
  }
</style>
