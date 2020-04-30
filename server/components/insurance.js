const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()

/**
 * 分页查询机构
 */
router.get('/insulist', async (req, res) => {
  const { pageNum, pageSize } = url.parse(req.url, true).query
  let fir = (pageNum - 1) * pageSize
  let sec = pageSize
  const insu = await querySql(`select * from tinsurance limit ${fir}, ${sec}`)
  const num = await querySql('select * from tinsurance')
  if (!insu || insu.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      insu,
      num: num.length
    })
  }
})

/**
 * 查询所有机构
 */
router.get('/allinsu', async (req, res) => {
  const insu = await querySql('select * from tinsurance')
  if (!insu || insu.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      insu
    })
  }
})

/**
 * 修改信息
 */
router.post('/insuup', async (req, res) => {
  const { iNum, iName, biMoney, inHosBao, noHosBao } = req.body
  const patient = await querySql(`update tinsurance set iName='${iName}', biMoney=${biMoney}, inHosBao=${inHosBao}, noHosBao=${noHosBao} where iNum='${iNum}'`)
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
 * 添加机构
 */
router.post('/insuadd', async (req, res) => {
  const { iNum, iName, biMoney, inHosBao, noHosBao } = req.body
  const insu = await querySql(`insert into tinsurance values ('${iNum}', '${iName}', ${biMoney}, ${inHosBao}, ${noHosBao})`)
  if (!insu) {
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
 * 姓名模糊查询
 */
router.get('/insulistname', async (req, res) => {
  const { iName } = url.parse(req.url, true).query
  const insu = await querySql(`select * from tinsurance where iName like '%${iName}%'`)
  for (let i = 0; i < insu.length; i++) {
    if (insu[i].status === 1) {
      insu[i].status = true
    } else {
      insu[i].status = false
    }
  }
  if (!insu || insu.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      insu,
      num: insu.length
    })
  }
})

/**
 * 删除机构
 */
router.delete('/insulistdel', async (req, res) => {
  const { iNum } = url.parse(req.url, true).query
  const insu = await querySql(`delete from tinsurance where iNum = '${iNum}'`)
  if (!insu || insu.length === 0) {
    res.json({
      statusCode: -1,
      msg: '删除失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '删除成功',
      insu,
    })
  }
})

module.exports = router