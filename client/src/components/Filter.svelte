<script>
    export let auctions = [];
    export let updateAuctions;
    export let selectedTags = [];
    export let tagData = [];

    const toggleTag = (category, value) => {
        const tagIndex = selectedTags.findIndex(tag => tag.category === category && tag.value === value);
        if (tagIndex !== -1) {
            // Tag is already selected, so remove it
            selectedTags.splice(tagIndex, 1);
        } else {
            // Tag is not selected, so add it
            selectedTags = [...selectedTags, { category, value }];
        }
        filterByTags();
    }

    const filterByTags = () => {
        const selectedCategoryTags = selectedTags.filter(tag => tag.category);

        let filteredAuctions = auctions;

        for (const categoryTag of selectedCategoryTags) {
            const valuesToMatch = selectedCategoryTags
                .filter(tag => tag.category === categoryTag.category)
                .map(tag => tag.value);

            filteredAuctions = filteredAuctions.filter(auction => {
                return valuesToMatch.includes(auction.tags[categoryTag.category]);
            });
        }

        updateAuctions(filteredAuctions);
    }

    const clearTags = () => {
        selectedTags = [];
        filterByTags();
    }

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
</script>

<div class="wrapper">
    <div class="tag-filter">
        {#each Object.keys(tagData) as category}
            {#if tagData[category].size > 0}
                <div class="item">
                    <label>{capitalizeFirstLetter(category)}:</label>
                    {#each Array.from(tagData[category]) as tag}
                        <label>
                            <input type="checkbox" on:change={() => toggleTag(category, tag)} checked={selectedTags.some(selectedTag => selectedTag.category === category && selectedTag.value === tag)} />
                            {tag}
                        </label>
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
    <button on:click={clearTags}>Clear Filter</button>
</div>

<style>
    .wrapper {
        background-color: var(--secondary);
        margin: auto; /* Center the entire component */
        max-width: 80vw;
        padding: 10px;
        border-radius: 8px;
    }

    .tag-filter {
        display: flex;
        align-items: center; /* Center horizontally */
        justify-content: space-around;
    }

    label {
        display: block;
        font-weight: bold;
    }

    input[type="checkbox"] {
        margin-right: 5px;
    }

    button {
        margin-top: 10px;
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
    }
</style>
