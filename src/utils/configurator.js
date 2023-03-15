const checkActionInputs = async (platformsToken, argocdHost, argocdApplication) => {
    if (platformsToken === "") {
        throw Error("platforms-token not found");
    };
    if (argocdHost === "") {
        throw Error("argocd-host not found");
    };
    if (argocdApplication === "") {
        throw Error("argocd-application not found");
    };
};

module.exports = {
    checkActionInputs
};
