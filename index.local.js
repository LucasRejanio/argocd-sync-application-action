const core = require("@actions/core");

const configurator = require("./src/utils/configurator")
const argocd = require("./src/argocd-handler")

async function main() {
    const environment = "development"
    const argocdHost = "example.com.br"
    const argocdUser = "admin"
    const argocdPassword = "Ex4mPl3"
    const argocdApplication = "backstage-development"

    await configurator.checkActionInputs(environment, argocdHost, argocdUser, argocdPassword, argocdApplication);
    
    try {
        const argocdSessionToken = await argocd.openSession(argocdHost, argocdUser, argocdPassword);
        await argocd.syncApplication(argocdHost, argocdSessionToken, argocdApplication);
    } catch (error) {
        console.error(error.message);
    }
};

main();
