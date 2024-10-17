const VictimModel = require('../Models/VictimModel');

// Register controller
const registerVictim = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        console.log(req.body)

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: 'Name, email, password, and phone are required' });
        }

        const existingVictim = await VictimModel.findOne({ email });
        if (existingVictim) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const newVictim = new VictimModel({
            name,
            email,
            password, 
            phone,
            
        });

        await newVictim.save();

        res.status(201).json({
            message: 'Victim registered successfully',
            victim: {
                id: newVictim._id,
                name: newVictim.name,
                email: newVictim.email,
                phone: newVictim.phone,
                location: newVictim.location
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { registerVictim };
