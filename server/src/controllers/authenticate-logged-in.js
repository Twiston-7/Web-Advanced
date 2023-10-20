import fs from "fs";
import jwt from "jsonwebtoken";

const privateKey = fs.readFileSync('./src/data/private-key.pem', 'utf8');

export const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization; // Assuming the token is sent in the 'Authorization' header

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, privateKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // At this point, the token is valid.
        // You can access the user's data from the 'decoded' object and check if they are an admin.

        if (decoded.isAdmin) {
            req.user = decoded;
            next();
        } else {
            return res.status(403).json({ message: "Permission denied" });
        }
    });
};

export const authenticateUser = (req, res, next) => {
    const token = req.headers.token; // Assuming the token is sent in the 'Authorization' header

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, privateKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.headers.user = decoded;
    });
};