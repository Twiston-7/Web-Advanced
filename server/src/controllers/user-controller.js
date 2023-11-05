import * as db from "../data/database.js";
export const placeBid = async (req, res) => {
    // User is already authenticated. To be authenticated the user obviously has to exist.
    const username = req.headers.username;
    const auctionId = req.body.auctionId;
    const bid = req.body.bid;

    if (!bid || (!Number.isInteger(bid) && !isNaN(Number.parseFloat(bid)))) {
        res
            .status(400)
            .json({
                message: "No or invalid bid amount provided",
                auctionId: auctionId,
                bid: bid
            })
        return;
    }

    if (auctionId === undefined || auctionId === null) {
        res
            .status(400)
            .json({
                message: "No auction id provided",
                auctionId: auctionId,
                bid: bid
            })
        return;
    }

    try {
        await db.addAuctionBid(username, auctionId, bid)

        res
            .status(200)
            .json({
                message: "Successfully added bid!",
                auctionId: auctionId,
                bid: bid
            })
    } catch (Error) {
        console.error("An error occurred adding auction bid for user: " + user +
            "\nAuction id: " + auctionId + "\nBid: " + bid, "\nError: " + Error);
        res
            .status(500)
            .json({
                message: "An internal server error occurred",
                auctionId: auctionId,
                bid: bid
            })
    }
}

export const getBidsForUser = async (req, res) => {
    const user = req.headers.user

    try {
        const bids = await db.getUserBids(user);

        const jsonObject = {
            message: "Successfully retrieved bids",
            bids: bids
        }

        res
            .status(200)
            .json(jsonObject);
    } catch (Error) {
        console.error("Error getting bids for user: " + JSON.stringify(user))

        res
            .status(500)
            .json({ message: "An internal server error occurred" })
    }
}