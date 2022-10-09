const CinemaSystemLocationController = require("../controllers/CinemaSystemLocation");

const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  CinemaSystemLocationController.addCinemaSystemLocation
);
router.get(
  "/",
  verifyToken.verifyTokenAPI,
  CinemaSystemLocationController.getAllCinemaSystemLocation
);
router.get(
  "/:key",
  verifyToken.verifyTokenAPI,
  CinemaSystemLocationController.findCinemaSystemLocationByName
);
router.get(
  "/detail/:id",
  verifyToken.verifyTokenAPI,
  CinemaSystemLocationController.findDetailCinemaSystemLocation
);
router.put(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  CinemaSystemLocationController.updateCinemaSystemLocation
);
router.delete(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  CinemaSystemLocationController.deleteCinemaSystemLocation
);
module.exports = router;
