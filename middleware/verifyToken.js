const jwt = require("jsonwebtoken");
const verifyToken = {
  verifyTokenUser: (req, res, next) => {
    const tokenAuths = req.headers[`tokenauth`];

    if (tokenAuths) {
      const accessToken = tokenAuths.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token auth wrong");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You have not authenticated with tokenAuth");
    }
  },
  verifyTokenAdmin: (req, res, next) => {
    verifyToken.verifyTokenUser(req, res, () => {
      if (req.user.id == req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not an Admin");
      }
    });
  },
  verifyTokenAPI: (req, res, next) => {
    const token = req.headers.token;

    if (token) {
      const accessToken = token.split(" ")[1];
      if (accessToken == process.env.VERIFY_TOKEN) {
        next();
      } else {
        res.status(403).json("Token request api is not correct");
      }
    } else {
      res.status(401).json("You have not authenticated with the token api");
    }
  },
};
module.exports = verifyToken;
