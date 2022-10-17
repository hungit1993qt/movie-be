const CinemaController = require("../controllers/Cinema");

const router = require("express").Router();
const upload = require("../middleware/uploadPicture");
const verifyToken = require("../middleware/verifyToken");
//


router.post(
  "/",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.single("pictureCinema"),
  CinemaController.addCinema
);


/**
 * @swagger
 * components:
 *   schemas:
 *     cinema:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the Cinema
 *         title:
 *           type: string
 *           description: The Cinema title
 *         author:
 *           type: string
 *           description: The Cinema author
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

/**
 * @swagger
 * tags:
 *   name: cinema
 *   description: The cinema managing API
 */

/**
 * @swagger
 * /cinema:
 *   get:
 *     summary: Returns the list of all the cinema
 *     tags: [cinema]
 *     responses:
 *       200:
 *         description: The list of the cinema
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/cinema'
 */
router.get("/", verifyToken.verifyTokenAPI, CinemaController.getAllCinema);






router.get(
  "/:key",
  verifyToken.verifyTokenAPI,
  CinemaController.findCinemaByName
);
router.get(
  "/detail/:id",
  verifyToken.verifyTokenAPI,
  CinemaController.findCinemaDetail
);
router.put(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  upload.single("pictureCinema"),
  CinemaController.updateCinema
);
router.delete(
  "/:id",
  verifyToken.verifyTokenAPI,
  //   verifyToken.verifyTokenManager,
  CinemaController.deleteCinema
);
module.exports = router;
