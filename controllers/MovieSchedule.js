const { MovieSchedule, CinemaRoom } = require("../model/model");
const MovieScheduleController = {
  addMovieSchedule: async (req, res) => {
    try {
      const newMovieSchedule = new MovieSchedule({
        dateSchedule: req.body.dateSchedule,
        timeSchedule: req.body.timeSchedule,
        price: req.body.price,
      });

      const savedMovieSchedule = await newMovieSchedule.save();

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
            path: "movie",
            select: " -__v -createdAt -updatedAt",
          },
          {
            path: "cinema",
            select: " -__v",
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
        nameMovieSchedule: {
          $regex: req.body.nameMovieSchedule.toString(),
          $options: "i",
        },
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
      const MovieScheduleDetail = await MovieSchedule.findById(req.body.id)
        .select("-createdAt -updatedAt -__v ")
        .populate({
          path: "movies",
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
      const updateMovieSchedule = await MovieSchedule.findById(req.body.id);
      await updateMovieSchedule.updateOne({
        $set: {
          codeMovieSchedule: req.body.codeMovieSchedule,
          timeDateMovieSchedule: req.body.timeDateMovieSchedule,
          price: req.body.price,
        },
      });

      res.status(200).json("Update successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteMovieSchedule: async (req, res) => {
    try {
      const foundMovieSchedule = await MovieSchedule.findById(req.body.id);
      console.log(foundMovieSchedule);
      if (foundMovieSchedule.movie.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Movie Schedule have " +
              "(" +
              foundMovieSchedule.movie.length +
              ")" +
              " movie "
          );
      } else {
        await CinemaRoom.updateMany(
          {
            movieSchedule: req.body.id,
          },
          {
            $pull: { movieSchedule: req.body.id },
          }
        );
        await MovieSchedule.findByIdAndDelete(req.body.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = MovieScheduleController;
