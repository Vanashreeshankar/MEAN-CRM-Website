const jwt = require("jsonwebtoken");

const { storeUserRefreshJWT } = require("../functions/user_function");
const { token } = require("morgan");


const createAccessJWT = async (_id, email, role, username) => {
    try {
        const accessJWT = await jwt.sign(
            { _id, email, role, username },
            process.env.JWT_ACCESS_SECRET || 'mjkjdlmljihkjbkjbhjvhj6576667ug65r55gcgh',
            { expiresIn: "1d" }
        );
        return Promise.resolve(accessJWT);
    } catch (error) {
        return Promise.reject(error);
    }
};

const createRefreshJWT = async (_id, email, role, username) => {
    try {
        const refreshJWT = jwt.sign(
            { email, role, username },
            process.env.JWT_REFRESH_SECRET || 'rdfgkjwertyuoipdsfgjklxcvb',
            { expiresIn: "30d" }
        );

        await storeUserRefreshJWT(_id, refreshJWT);

        return Promise.resolve(refreshJWT);
    } catch (error) {
        return Promise.reject(error);
    }
};


const verifyAccessJWT = (userJWT) => {
    try {
        return Promise.resolve(jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET));
    } catch (error) {
        return Promise.resolve(error);
    }
};
const verifyRefreshJWT = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded);
        });
    });
};

module.exports = {
    createAccessJWT,
    createRefreshJWT,
    verifyAccessJWT,
    verifyRefreshJWT,
};


