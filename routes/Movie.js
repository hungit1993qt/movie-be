const MovieController = require("../controllers/Movie");
const upload = require("../middleware/uploadPicture");
const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.single("pictureMovie"),
  MovieController.addMovie
);
router.post(
  "/movie-to-schelude",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,

  MovieController.addMovieToSchedele
);
router.get("/", verifyToken.verifyTokenAPI, MovieController.getAllMovie);
router.get(
  "/:key",
  verifyToken.verifyTokenAPI,
  MovieController.findMovieByName
);
router.get(
  "/detail/:id",
  verifyToken.verifyTokenAPI,
  MovieController.findMovieDetail
);
router.put(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.single("pictureMovie"),
  MovieController.updateMovie
);
router.delete(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  MovieController.deleteMovie
);
router.delete(
  "/:movieID/:scheduleID",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  MovieController.deleteScheduleOfMovie
);
module.exports = router;
