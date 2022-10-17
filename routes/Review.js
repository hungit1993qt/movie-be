const ReviewController = require("../controllers/Review");

const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
//
router.post(
  "/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,

  ReviewController.addReview
);
router.get("/", verifyToken.verifyTokenAPI, ReviewController.getAllReview);
router.get(
  "/:key",
  verifyToken.verifyTokenAPI,
  ReviewController.findReviewByName
);
router.get(
  "/detail/:id",
  verifyToken.verifyTokenAPI,
  ReviewController.findReviewDetail
);
router.put(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,

  ReviewController.updateReview
);
router.delete(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  ReviewController.deleteReview
);
module.exports = router;
