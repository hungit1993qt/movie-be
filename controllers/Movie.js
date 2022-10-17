const { Movie, MovieSchedule } = require("../model/model");
function convertViToEn(str, toUpperCase = false) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  str = str.replace(/ /g, "-");

  return toUpperCase ? str.toUpperCase() : str;
}
const MovieController = {
  addMovie: async (req, res) => {
    try {
      const newMovie = new Movie({
        codeMovie: req.body.codeMovie,
        nameMovie: req.body.nameMovie,
        slugMovie: convertViToEn(req.body.nameMovie),
        hotMovie: req.body.hotMovie,
        showingMovie: req.body.showingMovie,
        comingMovie: req.body.comingMovie,
        hotMovie: req.body.hotMovie,
      });
      if (req.file) {
        newMovie.pictureMovie = "http://localhost:8000/" + req.file.path;
      }

      const savedMovie = await newMovie.save();

      res.status(200).json(savedMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  addMovieToSchedele: async (req, res) => {
    try {
      const findMovie = await Movie.findById(req.body.movieId);
      const findSchedules = await MovieSchedule.findById(req.body.scheduleId);
      const checkScheduled = findMovie.movieSchedule.find(
        (resultSchedule) => resultSchedule._id == req.body.scheduleId
      );

      if (checkScheduled) {
        return res.status(400).json("Duplicate,the movie has been schedules");
      }

      await findSchedules.updateOne({
        $push: { movie: req.body.movieId },
      });
      await findMovie.updateOne({
        $push: { movieSchedule: req.body.scheduleId },
      });
      res.status(200).json("Put movie to schedule successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // updateMovieToSchedele: async (req, res) => {
  //   try {
  //     const updateMovieToSchedele = await Movie.findById(req.params.id);
  //     await updateMovieToSchedele.updateOne({
  //       _id: req.params.id,
  //     });
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // },
  getAllMovie: async (req, res) => {
    try {
      const allMovie = await Movie.find()
        .select("-__v")
        .populate([
          {
            path: "movieSchedule",
            select: "-movie -__v",
          },
          {
            path: "review",
            select: "-Movie -__v -createdAt -updatedAt",
          },
        ])
        .sort({ createdAt: -1 });
      res.status(200).json(allMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findMovieByName: async (req, res) => {
    try {
      const MovieByName = await Movie.find({
        nameMovie: { $regex: req.params.key.toString(), $options: "i" },
      })
        .select("-createdAt -updatedAt -__v -createdAt -updatedAt")
        .populate([
          {
            path: "movieSchedule",
            select: "-movie -__v",
          },
          {
            path: "review",
            select: "-Movie -__v -createdAt -updatedAt",
          },
        ])
        .sort({
          createdAt: -1,
        });
      res.status(200).json(MovieByName);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findMovieDetail: async (req, res) => {
    try {
      const MovieDetail = await Movie.findById(req.params.id)
        .select("-createdAt -updatedAt -__v ")
        .populate([
          {
            path: "movieSchedule",
            select: "-movie -__v",
          },
          {
            path: "review",
            select: "-Movie -__v -createdAt -updatedAt",
          },
        ]);
      res.status(200).json(MovieDetail);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateMovie: async (req, res) => {
    try {
      const updateMovie = await Movie.findById(req.params.id);

      await updateMovie.updateOne({
        $set: {
          codeMovie: req.body.codeMovie,
          nameMovie: req.body.nameMovie,
          slugMovie: convertViToEn(req.body.nameMovie),
          hotMovie: req.body.hotMovie,
          showingMovie: req.body.showingMovie,
          comingMovie: req.body.comingMovie,
          hotMovie: req.body.hotMovie,
        },
      });
      if (req.file) {
        await updateMovie.updateOne({
          pictureMovie: "http://localhost:8000/" + req.file.path,
        });
      }
      res.status(200).json("Update successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteMovie: async (req, res) => {
    try {
      const foundMovie = await Movie.findById(req.params.id);
      if (foundMovie.Movie.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Movie Schedule have " +
              "(" +
              foundMovie.Movie.length +
              ")" +
              " Movie "
          );
      } else {
        await CinemaRoom.updateMany(
          {
            Movie: req.params.id,
          },
          {
            $pull: { Movie: req.params.id },
          }
        );
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteScheduleOfMovie: async (req, res) => {
    try {
      const findMovie = await Movie.findById(req.params.movieID);
      const checkScheduleOfMovie = findMovie.movieSchedule.find(
        (resultSchedule) => resultSchedule._id == req.params.scheduleID
      );
      if (!checkScheduleOfMovie) {
        return res.status(400).json("Error,the movie hasn't schedules");
      }

      await Movie.updateMany(
        {
          _id: req.params.movieID,
        },
        {
          $pull: { movieSchedule: req.params.scheduleID },
        }
      );
      await MovieSchedule.updateMany(
        {
          _id: req.params.scheduleID,
        },
        {
          $pull: { movie: req.params.movieID },
        }
      );
      res.status(200).json("Delete successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = MovieController;
