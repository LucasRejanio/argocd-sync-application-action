const configurator = require("./src/utils/configurator")
const argocd = require("./src/argocd-handler")

async function main() {
    const environment = "development"
    const argocdHost = "example.com.br"
    const argocdUser = "admin"
    const argocdPassword = "Ex4mPl3"
    const argocdApplication = "example"
    
    try {
        await configurator.checkActionInputs(environment, argocdHost, argocdUser, argocdPassword, argocdApplication);

        const argocdSessionToken = await argocd.openSession(argocdHost, argocdUser, argocdPassword);
        await argocd.syncApplication(argocdHost, argocdSessionToken, argocdApplication);
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await argocd.validateApplicationRollout(argocdHost, argocdSessionToken, argocdApplication);
        await argocd.displayApplicationInfo(argocdHost, argocdApplication)
    } catch (error) {
        console.error(error.message);
        await argocd.displayApplicationInfo(argocdHost, argocdApplication)
        process.exit(1);
    }
};

main();
