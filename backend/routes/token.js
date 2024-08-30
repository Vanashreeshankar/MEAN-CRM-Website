const express = require("express");
const router = express.Router();

const { verifyRefreshJWT, createAccessJWT } = require("../functions/jwt.helper");
const { getUserByEmail } = require("../functions/user_function");

router.get("/", async (req, res, next) => {
   
  
    var token = req.body.token || req.query.token || req.headers['authorization'];
  
    //TODO
  
    const decoded = await verifyRefreshJWT(token);
    if (decoded.email) {
      const userProf = await getUserByEmail(decoded.email);
  
      if (userProf._id) {
        let tokenExp = userProf.refreshJWT.addedAt;
        const dBrefreshToken = userProf.refreshJWT.token;
  
        tokenExp = tokenExp.setDate(
          tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
        );
  
        const today = new Date();
  
        if (dBrefreshToken !== token && tokenExp < today) {
          return res.status(403).json({ message: "Forbidden" });
        }
  
        const accessJWT = await createAccessJWT(
          userProf._id.toString(),
          decoded.email,
          decoded.role
        );
  
        return res.json({ status: "success", accessJWT });
      }
    }
  
    res.status(403).json({ message: "Forbidden" });
  });
  
module.exports = router;