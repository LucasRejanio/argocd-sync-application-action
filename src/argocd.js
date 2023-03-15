const request = require('request');

// openSession is responsible for sending request to argocd and getting session token
const openSession = async (argocdClientSecret, argocdHost) => {
    console.log(argocdClientSecret)
    const requestOptions = {
        url: `https://${argocdHost}/api/v1/session`,
        method: 'POST',
        body: {
            username: 'admin',
            password: argocdClientSecret
        },
        json: true
    };

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

    // return new Promise((resolve, reject) => {
    //     request(requestOptions, (error, response, body) => {
    //         if (error) {
    //             reject(new Error(error));
    //         } else {
    //             if (response.statusCode == 200) {
    //                 console.log(`[Info]:: session with argocd opened successfully!`);
    //                 resolve(body['token']);
    //             } else {
    //                 console.log(`[Info]:: request to open argocd session returned status: ${response.statusCode}`);
    //                 throw error("failed to open session in argocd")
    //             }
    //         }
    //     });
    // });
}

// syncApplication is responsable for send request for sync trigger 
const syncApplication = (argocdSessionToken, argocdHost, argocdApplicationName) => {
    const requestOptions = {
        url: `https://${argocdHost}/api/v1/applications/${argocdApplicationName}/sync`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${argocdSessionToken}`
        },
        json: true
    };

    try {
        request(requestOptions, (error, response, body) => {
            if (error) {
                throw new Error(`${error}`);
            } else {
                if (response.statusCode == 200) {
                    console.log('[Info]:: the pong application has been synced');
                } else {
                    console.log(`[Error]:: request to sync application pong returned status: ${response.statusCode}`)
                    throw error("failed to sync application in argocd")
                }
            }
        });   
    } catch (error) {
        throw error (error)
    }
}

module.exports = {
    openSession,
    syncApplication
};
