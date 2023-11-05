<script>
    export let active;
    export let isLoggedIn = false;
    export let isAdmin = false;
    export let username = "";

    const isJwtValid = () => {
        const token = localStorage.getItem('token');

        if (token === null) {
            return false;
        }

        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const currentTimestamp = Math.floor(Date.now() / 1000);

            // Check if the token has not expired
            if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
                return false;
            }

            isAdmin = decodedToken.isAdmin;
            username = decodedToken.username;
            console.log(isAdmin);
            console.log(username);

            return true;
        } catch (error) {
            // If there is an error decoding or parsing the token, it's not valid
            return false;
        }
    }

    isLoggedIn = isJwtValid();
</script>

<div class="wrapper">
    <nav class="navbar">
        <a href="/" id="logo">
            <img src="http://localhost:3000/img/logo.png" alt="Logo" />
        </a>

        <ul class="nav-list">
            <li class="nav-item">
                <a class:active={active === "/"} href="/">Home</a>
            </li>

            {#if isLoggedIn}
                <li class="nav-item">
                    <a href="/logout">Log out</a>
                </li>

                {:else}

                <li class="nav-item">
                    <a class:active={active === "/login"} href="/login">Login</a>
                </li>
                <li class="nav-item">
                    <a class:active={active === "/register"} href="/register">Register</a>
                </li>
            {/if}
        </ul>
    </nav>
    <hr>
</div>

<style>
    #logo img {
        width: 100%;
        height: auto;
    }

    #logo {
        position: relative;
        height: auto;
        width: 50px;
        margin: 10px 10px 0 10px;
    }

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
        padding: 0;
        width: 100%;
    }

    .nav-list {
        list-style-type: none;
        display: flex;
    }

    .nav-item {
        margin-right: 20px;
    }

    a {
        text-decoration: none;
        color: #fff;
    }

    li {
        list-style-type: none;
    }

    a.active {
        font-weight: bold;
    }
</style>
