const UserController = require("../controllers/User");

const router = require("express").Router();
const upload = require("../middleware/uploadPicture");
const verifyToken = require("../middleware/verifyToken");
//
router.post(
  "/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.single("avatar"),
  UserController.addUser
);
router.get("/", verifyToken.verifyTokenAPI, UserController.getAllUser);
router.get("/:key", verifyToken.verifyTokenAPI, UserController.findUserByName);
router.get(
  "/detail/:id",
  verifyToken.verifyTokenAPI,
  UserController.findUserDetail
);
router.put(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.single("avatar"),
  UserController.updateUser
);
router.delete(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  UserController.deleteUser
);
module.exports = router;
