import db from "../data/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

const privateKey = fs.readFileSync('../data/private-key.pem', 'utf8');

const registerUser = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;

    if (
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !password ||
        !email.match(emailRegex) ||
        !username.match(usernameRegex)
    ) {
        return res.status(400).send("Invalid registration information");
    }

    // Check if the user already exists in the database (by username or email)
    if (db.findUser(username) || db.findUser(email)) {
        return res.status(409).send("User already exists");
    }

    try {
        // Hash the user's password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Add the user to the database
        await db.addUser(firstName, lastName, username, email, hashedPassword);

        // Log the user in and create a JWT token
        const token = jwt.sign({ username }, privateKey, { algorithm: 'RS256' });

        // Return a successful registration and login response with the JWT token
        res.status(201).json({ message: "Registration and login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error. Please try again.");
    }
};

// A bit of a lazy method, just copied the user and used registerAdmin in db (which I also copied from the addUser)
// Since usually I'd just manually run a sql command to register an admin.
const registerAdmin = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;

    if (
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !password ||
        !email.match(emailRegex) ||
        !username.match(usernameRegex)
    ) {
        return res.status(400).send("Invalid registration information");
    }

    // Check if the user already exists in the database (by username or email)
    if (db.findUser(username) || db.findUser(email)) {
        return res.status(409).send("User already exists");
    }

    try {
        // Hash the user's password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Add the user to the database
        await db.addAdmin(firstName, lastName, username, email, hashedPassword);

        // Log the user in and create a JWT token
        const token = jwt.sign({ username }, privateKey, { algorithm: 'RS256' });

        // Return a successful registration and login response with the JWT token
        res.status(201).json({ message: "Registration and login successful", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error. Please try again.");
    }
};

module.exports = {
    registerUser,
    registerAdmin,
};