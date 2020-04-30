const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()

/**
 * 分页查询医院
 */
router.get('/hospitallist', async (req, res) => {
  const { pageNum, pageSize } = url.parse(req.url, true).query
  let fir = (pageNum - 1) * pageSize
  let sec = pageSize
  const hos = await querySql(`select * from thospital limit ${fir}, ${sec}`)
  const num = await querySql('select * from thospital')
  if (!hos || hos.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      hos,
      num: num.length
    })
  }
})

/**
 * 查询所有医院
 */
router.get('/allhospital', async (req, res) => {
  const hos = await querySql('select * from thospital')
  if (!hos || hos.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      hos,
    })
  }
})


/**
 * 修改信息
 */
router.post('/hospitalup', async (req, res) => {
  const { hNum, hName, hType, hAddress, inhMoney } = req.body
  const patient = await querySql(`update thospital set hName='${hName}', hType='${hType}', hAddress='${hAddress}', inhMoney=${inhMoney} where hNum='${hNum}'`)
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
 * 添加医院
 */
router.post('/hospitaladd', async (req, res) => {
  const { hNum, hName, hType, hAddress, inhMoney } = req.body
  const hos = await querySql(`insert into thospital values ('${hNum}', '${hName}', '${hType}', '${hAddress}', ${inhMoney})`)
  if (!hos) {
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
router.get('/hospitallistname', async (req, res) => {
  const { hName } = url.parse(req.url, true).query
  const hos = await querySql(`select * from thospital where hName like '%${hName}%'`)
  if (!hos || hos.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      hos,
      num: hos.length
    })
  }
})

/**
 * 删除医院
 */
router.delete('/hospitallistdel', async (req, res) => {
  const { hNum } = url.parse(req.url, true).query
  const hos = await querySql(`delete from thospital where hNum = '${hNum}'`)
  if (!hos || hos.length === 0) {
    res.json({
      statusCode: -1,
      msg: '删除失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '删除成功',
      hos,
    })
  }
})

module.exports = router