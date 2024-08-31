const express = require('express');


const User = require('../models/user')


const { hashPassword, comparePassword } = require('../functions/bcrypt.helper');

const { createAccessJWT,createRefreshJWT} = require('../functions/jwt.helper')

const userAuthorization = require('../middleware/authorization')

const { getUserById,
    getUserByEmail,
    setPasswordRestPin,
    getPinByEmailPin,
    deletePin,
    updatePassword
} = require('../functions/user_function');

const emailProcessor = require('../functions/email.helper');

const {
    resetPassReqValidation,
    updatePassValidation
} = require('../middleware/formvalidation');



const router = express.Router();




router.all("/", (req, res, next) => {
    // res.json({message:"return"});
    next();
});


router.get("/", userAuthorization, async (req, res) => {

    const _id = req.userId;


    const userProf = await getUserById(_id);

    console.log(userProf)
    res.json({ userProf });




})

router.get('/test-email', (req, res) => {
  emailProcessor({
    email: 'kavya1981shree@gmail.com',
    pin: '123456',
    type: 'request-new-password',
  });
  res.send('Test email sent');
});



router.post('/signup', async (req, res) => {

    const { email, username, password, role, key } = req.body;

    if (role === 'admin' && key !== "1998") {
        return res.status(403).json({ error: 'Invalid Admin key' })
    }

    try {

        const passwordHash = await hashPassword(password)

        const newUser = {
            email,
            username,
            password: passwordHash,
            role,
            key
        };

        //reference
        const result = await User(newUser).save();
        console.log(result)
        res.json({ status: "successful", message: result })


    } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message })
    }
});


router.post('/login', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "Invalid form submission!" });
    }

    const user = await getUserByEmail(email);

    const passFromDb = user && user._id ? user.password : null;

    if (!passFromDb)
        return res.status(401).json({ status: "error", message: "Invalid email or password!" });

    const result = await comparePassword(password, passFromDb);

    if (!result) {
        return res.status(401).json({ status: "error", message: "Invalid email or password!" });
    }

    const accessJWT = await createAccessJWT(`${user._id}`, user.email, user.role, user.username);
    const refreshJWT = await createRefreshJWT(`${user._id}`,user.email,user.role, user.username);
    
   

    return res.json({
        status: "success",
        message: "Login Successfully!",
        username: user.username,
        role:user.role,
        email,
        accessJWT,
        refreshJWT,
    });
});

router.get('/currentUser', async (req, res) => {
    try {
      const userId = req.userId; // Assuming you get the userId from the request
  
      // Fetch the user details from your database
      const user = await getUserById (userId) // Replace with your actual DB call
  
      if (user) {
        return res.json(user);
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.post("/reset-password", resetPassReqValidation, async (req, res) => {

    try{
        const { email } = req.body;

        const user = await getUserByEmail(email);
    
        if (user && user._id) {
            /// crate// 2. create unique 6 digit pin
            const setPin = await setPasswordRestPin(email);
    
            emailProcessor({
                email,
                pin: setPin.pin,
                type: "request-new-password",
            });
        }
       console.log('Email sent successful')
        res.json({
            status: "success",
            message:
                "If the email is exist in our database, the password reset pin will be sent shortly.",
        });

    }catch(error){
      console.error('error in reset-password', error)
      res.status(500).json({status:"error", message:"internal server error"})
    }
   
});

router.patch("/reset-password", updatePassValidation, async (req, res) => {
    const { email, pin, newPassword } = req.body;

    const getPin = await getPinByEmailPin(email, pin);

    // 2. validate pin
    if (getPin?._id) {
        const dbDate = getPin.addedAt;
        const expiresIn = 1;

        let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

        const today = new Date();

        if (today > expDate) {

            return res.json({ status: "error", message: "Invalid or expired pin." });

        }

        // encrypt new password
        const hashedPass = await hashPassword(newPassword);

        const user = await updatePassword(email, hashedPass);


        if (user._id) {
            // send email notification
            emailProcessor({ email, type: "update-password-success" });

            ////delete pin from db
            deletePin(email, pin);

            return res.json({
                status: "success",
                message: "Your password has been updated",
            });
        }
    }

    res.json({
        status: "error",
        message: "Unable to update your password. plz try again later",
    });
});

router.delete("/logout", userAuthorization, async (req, res) => {
    const { authorization } = req.headers;
    //this data coming form database
    const _id = req.userId;

    // 2. delete accessJWT from redis database
    //deleteJWT(authorization);

    // 3. delete refreshJWT from mongodb
    const result = await storeUserRefreshJWT(_id, "");

    if (result._id) {
        return res.json({ status: "success", message: "Loged out successfully" });
    }

    res.json({
        status: "error",
        message: "Unable to logg you out, plz try again later",
    });
});



module.exports = router;
