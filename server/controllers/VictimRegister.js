const VictimModel = require('../Models/VictimModel');

// Register controller
const registerVictim = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;
        console.log(req.body)

        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ error: 'Name, email, password, and phone are required' });
        }

        const existingVictim = await VictimModel.findOne({ email });
        if (existingVictim) {
            return res.status(400).json({ error: 'Email is already registered' });
        }
        const existingVictimPhone = await VictimModel.findOne({ phone });
        if (existingVictimPhone) {
            return res.status(400).json({ error: 'Phone Number is already registered' });
        }

        const newVictim = new VictimModel({
            fullName,
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
            
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { registerVictim };
