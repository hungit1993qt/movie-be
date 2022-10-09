const CinemaBrandController = require("../controllers/CinemaBrand");

const router = require("express").Router();
const upload = require("../middleware/uploadPicture");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/",
  verifyToken.verifyTokenAPI,
//   verifyToken.verifyTokenManager,
  upload.single("logoCinemaBrand"),
  CinemaBrandController.addCinemaBrand
);
router.get(
  "/",
  verifyToken.verifyTokenAPI,
  CinemaBrandController.getAllCinemaBrand
);
router.get(
  "/:key",
  verifyToken.verifyTokenAPI,
  CinemaBrandController.findCinemaBrandByName
);
router.get(
  "/detail/:id",
  verifyToken.verifyTokenAPI,
  CinemaBrandController.findDetailCinemaBrand
);
router.put(
  "/:id",
  verifyToken.verifyTokenAPI,
//   verifyToken.verifyTokenManager,
  upload.single("logoCinemaBrand"),
  CinemaBrandController.updateCinemaBrand
);
router.delete(
  "/:id",
  verifyToken.verifyTokenAPI,
//   verifyToken.verifyTokenManager,
  CinemaBrandController.deleteCinemaBrand
);
module.exports = router;
