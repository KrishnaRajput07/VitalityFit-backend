const axios = require('axios');

async function checkSearch() {
    try {
        const res = await axios.post('http://localhost:5000/api/nutrition/search', { query: 'Basmati' });
        console.log('Search Result for "Basmati":', res.data);

        const res2 = await axios.post('http://localhost:5000/api/nutrition/search', { query: 'Gulab' });
        console.log('Search Result for "Gulab":', res2.data);

        if (res.data.length > 0 && res2.data.length > 0) {
            console.log('✅ Verification Successful: New items found in DB.');
        } else {
            console.log('❌ Verification Failed: Items not found.');
        }
    } catch (err) {
        console.error('Verification Error:', err.message);
    }
}

checkSearch();
