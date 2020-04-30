const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()

/**
 * 分页查询药品
 */
router.get('/druglist', async (req, res) => {
  const { pageNum, pageSize } = url.parse(req.url, true).query
  let fir = (pageNum - 1) * pageSize
  let sec = pageSize
  const drug = await querySql(`select * from tdrug limit ${fir}, ${sec}`)
  const num = await querySql('select * from tdrug')
  if (!drug || drug.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      drug,
      num: num.length
    })
  }
})

/**
 * 查询所有药品
 */
router.get('/alldrug', async (req, res) => {
  const drug = await querySql('select * from tdrug')
  if (!drug || drug.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      drug
    })
  }
})

/**
 * 修改信息
 */
router.post('/drugup', async (req, res) => {
  const { dNum, dName, dPrice, dPic, spec, madePe, madeDate, dFunction, taboo, expi } = req.body
  const drug = await querySql(`update tdrug set dName='${dName}', dPrice=${dPrice}, dPic='${dPic}', spec='${spec}', madePe='${madePe}', madeDate='${madeDate}', dFunction='${dFunction}', taboo='${taboo}', expi='${expi}' where dNum='${dNum}'`)
  if (!drug) {
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
 * 添加药品
 */
router.post('/drugadd', async (req, res) => {
  const { dNum, dName, dPrice, dPic, spec, madePe, madeDate, dFunction, taboo, expi } = req.body
  const drug = await querySql(`insert into tdrug values ('${dNum}', '${dName}', ${dPrice}, '${dPic}', '${spec}', '${madePe}', '${madeDate}', '${dFunction}', '${taboo}', '${expi}')`)
  if (!drug) {
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
router.get('/druglistname', async (req, res) => {
  const { dName } = url.parse(req.url, true).query
  const drug = await querySql(`select * from tdrug where dName like '%${dName}%'`)
  if (!drug || drug.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      drug,
      num: drug.length
    })
  }
})

/**
 * 删除药品
 */
router.delete('/druglistdel', async (req, res) => {
  const { dNum } = url.parse(req.url, true).query
  const drug = await querySql(`delete from tdrug where dNum = '${dNum}'`)
  if (!drug || drug.length === 0) {
    res.json({
      statusCode: -1,
      msg: '删除失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '删除成功',
      drug,
    })
  }
})

module.exports = router