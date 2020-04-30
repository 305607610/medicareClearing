const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()

/**
 * 分页查询医院
 */
router.get('/examinelist', async (req, res) => {
  const { pageNum, pageSize } = url.parse(req.url, true).query
  let fir = (pageNum - 1) * pageSize
  let sec = pageSize
  const examine = await querySql(`select * from texamine limit ${fir}, ${sec}`)
  const num = await querySql('select * from texamine')
  if (!examine || examine.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      examine,
      num: num.length
    })
  }
})

/**
 * 查询所有检查
 */
router.get('/allexam', async (req, res) => {
  const exam = await querySql('select * from texamine')
  if (!exam || exam.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      exam
    })
  }
})

/**
 * 修改信息
 */
router.post('/examineup', async (req, res) => {
  const { hNum, hName, hType, hAddress, inhMoney } = req.body
  const patient = await querySql(`update texamine set hName='${hName}', hType='${hType}', hAddress='${hAddress}', inhMoney=${inhMoney} where hNum='${hNum}'`)
  if (!patient) {
    res.json({
      statusCode: -1,
      msg: '修改失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '修改成功'
    })
  }
})

/**
 * 添加信息
 */
router.post('/examineadd', async (req, res) => {
  const { eNum, eName, ePrice } = req.body
  const examine = await querySql(`insert into texamine values ('${eNum}', '${eName}', ${ePrice})`)
  if (!examine) {
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
 * 名称模糊查询
 */
router.get('/examinename', async (req, res) => {
  const { eName } = url.parse(req.url, true).query
  const examine = await querySql(`select * from texamine where eName like '%${eName}%'`)
  if (!examine || examine.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      examine,
      num: examine.length
    })
  }
})

/**
 * 删除信息
 */
router.delete('/examinelistdel', async (req, res) => {
  const { eNum } = url.parse(req.url, true).query
  const examine = await querySql(`delete from texamine where eNum = '${eNum}'`)
  if (!examine || examine.length === 0) {
    res.json({
      statusCode: -1,
      msg: '删除失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '删除成功',
      examine,
    })
  }
})

module.exports = router