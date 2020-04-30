const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()

/**
 * 分页查询信息
 */
router.get('/iCardlist', async (req, res) => {
  const { pageNum, pageSize } = url.parse(req.url, true).query
  let fir = (pageNum - 1) * pageSize
  let sec = pageSize
  const iCard = await querySql(`select * from tinsucard limit ${fir}, ${sec}`)
  const num = await querySql('select * from tinsucard')
  if (!iCard || iCard.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      iCard,
      num: num.length
    })
  }
})

/**
 * 修改信息
 */
router.post('/iCardup', async (req, res) => {
  const { icNum, idCard, iNum } = req.body
  const patient = await querySql(`select * from trecord where idCard='${idCard}'`)
  const insu = await querySql(`select * from tinsurance where iNum='${iNum}'`)
  const iCard = await querySql(`update tinsucard set idCard='${idCard}', idName='${patient[0].uName}', iNum='${iNum}', iName='${insu[0].iName}' where icNum='${icNum}'`)
  if (!iCard) {
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
 * 支付
 */
router.post('/toPay', async (req, res) => {
  const { icNum, idCard, iNum } = req.body
  const patient = await querySql(`select * from trecord where idCard='${idCard}'`)
  const insu = await querySql(`select * from tinsurance where iNum='${iNum}'`)
  const iCard = await querySql(`select * from tinsucard where icNum='${icNum}'`)
  if(iCard[0].inStatus === 0){
    const iCard = await querySql(`update tinsucard set inStatus=1, inMoney=${insu[0].biMoney}, inDate='${(new Date()).toLocaleString()}' where icNum='${icNum}'`)
    res.json({
      statusCode: 0,
      msg: '支付成功'
    })
  } else{
    res.json({
      statusCode: -1,
      msg: '已支付'
    })
  }
})

/**
 * 添加医保卡
 */
router.post('/iCardadd', async (req, res) => {
  const { icNum, idCard, iNum } = req.body
  const patient = await querySql(`select * from trecord where idCard='${idCard}'`)
  const insu = await querySql(`select * from tinsurance where iNum='${iNum}'`)
  const iCard = await querySql(`insert into tinsucard values ('${icNum}', '${idCard}', '${patient[0].uName}', '${iNum}', '${insu[0].iName}', 0, 0, '0000-00-00 00:00:00')`)
  if (!iCard) {
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
router.get('/iCardlistname', async (req, res) => {
  const { idName } = url.parse(req.url, true).query
  const iCard = await querySql(`select * from tinsucard where idName like '%${idName}%'`)
  if (!iCard || iCard.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      iCard,
      num: iCard.length
    })
  }
})

/**
 * 删除医保卡
 */
router.delete('/iCardlistdel', async (req, res) => {
  const { icNum } = url.parse(req.url, true).query
  const iCard = await querySql(`delete from tinsucard where icNum = '${icNum}'`)
  if (!iCard || iCard.length === 0) {
    res.json({
      statusCode: -1,
      msg: '删除失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '删除成功',
      iCard,
    })
  }
})

module.exports = router