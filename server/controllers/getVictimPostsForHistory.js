const Victim = require("../Models/VictimModel");

const getVictimPostsForHistory = async (req, res) => {
    const { email } = req.query;

    try {
        const victim = await Victim.findOne({ email: email }).populate("problemStatements");

        if (!victim) {
            return res.status(404).json({ msg: "Victim not found" });
        }

        // Send the full problemStatements array along with any other needed data
        res.status(200).json({
            msg: "Success",
            fullName: victim.fullName,
            problemStatements: victim.problemStatements
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = getVictimPostsForHistory;
