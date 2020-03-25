import { getRequestUrl, executeXMLRequest } from './common/executeXmlRequest';
import { convertJsonToXml, convertXmlToJson } from './common/convertor';

function createGetHostUrlXMLRequestMaker(headerJson, meetingKey) {
  const headerXMLRequest = convertJsonToXml(headerJson);
  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
    <serv:message xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    ${headerXMLRequest}
      <body>
        <bodyContent
          xsi:type="java:com.webex.service.binding.meeting.GethosturlMeeting">
          <sessionKey>${meetingKey}</sessionKey>
        </bodyContent>
      </body>
    </serv:message>`;
  return xmlRequest;
}

function getHostUrlFromJsonResult(jsonResult) {
  const hostUrl = jsonResult.elements[0].elements[1].elements[0].elements[0].elements[0].text;
  return hostUrl;
}

export async function getHostUrl(headerJson, meetingKey) {
  try {
    console.log('Fetching Host Url');
    const requestUrl = getRequestUrl(headerJson);
    const xmlRequest = createGetHostUrlXMLRequestMaker(headerJson, meetingKey);
    const xmlResult = await executeXMLRequest(xmlRequest, requestUrl);
    const jsonResult = convertXmlToJson(xmlResult);
    const hostUrl = getHostUrlFromJsonResult(JSON.parse(jsonResult));
    return hostUrl;
  } catch (error) {
    console.log('Error in getHostUrl' + error);
    throw error;
  }
}
