const axios = require('axios');
const axiosRetry = require('axios-retry');

// Setting the axios retry
axiosRetry(axios, { 
    retries: 5, // Number of attempts
    retryDelay: (retryCount) => {
      return retryCount * 1000; // Delay in ms before retry
    },
    // retryCondition: (error) => {
    //   return axiosRetry.isNetworkError(error) || (error.response.status >= 500 && error.response.status <= 599);
    // }
});

// openSession is responsible for sending request to argocd and getting session token
async function openSession (host, user, password) {
    console.log("[Info]:: Starting a session with argocd...");
    const requestOptions = {
        method: 'POST',
        url: `https://${host}/api/v1/session`,
        data: {
            username: user,
            password: password
        },
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 10000
    };

    try {
        const response = await axios(requestOptions);
        console.log(`[Info]:: Session opened successfully!`);
        return response.data.token;
    } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.message : error.message;
        throw new Error(errorMessage);
    }
}

// syncApplication is responsable for send request for sync trigger 
async function syncApplication(host, sessionToken, applicationName) {
    console.log("[Info]:: Calling argocd to sync the application...");
    const requestOptions = {
        method: 'POST',
        url: `https://${host}/api/v1/applications/${applicationName}/sync`,
        headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json'
        },
        timeout: 10000
    };

    try {
        await axios(requestOptions);
        console.log(`[Info]:: The ${applicationName} application has been synced!`);
        console.log(`[Info]:: Check in the argocd console: https://${host}/applications/argocd/${applicationName}`);
    } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.message : error.message;
        throw new Error(errorMessage);
    }
}


module.exports = {
    openSession,
    syncApplication
};