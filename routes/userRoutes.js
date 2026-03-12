const express=require('express');
const router=express.Router();
const User=require('./../models/user.js')
const {jwtAuthMiddleware,generateToken}=require('./../jwt');
const Candidate = require('../models/candidate.js');

router.post('/signup',async(req,res)=>{
  try{
    const data=req.body  

    //create a new user document using the mongoose model
    const newUser=new User(data);

    //save newperson to database
    const response=await newUser.save();  //will until it gets saved-->if a error comes it will directly go to the catch block
    console.log("data saved");

    const payload={
      id:response.id,
    }

    console.log(JSON.stringify(payload));
    const token=generateToken(payload);
    console.log("token is : ",token);

    res.status(200).json({response:response,token:token});


  }catch(err){
    console.log(err);
    res.status(500).json({errror:'internal server error'})

  }

})

//login routes
router.post('/login',async(req,res)=>{
  try{
    console.log("Request body:",req.body)
    //extract the username and password from the request body
    const {aadharCardNumber,password}=req.body;

    //find the username from db
    const user=await Person.findOne({aadharCardNumber:aadharCardNumber});

    //if user does not exist or password does not match,return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error:"Invalid aadharCardNumber or password"});
    }

    //generate token
    const payload={
      id:user.id,
    }
    const token=generateToken(payload);

    // return token as response
    res.json({token});
  }catch(err){
    console.log(err);
    res.status(500).json({error:'internal server error'})
  }
})

//profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
  try{
    const userData=req.user;    //req.user == token form jwt.js
    // console.log("user data",userData);

    const userId=userData.id;
    const user=await User.findById(userId);
    res.status(200).json({user});

  }catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"})
  }
})


router.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userId=req.user;  //extract tthe id from the token
        const {currentPassword,newPassword}=req.body;
        
        // find the user from the db
        const user=await User.findById(userId);

        //if password does not match,return error
        if(!(await user.comparePassword(currentassword))){
          return res.status(401).json({error:"Invalid password"});
        }

        //update user password
        user.password=newPassword;
        await user.save();

        console.log("Password Updated");
        res.status(200).json({message:"password updated"})


    }catch(err){
        console.log(err);
        res.status(200).json({error:'internal server error'})
    }
})

module.exports=router;