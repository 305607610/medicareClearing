const express = require('express')
const boom = require('boom')
const UserRouter = require('../components/user')
const PatientRouter = require('../components/patient')
const HosRouter = require('../components/hospital')
const InsuRouter = require('../components/insurance')
const ICardRouter = require('../components/iCard')
const DrugRouter = require('../components/drug')
const ExamineRouter = require('../components/examine')
const InhosRouter = require('../components/inhospital')
const ClearRouter = require('../components/clearOrder')
const jwtAuth = require('./jwt')
const {CODE_ERROR} = require('../utils/constant')
const UploadRouter = require('../uploads/upload')

const router = express.Router()

// router.use(jwtAuth)

router.get('/' ,(req, res) => {
  res.send('蛋黄的长裙，蓬松的头发')
})

router.use('/user', UserRouter)
router.use('/patient', PatientRouter)
router.use('/upload', UploadRouter)
router.use('/hospital', HosRouter)
router.use('/insu', InsuRouter)
router.use('/iCard', ICardRouter)
router.use('/drug', DrugRouter)
router.use('/examine', ExamineRouter)
router.use('/inhospital', InhosRouter)
router.use('/clear', ClearRouter)

/**
 * 处理404
 */
router.use((req, res, next) => {
  next(boom.notFound('接口不存在'))
})

/**
 * 路由异常处理
 */
router.use((err, req, res, next) => {
  const msg = (err && err.message) || '系统错误'
  const statusCode = (err.output && err.output.statusCode) || 500
  const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
  res.status(statusCode).json({
    code: CODE_ERROR,
    msg,
    error: statusCode,
    errorMsg
  })
})

module.exports = router