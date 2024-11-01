const ProblemModel = require("../Models/ProblemModel");

const getPosts = async (req, res) => {
  const { email } = req.query;

  try {
    // Find all problems and populate volunteersAssigned to access their emails
    const allProblems = await ProblemModel.find()
      .populate({
        path: 'volunteersAssigned',
        select: 'email', // Only fetch email field from volunteers
      });

    // Filter out problems where any assigned volunteer's email matches the specified email
    const filteredProblems = allProblems.filter(problem => {
      return !problem.volunteersAssigned.some(volunteer => volunteer.email === email);
    });

    res.status(200).json({ allPosts: filteredProblems });
  } catch (e) {
    console.error('Error in fetching all posts:', e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = getPosts;
