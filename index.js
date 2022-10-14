const express = require("express");
const { engine } = require("express-handlebars");
const cors = require("cors");
const app = express();
app.use(express.static(__dirname + "/"));
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const CinemaBrandRoute = require("./routes/CinemaBrand");
const CinemaSystemLocationRoute = require("./routes/CinemaSystemLocation");
const CinemaRoute = require("./routes/Cinema");

// connect database

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connect to mongoDB");
    app.listen(process.env.PORT || 8080, () => {
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

app.use("/api/cinemabrand/", CinemaBrandRoute);
app.use("/api/cinemasystemlocation/", CinemaSystemLocationRoute);
app.use("/api/cinema/", CinemaRoute);
//check update
