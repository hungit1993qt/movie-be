const mongoose = require("mongoose");
const date = require("date-and-time");
const now = new Date();
const value = date.format(now, "YYYY-MM-DD");

const CinemaBrandSchema = new mongoose.Schema(
  {
    codeCinemaBrand: {
      type: String,
      required: true,
    },
    nameCinemaBrand: {
      type: String,
      require: true,
    },
    logoCinemaBrand: {
      type: String,
      required: true,
    },
    cinemaSystemLocation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CinemaSystemLocation",
      },
    ],
  },
  { timestamps: true }
);

const CinemaSystemLocationSchema = new mongoose.Schema(
  {
    codeCinemaSystemLocation: {
      type: String,
      required: true,
    },
    nameCinemaSystemLocation: {
      type: String,
      required: true,
    },
    CinemaBrands: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CinemaBrand",
    },
    cinemas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cinema",
      },
    ],
  },
  { timestamps: true }
);
const CinemaSchema = new mongoose.Schema(
  {
    codeCinema: {
      type: String,
      required: true,
    },
    nameCinema: {
      type: String,
      required: true,
    },
    addressCinema: {
      type: String,
      required: true,
    },
    pictureCinema: {
      type: String,
      required: true,
    },
    hotlineCinema: {
      type: String,
      required: true,
    },
    cinemaSystemLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CinemaSystemLocation",
    },
    cinimaRoom: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CinimaRoom",
      },
    ],
  },
  { timestamps: true }
);
const CinemaRoomSchema = new mongoose.Schema(
  {
    codeCinimaRoom: {
      type: String,
      requỉed: true,
    },
    nameCinimaRoom: {
      type: String,
      requỉed: true,
    },
    locationCinimaRoom: {
      type: String,
      requỉed: true,
    },
    cinima: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
    },
    movieSchedule: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MovieSchedule",
      },
    ],
  },
  { timestamps: true }
);
const MovieScheduleSchema = new mongoose.Schema(
  {
    codeMovieSchedule: {
      type: String,
      required: true,
    },
    timeDateMovieSchedule: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cinimaRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CinemaRoom",
    },
    movie: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true }
);
const MovieSchema = new mongoose.Schema(
  {
    codeMovie: {
      type: String,
      required: true,
    },
    nameMovie: {
      type: String,
      required: true,
    },
    pictureMovie: {
      type: String,
      required: true,
    },
    hotMovie: {
      type: Boolean,
      default: false,
    },
    showingMovie: {
      type: Boolean,
      default: false,
    },
    comingMovie: {
      type: Boolean,
      default: false,
    },
    movieSchedule: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);
const ReviewSchema = new mongoose.Schema(
  {
    contentReview: {
      type: String,
      required: true,
    },
    rankReview: {
      type: Number,
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps : true}
);
const UserSchema = new mongoose.Schema(
  {
    accountUser: {
      type: String,
      required: true,
    },
    passwordUser: {
      type: String,
      required: true,
    },
    nameUser: {
      type: String,
      required: true,
    },
    emailUser: {
      type: String,
      required: true,
    },
    phoneNumberUser: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps : true}
);

let CinemaBrand = mongoose.model("CinemaBrand", CinemaBrandSchema);
let CinemaSystemLocation = mongoose.model(
  "CinemaSystemLocation",
  CinemaSystemLocationSchema
);
let Cinema = mongoose.model("Cinema", CinemaSchema);
let CinemaRoom = mongoose.model("CinemaRoom", CinemaRoomSchema);
let MovieSchedule = mongoose.model("MovieSchedule", MovieScheduleSchema);
let Movie = mongoose.model("Movie", MovieSchema);
let Review = mongoose.model("Review", ReviewSchema);
let User = mongoose.model("User", UserSchema);

module.exports = {
  CinemaBrand,
  CinemaSystemLocation,
  Cinema,
  CinemaRoom,
  MovieSchedule,
  Movie,
  Review,
  User,
};
