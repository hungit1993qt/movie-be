const CinemaController = require("../controllers/Cinema");

const router = require("express").Router();
const upload = require("../middleware/uploadPictureCinema");
const verifyToken = require("../middleware/verifyToken");

router.get("/all/", verifyToken.verifyTokenAPI, CinemaController.getAllCinema);

router.get(
  "/search-name/",
  verifyToken.verifyTokenAPI,
  CinemaController.findCinemaByName
);

router.get(
  "/detail/",
  verifyToken.verifyTokenAPI,
  CinemaController.findCinemaDetail
);


router.post(
  "/add/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.single("pictureCinema"),
  CinemaController.addCinema
);

router.put(
  "/update/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.single("pictureCinema"),
  CinemaController.updateCinema
);
router.delete(
  "/delete/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  CinemaController.deleteCinema
);
module.exports = router;
