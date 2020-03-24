function getSiteName(serviceUrl) {
  const siteName = serviceUrl.split("//")[1].split(".webex")[0];
  return siteName;
}

export function makeHeaderJsonFromConfig(config) {
  try {
    const { webExID, password, serviceUrl } = config;
    const siteName = getSiteName(serviceUrl);
    const headerJson = {
      header: {
        securityContext: {
          siteName,
          webExID,
          password
        }
      }
    };
    return headerJson;
  } catch (error) {
    console.log("Error in makeHeaderJsonFromConfig", error);
    throw error;
  }
}
