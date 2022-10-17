const { Review, User } = require("../model/model");
const UserController = {
  addUser: async (req, res) => {
    try {
      const newUser = new User({
        accountUser: req.body.accountUser,
        passwordUser: req.body.passwordUser,
        nameUser: req.body.nameUser,
        emailUser: req.body.emailUser,
        phoneNumberUser: req.body.phoneNumberUser,
      });
      if (req.file) {
        newUser.avatar = "https://hungit1993qt-movie-be.herokuapp.com/" + req.file.path;
      }
      const savedUser = await newUser.save();

      res.status(200).json(savedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllUser: async (req, res) => {
    try {
      const allUser = await User.find()
        .select("-__v")
        .populate([
          { path: "reviews", select: "-__v" },
          { path: "orders", select: "-__v" },
        ])
        .sort({ createdAt: -1 });
      res.status(200).json(allUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findUserByName: async (req, res) => {
    try {
      const UserByName = await User.find({
        accountUser: { $regex: req.params.key.toString(), $options: "i" },
      })
        .select("-__v")
        .populate([
          {
            path: "reviews",
            select: "-__v ",
          },
          {
            path: "orders",
            select: "-__v ",
          },
        ])
        .sort({
          createdAt: -1,
        });
      res.status(200).json(UserByName);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findUserDetail: async (req, res) => {
    try {
      const UserDetail = await User.findById(req.params.id)
        .select("-__v")
        .populate([
          {
            path: "reviews",
            select: "-__v",
          },
          {
            path: "orders",
            select: "-__v",
          },
        ]);
      res.status(200).json(UserDetail);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateUser: async (req, res) => {
    try {
      const updateUser = await User.findById(req.params.id);
      if (req.file) {
        await updateUser.updateOne({
          $set: {
            accountUser: req.body.accountUser,
            passwordUser: req.body.passwordUser,
            nameUser: req.body.nameUser,
            emailUser: req.body.emailUser,
            avatar: "https://hungit1993qt-movie-be.herokuapp.com/" + req.file.path,
          },
        });
      } else {
        await updateUser.updateOne({
          $set: {
            accountUser: req.body.accountUser,
            passwordUser: req.body.passwordUser,
            nameUser: req.body.nameUser,
            emailUser: req.body.emailUser,
          },
        });
      }
      res.status(200).json("Update successfuly");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //delete not yet
  deleteUser: async (req, res) => {
    try {
      const foundUser = await User.findById(req.params.id);
      if (foundUser.UserRoom.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, User have " +
              "(" +
              foundUser.UserRoom.length +
              ")" +
              " User room "
          );
      } else {
        await UserSystemLocation.updateMany(
          {
            Users: req.params.id,
          },
          {
            $pull: { Users: req.params.id },
          }
        );
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = UserController;
