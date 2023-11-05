import express from 'express';
import cors from 'cors';
const app = express()
const port = 3000

import auctions from "./routes/auctions-router.js";
import admin from "./routes/admin-router.js";
import user from "./routes/user-router.js";
import login from "./routes/login-router.js"
import register from "./routes/register-router.js"

import * as db from "./data/database.js";

// Create test admin.
const createAdmin = async () => {
    await db.addAdmin("Generic", "User", "User", "genericuser@gmail.com", "ImNotIntoSecuritySoIUseABadPassword")
}

// Create test user
const createUser = async () => {
    await db.addUser("Admin", "", "Admin", "root@domain.com", "Str0ngP4sswurds4Life")
}

const createAuctions = async () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 9)

    const auction1 = {};
    auction1.item = "sennheiser HD 600 300Ω";
    auction1.description = "The HD 600 is the audio purist’s choice for reference playback. An instrument of Sennheiser’s passion for perfect sound, it is globally recognized as the standard for analytical high-fidelity listening - even 20-plus years after its release.";
    auction1.tags = {brand: "sennheiser", design: "open-back", impedance: "300Ω"};
    auction1.images = ["http://localhost:3000/img/auctions/hd600-300ohm/1.jpg",
        "http://localhost:3000/img/auctions/hd600-300ohm/2.jpg",
        "http://localhost:3000/img/auctions/hd600-300ohm/3.jpg",
        "http://localhost:3000/img/auctions/hd600-300ohm/4.jpg"];
    auction1.endDate = tomorrow;
    await db.addAuction(auction1);

    const auction2 = {};
    auction2.item = "beyerdynamic DT 990 PRO 32Ω";
    auction2.description = "Open-Back reference headphones for control and monitoring purpose.";
    auction2.tags = {brand: "beyerdynamic", design: "open-back", impedance: "32Ω"};
    auction2.images = ["http://localhost:3000/img/auctions/770-80ohm/1.jpg"];
    auction2.endDate = tomorrow;
    await db.addAuction(auction2);

    const auction3 = {};
    auction3.item = "beyerdynamic DT 770 PRO 80Ω";
    auction3.description = "Closed-Back reference headphones for control and monitoring purpose. ";
    auction3.tags = {brand: "beyerdynamic", design: "closed-back", impedance: "80Ω"};
    auction3.images = ["http://localhost:3000/img/auctions/990-32ohm/1.jpg"];
    auction3.endDate = tomorrow;
    await db.addAuction(auction3);

    const auction4 = {};
    auction4.item = "beyerdynamic DT 990 PRO 80Ω";
    auction4.description = "Open-Back reference headphones for control and monitoring purpose.";
    auction4.tags = {brand: "beyerdynamic", design: "open-back", impedance: "80Ω"};
    auction4.images = ["http://localhost:3000/img/auctions/990-80ohm/1.jpg"];
    auction4.endDate = tomorrow;
    await db.addAuction(auction4);

    const auction5 = {};
    auction5.item = "beyerdynamic DT 770 PRO 32Ω";
    auction5.description = "Closed-Back reference headphones for control and monitoring purpose. ";
    auction5.tags = {brand: "beyerdynamic", design: "closed-back", impedance: "32Ω"};
    auction5.images = ["http://localhost:3000/img/auctions/770-32ohm/1.jpg"];
    auction5.endDate = tomorrow;
    await db.addAuction(auction5);
}

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Promise Rejection:", reason);
});

const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('src/public'));

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

app.listen(port, async () => {
    await createAdmin();
    await createUser();
    await createAuctions();
    console.log(`Server listening on port ${port}`)
})