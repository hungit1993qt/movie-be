const express = require("express");
const { engine } = require("express-handlebars");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const CinemaBrandRoute = require("./routes/CinemaBrand");
const CinemaSystemLocationRoute = require("./routes/CinemaSystemLocation");
const CinemaRoute = require("./routes/Cinema");

app.use(express.static(__dirname + "/"));
dotenv.config();
// connect database
console.log(process.env.MONGODB_URL);
mongoose
  .connect(process.env.MONGODB_URL.toString(), {
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

app.use("/api/cinemabrand/", CinemaBrandRoute);
app.use("/api/cinemasystemlocation/", CinemaSystemLocationRoute);
app.use("/api/cinema/", CinemaRoute);
//check update
