const axios = require('axios');

// Paste your registration data and secrets here:
const credentials = {"email": "arimboothabhinav@gmail.com",
    "name": "abhinav a",
    "rollNo": "am.en.u4aie22107",
    "accessCode": "SwuuKE",
    "clientID": "f4b3f5bd-7454-4b12-860d-f971585f3783",
    "clientSecret": "mvPwqfDtzjdxaQdr"
}
let cachedToken = null;

async function getAccessToken() {
  if (cachedToken) return cachedToken;

  const response = await axios.post('http://20.244.56.144/evaluation-service/auth', credentials);
  const token = response.data.access_token;
  cachedToken = token; // cache it
  return token;
}

module.exports = { getAccessToken };
