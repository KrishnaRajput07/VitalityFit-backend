const axios = require('axios');

async function testUpload() {
    try {
        console.log("Checking user...");
        let userId = 1;
        try {
            await axios.get(`http://localhost:5000/api/user/${userId}`);
        } catch (e) {
            console.log("Creating test user...");
            const reg = await axios.post('http://localhost:5000/api/auth/register', {
                name: 'UploadTester', email: 'upload@test.com', password: 'password', age: 25, gender: 'Male', height: 180, weight: 75
            });
            userId = reg.data.user.id;
        }

        console.log(`Using User ID: ${userId}`);

        // Create ~6MB dummy base64 string
        const largeImage = "data:image/png;base64," + "A".repeat(6 * 1024 * 1024);

        console.log("Sending payload of size: " + (largeImage.length / 1024 / 1024).toFixed(2) + " MB");

        const res = await axios.put(`http://localhost:5000/api/user/${userId}`, {
            avatar: largeImage
        });

        console.log("Status:", res.status);
        console.log("Upload Success! Avatar length:", res.data.avatar.length);

    } catch (err) {
        console.error("Upload Failed:", err.message);
        if (err.response) {
            console.error("Response:", err.response.status, err.response.data);
            if (err.response.status === 413) {
                console.error("Error 413: Payload Too Large - The limit fix is NOT working.");
            }
        }
    }
}

testUpload();
