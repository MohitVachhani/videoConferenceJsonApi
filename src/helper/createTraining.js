import shortid from 'shortid';
import { difference } from 'lodash';
import { makeHeaderJsonFromConfig } from './common/makeHeaderJsonFromConfig';
import { getStartDate, getTimeZoneIdFromTimeZone } from './common/dateHelper';
import {
  convertJsonToXml,
  convertXmlToJsonPromisfied
} from './common/convertor';
import { getRequestUrl, executeXMLRequest } from './common/executeXmlRequest';
import { getAttendeUrl } from './getAttendeUrl';
import { getHostUrl } from './getHostUrl';

const password = shortid.generate();
const requiredKeys = [
  'startDate',
  'duration',
  'timeZone',
  'openTime',
  'confName',
  'agenda',
  'description',
  'emailInvitations'
];

function makeScheduleObject(inputJson) {
  const { timeZone, duration, startDate, openTime } = inputJson;
  const formattedStartDate = getStartDate(startDate, timeZone);
  const timeZoneID = getTimeZoneIdFromTimeZone(timeZone);
  return {
    startDate: formattedStartDate,
    duration,
    timeZoneID,
    openTime
  };
}

function makeAccessControlObject(inputJson) {
  const { sessionPassword } = inputJson;
  return {
    sessionPassword: sessionPassword === undefined ? password : sessionPassword
  };
}

function makeMetaDataObject(inputJson) {
  const { confName, agenda, description } = inputJson;
  return {
    confName,
    agenda,
    description
  };
}

function makeAttendeeOptionsObject(inputJson) {
  const { participantLimit: capacity, emailInvitations } = inputJson;
  const attendeeOptions = {
    participantLimit: capacity === -1 ? 100 : capacity,
    emailInvitations
  };
  return attendeeOptions;
}

function makeRemindObject(inputJson) {
  const { enableReminder, sendEmail, minutesAhead } = inputJson;
  return {
    enableReminder: enableReminder || true,
    sendEmail: sendEmail || true,
    minutesAhead: minutesAhead || 5
  };
}

function makeEnableOption(inputJson) {
  const {
    attendeeList,
    chat,
    poll,
    fileShare,
    attendeeRecordTrainingSession,
    trainingSessionRecord,
    voip
  } = inputJson;
  return {
    attendeeList: attendeeList || true,
    chat: chat || true,
    poll: poll || true,
    fileShare: fileShare || true,
    attendeeRecordTrainingSession: attendeeRecordTrainingSession || false,
    trainingSessionRecord: trainingSessionRecord || false,
    voip: voip || false
  };
}

function makeCreateTrainingParams(inputJson) {
  try {
    const accessControl = makeAccessControlObject(inputJson);
    const schedule = makeScheduleObject(inputJson);
    const metaData = makeMetaDataObject(inputJson);
    const attendeeOptions = makeAttendeeOptionsObject(inputJson);
    const remind = makeRemindObject(inputJson);
    const enableOptions = makeEnableOption(inputJson);
    const createTrainingParams = {
      accessControl,
      schedule,
      metaData,
      attendeeOptions,
      remind,
      enableOptions
    };
    return createTrainingParams;
  } catch (error) {
    console.log('Error in makeCreateTrainingParams', error);
    throw error;
  }
}

function validateCreateTrainingInput(inputJson) {
  const keys = Object.keys(inputJson);
  const isValid = difference(requiredKeys, keys).length === 0;
  if (!isValid) {
    throw new Error('Input json is not valid');
  }
}

function createTrainingXMLRequestMaker(headerJson, trainingCenterJson) {
  const headerXMLRequest = convertJsonToXml(headerJson);
  const bodyXMLRequest = convertJsonToXml(trainingCenterJson);
  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
    <serv:message xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    ${headerXMLRequest}
    <body>
        <bodyContent
            xsi:type="java:com.webex.service.binding.training.CreateTrainingSession">
            ${bodyXMLRequest}
        </bodyContent>
    </body>
    </serv:message>`;
  return xmlRequest;
}

function checkErrorOccuredByCreateTraining(jsonResult) {
  console.log('Checking Whether Error Occured while creating training session');
  const status =
    jsonResult['serv:message']['serv:header'][0]['serv:response'][0][
      'serv:result'
    ][0];
  console.log('Status:', status);
  if (status.toString() === 'FAILURE') {
    const reason =
      jsonResult['serv:message']['serv:header'][0]['serv:response'][0][
        'serv:reason'
      ][0];
    throw new Error('Error occured while creating training:  ' + reason);
  }
}

function getSessionKeyFromResult(jsonResult) {
  return jsonResult['serv:message']['serv:body'][0]['serv:bodyContent'][0][
    'train:sessionkey'
  ][0];
}

async function getHostAndAttendeUrl(headerJson, meetingKey) {
  const fetchUrlPromiseArray = [];
  fetchUrlPromiseArray.push(
    getHostUrl(headerJson, meetingKey),
    getAttendeUrl(headerJson, meetingKey)
  );
  const [hostUrl, attendeUrl] = await Promise.all(fetchUrlPromiseArray);
  return {
    hostUrl,
    attendeUrl
  };
}

export async function createTrainingHelper(config, inputJson) {
  try {
    validateCreateTrainingInput(inputJson);
    const headerJson = makeHeaderJsonFromConfig(config);
    const createTrainingParams = makeCreateTrainingParams(inputJson);
    const xmlRequest = createTrainingXMLRequestMaker(
      headerJson,
      createTrainingParams
    );
    const url = getRequestUrl(headerJson);
    const xmlResult = await executeXMLRequest(xmlRequest, url);
    const jsonResult = await convertXmlToJsonPromisfied(xmlResult);
    checkErrorOccuredByCreateTraining(jsonResult);
    const sessionKey = getSessionKeyFromResult(jsonResult);
    const { hostUrl, attendeUrl } = await getHostAndAttendeUrl(
      headerJson,
      sessionKey
    );
    return {
      sessionKey,
      hostUrl,
      attendeUrl,
      password
    };
  } catch (error) {
    console.log('Error in createTrainingHelper', error);
    throw error;
  }
}
