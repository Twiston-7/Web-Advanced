<script>
    import { onMount } from "svelte";
    import Ad from "../components/Ad.svelte";
    import SmallAuction from "../components/auctions/SmallAuction.svelte";
    import SearchBar from "../components/SearchBar.svelte";
    import Filter from "../components/Filter.svelte";

    export let auctions = [];
    export let searchFilteredAuctions = [];
    export let tagFilteredAuctions = [];

    // Use onMount to fetch data when the component is mounted
    onMount(async () => {
        try {
            const response = await fetch("http://localhost:3000/auctions", {
                method: "GET"
            });
            if (response.ok) {
                auctions = await response.json(); // Parse the response JSON
                tagFilteredAuctions = auctions;
                searchFilteredAuctions = auctions;
            } else {
                console.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    export const updateSearchAuctions = (newAuctions) => {
        searchFilteredAuctions = newAuctions;
    }

    export const updateTagAuctions = (newAuctions) => {
        tagFilteredAuctions = newAuctions
    }

    const extractUniqueTags = (auctions) => {
        const tagData = {};
        auctions.forEach(auction => {
            for (const key in auction.tags) {
                const value = auction.tags[key];
                if (!tagData[key]) {
                    tagData[key] = new Set();
                }
                tagData[key].add(value);
            }
        });
        return tagData;
    }

    $: tags = tags = extractUniqueTags(auctions);
    $: filteredAuctions = searchFilteredAuctions.filter(item => tagFilteredAuctions.includes(item));
</script>

<main>
    <h2>
        Welcome user, <br>
        welcome to the <span class="primary-color">auction website.</span> <br>
        Please disable any ad blocker you may have.
    </h2>
    <div id="ad">
        <Ad />
    </div>

    <div id="search-bar">
        <SearchBar {auctions} updateAuctions={updateSearchAuctions}/>
    </div>

    <div id="filters">
        <Filter {auctions} updateAuctions={updateTagAuctions} tagData={tags}/>
    </div>

    {#if filteredAuctions}
        {#each filteredAuctions as auction}
            <SmallAuction {auction} />
        {/each}

        {:else}
        <p>A critical error has occurred. Most likely the server is down. Please try again later. </p>
    {/if}

</main>

<style>
    @import url('https://fonts.googleapis.com/css?family=Poppins:700|Poppins:400');
    .primary-color {
        color: var(--primary);
    }
    /* Your CSS styles */
    #ad {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
