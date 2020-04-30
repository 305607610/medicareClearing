const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()

/**
 * 分页查询费用信息
 */
router.get('/orderlist', async (req, res) => {
  const { pageNum, pageSize } = url.parse(req.url, true).query
  let fir = (pageNum - 1) * pageSize
  let sec = pageSize
  const num = await querySql('select ihNum from tinhospital')

  const order = await querySql(`SELECT i.*, h.hName, r.uName FROM trecord AS r INNER JOIN thospital AS h INNER JOIN tinhospital AS i WHERE i.idCard = r.idCard AND i.hNum = h.hNum limit ${fir}, ${sec}`)

  for (let i = 0; i < order.length; i++) {
    let exam = await querySql(`SELECT ex.*, e.eName FROM texamine AS e INNER JOIN texamde AS ex WHERE e.eNum = ex.eNum AND ex.ihNum = '${order[i].ihNum}'`)
    let drug = await querySql(`SELECT de.*, d.dName FROM tdrug AS d INNER JOIN tdetails AS de WHERE d.dNum = de.dNum AND de.ihNum = '${order[i].ihNum}'`)
    let inhos = await querySql(`SELECT h.*, i.inHosDay, i.inHosMon FROM thospital AS h INNER JOIN tinhospital AS i WHERE h.hNum = i.hNum AND i.ihNum = '${order[i].ihNum}'`)
    order[i].exam = exam
    order[i].drug = drug
    order[i].inhos = inhos
  }

  if (!order || order.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      order,
      num: num.length
    })
  }
})

/**
 * 查询所有药品
 */
router.get('/allorder', async (req, res) => {
  const order = await querySql('select * from tinhospital')
  if (!order || order.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      order
    })
  }
})

/**
 * 修改信息
 */
router.post('/orderup', async (req, res) => {
  const { dNum, dName, dPrice, dPic, spec, madePe, madeDate, dFunction, taboo, expi } = req.body
  const order = await querySql(`update torder set dName='${dName}', dPrice=${dPrice}, dPic='${dPic}', spec='${spec}', madePe='${madePe}', madeDate='${madeDate}', dFunction='${dFunction}', taboo='${taboo}', expi='${expi}' where dNum='${dNum}'`)
  if (!order) {
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
router.post('/inhosadd', async (req, res) => {
  let { ihNum, idCard, hNum, isInHos, inHosDay, drug, exam } = req.body
  let inHosMoney = 0
  let allExamMon = 0
  let drugPrice = 0
  let examPrice = 0
  let allMoney = 0
  let allDrugMon = 0
  let temp = 0
  if (isInHos === true) {
    temp = 1
    const hos = await querySql(`select * from thospital where hNum='${hNum}'`)
    inHosMoney = inHosDay * hos[0].inhMoney
  } else {
    temp = 0
    inHosDay = 0
    inHosMoney = 0
  }
  const info = await querySql(`insert into tinhospital (ihNum, idCard, hNum, isInHos, inHosDay, isClear) values ('${ihNum}', '${idCard}', '${hNum}', ${temp}, ${inHosDay}, 0)`)
  for (let i = 0; i < drug.length; i++) {
    drug[i].tdNum = 'Det-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5)
    drugPrice = drug[i].dPrice * drug[i].num
    const td = await querySql(`insert into tdetails values ('${drug[i].tdNum}', '${ihNum}', '${drug[i].dNum}', ${drug[i].num}, ${drug[i].dPrice}, ${drugPrice})`)
    allDrugMon += drugPrice
  }
  for (let i = 0; i < exam.length; i++) {
    exam[i].edNum = 'Exa-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5)
    examPrice = exam[i].ePrice * exam[i].num
    await querySql(`insert into texamde values ('${exam[i].edNum}', '${ihNum}', '${exam[i].eNum}', ${exam[i].num}, ${exam[i].ePrice}, ${examPrice})`)
    allExamMon += examPrice
  }
  allMoney = allDrugMon + allExamMon + inHosMoney
  await querySql(`update tinhospital set inHosMon=${inHosMoney}, drugMoney=${allDrugMon}, texaMoney=${allExamMon}, allMoney=${allMoney} where ihNum='${ihNum}'`)
  if (!info) {
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
router.get('/ordername', async (req, res) => {
  const { name } = url.parse(req.url, true).query
  const order = await querySql(`SELECT i.*, r.uName, h.hName FROM trecord AS r INNER JOIN thospital AS h INNER JOIN tinhospital AS i WHERE i.idCard = r.idCard AND r.uName like '%${name}%'`)

  for (let i = 0; i < order.length; i++) {
    let exam = await querySql(`SELECT ex.*, e.eName FROM texamine AS e INNER JOIN texamde AS ex WHERE e.eNum = ex.eNum AND ex.ihNum = '${order[i].ihNum}'`)
    let drug = await querySql(`SELECT de.*, d.dName FROM tdrug AS d INNER JOIN tdetails AS de WHERE d.dNum = de.dNum AND de.ihNum = '${order[i].ihNum}'`)
    let inhos = await querySql(`SELECT h.*, i.inHosDay, i.inHosMon FROM thospital AS h INNER JOIN tinhospital AS i WHERE h.hNum = i.hNum AND i.ihNum = '${order[i].ihNum}'`)
    order[i].exam = exam
    order[i].drug = drug
    order[i].inhos = inhos
  }

  if (!order || order.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      order,
      num: order.length
    })
  }
})

/**
 * 删除药品
 */
router.delete('/orderdel', async (req, res) => {
  const { ihNum } = url.parse(req.url, true).query
  const drug = await querySql(`delete from tdetails where ihNum = '${ihNum}'`)
  const exam = await querySql(`delete from texamde where ihNum = '${ihNum}'`)
  const order = await querySql(`delete from tinhospital where ihNum = '${ihNum}'`)
  if (!order || order.length === 0) {
    res.json({
      statusCode: -1,
      msg: '删除失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '删除成功',
      order,
    })
  }
})

module.exports = router