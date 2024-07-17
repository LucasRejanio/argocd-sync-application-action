const checkActionInputs = async (environment, argocdHost, argocdUser, argocdPassword, argocdApplication) => {
  if (environment === "") {
    throw Error("environment-prefix not found!");
  };
  if (argocdHost === "") {
    throw Error("argocd-host not found!");
  };
  if (argocdUser === "") {
    throw Error("argocd-user not found!");
  };
  if (argocdPassword === "") {
    throw Error("argocd-password not found!");
  };
  if (argocdApplication === "") {
    throw Error("argocd-application not found!");
  };
};

module.exports = {
  checkActionInputs
};
