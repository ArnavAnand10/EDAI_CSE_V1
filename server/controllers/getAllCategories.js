const AllCategories = require("../Models/AllCategories");

const getAllCategories = async (req, res) => {
   
    try {
        const allCategories = await AllCategories.find({});

        res.status(200).json(allCategories); 
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "An error occurred while fetching categories." });
    }
};

module.exports = getAllCategories;