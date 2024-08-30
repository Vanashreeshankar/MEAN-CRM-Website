const bcrypt = require('bcrypt');

const saltRounds = 10;



const hashPassword = (plainPassword) => {
    return new Promise((resolve) => {
      resolve(bcrypt.hashSync(plainPassword, saltRounds));
    });
  };

const comparePassword = (plainPassword, passFromDB) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, passFromDB, function(error, result){
           if(error) reject(error);

           resolve(result);
        })
            
        
    })

}

module.exports = {hashPassword, comparePassword};