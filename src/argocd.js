const request = require('request');

// openSession is responsible for sending request to argocd and getting session token
const openSession = async (argocdClientSecret, argocdHost) => {
    console.log("[Info]:: Starting open argocd session")
    const requestOptions = {
        url: `https://${argocdHost}/api/v1/session`,
        method: 'POST',
        body: {
            username: 'admin',
            password: argocdClientSecret
        },
        json: true
    };

    return new Promise((resolve, reject) => {
        request(requestOptions, (error, response, body) => {
            if (error) {
                reject(new Error(error));
            } else {
                if (response.statusCode == 200) {
                    console.log(`[Info]:: Session with argocd opened successfully!`);
                    resolve(body['token']);
                } else {
                    console.log(`[Info]:: Request to open argocd session returned status: ${response.statusCode}`);
                    throw error("Failed to open session in argocd")
                }
            }
        });
    });
}

// syncApplication is responsable for send request for sync trigger 
const syncApplication = (argocdSessionToken, argocdHost, argocdApplicationName) => {
    console.log("[Info]:: Starting sync application")
    const requestOptions = {
        url: `https://${argocdHost}/api/v1/applications/${argocdApplicationName}/sync`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${argocdSessionToken}`
        },
        json: true
    };

    request(requestOptions, (error, response, body) => {
        if (error) {
            throw Error(error)
        } else {
            if (response.statusCode == 200) {
                console.log(`[Info]:: The ${argocdApplicationName} application has been synced`);
            } else {
                console.log(`[Error]:: Request to sync application pong returned status: ${response.statusCode}`)
                throw error("Failed to sync application in argocd")
            }
        }
    });
}

module.exports = {
    openSession,
    syncApplication
};
