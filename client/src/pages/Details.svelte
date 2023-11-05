<script>
    import { onMount } from 'svelte';
    import * as fs from "fs";
    import Ad from "../components/Ad.svelte";

    export let id;
    export let auction = null;
    export let currentImageIndex = 0;
    export let isLoggedIn = false;
    export let bid = 1.00;
    export let errorMessage = "";

    // Create a reactive variable for the remaining time
    let remainingTime = 0;

    // Function to calculate and format the remaining time
    const calculateRemainingTime = () => {
        if (auction && auction.endDate) {
            const endDate = new Date(auction.endDate);
            const now = new Date();
            const timeDifference = endDate - now;

            if (timeDifference > 0) {
                const seconds = Math.floor(timeDifference / 1000) % 60;
                const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) % 7;
                const weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));

                // Create a formatted time string
                remainingTime = "";

                // Format weeks
                if (weeks === 1) remainingTime += "1 week ";
                else if (weeks > 1) remainingTime += `${weeks} weeks `;

                // Format days
                if (days === 1) remainingTime += "1 day ";
                else if (days > 1) remainingTime += `${days} days `;

                // Format hours
                if (hours === 1) remainingTime += "1 hour ";
                else if (hours > 1) remainingTime += `${hours} hours `;

                // Format minutes
                if (minutes === 1) remainingTime += "1 minute ";
                else if (minutes > 1) remainingTime += `${minutes} minutes `;

                // Format seconds
                if (seconds === 1) remainingTime += "1 second";
                else remainingTime += `${seconds} seconds`;
            } else {
                remainingTime = "Auction has ended.";
            }
        }
    }

    const findHighestBid = () => {
        if (auction && auction.bids.length > 0) {
            const bidEntries = Object.entries(auction.bids);
            bidEntries.sort((a, b) => b[1] - a[1]); // Sort by bid values in descending order
            return bidEntries[0]; // Get the last (highest) bid
        }
    }

    const isJwtValid = () => {
        const token = localStorage.getItem('token');

        if (token === null) {
            return false;
        }

        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const currentTimestamp = Math.floor(Date.now() / 1000);

            // Check if the token has not expired
            return !(decodedToken.exp && decodedToken.exp < currentTimestamp);
        } catch (error) {
            // If there is an error decoding or parsing the token, it's not valid
            return false;
        }
    }

    export const submitBid = async () => {
        console.log(bid);
        const numericBid = Number(bid);

        if (!Number.isSafeInteger(numericBid)) {
            errorMessage = "Input provided is not a number. ";
            return;
        }

        if (numericBid <= findHighestBid() + 1) {
            errorMessage = "Bid must be at least 1 euro higher than last bid.";
            return;
        }

        const jwt = localStorage.getItem("token");
        const data = {
            "auctionId": auction.id,
            "bid": numericBid,
        }

        try {
            const response = await fetch("http://localhost:3000/user/bid", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: jwt,
                },
                body: JSON.stringify(data)
            });

            if (response.status === 200) {
                errorMessage = "";

                window.location.href = `/auctions/${id}`;
            } else {
                const responseJSON = await response.json();
                errorMessage = `Something went wrong when placing the bid with code ${response.status}: ` + responseJSON.message
            }
        } catch (error) {
            console.log(error);
            errorMessage = "Something went wrong when placing the bid. Please try again later. "
        }
    }

    onMount(async () => {
        isLoggedIn = isJwtValid();
        try {
            const response = await fetch(`http://localhost:3000/auctions/${id}`, {
                method: "GET"
            });
            if (response.ok) {
                auction = await response.json();
                auction.bids = Object.entries(auction.bids).map(([user, bid]) => ({ user, bid }));
                calculateRemainingTime(); // Calculate and format remaining time when data is fetched
                setInterval(calculateRemainingTime, 1000); // Update the remaining time every second
            } else {
                console.error("Error fetching data:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        if (bid < findHighestBid()) {
            bid = findHighestBid();
        }
    });

    const navigateTo = (index) => {
        currentImageIndex = (index + auction.images.length) % auction.images.length;
    }
</script>

<main>
    {#if auction === null}
        <p>Loading...</p>
    {:else}
        {#if auction.images && Array.isArray(auction.images)}
            <div class="image-description">
                <div class="image-container">
                    <div class="image-nav left" on:click={navigateTo(currentImageIndex - 1)}>&#9664;</div>
                    <img src={auction.images[currentImageIndex]} alt="Auction Image" />
                    <div class="image-nav right" on:click={navigateTo(currentImageIndex + 1)}>&#9654;</div>
                    <div class="image-pagination">
                        {#each auction.images as image, index (image)}
                            <div class="pagination-dot {index === currentImageIndex ? 'active' : ''}" on:click={navigateTo(index)}></div>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
        <div class="image-description">
            <div class="description-tags-bids">
                <h1>{auction.item}</h1>
                <p class="description">{auction.description}</p>
                <Ad />

                {#if auction.tags}
                    <div class="tags">
                        {#each Object.entries(auction.tags) as [tag, value]}
                            <div class="tag-box">
                                <p><strong>{tag}:</strong> {value}</p>
                            </div>
                        {/each}
                    </div>
                {/if}

                <br />

                <div class="countdown-timer">
                    <h3>Time before auction ends: <br />{remainingTime}</h3>
                </div>

                <br />

                <div class="bids">
                    <h2>Bids</h2>
                    {#if auction.bids.length > 0}
                        <ul>
                            {#each auction.bids.entries() as [user, bid]}
                                <li>{user}: {bid}</li>
                            {/each}
                        </ul>
                    {:else}
                        <p>No bids yet.</p>
                    {/if}
                    {#if isLoggedIn}
                        <div class="error-message">
                             {#if errorMessage}
                                {errorMessage}
                             {/if}
                        </div>

                        <label for="bid">Your Bid (in euros):</label>
                        <input type="number" step="1" bind:value={bid} placeholder="Enter your bid in euros (e.g., 50.00)" id="bid"/>
                        <div class="submit-button-container">
                            <button class="submit-button" on:click={submitBid}>Submit Bid</button>
                        </div>

                        {:else}
                        <p><a href="Login.svelte">Log in</a> or <a href="Register.svelte">register</a> to place a bid.</p>
                    {/if}
                    <Ad />
                </div>
            </div>
        </div>
    {/if}
</main>



<style>
    .image-description {
        display: flex;
        align-items: flex-start;
        justify-content: center;
    }

    .image-container {
        position: relative;
        text-align: center;
    }

    img {
        width: 30vw;
        height: auto;
    }

    .image-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        background: rgb(89, 89, 89, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
    }

    .image-nav.left {
        left: 0;
    }

    .image-nav.right {
        right: 0;
    }

    .image-pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .pagination-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgb(82, 82, 82);
        margin: 0 5px;
        transition: background 0.3s ease-in-out;
        cursor: pointer;
    }

    .pagination-dot.active {
        background: #ffffff;
    }

    .description-tags-bids {
        margin-left: 20px;
    }

    .description {
        color: var(--primary);
        max-width: 60vw;
        margin: 0 auto 0 auto;
    }

    .tag-box {
        display: inline-block;
        background: var(--accent);
        padding: 2px 5px 2px 5px;
        font-size: 12px;
        margin: 0 10px 10px;
    }

    .submit-button-container {
        text-align: center;
        margin-top: 20px;
    }

    #bid {
        background-color: var(--accent);
        max-width: 10vw;
        height: 20px;
    }

    .submit-button {
        border: none;
        border-radius: 20px;
        background: var(--primary);
        color: #fff;
        padding: 15px 20px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.3s ease-in-out;
    }

    .submit-button:hover {
        background: var(--accent); /* Change to your accent color */
    }

    input {
        border: none;
        background: none;
        color: var(--text);
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
        outline: none;
        width: 100%;
    }

    input::placeholder {
        color: var(--accent);
    }
</style>