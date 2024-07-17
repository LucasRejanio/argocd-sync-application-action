const core = require("@actions/core");

const configurator = require("./src/utils/configurator")
const argocd = require("./src/argocd-handler")

async function main() {
  const environment = core.getInput("environment").toString();
  const argocdHost = core.getInput("argocd-host").toString();
  const argocdUser = core.getInput("argocd-user").toString();
  const argocdPassword = core.getInput("argocd-password").toString();
  const argocdApplication = core.getInput("argocd-application").toString();
  
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
