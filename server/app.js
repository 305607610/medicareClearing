const express = require('express')
const router = require('./router')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extends: true }))

app.use('/api', router)

const server = app.listen(3000, () => {
  console.log('服务启动成功：http://localhost:3000')
})