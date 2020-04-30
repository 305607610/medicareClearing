const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()

/**
 * 用户登录
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const login = await querySql(`select * from tuser where username = '${username}' and password = '${password}'`)
  if (!login || login.length === 0) {
    res.json({
      statusCode: -1,
      msg: '登录失败'
    })
  } else {
    const token = jwt.sign(
      { username },
      PRIVATE_KEY,
      { expiresIn: JWT_EXPIRED }
    )
    res.json({
      statusCode: 0,
      msg: '登录成功',
      token,
      login
    })
  }
})

/**
 * 添加用户
 */
router.post('/userlistadd', async (req, res) => {
  const { username, password } = req.body
  let role = 2
  let status = 0
  const user = await querySql(`insert into tuser values ('${username}', '${password}', ${role}, ${status})`)
  if (!user) {
    res.json({
      statusCode: -1,
      msg: '添加失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '添加成功'
    })
  }
})

/**
 * 分页查询所有用户
 */
router.get('/userlist', async (req, res) => {
  const { pageNum, pageSize } = url.parse(req.url, true).query
  let fir = (pageNum - 1) * pageSize
  let sec = pageSize
  const user = await querySql(`select * from tuser limit ${fir}, ${sec}`)
  const num = await querySql('select * from tuser')
  for (let i = 0; i < user.length; i++) {
    if (user[i].status === 1) {
      user[i].status = true
    } else {
      user[i].status = false
    }
  }
  if (!user || user.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      user,
      num: num.length
    })
  }
})

/**
 * 校验用户名
 */
router.get('/userlistva', async (req, res) => {
  const { username } = url.parse(req.url, true).query
  const name = await querySql(`select username from tuser where username = '${username}'`)
  if (!name || name.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      name
    })
  }
})

/**
 * 用户名模糊查询
 */
router.get('/userlistid', async (req, res) => {
  const { name } = url.parse(req.url, true).query
  const user = await querySql(`select * from tuser where username like '%${name}%'`)
  for (let i = 0; i < user.length; i++) {
    if (user[i].status === 1) {
      user[i].status = true
    } else {
      user[i].status = false
    }
  }
  if (!user || user.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      user,
      num: user.length
    })
  }
})

/**
 * 删除用户
 */
router.delete('/userlistdel', async (req, res) => {
  const { username } = url.parse(req.url, true).query
  const user = await querySql(`delete from tuser where username = '${username}'`)
  if (!user || user.length === 0) {
    res.json({
      statusCode: -1,
      msg: '删除失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '删除成功',
      user,
    })
  }
})

/**
 * 修改用户状态
 */
router.get('/userlistup', async (req, res) => {
  const { username, status } = url.parse(req.url, true).query
  status === true ? 1 : 0
  const user = await querySql(`update tuser set status = ${status} where username = '${username}'`)
  if (!user || user.length === 0) {
    res.json({
      statusCode: -1,
      msg: '修改失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '修改用户状态成功',
      user,
    })
  }
})

module.exports = router