const express = require("express");
const { engine } = require("express-handlebars");
const cors = require("cors");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie API",
      version: "1.0.0",
      description: "A simple Express Movie API",
    },
    servers: [
      {
        url: "https://hungit1993qt-movie-be.herokuapp.com/",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(option);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.static(__dirname + "/"));
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cookieParser = require("cookie-parser");
const CinemaBrandRoute = require("./routes/CinemaBrand");
const CinemaSystemLocationRoute = require("./routes/CinemaSystemLocation");
const CinemaRoute = require("./routes/Cinema");
const CinemaRoomRoute = require("./routes/CinemaRoom");
const MovieScheduleRoute = require("./routes/MovieSchedule");
const MovieRoute = require("./routes/Movie");
const ReviewRoute = require("./routes/Review");
const UserRoute = require("./routes/User");

// connect database

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect to mongoDB");
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server running...");
    });
  });

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(cookieParser());
app.use(morgan("common"));

//Template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.get("/", (req, res) => {
  res.render("home");
});

//Routs

app.use("/cinema-brand/", CinemaBrandRoute);
app.use("cinema-system-location/", CinemaSystemLocationRoute);
app.use("cinema/", CinemaRoute);
app.use("cinema-room/", CinemaRoomRoute);
app.use("/movie-schedule/", MovieScheduleRoute);
app.use("/movie/", MovieRoute);
app.use("review/", ReviewRoute);
app.use("user/", UserRoute);
//check update
