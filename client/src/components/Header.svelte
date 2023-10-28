<script>
    export let active;
    export let isLoggedIn = false;
</script>

<div class="wrapper">
    <nav class="navbar">
        <a href="/">
            <img src="../img/logo.png" alt="Logo" />
        </a>

        <ul class="nav-list">
            {#if isLoggedIn}
                <li class="nav-item">
                    <a href="/profile">
                        <img class="profile-picture" src="placeholder-user-image.jpg" alt="Profile">
                    </a>
                </li>
            {/if}

            <li class="nav-item">
                <a class:active={active === "/"} href="/">Home</a>
            </li>
            <li class="nav-item right">
                <a class:active={active === "/login"} href="/login">Login</a>
            </li>
            <li class="nav-item right">
                <a class:active={active === "/register"} href="/register">Register</a>
            </li>
        </ul>
    </nav>
    <hr>
</div>

<style>
    .wrapper {
        position: fixed;
        top: 0;
        background-color: var(--background);
        color: #fff;
        padding: 10px 0 5px; /* Adjust padding on the right side */
        width: 100%;
        height: 5vh;
        z-index: 1;
    }

    .navbar {
        display: flex;
        align-items: center;
        height: 100%;
    }

    hr {
        margin: 0;
        padding: 0; /* Remove padding */
        width: 100%;
    }

    .right {
        justify-content: flex-end;
    }

    .nav-list {
        list-style-type: none;
        padding-left: 3vw;
        display: flex;
    }

    .nav-item {
        margin-right: 20px;
    }

    a {
        text-decoration: none;
        color: #fff;
    }

    a.active {
        font-weight: bold;
    }
</style>
