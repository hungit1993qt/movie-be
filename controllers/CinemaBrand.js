const { CinemaBrand } = require("../model/model");
const fs = require("fs");
function convertPath(str) {
  str = str.replace(/\\/g, "/");
  return str;
}
const CinemaBrandController = {
  addCinemaBrand: async (req, res) => {
    try {
      const fullUrl = req.protocol + "://" + req.get("host") + "/";
      const newCinemaBrand = new CinemaBrand({
        codeCinemaBrand: req.body.codeCinemaBrand,
        nameCinemaBrand: req.body.nameCinemaBrand,
      });
      if (req.file) {
        newCinemaBrand.logoCinemaBrand =
        fullUrl + req.file.path;
      }
      const savedCinemaBrand = await newCinemaBrand.save();
      res.status(200).json(savedCinemaBrand);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllCinemaBrand: async (req, res) => {
    try {
      const AllCinemaBrand = await CinemaBrand.find()
        .select("-createdAt -updatedAt -__v")
        .populate({
          path: "cinemas",
          select: "-cinemaBrand -__v -createdAt -updatedAt",
          populate: {
            path: "movies",
            select: "-cinemas -__v -createdAt -updatedAt",
          },
        })
        .sort({ createdAt: -1 });
      res.status(200).json(AllCinemaBrand);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findDetailCinemaBrand: async (req, res) => {
    try {
      const detailCinemaBrand = await CinemaBrand.findById(req.body.id)
        .select("-createdAt -updatedAt -__v")
        .populate({
          path: "cinemas",
          select: "-cinemaBrand -__v -createdAt -updatedAt",
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
          $regex: req.body.nameCinemaBrand.toString(),
          $options: "i",
        },
      })
        .select("-createdAt -updatedAt -__v")
        .populate({
          path: "cinemas",
          select: "-cinemaBrand -__v -createdAt -updatedAt",
        })
        .sort({ createdAt: -1 });
      res.status(200).json(cinemaBrandByName);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateCinemaBrand: async (req, res) => {
    try {
      const fullUrl = req.protocol + "://" + req.get("host") + "/";
      const cinemaBrand = await CinemaBrand.findById(req.body.id);
      if (req.file) {
        if (
          fs.existsSync(
            convertPath(cinemaBrand.logoCinemaBrand).slice(
              cinemaBrand.logoCinemaBrand.indexOf("public")
            )
          )
        ) {
          fs.unlinkSync(
            convertPath(cinemaBrand.logoCinemaBrand).slice(
              cinemaBrand.logoCinemaBrand.indexOf("public")
            )
          );
        }
        await cinemaBrand.updateOne({
          $set: {
            codeCinemaBrand: req.body.codeCinemaBrand,
            nameCinemaBrand: req.body.nameCinemaBrand,
            logoCinemaBrand: fullUrl + req.file.path,
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
      const foundCinemaBrand = await CinemaBrand.findById(req.body.id);

      if (foundCinemaBrand.cinemas.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Cinema Brand have " +
              "(" +
              foundCinemaBrand.cinemas.length +
              ")" +
              " Cinema "
          );
      } else {
        if (
          fs.existsSync(
            convertPath(foundCinemaBrand.logoCinemaBrand).slice(
              foundCinemaBrand.logoCinemaBrand.indexOf("public")
            )
          )
        ) {
          fs.unlinkSync(
            convertPath(foundCinemaBrand.logoCinemaBrand).slice(
              foundCinemaBrand.logoCinemaBrand.indexOf("public")
            )
          );
        }
        await CinemaBrand.findByIdAndDelete(req.body.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = CinemaBrandController;
