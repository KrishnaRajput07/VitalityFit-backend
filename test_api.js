const axios = require('axios');

async function testApi() {
    try {
        console.log("Fetching posts...");
        const postsRes = await axios.get('http://localhost:5000/api/posts');
        const posts = postsRes.data;
        if (posts.length === 0) {
            console.log("No posts found. Creating one...");
            const newPost = await axios.post('http://localhost:5000/api/posts', {
                userName: 'Tester',
                content: 'Test Post',
                image: ''
            });
            posts.push(newPost.data);
        }

        const postId = posts[0].id;
        console.log(`Using Post ID: ${postId}`);

        console.log("Posting comment...");
        const commentRes = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, {
            userName: 'API Tester',
            content: 'Hello via Script',
            parentId: null
        });
        console.log("Comment posted:", commentRes.data);

        console.log("Fetching comments...");
        const commentsRes = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`);
        console.log("Comments fetched:", commentsRes.data);

    } catch (err) {
        console.error("API Test Failed:", err.response ? err.response.data : err.message);
    }
}

testApi();
