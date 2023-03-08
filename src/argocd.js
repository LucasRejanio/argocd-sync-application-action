const request = require('request');

// openSession is responsible for sending request to argocd and getting session token
const openSession = async (argocdClientSecret) => {
    const requestOptions = {
        url: `https://argocd-${process.env.ENVIRONMET_PREFIX}.owill.com.br/api/v1/session`,
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
                    console.log(`[Info]:: session with argocd opened successfully!`);
                    resolve(body['token']);
                } else {
                    console.log(`[Info]:: request to open argocd session returned status: ${response.statusCode}`);
                    throw error("failed to open session in argocd")
                }
            }
        });
    });
}

// syncApplication is responsable for send request for sync trigger 
const syncApplication = (argocdSessionToken, applicationName) => {
    const requestOptions = {
        url: `https://argocd-${process.env.ENVIRONMET_PREFIX}.owill.com.br/api/v1/applications/${applicationName}/sync`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${argocdSessionToken}`
        },
        json: true
    };

    request(requestOptions, (error, response, body) => {
        if (error) {
            reject(new Error(error));
        } else {
            if (response.statusCode == 200) {
                console.log('[Info]:: the pong application has been synced');
            } else {
                console.log(`[Error]:: request to sync application pong returned status: ${response.statusCode}`)
                throw error("failed to sync application in argocd")
            }
        }
    });
}

module.exports = {
    openSession,
    syncApplication
}
