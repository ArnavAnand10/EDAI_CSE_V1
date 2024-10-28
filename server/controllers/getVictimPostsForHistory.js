const Victim = require("../Models/VictimModel");

const getVictimPostsForHistory = async (req, res) => {
    const { email, status } = req.query; // Add status to the query parameters

    try {
        // Find the victim by email and filter problem statements by status if provided
        const victim = await Victim.findOne({ email: email })
            .populate({
                path: "problemStatements",
                match: status ? { status: status } : {status:"open"}, // Filter by status if provided
            });

        if (!victim) {
            return res.status(404).json({ msg: "Victim not found" });
        }

        // Send the filtered problemStatements array along with any other needed data
        res.status(200).json({
            msg: "Success",
            fullName: victim.fullName,
            problemStatements: victim.problemStatements,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = getVictimPostsForHistory;
