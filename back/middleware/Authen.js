const jwt = require('jsonwebtoken');
const {Seller} = require('../model/sellerSchema');


const Authen = async (req,res,next)=>{
 try {
    const token = req.cookies.jwttoken;
    const VerifyToken = jwt.verify(token,process.env.SECRET_KEY);
   
    const rootSeller = await Seller.findOne({_id:VerifyToken._id,"tokens.token":token})

    if(!rootSeller) {throw new Error('User Not Found')}
    
   req.token = token;
   req.rootSeller = rootSeller;
   req.sellerID = rootSeller._id;
   next();


 } catch (error) {
     res.status(401).send('Unauthorized');
     console.log(error);
 }



}


module.exports = Authen;