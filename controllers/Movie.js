const { Movie, MovieSchedule, Review, Cinema } = require("../model/model");
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
const fs = require("fs");
function convertPath(str) {
  str = str.replace(/\\/g, "/");
  return str;
}

const MovieController = {
  addMovie: async (req, res) => {
    try {
      const fullUrl = req.protocol + "://" + req.get("host") + "/";
      const newMovie = new Movie({
        codeMovie: req.body.codeMovie,
        nameMovie: req.body.nameMovie,
        slugMovie: convertViToEn(req.body.nameMovie),
        hotMovie: req.body.hotMovie,
        trainlerMovie: req.body.trainlerMovie,
        showingMovie: req.body.showingMovie,
        comingMovie: req.body.comingMovie,
        description: req.body.description,
        hotMovie: req.body.hotMovie,
      });
      console.log(req.files);

      if (req.files) {
        newMovie.pictureMovie = fullUrl + req.files[0].path;
        newMovie.thumbnailMovie = fullUrl + req.files[1].path; //thumbnail
      }
      const savedMovie = await newMovie.save();
      // if (req.body.cinema) {
      //   const cinema = Cinema.findById(req.body.cinema);
      //   await cinema.updateOne({
      //     $push: { movies: savedMovie._id },
      //   });
      // }

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
  addCategory: async (req, res) => {
    try {
      const movie = await Movie.findById(req.body.id);
      if (req.body.categoryMovie) {
        await movie.updateOne({
          $set: {
            categoryMovie: req.body.categoryMovie,
          },
        });
        res.status(200).json("Add category successfully");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
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
            select: "-movie -__v",
            populate: {
              path: "user",
              select: "-reviews -__v -createdAt -updatedAt",
             
            },
          },
        ])
        .sort({ createdAt: -1 });
      res.status(200).json(allMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllMovieByPagination: async (req, res) => {
    try {
      let pageAsNumber = Number.parseInt(req.query.page);
      let sizeAsNumber = Number.parseInt(req.query.size);
      let page = 0;
      if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber;
      }
      let size = 4; //default
      if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0) {
        size = sizeAsNumber;
      }
      console.log(sizeAsNumber);
      const allItem = await Movie.find();

      const allMovie = await Movie.find()
        .select("-__v")
        .populate([
          {
            path: "movieSchedule",
            select: "-movie -__v",
          },        
          {
            path: "review",
            select: "-movie -__v -createdAt -updatedAt",
            populate: {
              path: "user",
              select: "-reviews -__v -createdAt -updatedAt",
             
            },
          },
        ])
        .sort({ createdAt: -1 })
        .skip(page * size)
        .limit(size);
      res.status(200).json({
        conent: allMovie,
        pageAt: page,
        totalItem: allItem.length,
        totalPages: Math.ceil(allItem.length / size),
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findMovieByName: async (req, res) => {
    try {
      const MovieByName = await Movie.find({
        nameMovie: { $regex: req.body.nameMovie.toString(), $options: "i" },
      })
        .select("-createdAt -updatedAt -__v -createdAt -updatedAt")
        .populate([
          {
            path: "movieSchedule",
            select: "-movie -__v",
          },        
          {
            path: "review",
            select: "-movie -__v -createdAt -updatedAt",
            populate: {
              path: "user",
              select: "-reviews -__v -createdAt -updatedAt",
             
            },
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
      const slug = req.query.slugMovie;
      console.log(slug);
      const MovieDetail = await Movie.findOne({
        slugMovie: slug,
      })
        .select("-createdAt -updatedAt -__v ")
        .populate([
          {
            path: "movieSchedule",
            select: "-movie -__v",
          },        
          {
            path: "review",
            select: "-movie -__v",
            populate: {
              path: "user",
              select: "-reviews -__v -createdAt -updatedAt",
             
            },
          },
        ]);
      res.status(200).json(MovieDetail);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateMovie: async (req, res) => {
    try {
      const fullUrl = req.protocol + "://" + req.get("host") + "/";
      const updateMovie = await Movie.findById(req.body.id);
      console.log(updateMovie);
      if (updateMovie == null) {
        fs.unlinkSync(convertPath(req.files[0].path));
        fs.unlinkSync(convertPath(req.files[1].path));
        return res.status(404).json("Not found");
      } else {
        if (req.files.length > 0) {
          if (
            fs.existsSync(
              convertPath(updateMovie.pictureMovie).slice(
                updateMovie.pictureMovie.indexOf("public")
              )
            )
          ) {
            fs.unlinkSync(
              convertPath(updateMovie.pictureMovie).slice(
                updateMovie.pictureMovie.indexOf("public")
              )
            );
          }
          if (
            fs.existsSync(
              convertPath(updateMovie.thumbnailMovie).slice(
                updateMovie.thumbnailMovie.indexOf("public")
              )
            )
          ) {
            fs.unlinkSync(
              convertPath(updateMovie.thumbnailMovie).slice(
                updateMovie.thumbnailMovie.indexOf("public")
              )
            );
          }
          await updateMovie.update({
            pictureMovie: fullUrl + req.files[0].path,
            thumbnailMovie: fullUrl + req.files[1].path,
          });
        }
        if (req.body.nameMovie) {
          await updateMovie.update({
            $set: {
              slugMovie: convertViToEn(req.body.nameMovie),
            },
          });
        }
        await updateMovie.update({
          $set: {
            codeMovie: req.body.codeMovie,
            nameMovie: req.body.nameMovie,
            hotMovie: req.body.hotMovie,
            trainlerMovie: req.body.trainlerMovie,
            showingMovie: req.body.showingMovie,
            comingMovie: req.body.comingMovie,
            description: req.body.description,
          },
        });
        res.status(200).json("Update successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteMovie: async (req, res) => {
    try {
      const foundMovie = await Movie.findById(req.body.id);
      if (foundMovie.review.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Movie have " +
              "(" +
              foundMovie.review.length +
              ")" +
              " review "
          );
      } else {
        await Review.updateMany(
          {
            movie: req.body.id,
          },
          {
            $pull: { movie: req.body.id },
          }
        );
        if (
          fs.existsSync(
            convertPath(foundMovie.pictureMovie).slice(
              foundMovie.pictureMovie.indexOf("public")
            )
          )
        ) {
          fs.unlinkSync(
            convertPath(foundMovie.pictureMovie).slice(
              foundMovie.pictureMovie.indexOf("public")
            )
          );
        }
        if (
          fs.existsSync(
            convertPath(foundMovie.thumbnailMovie).slice(
              foundMovie.thumbnailMovie.indexOf("public")
            )
          )
        ) {
          fs.unlinkSync(
            convertPath(foundMovie.thumbnailMovie).slice(
              foundMovie.thumbnailMovie.indexOf("public")
            )
          );
        }
        await Movie.findByIdAndDelete(req.body.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteScheduleOfMovie: async (req, res) => {
    try {
      const findMovie = await Movie.findById(req.body.movieID);
      const checkScheduleOfMovie = findMovie.movieSchedule.find(
        (resultSchedule) => resultSchedule._id == req.body.scheduleID
      );
      if (!checkScheduleOfMovie) {
        return res.status(400).json("Error,the movie hasn't schedules");
      }

      await Movie.updateMany(
        {
          _id: req.body.movieID,
        },
        {
          $pull: { movieSchedule: req.body.scheduleID },
        }
      );
      await MovieSchedule.updateMany(
        {
          _id: req.body.scheduleID,
        },
        {
          $pull: { movie: req.body.movieID },
        }
      );
      res.status(200).json("Delete successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = MovieController;
