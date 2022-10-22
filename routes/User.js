const UserController = require("../controllers/User");

const router = require("express").Router();
const upload = require("../middleware/uploadPictureUser");
const verifyToken = require("../middleware/verifyToken");
//
router.post(
  "/add/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.single("avatar"),
  UserController.addUser
);
router.get("/all/", verifyToken.verifyTokenAPI, UserController.getAllUser);
router.get("/search-name/", verifyToken.verifyTokenAPI, UserController.findUserByName);
router.get(
  "/detail/",
  verifyToken.verifyTokenAPI,
  UserController.findUserDetail
);
router.put(
  "/update/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.single("avatar"),
  UserController.updateUser
);
router.delete(
  "/delete/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  UserController.deleteUser
);
module.exports = router;
