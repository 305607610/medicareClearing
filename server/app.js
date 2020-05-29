const express = require('express')
const router = require('./router')
const cors = require('cors')
// const log4js = require('log4js')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extends: true }))

app.use('/api', router)

// log4js.use(app)

const server = app.listen(3000, () => {
  console.log('服务启动成功：http://localhost:3000')
})