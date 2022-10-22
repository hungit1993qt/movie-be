const MovieScheduleController = require("../controllers/MovieSchedule");

const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/add/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  MovieScheduleController.addMovieSchedule
);
router.get(
  "/all/",
  verifyToken.verifyTokenAPI,
  MovieScheduleController.getAllMovieSchedule
);
router.get(
  "/search-name/",
  verifyToken.verifyTokenAPI,
  MovieScheduleController.findMovieScheduleByName
);
router.get(
  "/detail/",
  verifyToken.verifyTokenAPI,
  MovieScheduleController.findMovieScheduleDetail
);
router.put(
  "/update/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  MovieScheduleController.updateMovieSchedule
);
router.delete(
  "/delete/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  MovieScheduleController.deleteMovieSchedule
);
module.exports = router;
