const VolunteerModel = require("../Models/VolunteerModel");

// Login controller
const loginVolunteer = async (req, res) => {
  try {
    const { email, password, location } = req.body;

   

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find volunteer by email
    const volunteer = await VolunteerModel  .findOne({ email });
    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    // Check if the provided password matches the stored password
    if (volunteer.password !== password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Optionally, update the volunteer's location if required
    if (location) {
      volunteer.location = location; // Update the location in the volunteer document
      await volunteer.save(); // Save the changes to the database
    }

    // Respond with success message and volunteer info
    res.status(200).json({
      message: "Login successful",
      volunteer: {
        id: volunteer._id,
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
        location: volunteer.location, // Send the updated location
        preferences: volunteer.preferences,
        availability: volunteer.availability,
        skills: volunteer.skills,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { loginVolunteer };