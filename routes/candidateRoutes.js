const express=require('express');
const router=express.Router();
const Candidate=require('./../models/candidate')
const {jwtAuthMiddleware,generateToken}=require('./../jwt');
const User=require('./../models/user');

const checkAdminRole=async(userId)=>{
  try{
    const user =await User.findById(userId);
    return user.role==='admin';
  }catch(err){
    return false;
  }
}

//POST route to add a candidate
router.post('/',async(req,res)=>{
  try{
    if(!(await checkAdminRole(req.user.id))){
          return res.status(403).json({message:'user does not have admin role'})
        }
    const data=req.body  

    //create a new candidate document using the mongoose model
    const newCandidate=new Candidate(data);

    //save newCandidate to database
    const response=await newCandidate.save();  //will until it gets saved-->if a error comes it will directly go to the catch block
    console.log("data saved");


    res.status(200).json({response:response});


  }catch(err){
    console.log(err);
    res.status(500).json({errror:'internal server error'})

  }

})

router.put('/:candidateId',async(req,res)=>{
    try{
        if(!(await checkAdminRole(req.user.id))){
          return res.status(403).json({message:'user does not have admin role'})
        }

        const candidateID=req.params.candidateId;   //sxtract tthe id from the url parameter
        const updatedCandidateData=req.body;   //updated data for  the person

        const response=await Candidate.findByIdAndUpdate(candidateID,updatedCandidateData,{
            new:true,   //return the updated document
            runValidators:true,   // run Mongoose validation
        })

        if(!response){  //agar person present hi na ho 
            return res.status(404).json({error:'Person not found'});
        }

        console.log("candidate data updated");
        res.status(400).json(response);

    }catch(err){
        console.log(err);
        res.status(200).json({error:'internal server error'})
    }
})

router.delete('/:candidateId',async(req,res)=>{
    try{
        if(!(await checkAdminRole(req.user.id))){
          return res.status(403).json({message:'user does not have admin role'})
        }

        const candidateID=req.params.candidateId;   //sxtract tthe id from the url parameter

        const response=await Candidate.findByIdAndDelete(candidateID)
    
        if(!response){  //agar person present hi na ho 
            return res.status(404).json({error:'Person not found'});
        }

        console.log("candidate deleted");
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal server error'})
    }
})

module.exports=router;