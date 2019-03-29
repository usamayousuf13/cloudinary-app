var express = require("express");
var router = express.Router();
var multer = require("multer");
require("dotenv").config();

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "C:/Users/Usama/WebstormProjects/cloudinaryapp/public/userImages");
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imagefilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

var uploaded = multer({ storage: storage, fileFilter: imagefilter });

// configuring cloudinary

var cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

/* GET home page. */
router.get("/", function(req, res, next) {
  console.log(
    "process.env.cloud_name ",
    process.env.cloud_name,
    "process.env.api_key ",
    process.env.api_key,
    " process.env.api_secret ",
    process.env.api_secret
  );
  res.render("index", { title: "Express" });
});

router.post("/", uploaded.single("image"), function(req, res) {
  var topic = req.body.topic;
  var username = req.body.username;
  var keywords = req.body.keywords;
  var date = req.body.date;
  var blog = req.body.blog;
  var blogImage = req.body.blogImage;

  console.log(blogImage);

  cloudinary.uploader.upload(req.file.path, function(result) {
    console.log("->" + req.file.path);

    console.log(result);
    res.render("added", { data: result });
  });
});

module.exports = router;
