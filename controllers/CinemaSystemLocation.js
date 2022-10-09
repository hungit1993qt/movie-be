const { CinemaSystemLocation, CinemaBrand, Cinema } = require("../model/model");
const CinemaSystemLocationController = {
  addCinemaSystemLocation: async (req, res) => {
    try {
      const newCinemaSystemLocation = new CinemaSystemLocation({
        codeCinemaSystemLocation: req.body.codeCinemaSystemLocation,
        nameCinemaSystemLocation: req.body.nameCinemaSystemLocation,
        CinemaBrands: req.body.CinemaBrands,
      });
      const savedCinemaSystemLocation = await newCinemaSystemLocation.save();
      if (req.body.CinemaBrands) {
        const CinemaBranded = CinemaBrand.findById(req.body.CinemaBrands);
        await CinemaBranded.updateOne({
          $push: { cinemaSystemLocation: savedCinemaSystemLocation._id },
        });
      }
      res.status(200).json(savedCinemaSystemLocation);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllCinemaSystemLocation: async (req, res) => {
    try {
      const AllCinemaSystemLocation = await CinemaSystemLocation.find()
        .populate({
          path: "CinemaBrands",
          select: "codeCinemaBrand nameCinemaBrand logoCinemaBrand",
        })
        .sort({
          createdAt: -1,
        });
      res.status(200).json(AllCinemaSystemLocation);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findDetailCinemaSystemLocation: async (req, res) => {
    try {
      const detailCinemaSystemLocation = await CinemaSystemLocation.findById(
        req.params.id
      ).populate({
        path: "CinemaBrands",
        select: "codeCinemaBrand nameCinemaBrand logoCinemaBrand",
      });
      res.status(200).json(detailCinemaSystemLocation);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findCinemaSystemLocationByName: async (req, res) => {
    try {
      const CinemaSystemLocationByName = await CinemaSystemLocation.find({
        nameCinemaBrand: {
          $regex: req.params.key.toString(),
          $options: "i",
        },
      })
        .populate({
          path: "CinemaBrands",
          select:
            "codeCinemaBrand nameCinemaBrand logoCinemaBrand createdAt updatedAt",
        })
        .sort({ createdAt: -1 });
      res.status(200).json(CinemaSystemLocationByName);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateCinemaSystemLocation: async (req, res) => {
    try {
      const updateCinemaSystemLocation = await CinemaSystemLocation.findById(
        req.params.id
      );
      await updateCinemaSystemLocation.updateOne({
        $set: req.body,
      });

      res.status(200).json("Update successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteCinemaSystemLocation: async (req, res) => {
    try {
      const foundCinemaSystemLocation = await CinemaSystemLocation.findById(req.params.id);
      if (foundCinemaSystemLocation.cinemas.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Cinema System Location have " +
              "(" +
              foundCinemaSystemLocation.cinemas.length +
              ")" +
              " Cinema "
          );
      } else {
        // await CinemaBrand.updateMany(
        //   { cinemaSystemLocation: req.params.id },
        //   { $pull: { cinemaSystemLocation: req.params.id } }
        // );
        // await CinemaSystemLocation.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = CinemaSystemLocationController;
