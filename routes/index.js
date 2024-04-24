const express = require('express');
const router = express.Router();
const Registration = require('../models/signupModels');


router.get("/", async (req, res) => {
   res.render('index');
});



router.get("/signup", (req, res) => {
    res.render('signup');
});

router.get("/login", (req, res) => {
    res.render('login');
});

router.post('/signup', async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const existingUserByEmail = await Registration.findOne({ email: email });

        if (existingUserByEmail) {
            return res.redirect('/signup?message=Email%20already%20exists');
        }

        const newRegistration = new Registration({ name,  username, email, password });
        await newRegistration.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error saving registration:', err.message);
        res.redirect('/signup');
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Registration.findOne({ email: email });

        if (!user || password != user.password) {
            return res.status(400).redirect('/login?message=Invalid%20credentials');
        }

        req.session.loggedIn = true;
        req.session.user = user; // Store user information in session
        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).redirect('/login?message=Internal%20Server%20Error');
    }
});




router.get('/signup', (req, res) => {
    res.render('signup')
});

module.exports = router;
