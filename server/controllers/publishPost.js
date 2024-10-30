const AllCategories = require("../Models/AllCategories");
const ProblemModel = require("../Models/ProblemModel");
const Victim = require("../Models/VictimModel");
const VolunteerModel = require("../Models/VolunteerModel");
const nodemailer = require("nodemailer")

const calculateDistance = (lat1, lon1, lat2, lon2) => {

    console.log(lat1, lon1, lat2, lon2);


    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula 
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956 
    // for miles
    let r = 6371;

    // calculate the result
    return (c * r).toFixed(2);  // Distance in kilometers
};

const publishPost = async (req, res) => {
    const { email, problemStatement, problemUrgency, problemCategory, problemSeverity, problemLocation, imageUrl } = req.body;

    try {
        const victim = await Victim.findOne({ email });
        if (!victim) {
            return res.status(404).json({ error: "Victim not found." });
        }

        const problem = new ProblemModel({
            description: problemStatement,
            category: problemCategory,
            severity: problemSeverity,
            priority: problemUrgency,
            status: 'open',
            geoLocation: problemLocation,
            imageUrl,
            victimId: victim._id,
            victimName: victim.fullName
        });

        await problem.save();
        victim.problemStatements.push(problem._id);
        await victim.save();






        // Find nearby volunteers within 5 km
        const volunteers = await VolunteerModel.find({});

        const nearbyVolunteers = [];

        for (const volunteer of volunteers) {
            const distance = calculateDistance(
                problemLocation[0],
                problemLocation[1],
                volunteer.location[0],
                volunteer.location[1]
            );

            if (distance <= 5) {
                nearbyVolunteers.push(volunteer);
            }
        }

        // Log nearby volunteers
        console.log("Nearby Volunteers:", nearbyVolunteers);

        // Send email notifications to nearby volunteers
        if (nearbyVolunteers.length > 0) {
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Use your email service
                auth: {
                    user: 'ridhamanand31@gmail.com',
                    pass: 'hzrn oryt ygab cqrq', // Use environment variables for security
                }
            });

            for (const volunteer of nearbyVolunteers) {
                const mailOptions = {
                    from: "ridhamanand31@gmail.com",
                    to: volunteer.email,
                    subject: 'New Problem Alert',
                    text: `Hello ${volunteer.name},\n\nA new problem has been reported in your area:\n\nDescription: ${problemStatement}\nCategory: ${problemCategory}\nSeverity: ${problemSeverity}\nUrgency: ${problemUrgency}\n\nPlease check the system for more details.\n\nBest,\nAssistMatrix Team`
                };

                await transporter.sendMail(mailOptions);
            }
        }
        const updatePromises = problemCategory.map(async (category) => {
            return await AllCategories.findOneAndUpdate(
                { category },
                { 
                    $inc: { count: 1 }, // Increment count by 1
                    $addToSet: { problems: problem._id } // Push problem ID, ensuring no duplicates
                },
                { upsert: true, new: true } // Create if not exists and return the updated category
            );
        });

        // Wait for all category updates to complete
        await Promise.all(updatePromises);

        console.log("Problem Saved Successfully and Victim Updated");
        res.status(200).json({ msg: "Problem saved successfully and victim updated" });
    } catch (error) {
        console.error("Error publishing post:", error);
        res.status(500).json({ error: "An error occurred while publishing the post." });
    }
};

module.exports = publishPost;
