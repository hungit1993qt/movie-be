const jwt = require("jsonwebtoken");
const verifyToken = {
  verifyTokenManager: (req, res, next) => {
    const tokenAuths = req.headers[`tokenauth`];
    
    if (tokenAuths) {
      const accessToken = tokenAuths.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, manager) => {
        if (err) {
          res.status(403).json("Token auth không đúng");
        }
        req.manager = manager;
        next();
      });
    } else {
      res.status(401).json("Bạn chưa xác thực bằng tokenAuth");
    }
  },
  verifyTokenAdmin: (req, res, next) => {
    verifyToken.verifyTokenManager(req, res, () => {
      if (req.manager.id == req.params.id || req.manager.admin) {
        next();
      } else {
        res.status(403).json("Bạn không phải là Admin");
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
        res.status(403).json("Token không đúng");
      }
    } else {
      res.status(401).json("Bạn chưa xác thực bằng token");
    }
  },
};
module.exports = verifyToken;
