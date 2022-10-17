const { CinemaBrand } = require("../model/model");
const CinemaBrandController = {
  addCinemaBrand: async (req, res) => {
    try {
      const newCinemaBrand = new CinemaBrand({
        codeCinemaBrand: req.body.codeCinemaBrand,
        nameCinemaBrand: req.body.nameCinemaBrand,
      });
      if (req.file) {
        newCinemaBrand.logoCinemaBrand =
          "http://localhost:8000/" + req.file.path;
      }
      const savedCinemaBrand = await newCinemaBrand.save();
      res.status(200).json(savedCinemaBrand);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllCinemaBrand: async (req, res) => {
    try {
      const AllCinemaBrand = await CinemaBrand.find().select("-createdAt -updatedAt -__v")
        .populate({
          path: "cinemaSystemLocation",
          select: "-CinemaBrands -__v -createdAt -updatedAt -cinemas",
        })
        .sort({ createdAt: -1 });
      res.status(200).json(AllCinemaBrand);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findDetailCinemaBrand: async (req, res) => {
    try {
      const detailCinemaBrand = await CinemaBrand.findById(
        req.params.id
      ).select("-createdAt -updatedAt -__v").populate({
        path: "cinemaSystemLocation",
        select: "-CinemaBrands -__v -createdAt -updatedAt -cinemas",
      });
      res.status(200).json(detailCinemaBrand);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findCinemaBrandByName: async (req, res) => {
    try {
      const cinemaBrandByName = await CinemaBrand.find({
        nameCinemaBrand: {
          $regex: req.params.key.toString(),
          $options: "i",
        },
      }).select("-createdAt -updatedAt -__v")
        .populate({
          path: "cinemaSystemLocation",
          select: "-CinemaBrands -__v -createdAt -updatedAt -cinemas",
        })
        .sort({ createdAt: -1 });
      res.status(200).json(cinemaBrandByName);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateCinemaBrand: async (req, res) => {
    try {
      const cinemaBrand = await CinemaBrand.findById(req.params.id);
      if (req.file) {
        await cinemaBrand.updateOne({
          $set: {
            codeCinemaBrand: req.body.codeCinemaBrand,
            nameCinemaBrand: req.body.nameCinemaBrand,
            logoCinemaBrand: "http://localhost:8000/" + req.file.path,
          },
        });
      } else {
        await cinemaBrand.updateOne({
          $set: {
            codeCinemaBrand: req.body.codeCinemaBrand,
            nameCinemaBrand: req.body.nameCinemaBrand,
          },
        });
      }
      res.status(200).json("Update successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteCinemaBrand: async (req, res) => {
    try {
      const foundCinemaBrand = await CinemaBrand.findById(req.params.id);

      if (foundCinemaBrand.cinemaSystemLocation.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Cinema Brand have " +
              "(" +
              foundCinemaBrand.cinemaSystemLocation.length +
              ")" +
              " Cinema System Location"
          );
      } else {
        await CinemaBrand.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = CinemaBrandController;
