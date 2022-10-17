const { Cinema, CinemaSystemLocation } = require("../model/model");
const CinemaController = {
  addCinema: async (req, res) => {
    try {
      const newCinema = new Cinema({
        codeCinema: req.body.codeCinema,
        nameCinema: req.body.nameCinema,
        addressCinema: req.body.addressCinema,
        hotlineCinema: req.body.hotlineCinema,
        cinemaSystemLocation: req.body.cinemaSystemLocation,
      });
      if (req.file) {
        newCinema.pictureCinema = "https://hungit1993qt-movie-be.herokuapp.com/" + req.file.path;
      }
      const savedCinema = await newCinema.save();
      if (req.body.cinemaSystemLocation) {
        const cinemaSystemLocation = CinemaSystemLocation.findById(
          req.body.cinemaSystemLocation
        );
        await cinemaSystemLocation.updateOne({
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
            path: "cinemaSystemLocation",

            select: "-cinemas -__v -createdAt -updatedAt",
            populate: {
              path: "CinemaBrands",
              select: "-cinemaSystemLocation -__v -createdAt -updatedAt",
            },
          },
          {
            path: "cinemaRoom",
            select: " -__v -createdAt -updatedAt",
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
        nameCinema: { $regex: req.params.key.toString(), $options: "i" },
      })
        .select("-createdAt -updatedAt -__v -createdAt -updatedAt")
        .populate([
          {
            path: "cinemaSystemLocation",

            select: "-cinemas -__v -createdAt -updatedAt",
            populate: {
              path: "CinemaBrands",
              select: "-cinemaSystemLocation -__v -createdAt -updatedAt",
            },
          },
          {
            path: "cinemaRoom",
            select: " -__v -createdAt -updatedAt",
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
      const cinemaDetail = await Cinema.findById(req.params.id)
        .select("-createdAt -updatedAt -__v ")
        .populate([
          {
            path: "cinemaSystemLocation",

            select: "-cinemas -__v -createdAt -updatedAt",
            populate: {
              path: "CinemaBrands",
              select: "-cinemaSystemLocation -__v -createdAt -updatedAt",
            },
          },
          {
            path: "cinemaRoom",
            select: " -__v -createdAt -updatedAt",
          },
        ]);
      res.status(200).json(cinemaDetail);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateCinema: async (req, res) => {
    try {
      const updateCinema = await Cinema.findById(req.params.id);
      if (req.file) {
        await updateCinema.updateOne({
          $set: {
            codeCinema: req.body.codeCinema,
            nameCinema: req.body.nameCinema,
            addressCinema: req.body.addressCinema,
            hotlineCinema: req.body.hotlineCinema,
            cinemaSystemLocation: req.body.cinemaSystemLocation,
            pictureCinema: "https://hungit1993qt-movie-be.herokuapp.com/" + req.file.path,
          },
        });
      } else {
        await updateCinema.updateOne({
          $set: {
            codeCinema: req.body.codeCinema,
            nameCinema: req.body.nameCinema,
            addressCinema: req.body.addressCinema,
            hotlineCinema: req.body.hotlineCinema,
            cinemaSystemLocation: req.body.cinemaSystemLocation,
          },
        });
      }
      res.status(200).json("Update successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteCinema: async (req, res) => {
    try {
      const foundCinema = await Cinema.findById(
        req.params.id
      );
      if (foundCinema.cinemaRoom.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Cinema have " +
              "(" +
              foundCinema.cinemaRoom.length +
              ")" +
              " cinema room "
          );
      } else {
        await CinemaSystemLocation.updateMany(
          {
            cinemas: req.params.id,
          },
          {
            $pull: { cinemas: req.params.id },
          }
        );
        await Cinema.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete successfuly");
      }
     
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = CinemaController;
