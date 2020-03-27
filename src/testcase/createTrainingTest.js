import { createTrainingHelper } from '../';
import { webexConfigs } from './config';

async function createTrainingTest(createMeetingParams) {
  try {
    const result = await createTrainingHelper(
      webexConfigs,
      createMeetingParams
    );
    console.log(result);
  } catch (error) {
    console.log('Error in createTrainingTest', error);
    throw error;
  }
}

// this is the input params of the createTrainingSession of webex
const params = {
  startDate: '2020-10-18T06:30:00.000Z',
  duration: 1200,
  timeZone: 'Asia/Calcutta',
  openTime: 5,
  confName: 'API TESTING',
  agenda: 'Test the webex api',
  description: 'This webex training session is created using different methid',
  participantLimit: 100,
  emailInvitations: true,
  enableReminder: true,
  sendEmail: true,
  minutesAhead: 5,
  attendeeList: true,
  chat: true,
  poll: true,
  fileShare: false,
  attendeeRecordTrainingSession: false,
  trainingSessionRecord: false,
  voip: false
};

createTrainingTest(params);
