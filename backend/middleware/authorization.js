require("dotenv").config();
const jwt = require('jsonwebtoken');

const userAuthorization = async (req, res, next) => {
  // Extracting the access token from request headers
  var token = req.body.token || req.query.token || req.headers['authorization'] ;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        req.userId = decoded;//Ensure token payload contain clientdId (temp)
        console.log(decoded);
        next();
      }
    });
  } else {
    return res.json({ success: false, message: 'No token provided.' });
  }
};

module.exports = userAuthorization;