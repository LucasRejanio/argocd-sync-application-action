const {SecretsManagerClient, GetSecretValueCommand} = require("@aws-sdk/client-secrets-manager");

const getSecret = async (secretName, awsRegion) => {
    const client = new SecretsManagerClient({
        region: awsRegion,
    });

    let response;
  
    try {
        response = await client.send(
        new GetSecretValueCommand({
            SecretId: secretName,
            VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        })
    );
  
    var secret = response.SecretString;
    
    return secret
    } catch (error) {
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
    }
}

module.exports = {
    getSecret
}
