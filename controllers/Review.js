const { User, Movie, Review } = require("../model/model");
const ReviewController = {
  addReview: async (req, res) => {
    try {
      const newReview = new Review({
        contentReview: req.body.contentReview,
        rankReview: req.body.rankReview,
        movie: req.body.movie,
        user: req.body.user,
      });
      const savedReview = await newReview.save();
      if (req.body.movie) {
        const ReviewToMovie = Movie.findById(req.body.movie);
        await ReviewToMovie.updateOne({
          $push: { review: savedReview._id },
        });
      }
      if (req.body.user) {
        const ReviewOfUser = User.findById(req.body.user);
        await ReviewOfUser.updateOne({
          $push: { reviews: savedReview._id },
        });
      }
      res.status(200).json(savedReview);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllReview: async (req, res) => {
    try {
      const allReview = await Review.find()
        .select("-__v")
        .populate([
          {
            path: "movie",
            select: "-__v -review -movieSchedule",
          },
          {
            path: "user",
            select: " -__v -createdAt -updatedAt -reviews",
          },
        ])
        .sort({ createdAt: -1 });
      res.status(200).json(allReview);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findReviewByName: async (req, res) => {
    try {
      const ReviewByName = await Review.find({
        nameReview: { $regex: req.params.key.toString(), $options: "i" },
      })
        .select("-__v")
        .populate([
          {
            path: "movie",
            select: "-__v -review -movieSchedule",
          },
          {
            path: "user",
            select: " -__v -createdAt -updatedAt -reviews",
          },
        ])
        .sort({
          createdAt: -1,
        });
      res.status(200).json(ReviewByName);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findReviewDetail: async (req, res) => {
    try {
      const ReviewDetail = await Review.findById(req.params.id)
        .select("-__v")
        .populate([
          {
            path: "movie",
            select: "-__v -review -movieSchedule",
          },
          {
            path: "user",
            select: " -__v -createdAt -updatedAt -reviews",
          },
        ]);
      res.status(200).json(ReviewDetail);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateReview: async (req, res) => {
    try {
      const updateReview = await Review.findById(req.params.id);

      await updateReview.updateOne({
        $set: {
          contentReview: req.body.codeReview,
          rankReview: req.body.nameReview,
        },
      });

      res.status(200).json("Update successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteReview: async (req, res) => {
    try {
      await Movie.updateMany(
        {
          review: req.params.id,
        },
        {
          $pull: { review: req.params.id },
        }
      );
      await User.updateMany(
        {
          reviews: req.params.id,
        },
        {
          $pull: { reviews: req.params.id },
        }
      );
      await Review.findByIdAndDelete(req.params.id);
      res.status(200).json("Delete successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = ReviewController;
