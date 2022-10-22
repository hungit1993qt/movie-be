const ReviewController = require("../controllers/Review");

const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
//
router.post(
  "/add/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,

  ReviewController.addReview
);
router.get("/all/", verifyToken.verifyTokenAPI, ReviewController.getAllReview);
router.get(
  "/search-name/",
  verifyToken.verifyTokenAPI,
  ReviewController.findReviewByName
);
router.get(
  "/detail/",
  verifyToken.verifyTokenAPI,
  ReviewController.findReviewDetail
);
router.put(
  "/update/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,

  ReviewController.updateReview
);
router.delete(
  "/delete/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  ReviewController.deleteReview
);
module.exports = router;
