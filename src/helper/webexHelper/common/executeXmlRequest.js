import request from 'request-promise';

export function getRequestUrl(headerJson) {
  const url = `https://${headerJson.header.securityContext.siteName}.webex.com/WBXService/XMLService`;
  return url;
}

export async function executeXMLRequest(xmlRequest, url) {
  try {
    const postRequest = {
      method: 'POST',
      url,
      headers: {
        'content-type': 'text/xml'
      },
      body: xmlRequest
    };
    const result = await request(postRequest);
    return result;
  } catch (error) {
    throw Error('Error in executeXMLRequest' + error);
  }
}
