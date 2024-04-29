const core = require("@actions/core");

const configurator = require("./src/utils/configurator")
const argocd = require("./src/argocd-handler")

async function main() {
    const environment = core.getInput("environment").toString();
    const argocdHost = core.getInput("argocd-host").toString();
    const argocdUser = core.getInput("argocd-user").toString();
    const argocdPassword = core.getInput("argocd-password").toString();
    const argocdApplication = core.getInput("argocd-application").toString();

    await configurator.checkActionInputs(environment, argocdHost, argocdUser, argocdPassword, argocdApplication);
    
    try {
        const argocdSessionToken = await argocd.openSession(argocdHost, argocdUser, argocdPassword);
        await argocd.syncApplication(argocdHost, argocdSessionToken, argocdApplication);
    } catch (error) {
        console.error(error.message);
    }
};

main();
