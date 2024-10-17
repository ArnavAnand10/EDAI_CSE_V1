const ProblemModel = require("../Models/ProblemModel");

const getPosts = async (req,res)=>{
    // we want all the posts so we can fetch all the posts where status is open:
    try{
    const allPosts = await  ProblemModel.find();
    res.status(200).json({allPosts: allPosts});
    }
    catch(e){
        console.log('error in fetching all posts:',e);
        res.status(400).json({error: 'Internal Server Error'});
    }
};


module.exports = getPosts;