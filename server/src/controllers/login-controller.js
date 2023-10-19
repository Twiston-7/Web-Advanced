import fs from "fs";
import db from "../data/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const privateKey = fs.readFileSync('../data/private-key.pem', 'utf8');

const login = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).send("Invalid login information");
    }

    // Find the user by username or email
    const user = db.findUser(username);

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res
            .status(401)
            .json({message: "Login failed. Please check username and password"});
    }

    // Create a JWT token for the authenticated user
    const token = jwt.sign({username}, privateKey, {algorithm: 'RS256'})
    // Return a successful login response with the JWT token
    res
        .status(200)
        .json({message: "Login successful", token: token});
}

module.exports = {
    login,
};