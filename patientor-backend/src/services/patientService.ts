import patients from '../../data/patients';
import {
  EntryWithoutId,
  NewPatientEntry,
  NonSensitivePatient,
  Patient,
} from '../types';
import { v1 as uuid } from 'uuid';

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatientById = (id: string): Patient => {
  const foundPatient = patients.find(p => p.id === id);
  if (!foundPatient) {
    throw new Error('No patient found');
  }
  console.log(foundPatient);
  return foundPatient;
};

const addPatient = (entry: NewPatientEntry) => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patientId: string, entry: EntryWithoutId) => {
  const patient = patients.find(p => p.id === patientId);

  if (!patient) throw new Error('Patient not found');

  const newEntry = {
    id: uuid(),
    ...entry,
  };
  patient.entries.push(newEntry);
  return newEntry;
};
export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  getPatientById,
  addEntry,
};
