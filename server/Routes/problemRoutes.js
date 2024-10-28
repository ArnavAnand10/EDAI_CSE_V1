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
module.exports = router;
