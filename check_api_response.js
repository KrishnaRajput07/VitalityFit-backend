const axios = require('axios');

async function checkApiResponse() {
    try {
        console.log("Logging in...");
        const login = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'visual_test@example.com', password: 'password123'
        });
        const user = login.data.user;
        console.log(`Login response - User ID: ${user.id}`);
        console.log(`Login response - Avatar length: ${user.avatar ? user.avatar.length : 'NULL/Undefined'}`);

        console.log("Fetching user directly...");
        const fetch = await axios.get(`http://localhost:5000/api/user/${user.id}`);
        const fetchedUser = fetch.data;
        console.log(`Fetch response - Avatar length: ${fetchedUser.avatar ? fetchedUser.avatar.length : 'NULL/Undefined'}`);

    } catch (err) {
        console.error("Test Failed:", err.message);
    }
}

checkApiResponse();
