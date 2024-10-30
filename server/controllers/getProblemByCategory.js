const AllCategories = require("../Models/AllCategories");

const getProblemByCategory = async (req, res) => {
    const { query } = req.body; // The query contains an array of category objects

    try {
        // Extract the category IDs from the query
        const categoryIds = query;

        // Find all categories that match the provided category IDs
        const categories = await AllCategories.find({ _id: { $in: categoryIds } }).populate('problems');

        // Extract problems from the categories and flatten them into a single array
        const allProblems = categories.flatMap(category => category.problems);

        // Remove duplicates based on the problem ID
        const uniqueProblems = Array.from(new Map(allProblems.map(problem => [problem._id, problem])).values());

        // Check if unique problems were found
        if (uniqueProblems.length === 0) {
            return res.status(404).json({ message: "No problems found for the given categories." });
        }

        // Send the found unique problems to the front end
        res.status(200).json(uniqueProblems);
    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({ error: "An error occurred while fetching problems." });
    }
};

module.exports = getProblemByCategory;
