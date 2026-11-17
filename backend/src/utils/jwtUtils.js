const jwt = require("jsonwebtoken");

const generateToken = (user) => {   
    const token = jwt.sign({   //jwt.sign(payload, secretKey, options);
        userId: user.UserId, 
        email: user.Email,                       //Payload --> User information
        role: user.Role,
    },

    process.env.JWT_SECRET_KEY,                   //SecretKey --> Used to sign the token
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h"  //Options --> Expiration and other settings
      }
    )
    return token;
}

module.exports = {
    generateToken
};




