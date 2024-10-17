const VolunteerModel = require('../Models/VolunteerModel');

// Register controller
const registerVolunteer = async (req, res) => {
    try {
        const { name, email, password, phone, location, preferences, availability } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: 'Name, email, password, and phone are required' });
        }

        const existingVolunteer = await VolunteerModel.findOne({ email });
        if (existingVolunteer) {
            return res.status(400).json({ error: 'Email is already registered' });
        }


        const newVolunteer = new VolunteerModel({
            name,
            email,
            password, 
            phone,
            location,
            preferences,
            availability
        });

        await newVolunteer.save();

        res.status(201).json({
            message: 'Volunteer registered successfully',
            volunteer: {
                id: newVolunteer._id,
                name: newVolunteer.name,
                email: newVolunteer.email,
                phone: newVolunteer.phone,
                location: newVolunteer.location,
                preferences: newVolunteer.preferences,
                availability: newVolunteer.availability
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { registerVolunteer };
