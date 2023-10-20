import express from 'express';
import os from 'os';
const app = express()
const port = 3000

import auctions from "./routes/auctions-router.js";
import admin from "./routes/admin-router.js";
import user from "./routes/user-router.js";
import login from "./routes/login-router.js"
import register from "./routes/register-router.js"

import * as db from "./data/database.js";

// Create test admin.
const createAdmin = () => {
    db.addAdmin("Generic", "User", "User", "genericuser@gmail.com", "ImNotIntoSecuritySoIUseABadPassword")
}

// Create test user
const createUser = () => {
    db.addUser("Admin", "", "Admin", "root@domain.com", "Str0ngP4sswurds4Life")
}

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Promise Rejection:", reason);
});

app.use("/auctions", auctions);
app.use("/admin", admin);
app.use("/user", user)
app.use("/login", login);
app.use("/register", register);

app.get('/', (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    res
        .status(403)
        .json({
            message: "Forbidden. You will now be reported to the fbi with ip " + clientIp
        });
})

app.listen(port, () => {
    createAdmin();
    createUser();
    console.log(`Server listening on port ${port}`)
})