import * as db from "../data/database.js"

export const getAllAuctions = async (req, res) => {
    const auctions = await db.getAllAuctions();

    if (!auctions) {
        res
            .status(500)
            .json({message: "Internal server error"});
    }

    res
        .status(200)
        .json(JSON.stringify(auctions));
}

export const getAuctionById = async (req, res) => {
    const auction = db.getAuctionById(req.id);

    if (!auction) {
        res
            .status(404)
            .json({message: "Auction not found"});
    }

    res
        .status(200)
        .json(JSON.stringify(auction));
}