require('dotenv').config();
const axios = require('axios');
const API_KEY = process.env.GOOGLE_API_KEY;
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_VERSION = process.env.CLIENT_VERSION;

function getRequestBody( urls ) {
    const threatEntries = urls.map(url => ({url: url}));
    return {
        "client": {
            "clientId": CLIENT_ID,
            "clientVersion": CLIENT_VERSION
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
            "platformTypes": ["WINDOWS"],
            "threatEntryTypes": ["URL"],
            "threatEntries": threatEntries
        }
    };
}

// @param urls - []
const getBadUrls = async(urls) => {
    let badURLs = [];
    console.log( "urls: ", urls );
    for (let url of urls) {
            try {

                const responseSafety = await axios.post(
                    'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=' + API_KEY,
                    getRequestBody([ encodeURIComponent(url) ] )
                );

                if (responseSafety.data.matches) {
                    badURLs.push( { url: url, reason: "Unsafe" } );
                    continue;
                }

                await axios.get(url, { timeout: 15000 });

                // await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                badURLs.push( { url : url, reason: error.message } );
            }
        }
    console.log("bad urls", badURLs);
    return badURLs;
}

module.exports = getBadUrls;