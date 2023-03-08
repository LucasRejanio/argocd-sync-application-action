const secretManager = require("./src/utils/secret-manager")
const argocd = require("./src/argocd")

const getArgocdClientSecret = async () => {
    try {
        const secretName = `will-${process.env.ENVIRONMET_PREFIX}-foundation-platforms-secret-argocd-admin`;
        const secretString = await secretManager.getSecret(secretName, process.env.AWS_REGION);
        var secret = JSON.parse(secretString);

        return secret['configs.secret.argocdServerAdminPassword'];
    } catch (error) {
        throw error(error);
    }
};

const main = async () => {
    try {
        const argocdClientSecret = await getArgocdClientSecret();
        const argocdSessionToken = await argocd.openSession(argocdClientSecret);

        argocd.syncApplication(argocdSessionToken, process.env.APPLICATION_NAME)
    } catch(error){
        throw error(error);
    }
};

main();
