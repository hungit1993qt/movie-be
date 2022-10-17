const { MovieSchedule, CinemaRoom } = require("../model/model");
const MovieScheduleController = {
  addMovieSchedule: async (req, res) => {
    try {
      const newMovieSchedule = new MovieSchedule({
        codeMovieSchedule: req.body.codeMovieSchedule,
        timeDateMovieSchedule: req.body.timeDateMovieSchedule,
        price: req.body.price,
        cinemaRoom: req.body.cinemaRoom,
      });

      const savedMovieSchedule = await newMovieSchedule.save();
      if (req.body.cinemaRoom) {
        const cinemaRoom = CinemaRoom.findById(req.body.cinemaRoom);
        await cinemaRoom.updateOne({
          $push: { movieSchedule: savedMovieSchedule._id },
        });
      }
      res.status(200).json(savedMovieSchedule);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllMovieSchedule: async (req, res) => {
    try {
      const allMovieSchedule = await MovieSchedule.find()
        .select("-__v")
        .populate([
          {
            path: "cinemaRoom",
            select: "-movieSchedule -__v -createdAt -updatedAt",
            populate: {
              path: "cinema",
              select: "-cinemaRoom -cinemas -__v -createdAt -updatedAt",
              populate: {
                path: "cinemaSystemLocation",
                select: "-cinemas -__v -createdAt -updatedAt",
                populate: {
                  path: "CinemaBrands",
                  select: "-cinemaSystemLocation -__v -createdAt -updatedAt",
                },
              },
            },
          },
          {
            path: "movie",
            select: "-movieSchedule -__v",
          },
        ])
        .sort({ createdAt: -1 });
      res.status(200).json(allMovieSchedule);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findMovieScheduleByName: async (req, res) => {
    try {
      const MovieScheduleByName = await MovieSchedule.find({
        nameMovieSchedule: { $regex: req.params.key.toString(), $options: "i" },
      })
        .select("-createdAt -updatedAt -__v -createdAt -updatedAt")
        .populate({
          path: "cinemaRoom",
          select: "-movieSchedule -__v -createdAt -updatedAt",
          populate: {
            path: "cinema",
            select: "-cinemaRoom -cinemas -__v -createdAt -updatedAt",
            populate: {
              path: "cinemaSystemLocation",
              select: "-cinemas -__v -createdAt -updatedAt",
              populate: {
                path: "CinemaBrands",
                select: "-cinemaSystemLocation -__v -createdAt -updatedAt",
              },
            },
          },
        })
        .sort({
          createdAt: -1,
        });
      res.status(200).json(MovieScheduleByName);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findMovieScheduleDetail: async (req, res) => {
    try {
      const MovieScheduleDetail = await MovieSchedule.findById(req.params.id)
        .select("-createdAt -updatedAt -__v ")
        .populate({
          path: "cinemaRoom",
          select: "-movieSchedule -__v -createdAt -updatedAt",
          populate: {
            path: "cinema",
            select: "-cinemaRoom -cinemas -__v -createdAt -updatedAt",
            populate: {
              path: "cinemaSystemLocation",
              select: "-cinemas -__v -createdAt -updatedAt",
              populate: {
                path: "CinemaBrands",
                select: "-cinemaSystemLocation -__v -createdAt -updatedAt",
              },
            },
          },
        });
      res.status(200).json(MovieScheduleDetail);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateMovieSchedule: async (req, res) => {
    try {
      const updateMovieSchedule = await MovieSchedule.findById(req.params.id);
      await updateMovieSchedule.updateOne({
        $set: {
          codeMovieSchedule: req.body.codeMovieSchedule,
          timeDateMovieSchedule: req.body.timeDateMovieSchedule,
          price: req.body.price,
          cinemaRoom: req.body.cinemaRoom,
        },
      });

      res.status(200).json("Update successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteMovieSchedule: async (req, res) => {
    try {
      const foundMovieSchedule = await MovieSchedule.findById(req.params.id);
      if (foundMovieSchedule.review.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Movie Schedule have " +
              "(" +
              foundMovieSchedule.review.length +
              ")" +
              " review "
          );
      } else {
        await CinemaRoom.updateMany(
          {
            movieSchedule: req.params.id,
          },
          {
            $pull: { movieSchedule: req.params.id },
          }
        );
        await MovieSchedule.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = MovieScheduleController;
