import { createTrainingHelper } from '../../helper/webexHelper';
import { webexConfigs } from '../../config';

async function createTrainingTest() {
  try {
    await createTrainingHelper(webexConfigs);
  } catch (error) {
    console.log('Error in createTrainingTest', error);
    throw error;
  }
}

createTrainingTest();
