const { Review, User } = require("../model/model");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
function convertPath(str) {
  str = str.replace(/\\/g, "/");
  return str;
}
const UserController = {
  addUser: async (req, res) => {
    try {
      const fullUrl = req.protocol + "://" + req.get("host") + "/";
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.passwordUser, salt);
      const newUser = new User({
        accountUser: req.body.accountUser,
        passwordUser: hashed,
        nameUser: req.body.nameUser,
        emailUser: req.body.emailUser,
        phoneNumberUser: req.body.phoneNumberUser,
      });
      if (req.file) {
        newUser.avatar = fullUrl + req.file.path;
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
          {
            path: "reviews",
            select: "-__v",
            // populate: {
            //   path: "user",
            //   select: "-__v",
            // },
            // populate: {
            //   path: "movie",
            //   select: "-__v",
            // },
          },
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
        accountUser: { $regex: req.body.accountUser.toString(), $options: "i" },
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
      const UserDetail = await User.findById(req.body.id)
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
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.passwordUser, salt);
      const fullUrl = req.protocol + "://" + req.get("host") + "/";
      const updateUser = await User.findById(req.body.id);
      if (req.file) {
        if (
          fs.existsSync(
            convertPath(updateUser.avatar).slice(
              updateUser.avatar.indexOf("public")
            )
          )
        ) {
          fs.unlinkSync(
            convertPath(updateUser.avatar).slice(
              updateUser.avatar.indexOf("public")
            )
          );
        }
        await updateUser.updateOne({
          $set: {
            accountUser: req.body.accountUser,
            passwordUser: hashed,
            nameUser: req.body.nameUser,
            phoneNumberUser: req.body.phoneNumberUser,
            emailUser: req.body.emailUser,
            avatar: fullUrl + req.file.path,
          },
        });
      } else {
        await updateUser.updateOne({
          $set: {
            accountUser: req.body.accountUser,
            passwordUser: hashed,
            phoneNumberUser: req.body.phoneNumberUser,
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
      const foundUser = await User.findById(req.body.id);
      if (foundUser.reviews.length > 0) {
        res
          .status(500)
          .json(
            "Delete false, User have " +
              "(" +
              foundUser.reviews.length +
              ")" +
              " Review "
          );
      } else {
        await Review.updateMany(
          {
            user: req.body.id,
          },
          {
            $pull: { user: req.body.id },
          }
        );
        if (
          fs.existsSync(
            convertPath(foundUser.avatar).slice(
              foundUser.avatar.indexOf("public")
            )
          )
        ) {
          fs.unlinkSync(
            convertPath(foundUser.avatar).slice(
              foundUser.avatar.indexOf("public")
            )
          );
        }
        await User.findByIdAndDelete(req.body.id);
        res.status(200).json("Delete successfuly");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = UserController;
