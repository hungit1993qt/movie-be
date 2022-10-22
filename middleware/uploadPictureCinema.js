const path = require("path");
const multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, res) => {
    res(null, "public/img/uploads/Cinema");
  },
  filename: (req, file, res) => {
    let ext = path.extname(file.originalname);
    res(null, Date.now() + ext);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      console.log("only jpg png file supported ");
      callback(null, false);
    }
  },
  //   limits: {
  //     fieldSize: 1024 * 1024 * 2,
  //   },
});
module.exports = upload;
