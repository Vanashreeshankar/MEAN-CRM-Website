
const User = require('../models/user')
const  Reset_id = require('../models/reset');
const  randomPinNumber  = require('../functions/generate_id');


const insertUser = (userObj) => {
  return new Promise((resolve, reject) => {
    UserSchema(userObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    if (!email) return false;

    try {
      User.findOne({ email })
      .then({email}, (error, data) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        resolve(data);
      })
      .then((data) => resolve(data))
      .catch((error) => {
            console.log(error);
            reject(error);
          })
    } catch (error) {
      reject(error);
    }
  });
};



const getUserById = ( _id) => {

    return new Promise((resolve, reject) => {
        if (!_id) return false;

        try{
            User.findOne({_id}).then({_id}, (error, data) => { //.then() added to resolve error
                if (error) {
                  console.log(error);
                  reject(error);
                }
                resolve(data);
             })
            .then((data) => resolve(data))
            .catch((error) => {
                console.log(error);
                reject(error);
            })
            
  
          } catch (error) {
              reject(error);
          }
   
  });
}


  

const storeUserRefreshJWT = (_id, token) => {
    return new Promise((resolve, reject) => {
      try {
        User.findOneAndUpdate(
          { _id },
          {
            $set: { "refreshJWT.token": token, "refreshJWT.addedAt": Date.now() },
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  const updatePassword = (email, newhashedPass) => {
    return new Promise((resolve, reject) => {
      try {
        User.findOneAndUpdate(
          { email },
          {
            $set: { password: newhashedPass },
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };
  
  const verifyUser = (_id, email) => {
    return new Promise((resolve, reject) => {
      try {
        User.findOneAndUpdate(
          { _id, email, isVerified: false },
          {
            $set: { isVerified: true },
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => {
            console.log(error.message);
            reject(error);
          });
      } catch (error) {
        console.log(error.message);
        reject(error);
      }
    });
  };
  
  const setPasswordRestPin = async (email) => {
    //reand 6 digit
    const pinLength = 6;
    const randPin = randomPinNumber(pinLength);
  
    const restObj = {
      email,
      pin: randPin,
    };
  
    return new Promise((resolve, reject) => {
        Reset_id(restObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  };
  
  const getPinByEmailPin = (email, pin) => {
    return new Promise((resolve, reject) => {
      try {
        Reset_id.findOne({ email, pin }) .then({ email, pin }, (error, data) => {
          if (error) {
            console.log(error);
            resolve(false);
          }
  
          resolve(data);
        })
        //let see
        .then((data) => resolve(data))
        .catch((error) => reject(error));
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });
  };
  
  const deletePin = (email, pin) => {
    try {
        Reset_id.findOneAndDelete({ email, pin }).then( { email, pin }, (error, data) => {
        if (error) {
          console.log(error);
        }
      })//let see
      
    } catch (error) {
      console.log(error);
    }
  };

  



  module.exports = {insertUser, getUserByEmail, getUserById, storeUserRefreshJWT, updatePassword, verifyUser, setPasswordRestPin, getPinByEmailPin, deletePin };