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
  console.log("[Info]:: Starting a session with ArgoCD...");
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
async function syncApplication(host, sessionToken, applicationName, enableLogging=true) {
  if (enableLogging) {
    console.log("[Info]:: Calling ArgoCD to sync the application...");
  }
  const requestOptions = {
    method: 'POST',
    url: `https://${host}/api/v1/applications/${applicationName}/sync`,
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Content-Type': 'application/json'
    },
    data: {
      "prune": true // Forces reconciliation if set to 'true'
    },
    timeout: 10000
  };

  try {
    await axios(requestOptions);
    if (enableLogging) {
      console.log(`[Info]:: The ${applicationName} application has been synced!`);
    }
  } catch (error) {
    const errorMessage = error.response && error.response.data ? error.response.data.message : error.message;
    throw new Error(errorMessage);
  }
}

// validateApplicationRollout is responsible for checking if the application is synchronized and healthy
async function validateApplicationRollout(host, sessionToken, applicationName) {
  console.log("[Info]:: Validating the application rollout...");
  const requestOptions = {
    method: 'GET',
    url: `https://${host}/api/v1/applications/${applicationName}`,
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  };

  const startTime = Date.now();
  const timeout = 2700000; // 45 minutes in milliseconds
  const checkInterval = 5000; // 5 seconds

  while (Date.now() - startTime < timeout) {
    try {
      const response = await axios(requestOptions);
      const { sync, health } = response.data.status;
      
      statusMessage = `[Info]:: Checking status... Sync Status = ${sync.status}, Health Status = ${health.status}`;

      if (sync.status === 'Synced' && health.status === 'Healthy') {
        console.log(`[Info]:: The ${applicationName} application is successfully rolled out!`);
        return;
      }
      else if (sync.status === 'OutOfSync' && health.status === 'Healthy') {
        console.log(statusMessage);
        syncApplication(host, sessionToken, applicationName, false)
      }
      else if (health.status === 'Degraded' || health.status === 'Suspended' || health.status === 'Missing') {
        throw new Error(`The ${applicationName} application is in an error state. Health Status = ${health.status}`);
      } else {
        console.log(statusMessage);
      }
    } catch (error) {
      const errorMessage = error.response && error.response.data ? error.response.data.message : error.message;
      throw new Error(errorMessage);
    }

    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }

  throw new Error(`Timeout exceeded, rollout failed. The ${applicationName} application is not in the desired state (Synced and Healthy). Check the ArgoCD console for more details.`);
}

async function displayApplicationInfo(host, applicationName) {
  console.log('');
  console.log(`[Info]:: *** Application on the ArgoCD console: ***`);
  console.log(`[Info]:: https://${host}/applications/${applicationName}`);
}

module.exports = {
  openSession,
  syncApplication,
  validateApplicationRollout,
  displayApplicationInfo
};
