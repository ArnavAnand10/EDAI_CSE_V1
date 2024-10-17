const ProblemModel = require("../Models/ProblemModel");
const Victim = require("../Models/VictimModel");




const publishPost =async (req,res)=>{
    const { email,problemStatement,problemUrgency,problemCategory,problemSeverity,problemLocation, imageUrl} = req.body;
    console.log(problemUrgency,email)
  
    const victim = await Victim.findOne({email: email})
    console.log(victim && victim._id);
    
  
    const problem = new ProblemModel({
      description : problemStatement,
      category : problemCategory,
      severity : problemSeverity,
      priority : problemUrgency,
      status: 'open',
      geoLocation: problemLocation,
      imageUrl: imageUrl,
      victimId: victim._id,
      victimName: victim.name
    })

    await problem.save();
  
    victim.problemStatements.push(problem._id); // Add the problem ID to the victim
    await victim.save(); // Save the updated victim document
  
    console.log("Problem Saved Successfully and Victim Updated");
  
    // Respond with success message
    res.status(200).json({ msg: "Problem saved successfully and victim updated" });
    
  
}

module.exports = publishPost;