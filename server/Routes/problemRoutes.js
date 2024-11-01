const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ProblemModel = require("../Models/ProblemModel");
const VictimModel = require("../Models/VictimModel");
const Victim = require("../Models/VictimModel");
const publishPost = require("../controllers/publishPost");
const getPosts = require("../controllers/getPosts");
const getVictimPostsForHistory = require("../controllers/getVictimPostsForHistory");
const closeProblem = require("../controllers/deleteVictimPost");
const getAllCategories = require("../controllers/getAllCategories");
const getProblemByCategory = require("../controllers/getProblemByCategory");
const VolunteerProblem = require("../controllers/VolunteerProblem");
const fetchVolunteerHistory = require("../controllers/FetchVolunteerHistory");
dotenv.config();

router.post("/gemini-model", async (req, res) => {
  const problem = req.body.userProblem;
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  This is the problem: ${problem}

    If problem is not related to consequences of natural calamities/disaster, say irrelevant problem


  Please classify the problem and provide keywords for the following criteria:

  **Category:** Identify the main category of the problem. You may include any relevant keywords that describe the issue.
  **Urgency:** Assess the urgency of the situation and provide a keyword that best reflects it (e.g., low, medium, high).
  **Severity:** Determine the severity of the situation and provide a keyword that best describes it (e.g., low, medium, high).

  Please respond with a JSON object containing:
  {
    "category": "<keywords>",
    "urgency": "<keyword>",
    "severity": "<keyword>"
  }

  Example Classification:
  {
    "category": "Injury, Hospital, Flood",
    "urgency": "High",
    "severity": "Medium"
  }

  `;

  try {
    const result = await model.generateContent(prompt);
    const classificationResult = result.response.text();
    console.log("Raw classification result:", classificationResult); // Log the raw response

    // Sanitize the response by removing markdown syntax
    const sanitizedResult = classificationResult
      .replace(/```json|```/g, "")
      .trim();

    // Attempt to parse the sanitized classification result
    let classification;
    try {
      classification = JSON.parse(sanitizedResult);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res
        .status(400)
        .json({ error: "Invalid response format from AI model." });
    }

    return res.status(200).json({
      category: classification.category,
      urgency: classification.urgency,
      severity: classification.severity,
    });
  } catch (error) {
    console.error("Error generating classification:", error);
    return res.status(500).json({
      error: "An error occurred while classifying the problem statement.",
    });
  }
});


router.post("/publish-post", publishPost);
router.get("/get-posts",getPosts);
router.get("/get-victim-history",getVictimPostsForHistory)
router.post("/close-problem",closeProblem)

// sort functionality

router.get("/sort-posts", async (req, res) => {
  const { sortBy, filter, email } = req.query;
  console.log(sortBy, filter);

  try {
    // Fetch all posts and populate the `volunteersAssigned` field to access volunteer emails
    const allPosts = await ProblemModel.find().populate({
      path: 'volunteersAssigned',
      select: 'email' // Only get the email field of assigned volunteers
    });

    // Filter out posts where a volunteer's email matches the provided email
    const filteredPosts = allPosts.filter(post => 
      !post.volunteersAssigned.some(volunteer => volunteer.email === email)
    );

    // Apply sorting and filtering criteria on the filtered posts
    const sortedArr = getFilteredData(sortBy, filter, filteredPosts);

    res.status(200).json({ allPosts: sortedArr });
  } catch (e) {
    console.log('error in fetching all posts:', e);
    res.status(400).json({ error: 'Internal Server Error' });
  }
});



function getFilteredData(sortBy, filter, allPosts) {
  let highCount = 0;
  let lowCount = 0;
  let middleCount = 0;

  sortBy = sortBy === 'Urgency' ? 'priority' : sortBy;
  // Count the occurrences based on the dynamic `sortBy` key
  allPosts.forEach(element => {
    console.log(element[sortBy]);



    if (element[sortBy] === 'High') {
      highCount++;
    } else if (element[sortBy] === 'Medium') {
      middleCount++;
    } else if (element[sortBy] === 'Low') {
      lowCount++;
    }
  });

  // Create an array with enough space for all elements
  let sortedArray = new Array(highCount + middleCount + lowCount);

  // Initialize indices for each priority level
  let i = 0;
  let j = highCount;
  let k = highCount + middleCount;

  // Populate sortedArray based on the dynamic `sortBy` key
  allPosts.forEach(element => {
    if (element[sortBy] === 'High') {
      sortedArray[i++] = element;
    } else if (element[sortBy] === 'Medium') {
      sortedArray[j++] = element;
    } else if (element[sortBy] === 'Low') {
      sortedArray[k++] = element;
    }
  });

  // Apply the filter to determine order of return
  return filter === 'high' ? sortedArray : sortedArray.reverse();
}




// all categories

router.post("/get-categories",getAllCategories);

router.post("/get-query-posts-by-category",getProblemByCategory);

// volunteer for a problem
router.post("/volunteer-problem",VolunteerProblem)

// volunterr history

router.get("/fetch-volunteer-history",fetchVolunteerHistory)

module.exports = router;
