const VictimModel = require("../Models/VictimModel");

// Login controller
const loginVictim = async (req, res) => {

   



    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find victim by email
        const victim = await VictimModel.findOne({ email });
        if (!victim) {
            return res.status(404).json({ error: 'Victim not found' });
        }

        // Check if the provided password matches the stored password
        if (victim.password !== password) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Respond with success message and victim info
        res.status(200).json({
            message: 'Login successful',
            victim: {
                id: victim._id,
                name: victim.name,
                email: victim.email,
                phone: victim.phone,
                location: victim.location
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { loginVictim };
