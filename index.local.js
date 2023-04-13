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
    const environmentPrefix = "dev"
    const argocdHost = "argocd-dev.owill.com.br"
    const argocdApplication = "userdept"

    await configurator.checkActionInputs(environmentPrefix, argocdHost, argocdApplication)
    const argocdClientSecret = await getArgocdClientSecret(environmentPrefix);
    
    try {
        const argocdSessionToken = await argocd.openSession(argocdClientSecret, argocdHost);
        await argocd.syncApplication(argocdSessionToken, argocdHost, argocdApplication)
    } catch (error) {
        console.error(error.message)
    }
};

main();
