import { SensitiveKeys } from '../enums/logger/sensitive-keys.enum';

const sensitiveKeysList = Object.values(SensitiveKeys) as string[];

const redactLogData = (data: any): any => {
  if (typeof data === 'object' && data !== null && !data.constructor.name.startsWith('model')) {
    if (Array.isArray(data)) {
      return data.map(item => redactLogData(item));
    }
    
    const redactedData: any = {};
    for (const key in data) {
      if (sensitiveKeysList.includes(key.toLowerCase())) {
        redactedData[key] = '*****'; // replace sensitive data with asterisks
      } else {
        // Recursively redact sensitive keys within nested objects
        redactedData[key] = redactLogData(data[key]);
      }
    }
    return redactedData;
  } else {
    return data;
  }
};

export default redactLogData;
