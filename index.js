const express = require("express");
const { engine } = require("express-handlebars");
const cors = require("cors");
const app = express();
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

app.use("/api/cinema-brand/", CinemaBrandRoute);
app.use("/api/cinema-system-location/", CinemaSystemLocationRoute);
app.use("/api/cinema/", CinemaRoute);
app.use("/api/cinema-room/", CinemaRoomRoute);
app.use("/api/movie-schedule/", MovieScheduleRoute);
app.use("/api/movie/", MovieRoute);
app.use("/api/review/", ReviewRoute);
app.use("/api/user/", UserRoute);
//check update
