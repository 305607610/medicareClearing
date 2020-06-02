const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()

/**
 * 获取日期
 * @param {*} day 
 */
function getDateList(day) {
  var today = new Date()
  var targetday = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday)
  var tYear = today.getFullYear()
  var tMonth = today.getMonth()
  var tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}
function doHandleMonth(month) {
  var m = month
  if (month.toString().length === 1) {
    m = '0' + month
  }
  return m
}

/**
 * 总金额
 */
router.get('/allmoney', async (req, res) => {
  const money = await querySql('select allMoney, clearMoney from tclear')
  let allMoney = 0
  let clearMoney = 0

  for (let i = 0; i < money.length; i++) {
    allMoney += money[i].allMoney
    clearMoney += money[i].clearMoney
  }

  if (!money || money.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      allMoney,
      clearMoney
    })
  }
})

/**
 * 总订单
 */
router.get('/allorder', async (req, res) => {
  const order = await querySql('select ihNum from tinhospital')
  let allOrder = 0
  let clearOrder = 0

  allOrder = order.length
  const clear = await querySql('select ihNum from tinhospital where isClear = 1')

  clearOrder = clear.length

  if (!order || order.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      allOrder,
      clearOrder
    })
  }
})

/**
 * 七日金额
 */
router.get('/moneylist', async (req, res) => {
  const money = await querySql('select allMoney, clearMoney, cDate from tclear')
  let allMoney = []
  let clearMoney = []
  for(let i = 0; i < 7; i++){
    allMoney[i] = 0
    clearMoney[i] = 0
  }

  for (let i = 0; i < money.length; i++) {
    for(let j = -6, k = 0; j <= 0; j++, k++){
      if(getDateList(j) === money[i].cDate.slice(0, 10)) {
        allMoney[k] += money[i].allMoney
        clearMoney[k] += money[i].clearMoney
      }
    }
  }

  if (!money || money.length === 0) {
    res.json({
      statusCode: -1,
      msg: '没有查询到信息'
    })
  } else {
    res.json({
      statusCode: 0,
      msg: '查询成功',
      allMoney,
      clearMoney
    })
  }
})

/**
 * 七日订单
 */
router.get('/orderlist', async (req, res) => {
  const order = await querySql('select ihDate from tinhospital')
  const clearorder = await querySql('select ihDate from tinhospital where isClear = 1')
  let allOrder = []
  let clearOrder = []
  for(let i = 0; i < 7; i++){
    allOrder[i] = 0
    clearOrder[i] = 0
  }

  for (let i = 0; i < order.length; i++) {
    for(let j = -6, k = 0; j <= 0; j++, k++){
      if(getDateList(j) === order[i].ihDate.slice(0, 10)) {
        allOrder[k] += 1
      }
    }
  }
  for (let i = 0; i < clearorder.length; i++) {
    for(let j = -6, k = 0; j <= 0; j++, k++){
      if(getDateList(j) === clearorder[i].ihDate.slice(0, 10)) {
        clearOrder[k] += 1
      }
    }
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
      allOrder,
      clearOrder
    })
  }
})


module.exports = router