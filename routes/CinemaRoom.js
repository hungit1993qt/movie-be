const CinemaRoomController = require("../controllers/CinemaRoom");

const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  CinemaRoomController.addCinemaRoom
);
router.get(
  "/",
  verifyToken.verifyTokenAPI,
  CinemaRoomController.getAllCinemaRoom
);
router.get(
  "/:key",
  verifyToken.verifyTokenAPI,
  CinemaRoomController.findCinemaRoomByName
);
router.get(
  "/detail/:id",
  verifyToken.verifyTokenAPI,
  CinemaRoomController.findCinemaRoomDetail
);
router.put(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  CinemaRoomController.updateCinemaRoom
);
router.delete(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  CinemaRoomController.deleteCinemaRoom
);
module.exports = router;
