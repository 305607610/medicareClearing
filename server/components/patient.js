const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()

/**
 * 分页查询患者
 */
router.get('/patientlist', async (req, res) => {
  const { pageNum, pageSize } = url.parse(req.url, true).query
  let fir = (pageNum - 1) * pageSize
  let sec = pageSize
  const patient = await querySql(`select * from trecord limit ${fir}, ${sec}`)
  const num = await querySql('select * from trecord')
  if (!patient || patient.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      patient,
      num: num.length
    })
  }
})

/**
 * 查询所有患者信息
 */
router.get('/allpatient', async (req, res) => {
  const patient = await querySql('select * from trecord')
  if (!patient || patient.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      patient
    })
  }
})

/**
 * 校验身份证号
 */
router.get('/patientlistva', async (req, res) => {
  const { idCard } = url.parse(req.url, true).query
  const name = await querySql(`select idCard from trecord where idCard = '${idCard}'`)
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
 * 添加患者
 */
router.post('/patientadd', async (req, res) => {
  const { idCard, username, uName, sex, uphoto, email, age, telphone, staAddress, history } = req.body
  const patient = await querySql(`insert into trecord (idCard, uName, sex, uphoto, email, age, telphone, staAddress, history) values ('${idCard}', '${uName}', '${sex}', '${uphoto}', '${email}', ${age}, '${telphone}', '${staAddress}', '${history}')`)
  if (!patient) {
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
 * 修改信息
 */
router.post('/patientup', async (req, res) => {
  const { idCard, username, uName, sex, uphoto, email, age, telphone, staAddress, history } = req.body
  const patient = await querySql(`update trecord set uName='${uName}', sex='${sex}', uphoto='${uphoto}', email='${email}', age=${age}, telphone='${telphone}', staAddress='${staAddress}', history='${history}' where idCard='${idCard}'`)
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
 * 姓名模糊查询
 */
router.get('/patientlistname', async (req, res) => {
  const { uName } = url.parse(req.url, true).query
  const patient = await querySql(`select * from trecord where uName like '%${uName}%'`)
  if (!patient || patient.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      patient,
      num: patient.length
    })
  }
})

/**
 * 删除患者
 */
router.delete('/patientlistdel', async (req, res) => {
  const { idCard } = url.parse(req.url, true).query
  const patient = await querySql(`delete from trecord where idCard = '${idCard}'`)
  if (!patient || patient.length === 0) {
    res.json({
      statusCode: -1,
      msg: '删除失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '删除成功',
      patient,
    })
  }
})

module.exports = router