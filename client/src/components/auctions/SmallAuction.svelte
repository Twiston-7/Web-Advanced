<script>
    // Import the createEventDispatcher function from Svelte
    import { createEventDispatcher } from 'svelte';

    export let auction; // Define auction as a Svelte reactive variable
    export const auctionURL = `/auctions/${auction.id}`;

    const getImageSrc = (auction) => {
        return auction.images && auction.images.length > 0
            ? auction.images[0] // Use the first image if available
            : "http://localhost:3000/img/logo.png";
    }

    // Create an event dispatcher
    const dispatch = createEventDispatcher();

    // Function to handle the auction item click
    const handleItemClick = () => {
        // Dispatch a custom event with the auction object as payload
        dispatch('auctionItemClick', auction);
    }
</script>

<style>
    .auction {
        display: flex;
        align-items: center;
        background-color: var(--secondary);
        padding: 10px;
        margin: 10px auto 0 auto;
        border-radius: 8px;
        cursor: pointer; /* Add a cursor style to indicate it's clickable */
        max-width: 80vw;
    }

    .image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-right: 20px;
        object-fit: cover;
    }

    .item-name {
        font-size: 18px;
        font-weight: 700;
        color: var(--primary);
    }
</style>

<!-- Add an event listener for the click event -->
<div class="auction" on:click={handleItemClick}>
    <img class="image" src={getImageSrc(auction)} alt="Auction Image" />
    <a href={auctionURL} class="item-name">{auction.item}</a>
</div>
