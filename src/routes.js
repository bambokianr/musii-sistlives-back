const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');
const crypto = require('crypto');
const aws = require('aws-sdk');

const s3 = new aws.S3();

routes.post('/post', multer(multerConfig).single('file'), (req, res) => {
  const { originalname: name, size, key, location: url = `${process.env.APP_URL}/files/${key}` } = req.file;
  const post = {
    _id: crypto.randomBytes(8).toString('hex'),
    name,
    size, 
    key,
    url,
  }
  
  return res.json(post);
});
 
routes.delete('/post/:key',  (req, res) => {
  s3.deleteObject({
    Bucket: process.env.BUCKET_S3,
    Key: req.params.key, //key --> 'hash-nomedoarquivo.extensao'
  }) .promise();

  return res.send();
})

module.exports = routes;