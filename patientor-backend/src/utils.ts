import {
  NewPatientEntry,
  EntryWithoutId,
  OccupationalHealthcareEntry,
  Discharge,
  HealthCheckRating,
} from './types';
import { Gender, SickLeave } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name!');
  }
  return name;
};

const parseDate = (date: unknown): string => {
  if (!isString(date)) {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map(g => g.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

/*const isArray = (array: unknown): array is Array<string> => {
  return Array.isArray(array) || array instanceof Array;
};

const parseEntries = (entries: unknown): Entry => {
  if (!isArray(entries)) {
    throw new Error("entries missing")
  }
  return entries
}*/
const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object &&
    'entries'
  ) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };
    return newEntry;
  }
  throw new Error('Incorrect data, a field missing.');
};

const parseDescription = (description: unknown): string => {
  if (!isString(description) || !description) {
    throw new Error('Incorrect or missing value (description)');
  }
  return description;
};

const isSickLeave = (obj: any): obj is SickLeave => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'startDate' in obj &&
    typeof obj.startDate === 'string' &&
    'endDate' in obj &&
    typeof obj.endDate === 'string'
  );
};

const isDischarge = (obj: any): obj is Discharge => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'date' in obj &&
    typeof obj.date === 'string' &&
    'criteria' in obj &&
    typeof obj.criteria === 'string'
  );
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map(hc => hc.toString())
    .includes(param.toString());
};

const parseHealthCheckRating = (
  healthCheckRating: unknown,
): HealthCheckRating => {
  if (!isHealthCheckRating(healthCheckRating as number) || !healthCheckRating) {
    throw new Error('Invalid healthcheck rating');
  }
  return healthCheckRating as HealthCheckRating;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!isDischarge(discharge) || !discharge) {
    throw new Error('Incorrect or missing data (discharge)');
  }
  return discharge;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (!isSickLeave(sickLeave)) {
    throw new Error('Incorrect input (sick leave)');
  }
  return sickLeave;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist) || !specialist) {
    throw new Error('Incorrect or missing data (specialist)');
  }
  return specialist;
};

const parseEntryDate = (date: unknown): string => {
  if (!isString(date) || !date) {
    throw new Error('Incorrect or missing data (date)');
  }
  return date;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!isString(employerName) || !employerName) {
    throw new Error('incorrect or missing data (employer');
  }
  return employerName;
};

const parseType = (
  type: unknown,
): 'Hospital' | 'OccupationalHealthcare' | 'HealthCheck' => {
  if (!isString(type)) {
    throw new Error('incorrect or missing data (type)');
  }
  if (
    type === 'Hospital' ||
    type === 'OccupationalHealthcare' ||
    type === 'HealthCheck'
  ) {
    return type;
  }
  throw new Error('incorrect or missing type');
};

const parseDiagnosisCodes = (array: unknown): string[] => {
  if (!Array.isArray(array)) {
    throw new Error('Incorrect value on diagnosis code');
  }
  const allStrings = array.every(element => typeof element === 'string');
  if (!allStrings) {
    throw new Error('Diagnosis codes should be strings');
  }
  return array as string[];
};

export const toNewEntries = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }
  if (
    'description' in object &&
    'date' in object &&
    'specialist' in object &&
    'type' in object &&
    'diagnosisCodes' in object
  ) {
    const entry: EntryWithoutId = {
      description: parseDescription(object.description),
      date: parseEntryDate(object.date),
      specialist: parseSpecialist(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
      type: parseType(object.type),
    };
    switch (object.type) {
      case 'Hospital':
        if ('discharge' in object) {
          const hospitalEntry = {
            ...entry,
            discharge: parseDischarge(object.discharge),
          };
          return hospitalEntry;
        }
        throw new Error('Incorrect or missing data (discharge)');

      case 'HealthCheck':
        if ('healthCheckRating' in object) {
          const healthCheckEntry = {
            ...entry,
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
          };
          return healthCheckEntry;
        }
        throw new Error('Incorrect or missing data (healthcheck entry)');

      case 'OccupationalHealthcare':
        if ('employerName' in object) {
          const updatedEntry = {
            ...entry,
            employerName: parseEmployerName(object.employerName),
          } as OccupationalHealthcareEntry;

          if ('sickLeave' in object) {
            updatedEntry.sickLeave = parseSickLeave(object.sickLeave);
          }

          return updatedEntry;
        } else {
          throw new Error('Incorrect or missing data (employer name)');
        }
        break;

      default:
        break;
    }
  }
  throw new Error('Incorrect data, a field missing.');
};

export default toNewPatientEntry;
