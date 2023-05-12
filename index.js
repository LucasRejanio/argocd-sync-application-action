const core = require("@actions/core");

const secretManager = require("./src/utils/secret-manager")
const configurator = require("./src/utils/configurator")
const argocd = require("./src/argocd")

const getArgocdClientSecret = async (environmentPrefix) => {
    const secretName = `will-${environmentPrefix}-foundation-platforms-secret-argocd-admin`;
    const secretString = await secretManager.getSecret(secretName, process.env.AWS_REGION);

    var secret = JSON.parse(secretString);

    return secret['configs.secret.argocdServerAdminPassword'];
};

async function main() {
    const environmentPrefix = core.getInput("environment-prefix").toString();
    const argocdHost = core.getInput("argocd-host").toString();
    const argocdApplication = core.getInput("argocd-application").toString();

    await configurator.checkActionInputs(environmentPrefix, argocdHost, argocdApplication);
    const argocdClientSecret = await getArgocdClientSecret(environmentPrefix);
    
    try {
        const argocdSessionToken = await argocd.openSession(argocdClientSecret, argocdHost);
        await argocd.syncApplication(argocdSessionToken, argocdHost, argocdApplication);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error synchronizing the application on ArgoCD');
    }
};

main();
