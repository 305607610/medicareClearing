<template>
  <div style="height: 100%">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="query" class="query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUserById"></el-button>
          </el-input>
          <el-button type="success" @click="dialogAddUser = true" plain>添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="users" stripe style="width: 100%">
        <el-table-column align="center" type="index" label="编号" width="80px"></el-table-column>
        <el-table-column align="center" prop="username" label="用户名"></el-table-column>
        <el-table-column align="center" prop="password" label="密码"></el-table-column>
        <el-table-column align="center" label="角色">
          <template v-slot="scope">
            <el-tag v-if="scope.row.role === 1">管理员</el-tag>
            <el-tag v-else type="success">用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template v-slot="scope">
            <el-switch
              @change="chageStatus(scope.row)"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button
              @click="updateUser(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
              plain
            ></el-button>
            <el-button
              @click="deleteUser(scope.row)"
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
    <el-dialog title="添加用户" :visible.sync="dialogAddUser" @close="closeAddDis()">
      <el-form :model="addForm" ref="addForm" :rules="rules" status-icon>
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input
            type="password"
            clearable
            show-password
            v-model="addForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" :label-width="formLabelWidth">
          <el-input
            type="password"
            clearable
            show-password
            v-model="addForm.password2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAddDis()">取 消</el-button>
        <el-button type="primary" @click="addUser('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改用户" :visible.sync="dialogupUser" @close="closeUpDis()">
      <el-form :model="upForm" ref="upForm" :rules="rules" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="upForm.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input
            type="password"
            show-password
            clearable
            v-model="upForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" :label-width="formLabelWidth">
          <el-input
            type="password"
            show-password
            clearable
            v-model="upForm.password2"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="upForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="1"></el-option>
            <el-option label="用户" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUpDis()">取 消</el-button>
        <el-button type="primary" @click="upUser('upForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'UserList',
  data() {
    var validateUname = async (rule, value, callback) => {
      const { data: res } = await await this._http.get(
        `user/userlistva?username=${value}`
      )
      if (res.statusCode === 0) {
        callback(new Error('用户名已存在'))
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      role: localStorage.getItem('role'),
      users: [],
      query: '',
      total: 0,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 20, message: '长度要大于5位', trigger: 'blur' },
          { validator: validateUname, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度要大于6位', trigger: 'blur' }
        ],
        password2: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      dialogAddUser: false,
      dialogupUser: false,
      addForm: {},
      upForm: {},
      formLabelWidth: '120px',
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    closeAddDis() {
      this.dialogAddUser = false
      this.addForm = {}
    },
    closeUpDis() {
      this.dialogupUser = false
      this.upForm.password2 = ''
    },
    async getUsers() {
      const { data: res } = await this._http.get(
        `user/userlist?pageNum=${this.queryInfo.pageNum}&pageSize=${this.queryInfo.pageSize}`
      )
      this.users = res.user
      this.total = res.num
    },
    async chageStatus(user) {
      if (user.username === 'admin') {
        return
      }
      const res = await this._http.get(
        `user/userlistup?username=${user.username}&status=${user.status}`
      )
      if (res.status === 200) {
        this.$message.success(res.data.msg)
      }
      this.getUsers()
    },
    async getUserById() {
      if (this.query === '') {
        this.getUsers()
        return
      }
      const { data: res } = await this._http.get(
        `user/userlistid?name=${this.query}`
      )
      this.users = res.user
      this.total = res.user.length
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getUsers()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage
      this.getUsers()
    },
    addUser(user) {
      this.$refs[user].validate(async valid => {
        if (valid) {
          const { data: res } = await this._http.post(
            'user/userlistadd',
            this.addForm
          )
          if (res.statusCode === 0) {
            this.dialogAddUser = false
            this.$message.success('添加成功')
            this.addForm = {}
            this.getUsers()
          } else {
            this.$message.error('添加失败')
          }
        }
      })
    },
    updateUser(user) {
      if (user.username === 'admin') {
        return
      }
      this.dialogupUser = true
      if (user.role === 1) {
        user.role = '1'
      } else {
        user.role = '2'
      }
      this.upForm.username = user.username
      this.upForm.role = user.role
    },
    deleteUser(user) {
      if (user.username === 'admin') {
        return
      }
      this.$confirm(`确定要删除${user.username}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this._http.delete(`user/userlistdel?username=${user.username}`)
          this.getUsers()
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
