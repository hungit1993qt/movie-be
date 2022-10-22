const path = require("path");
const multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, res) => {
    res(null, "public/img/uploads/Movie");
  },
  filename: (req, file, res) => {
    let ext = path.extname(file.originalname);
    let pictureName = file.originalname.substring(
      file.originalname.indexOf("."),
      0
    );
    console.log(pictureName);
    res(null, Date.now() + pictureName + ext);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/webp"
    ) {
      callback(null, true);
    } else {
      console.log("only jpg png webp file supported ");
      callback(null, false);
    }
  },
  //   limits: {
  //     fieldSize: 1024 * 1024 * 2,
  //   },
});
module.exports = upload;
