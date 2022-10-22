const CinemaBrandController = require("../controllers/CinemaBrand");

const router = require("express").Router();
const upload = require("../middleware/uploadPictureCinemaBrand");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/add/",
  verifyToken.verifyTokenAPI,
//   verifyToken.verifyTokenManager,
  upload.single("logoCinemaBrand"),
  CinemaBrandController.addCinemaBrand
);
router.get(
  "/all/",
  verifyToken.verifyTokenAPI,
  CinemaBrandController.getAllCinemaBrand
);
router.get(
  "/search-name/",
  verifyToken.verifyTokenAPI,
  CinemaBrandController.findCinemaBrandByName
);
router.get(
  "/detail/",
  verifyToken.verifyTokenAPI,
  CinemaBrandController.findDetailCinemaBrand
);
router.put(
  "/update/",
  verifyToken.verifyTokenAPI,
//   verifyToken.verifyTokenManager,
  upload.single("logoCinemaBrand"),
  CinemaBrandController.updateCinemaBrand
);
router.delete(
  "/delete/",
  verifyToken.verifyTokenAPI,
//   verifyToken.verifyTokenManager,
  CinemaBrandController.deleteCinemaBrand
);
module.exports = router;
