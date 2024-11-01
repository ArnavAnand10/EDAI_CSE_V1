const AllCategories = require("../Models/AllCategories");

const getProblemByCategory = async (req, res) => {
    const { query, email } = req.body; // The query contains an array of category objects

    try {
        // Extract the category IDs from the query
        const categoryIds = query;

        // Find all categories that match the provided category IDs
        const categories = await AllCategories.find({ _id: { $in: categoryIds } })
            .populate({
                path: 'problems',
                populate: {
                    path: 'volunteersAssigned', // Populate volunteers assigned to each problem
                    select: 'email' // Only get the email field of volunteers
                }
            });

        // Extract problems from the categories and flatten them into a single array
        const allProblems = categories.flatMap(category => category.problems);

        // Remove duplicates based on the problem ID
        const uniqueProblems = Array.from(new Map(allProblems.map(problem => [problem._id, problem])).values());

        // Filter out problems where any volunteer's email matches the specified email
        const filteredProblems = uniqueProblems.filter(problem => {
            return !problem.volunteersAssigned.some(volunteer => volunteer.email === email);
        });

        // Check if filtered problems were found
        if (filteredProblems.length === 0) {
            return res.status(404).json({ message: "No problems found for the given categories." });
        }

        // Send the filtered problems to the front end
        res.status(200).json(filteredProblems);
    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({ error: "An error occurred while fetching problems." });
    }
};

module.exports = getProblemByCategory;
