const MovieScheduleController = require("../controllers/MovieSchedule");

const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  MovieScheduleController.addMovieSchedule
);
router.get(
  "/",
  verifyToken.verifyTokenAPI,
  MovieScheduleController.getAllMovieSchedule
);
router.get(
  "/:key",
  verifyToken.verifyTokenAPI,
  MovieScheduleController.findMovieScheduleByName
);
router.get(
  "/detail/:id",
  verifyToken.verifyTokenAPI,
  MovieScheduleController.findMovieScheduleDetail
);
router.put(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  MovieScheduleController.updateMovieSchedule
);
router.delete(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  MovieScheduleController.deleteMovieSchedule
);
module.exports = router;
