const MovieController = require("../controllers/Movie");
const upload = require("../middleware/uploadPictureMovie");
const upload2 = require("../middleware/uploadPictureMovie");
const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/add/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.any([{ name: "pictureMovie" }, { name: "thumbnailMovie" }]),
  MovieController.addMovie
);
router.post(
  "/add-movie-to-schelude",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,

  MovieController.addMovieToSchedele
);
router.get("/all/", verifyToken.verifyTokenAPI, MovieController.getAllMovie);
router.get(
  "/pagination",
  verifyToken.verifyTokenAPI,
  MovieController.getAllMovieByPagination
);
router.get(
  "/search-name/",
  verifyToken.verifyTokenAPI,
  MovieController.findMovieByName
);
router.get(
  "/detail/",
  verifyToken.verifyTokenAPI,
  MovieController.findMovieDetail
);
router.put(
  "/update/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.any([{ name: "pictureMovie" }, { name: "thumbnailMovie" }]),
  MovieController.updateMovie
);
router.delete(
  "/delete/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  MovieController.deleteMovie
);
router.delete(
  "/delete-movie-to-schelude/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  MovieController.deleteScheduleOfMovie
);
module.exports = router;
