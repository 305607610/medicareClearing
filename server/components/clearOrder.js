const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()

/**
 * 分页查询药品
 */
router.get('/clearorder', async (req, res) => {
  const { pageNum, pageSize } = url.parse(req.url, true).query
  let fir = (pageNum - 1) * pageSize
  let sec = pageSize
  const num = await querySql('select cNum from tclear')

  const clear = await querySql(`SELECT * FROM tinsucard AS s INNER JOIN tclear AS c INNER JOIN tinhospital AS h INNER JOIN thospital AS ho WHERE s.icNum = c.icNum AND h.ihNum = c.ihNum AND h.hNum = ho.hNum limit ${fir}, ${sec}`)

  for (let i = 0; i < clear.length; i++) {
    let exam = await querySql(`SELECT ex.*, e.eName FROM texamine AS e INNER JOIN texamde AS ex WHERE e.eNum = ex.eNum AND ex.ihNum = '${clear[i].ihNum}'`)
    let drug = await querySql(`SELECT de.*, d.dName FROM tdrug AS d INNER JOIN tdetails AS de WHERE d.dNum = de.dNum AND de.ihNum = '${clear[i].ihNum}'`)
    let inhos = await querySql(`SELECT h.*, i.inHosDay, i.inHosMon FROM thospital AS h INNER JOIN tinhospital AS i WHERE h.hNum = i.hNum AND i.ihNum = '${clear[i].ihNum}'`)
    clear[i].exam = exam
    clear[i].drug = drug
    clear[i].inhos = inhos
  }

  if (!clear || clear.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      clear,
      num: num.length
    })
  }
})

/**
 * 支付
 */
router.post('/toPay', async (req, res) => {
  let order = req.body
  let clearMon = 0
  let myMon = 0
  const info = await querySql(`SELECT c.*, h.*, s.inHosBao, s.noHosBao FROM tinsurance AS s INNER JOIN tinsucard AS c INNER JOIN tinhospital AS h WHERE s.iNum = c.iNum AND c.idCard = h.idCard AND h.ihNum = '${order.ihNum}'`)
  let cNum = 'Cle-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5)
  if (order.isClear === 0) {
    if (info[0].inStatus === 1) {
      if (order.isInHos === 1) {
        clearMon = order.allMoney * info[0].inHosBao
      } else {
        clearMon = order.allMoney * info[0].noHosBao
      }
    } else {
      clearMon = 0
    }

    myMon = order.allMoney - clearMon
    let remark = '' + order.isInHos + info[0].inStatus
    const clear = await querySql(`insert into tclear values ('${cNum}', '${order.ihNum}', '${info[0].icNum}', ${order.allMoney}, ${clearMon}, ${myMon}, '${remark}')`)
    await querySql(`update tinhospital set isClear = 1 where ihNum = '${order.ihNum}'`)
    if (!clear || clear.length === 0) {
      res.json({
        statusCode: -1,
        msg: '结算失败'
      })
    } else {
      // 区块链
      const clearApp = {
        "cNum": `'${cNum}'`,
        "idName": `'${info[0].idName}'`,
        "iName": `'${info[0].iName}'`,
        "clearMoney": `${clearMon.toFixed(2)}`
      }
      res.json({
        statusCode: 0,
        msg: '结算成功',
        clearApp
      })
    }
  } else {
    res.json({
      statusCode: -1,
      msg: '已结算'
    })
  }

})

/**
 * 名称模糊查询
 */
router.get('/clearname', async (req, res) => {
  const { name } = url.parse(req.url, true).query
  const clear = await querySql(`SELECT * FROM tinsucard AS s INNER JOIN tclear AS c INNER JOIN tinhospital AS h INNER JOIN thospital AS ho WHERE s.icNum = c.icNum AND h.ihNum = c.ihNum AND h.hNum = ho.hNum AND s.idName LIKE '%${name}%'`)
  for (let i = 0; i < clear.length; i++) {
    let exam = await querySql(`SELECT ex.*, e.eName FROM texamine AS e INNER JOIN texamde AS ex WHERE e.eNum = ex.eNum AND ex.ihNum = '${clear[i].ihNum}'`)
    let drug = await querySql(`SELECT de.*, d.dName FROM tdrug AS d INNER JOIN tdetails AS de WHERE d.dNum = de.dNum AND de.ihNum = '${clear[i].ihNum}'`)
    let inhos = await querySql(`SELECT h.*, i.inHosDay, i.inHosMon FROM thospital AS h INNER JOIN tinhospital AS i WHERE h.hNum = i.hNum AND i.ihNum = '${clear[i].ihNum}'`)
    clear[i].exam = exam
    clear[i].drug = drug
    clear[i].inhos = inhos
  }

  if (!clear || clear.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      clear,
      num: clear.length
    })
  }
})

/**
 * 删除药品
 */
router.delete('/cleardel', async (req, res) => {
  const { cNum } = url.parse(req.url, true).query
  const clear = await querySql(`delete from tclear where cNum = '${cNum}'`)
  if (!clear || clear.length === 0) {
    res.json({
      statusCode: -1,
      msg: '删除失败'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '删除成功',
      clear,
    })
  }
})

module.exports = router