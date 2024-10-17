const { loginVictim } = require("../controllers/VictimLogin");
const { registerVictim } = require("../controllers/VictimRegister");

const router = require("express").Router();

// victim routes

// login
router.post("/login-victim", loginVictim);

//register
router.post("/register-victim", registerVictim);

// volunteerRoutes
const { loginVolunteer } = require("../controllers/VolunteerLogin");
const { registerVolunteer } = require("../controllers/VolunteerRegister");

// login
router.post("/login-volunteer", loginVolunteer);

//register
router.post("/register-volunteer", registerVolunteer);

module.exports = router;
