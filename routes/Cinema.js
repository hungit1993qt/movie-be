const CinemaController = require("../controllers/Cinema");

const router = require("express").Router();
const upload = require("../middleware/uploadPicture");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/",
  verifyToken.verifyTokenAPI,
//   verifyToken.verifyTokenManager,
  upload.single("pictureCinema"),
  CinemaController.addCinema
);
router.get(
  "/",
  verifyToken.verifyTokenAPI,
  CinemaController.getAllCinema
);
router.get(
  "/:key",
  verifyToken.verifyTokenAPI,
  CinemaController.findCinemaByName
);
router.get(
  "/detail/:id",
  verifyToken.verifyTokenAPI,
  CinemaController.findCinemaDetail
);
router.put(
  "/:id",
  verifyToken.verifyTokenAPI,
//   verifyToken.verifyTokenManager,
  upload.single("pictureCinema"),
  CinemaController.updateCinema
);
router.delete(
  "/:id",
  verifyToken.verifyTokenAPI,
//   verifyToken.verifyTokenManager,
CinemaController.deleteCinema
);
module.exports = router;
