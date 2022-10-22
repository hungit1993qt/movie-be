const { Cinema, CinemaBrand } = require("../model/model");
const fs = require("fs");
function convertPath(str) {
  str = str.replace(/\\/g, "/");
  return str;
}
const CinemaController = {
  addCinema: async (req, res) => {
    try {
      const fullUrl = req.protocol + "://" + req.get("host") + "/";
      const newCinema = new Cinema({
        codeCinema: req.body.codeCinema,
        nameCinema: req.body.nameCinema,
        addressCinema: req.body.addressCinema,
        hotlineCinema: req.body.hotlineCinema,
        cinemaBrand: req.body.cinemaBrand,
      });
      if (req.file) {
        newCinema.pictureCinema = fullUrl + req.file.path;
      }
      const savedCinema = await newCinema.save();
      if (req.body.cinemaBrand) {
        const cinemaBrands = CinemaBrand.findById(req.body.cinemaBrand);
        await cinemaBrands.updateOne({
          $push: { cinemas: savedCinema._id },
        });
      }
      res.status(200).json(savedCinema);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllCinema: async (req, res) => {
    try {
      const allCinema = await Cinema.find()
        .select("-createdAt -updatedAt -__v")
        .populate([
          {
            path: "cinemaBrand",
            select: "-cinemas -__v -createdAt -updatedAt",
          },
          {
            path: "scheduls",
            select: " -__v  -createdAt -updatedAt",
          },
          {
            path: "movies",
            select: " -__v  -createdAt -updatedAt",
          },
        ])
        .sort({ createdAt: -1 });
      res.status(200).json(allCinema);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findCinemaByName: async (req, res) => {
    try {
      const cinemaByName = await Cinema.find({
        nameCinema: { $regex: req.body.nameCinema.toString(), $options: "i" },
      })
        .select("-createdAt -updatedAt -__v -createdAt -updatedAt")
        .populate([
          {
            path: "cinemaSystemLocation",

            select: "-cinemas -__v -createdAt -updatedAt",
            populate: {
              path: "cinemaBrand",
              select: "-__v -createdAt -updatedAt",
            },
          },
          {
            path: "scheduls",
            select: " -__v  -createdAt -updatedAt",
          },
          {
            path: "movies",
            select: " -__v  -createdAt -updatedAt",
          },
        ])
        .sort({
          createdAt: -1,
        });
      res.status(200).json(cinemaByName);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findCinemaDetail: async (req, res) => {
    try {
      const cinemaDetail = await Cinema.findById(req.body.id)
        .select("-createdAt -updatedAt -__v ")
        .populate([
          {
            path: "cinemaSystemLocation",

            select: "-cinemas -__v -createdAt -updatedAt",
            populate: {
              path: "cinemaBrand",
              select: "-__v -createdAt -updatedAt",
            },
          },
          {
            path: "scheduls",
            select: " -__v  -createdAt -updatedAt",
          },
          {
            path: "movies",
            select: " -__v  -createdAt -updatedAt",
          },
        ]);
      res.status(200).json(cinemaDetail);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateCinema: async (req, res) => {
    try {
      const fullUrl = req.protocol + "://" + req.get("host") + "/";
      const updateCinema = await Cinema.findById(req.body.id);
      if (req.file) {
        if (
          fs.existsSync(
            convertPath(updateCinema.pictureCinema).slice(
              updateCinema.pictureCinema.indexOf("public")
            )
          )
        ) {
          fs.unlinkSync(
            convertPath(updateCinema.pictureCinema).slice(
              updateCinema.pictureCinema.indexOf("public")
            )
          );
        }
        await updateCinema.updateOne({
          $set: {
            codeCinema: req.body.codeCinema,
            nameCinema: req.body.nameCinema,
            addressCinema: req.body.addressCinema,
            hotlineCinema: req.body.hotlineCinema,
            cinemaBrand: req.body.cinemaBrand,
            pictureCinema: fullUrl + req.file.path,
          },
        });
      } else {
        await updateCinema.updateOne({
          $set: {
            codeCinema: req.body.codeCinema,
            nameCinema: req.body.nameCinema,
            addressCinema: req.body.addressCinema,
            hotlineCinema: req.body.hotlineCinema,
            cinemaBrand: req.body.cinemaBrand,
          },
        });
      }
      res.status(200).json("Update successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteCinema: async (req, res) => {
    try {
      const foundCinema = await Cinema.findById(req.body.id);

      if (foundCinema.movies.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Cinema have " +
              "(" +
              foundCinema.movies.length +
              ")" +
              " movies "
          );
      } else if (foundCinema.scheduls.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Cinema have " +
              "(" +
              foundCinema.scheduls.length +
              ")" +
              " scheduls "
          );
      } else {
        await CinemaBrand.updateMany(
          {
            cinemas: req.body.id,
          },
          {
            $pull: { cinemas: req.body.id },
          }
        );
        if (
          fs.existsSync(
            convertPath(foundCinema.pictureCinema).slice(
              foundCinema.pictureCinema.indexOf("public")
            )
          )
        ) {
          fs.unlinkSync(
            convertPath(foundCinema.pictureCinema).slice(
              foundCinema.pictureCinema.indexOf("public")
            )
          );
        }
        //file removed
        await Cinema.findByIdAndDelete(req.body.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = CinemaController;
