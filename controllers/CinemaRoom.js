const { CinemaRoom, Cinema } = require("../model/model");
const CinemaRoomController = {
  addCinemaRoom: async (req, res) => {
    try {
      const newCinemaRoom = new CinemaRoom({
        codeCinemaRoom: req.body.codeCinemaRoom,
        nameCinemaRoom: req.body.nameCinemaRoom,
        locationCinemaRoom: req.body.locationCinemaRoom,
        cinema: req.body.cinema,
      });

      const savedCinemaRoom = await newCinemaRoom.save();
      if (req.body.cinema) {
        const cinemas = Cinema.findById(req.body.cinema);
        await cinemas.updateOne({
          $push: { cinemaRoom: savedCinemaRoom._id },
        });
      }
      res.status(200).json(savedCinemaRoom);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllCinemaRoom: async (req, res) => {
    try {
      const allCinemaRoom = await CinemaRoom.find()
        .select("-createdAt -updatedAt -__v")
        .populate([{
          path: "cinema",
          select: "-cinemaRoom -__v -createdAt -updatedAt",
          populate: {
            path: "cinemaSystemLocation",
            select: "-cinemas -__v -createdAt -updatedAt",
            populate: {
              path: "CinemaBrands",
              select: "-cinemaSystemLocation -__v -createdAt -updatedAt",
            },
          },
        },
      {
        path:"movieSchedule",
        select:"-cinemaRoom -__v -movie"
      }])
        .sort({ createdAt: -1 });
      res.status(200).json(allCinemaRoom);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findCinemaRoomByName: async (req, res) => {
    try {
      const cinemaRoomByName = await CinemaRoom.find({
        nameCinemaRoom: { $regex: req.params.key.toString(), $options: "i" },
      })
        .select("-createdAt -updatedAt -__v -createdAt -updatedAt")
        .populate([{
          path: "cinema",
          select: "-cinemaRoom -__v -createdAt -updatedAt",
          populate: {
            path: "cinemaSystemLocation",
            select: "-cinemas -__v -createdAt -updatedAt",
            populate: {
              path: "CinemaBrands",
              select: "-cinemaSystemLocation -__v -createdAt -updatedAt",
            },
          },
        },
      {
        path:"movieSchedule",
        select:"-cinemaRoom -__v -movie"
      }])
        .sort({
          createdAt: -1,
        });
      res.status(200).json(cinemaRoomByName);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findCinemaRoomDetail: async (req, res) => {
    try {
      const cinemaRoomDetail = await CinemaRoom.findById(req.params.id)
        .select("-createdAt -updatedAt -__v ")
        .populate([{
          path: "cinema",
          select: "-cinemaRoom -__v -createdAt -updatedAt",
          populate: {
            path: "cinemaSystemLocation",
            select: "-cinemas -__v -createdAt -updatedAt",
            populate: {
              path: "CinemaBrands",
              select: "-cinemaSystemLocation -__v -createdAt -updatedAt",
            },
          },
        },
      {
        path:"movieSchedule",
        select:"-cinemaRoom -__v -movie"
      }]);
      res.status(200).json(cinemaRoomDetail);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateCinemaRoom: async (req, res) => {
    try {
      const updateCinemaRoom = await CinemaRoom.findById(req.params.id);
      await updateCinemaRoom.updateOne({
        $set: {
          codeCinemaRoom: req.body.codeCinemaRoom,
          nameCinemaRoom: req.body.nameCinemaRoom,
          addressCinemaRoom: req.body.addressCinemaRoom,
          hotlineCinemaRoom: req.body.hotlineCinemaRoom,
          CinemaRoomSystemLocation: req.body.CinemaRoomSystemLocation,
        },
      });

      res.status(200).json("Update successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteCinemaRoom: async (req, res) => {
    try {
      const foundCinemaRoom = await CinemaRoom.findById(
        req.params.id
      );
      if (foundCinemaRoom.movieSchedule.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, Cinema Room have " +
              "(" +
              foundCinemaRoom.movieSchedule.length +
              ")" +
              " movie schedule "
          );
      } else {
        await Cinema.updateMany(
          {
            cinemaRoom: req.params.id,
          },
          {
            $pull: { cinemaRoom: req.params.id },
          }
        );
        await CinemaRoom.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = CinemaRoomController;
