import express from 'express';
const router = express.Router();
import patientService from '../services/patientService';
import toNewPatientEntry, { toNewEntries } from '../utils';

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const foundPatient = patientService.getPatientById(id);
  res.json(foundPatient);
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addEntry = patientService.addPatient(newPatientEntry);
    res.json(addEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += 'Error. ' + error.message;
    }
    console.log(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const newEntry = toNewEntries(req.body);
    console.log(newEntry);
    const id = req.params.id;
    const addNewEntry = patientService.addEntry(id, newEntry);
    res.json(addNewEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += 'Error: ' + error.message;
    }
    res.json(errorMessage);
  }
});

export default router;
