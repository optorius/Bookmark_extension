require("dotenv").config();
const axios = require("axios");
const API_KEY = process.env.GOOGLE_API_KEY;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_VERSION = process.env.CLIENT_VERSION;
const https = require("https");

const checkCertificate = (siteUrl) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(siteUrl);
    const options = {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      port:
        parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : undefined),
      method: "HEAD",
    };
    options.agent = new https.Agent(options);

    const req = https.request(options, (res) => {
      const certificate = res.socket.getPeerCertificate();
      if (!certificate || !certificate.valid_to) {
        reject(`Failed to retrieve certificate for ${siteUrl}`);
      } else if (new Date(certificate.valid_to) < new Date()) {
        reject(`Certificate for ${siteUrl} has expired`);
      } else {
        resolve(`Certificate for ${siteUrl} is valid`);
      }
    });

    req.on("error", (error) => {
      reject(`Request failed: ${error.message}`);
    });

    req.end();
  });
};

function getReqBody(url) {
  return {
    client: {
      clientId: CLIENT_ID,
      clientVersion: CLIENT_VERSION,
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
      platformTypes: ["WINDOWS"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: url }],
    },
  };
}

// @param urls - []
const getBadUrls = async (urls) => {
  console.log("URLs to check", urls);
  let badURLs = [];
  for (let url of urls) {
    try {
      const responseSafety = await axios.post(
        "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" +
          API_KEY,
        getReqBody(encodeURIComponent(url))
      );

      if (responseSafety.status !== 200) {
        badURLs.push({
          url: url,
          reason: "Safety API returned status: " + responseSafety.status,
        });
        continue;
      }

      if (responseSafety.data && responseSafety.data.matches) {
        badURLs.push({ url: url, reason: "Unsafe" });
        continue;
      }

      // SSL certificate check
      try {
        await checkCertificate(url);
      } catch (error) {
        console.log("error:", error);
        badURLs.push({ url: url, reason: error });
        continue;
      }

      await axios.get(url, { timeout: 15000 });
    } catch (error) {
      badURLs.push({ url: url, reason: error.message });
    }
  }
  console.log("bad urls:", badURLs);
  return badURLs;
};

module.exports = getBadUrls;
