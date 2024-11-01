const VolunteerModel = require("../Models/VolunteerModel");

const fetchVolunteerHistory = async (req, res) => {
  const { email,status } = req.query;

  try {
    const volunteer = await VolunteerModel.findOne({ email: email })
        .populate({
            path: "historicalData",
            match: status ? { status: status } : {status:"open"}, 
        });

    if (!volunteer) {
        return res.status(404).json({ msg: "Volunteer not found" });
    }

    res.status(200).json({
        msg: "Success",
        historicalData: volunteer.historicalData,
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
}
};

module.exports = fetchVolunteerHistory;
