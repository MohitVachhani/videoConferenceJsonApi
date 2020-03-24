import { makeHeaderJsonFromConfig } from './common/makeHeaderJsonFromConfig';

export async function createTrainingHelper(config) {
  try {
    const headerJson = makeHeaderJsonFromConfig(config);
    
  } catch (error) {
    console.log('Error in createTrainingHelper', error);
    throw error;
  }
}
