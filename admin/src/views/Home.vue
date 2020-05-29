<template>
  <el-container class="out-container">
    <!-- 头部 -->
    <el-header class="header">
      <el-row>
        <el-col :span="22">
          <div class>
            <h2>医疗保险清算系统</h2>
          </div>
        </el-col>
        <el-col :span="2">
          <div class>
            <span>{{ name }}</span>&nbsp;&nbsp;
            <a href="#" @click.prevent="loginOut()">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <el-menu
          router
          unique-opened
          background-color="#ecfcff"
          :default-active="menuStatus"
          class="el-menu-vertical-demo"
        >
          <el-menu-item index="dashboard" v-if="role === '1'">
            <i class="el-icon-s-marketing"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu index="1" v-if="role === '1'">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>系统管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="userlist">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-info"></i>
              <span v-if="role === '1'">公共信息管理</span>
              <span v-else>公共信息查询</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="patientlist">
                <i class="el-icon-s-custom"></i>
                <span v-if="role === '1'">患者管理</span>
                <span v-else>个人信息管理</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="hoslist">
                <i class="el-icon-s-home"></i>
                <span v-if="role === '1'">医院管理</span>
                <span v-else>医院查询</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="organlist">
                <i class="el-icon-s-shop"></i>
                <span v-if="role === '1'">保险机构管理</span>
                <span v-else>保险机构查询</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>医保管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="icardlist">
                <i class="el-icon-bank-card"></i>
                <span>缴费管理</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="druglist">
                <i class="el-icon-s-cooperation"></i>
                <span v-if="role === '1'">药品管理</span>
                <span v-else>药品查询</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="examine">
                <i class="el-icon-s-release"></i>
                <span v-if="role === '1'">检查管理</span>
                <span v-else>检查查询</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-check"></i>
              <span v-if="role === '1'">结算管理</span>
              <span v-else>结算信息</span>
            </template>
            <el-menu-item-group v-if="role === '1'">
              <el-menu-item index="costentry">
                <i class="el-icon-s-claim"></i>
                <span>费用录入</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="payorder">
                <i class="el-icon-s-open"></i>
                <span>费用结算</span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="clearorder">
                <i class="el-icon-printer"></i>
                <span>清算信息</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      name: localStorage.getItem('name'),
      role: localStorage.getItem('role'),
      menuStatus: window.location.hash.substring(2)
    }
  },
  methods: {
    loginOut() {
      localStorage.clear()
      this.$router.push({ path: '/login' })
      this.$message.success('谢谢使用')
    }
  }
}
</script>

<style scoped>
.out-container {
  height: 100%;
}

.header {
  line-height: 60px;
  text-align: center;
  background-image: linear-gradient(to right, #ecfcff, #5edfff);
}

.header a {
  text-decoration: none;
}

.aside {
  background-image: linear-gradient(#ecfcff, #b2fcff);
}

.main {
  height: 100%;
  background-color: #ecfcff;
}
</style>>
