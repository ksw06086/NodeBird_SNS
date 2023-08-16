const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { afterUploadImage, uploadPost, like, likeCancel } = require('../controllers/post');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
// upload 폴더가 있는지 확인하고 없으면 만들기
try {
    fs.readdirSync('uploads');
} catch (err) {
    fs.mkdirSync('uploads');
}

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    region: 'ap-northeast-2', // 지역
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'nodebird01',
        key(req, file, cb) {
            cb(null, `original/${Date.now()}_${file.originalname}`);
        },
    }),
    limits: { fileSize: 20*1024*1024 },
});
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

module.exports = router;
