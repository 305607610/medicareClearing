const express = require('express')
const { querySql } = require('../db/index')
const url = require('url')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')

const router = express.Router()
const fs = require('fs')
const multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() })
// 上传图片
router.post("/upload_image", upload.any(), async (req, res) => {
    const files = req.files || []

    let success = 0 // 成功上传数量
    const promises = files.map(async (file) => {
        try {
            const filePath =  `${__dirname}/${file.originalname}`
            // 判断文件是否存在, 若存在先删除原有文件，再写入新文件
            const is_have = await fs.existsSync(filePath)
            if (is_have) {
                await fs.unlinkSync(filePath)
            }
            await fs.writeFileSync(filePath, file.buffer)
            res.json({
                imgPath: 'server/uploads/' + file.originalname
            })
            success++ // 成功次数+1
        } catch (err) {
            console.error(err)
        }
    })
    // 异步存储图片
    await Promise.all(promises)
    
    return res.json({ text: `已成功上传${success}个文件` })
})

module.exports = router