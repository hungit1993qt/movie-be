const path = require("path");
const multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, res) => {
    res(null, "public/video/uploads");
  },
  filename: (req, file, res) => {
    let ext = path.extname(file.originalname);
    res(null, req.body.name + "-" + Date.now() + ext);
  },
});

var uploadVideo = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == "video/mp4" ||
      file.mimetype == "video/MP2T" ||
      file.mimetype == "video/quicktime" ||
      file.mimetype == "video/x-ms-wmv"
    ) {
      callback(null, true);
    } else {
      console.log("only mp4,mov,avi,wmv supported ");
      callback(null, false);
    }
  },
  //   limits: {
  //     fieldSize: 1024 * 1024 * 2,
  //   },
});
module.exports = uploadVideo;
