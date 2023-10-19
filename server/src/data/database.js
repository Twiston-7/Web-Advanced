const bcrypt = require("bcrypt");
const auctionsRouter = require("../routes/auctions-router.js");

// Fake database
const users = [];
const auctions = [];

const addUser = async (firstName, lastName, username, email, password) => {
    // Hash and salt the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = {
        id: users.length,
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        isAdmin: false
    };

    // Add user to "database"
    users.push(user);
}

const addAdmin = async (firstName, lastName, username, email, password) => {
    // Hash and salt the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        isAdmin: true
    };

    // Add user to "database"
    users.push(user);
}

const findUser = (usernameOrEmail) => {
    return users.find (
        (user) => user.username === usernameOrEmail || user.email === usernameOrEmail
    );
}

const getUserBids = async (user) => {
    const bids = [];

    for (let i = 0; i < auctions.length; i++) {
        if (!auctions[i].bids) {
            continue;
        }

        bids.push(auctions[i].bids.get(user));
    }

    return bids;
}

const addAuction = async (auction) => {
    auctions.push(auction)
}

const deleteAuction = async (auctionId) => {
    for (let i = 0; i < auctions.length; i++) {
        if (auctions[i].id === auctionId) {
            auctions.splice(i, 1); // Remove the auction at index i
            return true; // Return true if auction was removed
        }
    }

    return false; // Return false if auction was not found.
}

const editAuction = async (auctionId, newAuction) => {
    for (let i = 0; i < auctions.length; i++) {
        if (auctions[i].id === auctionId) {
            auctions[i] = newAuction;
            return true; // Return true if auction got replaced
        }
    }

    // Return false if auction not found
    return false;
}

const getAllAuctions = async () => {
    return auctions;
}

const getAuctionById = async (auctionId) => {
    return auctions.find (
        (auction) => auction.id === auctionId
    );
}

const addAuctionBid = async (user, auctionId, bid) => {
    let auction;

    for (let i = 0; i < auctions.length; i++) {
        if (auctions[i].id === auctionId) {
            auction = auctions[i];
        }
    }

    if (auction) {
        if (!auction.bids) {
            auction.bids = new Map();
        }

        // Use the user as the key and bid as the value in the map
        auction.bids.set(user, bid);

        return true; // Return true if the bid was added successfully
    }

    return false; // Return false if the auction was not found.
}

const getNextAuctionId = () => {
    return auctions.length;
}

const checkAuctionIdExists = (id) => {
    const auction = auctions.find (
        (auction) => auction.id === id
    );

    // Return true if auction exists, return false if not.
    return auction !== undefined;
}

module.exports = {
    // User management functions
    addUser,
    addAdmin,
    findUser,

    // User functions
    getUserBids,
    addAuctionBid,

    // Admin functions
    addAuction,
    deleteAuction,
    editAuction,

    // Auction functions
    getAllAuctions,
    getAuctionById,

    // Helper functions
    getNextAuctionId,
    checkAuctionIdExists,
};