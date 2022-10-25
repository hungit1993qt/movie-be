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
    cinemaBrand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CinemaBrand",
    },
    scheduls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MovieSchedule",
      },
    ],
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true }
);

const MovieScheduleSchema = new mongoose.Schema(
  {
    dateSchedule: {
      type: Date,
      required: true,
    },
    timeSchedule: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
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
    description: {
      type: String,
      required: true,
    },
    slugMovie: {
      type: String,
      required: true,
    },
    pictureMovie: {
      type: String,
      required: true,
    },
    thumbnailMovie: {
      type: String,
      required: true,
    },
    trainlerMovie: {
      type: String,
      required: true,
    },
    categoryMovie: {
      type: String,
      default: false,
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
    timeMovie: {
      type: String,
      required: true,
    },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
    },

    movieSchedule: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MovieSchedule",
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
      min: 0,
      max: 10,
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
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
    avatar: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

let CinemaBrand = mongoose.model("CinemaBrand", CinemaBrandSchema);

let Cinema = mongoose.model("Cinema", CinemaSchema);
let MovieSchedule = mongoose.model("MovieSchedule", MovieScheduleSchema);
let Movie = mongoose.model("Movie", MovieSchema);
let Review = mongoose.model("Review", ReviewSchema);
let User = mongoose.model("User", UserSchema);

module.exports = {
  CinemaBrand,
  Cinema,
  MovieSchedule,
  Movie,
  Review,
  User,
};
