const jwt = require('jsonwebtoken');

//This method pulls the token from with request string
function pullToken(req){
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if(token){
        try{
            return jwt.decode(token, config.secret);
            
        }catch(err){
            return null;
        }
    }else{
        return null;
    }
}

//This method checks if the user is able to make a purchase 
function checkIfAuthorisedToPurchase(req){
    var decodedToken = pullToken(req);
    if(decodedToken){
        if(decodedToken.canPurchase){
            return true;
        }
    }
    return false;
}


module.exports = {checkIfAuthorisedToPurchase, pullToken};