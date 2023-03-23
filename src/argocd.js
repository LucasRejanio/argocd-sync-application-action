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
async function openSession (argocdClientSecret, argocdHost) {
    console.log("[Info]:: Starting a session with argocd...");
    const requestOptions = {
        method: 'POST',
        url: `https://${argocdHost}/api/v1/session`,
        data: {
            username: 'admin',
            password: argocdClientSecret
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
async function syncApplication(argocdSessionToken, argocdHost, argocdApplicationName) {
    console.log("[Info]:: Calling argocd to sync application...")
    const requestOptions = {
        method: 'post',
        url: `https://${argocdHost}/api/v1/applications/${argocdApplicationName}/sync`,
        headers: {
            'Authorization': `Bearer ${argocdSessionToken}`
        },
        timeout: 10000
    };

    try {
        await axios(requestOptions);
        console.log(`[Info]:: The ${argocdApplicationName} application has been synced!`);
    } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.message : error.message;
        throw new Error(errorMessage);
    }
}

module.exports = {
    openSession,
    syncApplication
};
