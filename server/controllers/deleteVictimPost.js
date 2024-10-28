const ProblemModel = require("../Models/ProblemModel");

const closeProblem = async (req,res)=>{

    const {_id} = req.body;

    try{
    const post = await  ProblemModel.updateOne(
        { _id:_id },
        { $set: { status: "closed" } }
      )
    res.status(200).json({msg:"Problem Statement Closed Sucessfully"});
    }
    catch(e){
        console.log('Error Closing Your Problem Statement',e);
        res.status(400).json({error: 'Internal Server Error'});
    }
};


module.exports = closeProblem;