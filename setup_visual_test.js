const axios = require('axios');

async function setupVisualTest() {
    try {
        // 1. Register User
        console.log("Registering visual_test user...");
        let userId;
        try {
            const reg = await axios.post('http://localhost:5000/api/auth/register', {
                name: 'Visual Tester',
                email: 'visual_test@example.com',
                password: 'password123',
                age: 30, gender: 'Female', height: 165, weight: 60
            });
            userId = reg.data.user.id;
        } catch (e) {
            // If exists, login to get ID (or just assume we can find it somehow, but API doesn't have search-by-email easily without auth)
            // Let's rely on register failing = user exists. 
            // We can't easy get the ID if register fails without login.
            // Let's assume clean slate or catch 400.
            if (e.response && e.response.status === 400 && e.response.data.message === 'User already exists') {
                console.log("User exists. Trying login to get ID...");
                const login = await axios.post('http://localhost:5000/api/auth/login', {
                    email: 'visual_test@example.com', password: 'password123'
                });
                userId = login.data.user.id;
            } else {
                throw e;
            }
        }
        console.log(`User ID: ${userId}`);

        // 2. Upload Image
        console.log("Uploading avatar...");
        // Use a real small red dot base64 for visual confirmation, or the large one? 
        // User wants to know if "uploading" (implies large file support) AND "seeing" works. 
        // Let's use a visible pattern.
        // 100x100 Red Square (Approx)
        // I'll use a slightly larger base64 string for a red block. 
        // This is a 1x1 pixel scaled up? No, let's just use the previous one but rely on the fact it's valid.
        // The previous one was 5x5.
        // Let's use a known valid 30x30 red square.
        const redSquare30 = "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAdSURBVEhL7cIxAQAAAMKg9U9tDj8gAAAAAAAA4NwGZu4Awm6QGnwAAAAASUVORK5CYII=";
        const header = "data:image/png;base64,";

        await axios.put(`http://localhost:5000/api/user/${userId}`, {
            avatar: header + redSquare30
        });
        console.log("Avatar uploaded.");

    } catch (err) {
        console.error("Setup Failed:", err.message);
    }
}

setupVisualTest();
