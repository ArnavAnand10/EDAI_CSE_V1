const ProblemModel = require("../Models/ProblemModel");
const VolunteerModel = require("../Models/VolunteerModel");

const VolunteerProblem = async (req,res)=>{

    const {email,problemId} = req.body;
    


    try{
        const Volunteer =await VolunteerModel.findOne({email});

        
        const updatedProblem = await ProblemModel.findByIdAndUpdate(
            problemId,
            { $push: { volunteersAssigned: Volunteer._id } },
            { new: true, useFindAndModify: false } // `new: true` returns the updated document
        );
        const updatedVolunteerHistory= await VolunteerModel.findOneAndUpdate(
           { email},
            { $push: { historicalData:problemId } },
            { new: true, useFindAndModify: false } // `new: true` returns the updated document
        );


        console.log("Volunteer added to problem:", updatedProblem);   

        res.status(200).json({msg:"Problem Volunteered Sucessfully"})
    
    }catch(e){
        console.log(e);
        res.status(500).json({msg:"Internal Server Error, Try Again Later."})
        
    }
}

module.exports = VolunteerProblem;