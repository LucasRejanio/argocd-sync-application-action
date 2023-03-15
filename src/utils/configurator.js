const checkActionInputs = async (environmentPrefix, argocdHost, argocdApplication) => {
    if (environmentPrefix === "") {
        throw Error("environment-prefix not found");
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
