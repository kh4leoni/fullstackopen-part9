import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HealthCheckEntryWithoutId,
  HospitalEntry,
  HospitalEntryWithoutId,
  OccupationalHealthCareEntryWithoutId,
  OccupationalHealthcareEntry,
  Patient,
} from '../types';
import { useParams } from 'react-router-dom';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import patientService from '../services/patients';
import diagnoseService from '../services/diagnoses';
import './PatientPage.css';
import { TextField, Button, ButtonGroup } from '@mui/material';
import MultipleSelect from './MultipleSelect';

interface Props {
  patients: Patient[];
}
const PatientPage = (props: Props) => {
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState<
    'Hospital' | 'HealthCheck' | 'OccupationalHealthcare' | null
  >(null);
  const [message, setMessage] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');
  const [employerName, setEmployerName] = useState('');
  /*  const [showHealthCheckForm, setShowHealthCheckForm] = useState(false);
  const [showOccuCheckForm, setShowOccuCheckForm] = useState(false);
  const [showHospitalForm, setShowHospitalForm] = useState(false);*/
  const [success, setSuccess] = useState('');

  const [formToShow, setFormToShow] = useState('');
  const { id } = useParams();

  useEffect(() => {
    patientService.getPatientById(id as string).then(data => setPatient(data));
    diagnoseService.getDiagnoses().then(data => setDiagnoses(data));
  }, []);

  const showEntries = (patient: Patient) => {
    return (
      <div>
        {patient.entries.map(entry => {
          switch (entry.type) {
            case 'Hospital':
              return (
                <div className='entry' key={entry.id}>
                  <p>{entry.date} 🏥</p>
                  <p className='description'>{entry.description}</p>
                  <ul>
                    {entry.diagnosisCodes?.map(dc => {
                      const diagnosis = diagnoses?.find(d => d.code === dc);
                      return (
                        <li key={dc}>
                          {dc}{' '}
                          <span className='diagnose'>{diagnosis?.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <p>Specialist: {entry.specialist}</p>
                </div>
              );
            case 'OccupationalHealthcare':
              return (
                <div className='entry' key={entry.id}>
                  <p>
                    {entry.date} ⛑ {entry.employerName}
                  </p>
                  <p className='description'>{entry.description}</p>
                  <ul>
                    {entry.diagnosisCodes?.map(dc => {
                      const diagnosis = diagnoses?.find(d => d.code === dc);
                      return (
                        <li key={dc}>
                          {dc}{' '}
                          <span className='diagnose'>{diagnosis?.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                  {entry.sickLeave && (
                    <div>
                      <h4>Sick Leave:</h4>
                      <p>Start date: {entry.sickLeave.startDate}</p>
                      <p>End date: {entry.sickLeave.endDate}</p>
                    </div>
                  )}
                  <p>Specialist: {entry.specialist}</p>
                </div>
              );
            case 'HealthCheck':
              return (
                <div className='entry' key={entry.id}>
                  <p>{entry.date} 🩺</p>
                  <p className='description'> {entry.description} </p>
                  <ul>
                    {entry.diagnosisCodes?.map(dc => {
                      const diagnosis = diagnoses?.find(d => d.code === dc);
                      return (
                        <li key={dc}>
                          {dc}{' '}
                          <span className='diagnose'>{diagnosis?.name}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <p>Healthcheck rating: {entry.healthCheckRating}</p>
                  <p>Specialist: {entry.specialist}</p>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  const handleHealthCheckSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const entryToAdd: HealthCheckEntryWithoutId = {
      description,
      date,
      specialist,
      healthCheckRating,
      diagnosisCodes,
      type: 'HealthCheck',
    };

    try {
      const newEntry = (await patientService.addEntry(
        id as string,
        entryToAdd,
      )) as HealthCheckEntry;

      setPatient(prevPatient => {
        if (prevPatient) {
          return {
            ...prevPatient,
            entries: [...prevPatient.entries, newEntry],
          };
        }
        return prevPatient;
      });
      setDiagnosisCodes([]);
      setFormToShow('');
      setSuccess(`New ${newEntry.type.toLowerCase()} entry added`);
      setTimeout(() => {
        setSuccess('');
      }, 5000);
      setDescription('');
      setDate('');
      setSpecialist('');
      setHealthCheckRating(0);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }
    }
  };

  const handleHospitalFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const entryToAdd: HospitalEntryWithoutId = {
      description,
      date,
      specialist,
      discharge: {
        date: dischargeDate,
        criteria: dischargeCriteria,
      },
      diagnosisCodes,
      type: 'Hospital',
    };

    try {
      const newEntry = (await patientService.addEntry(
        id as string,
        entryToAdd,
      )) as HospitalEntry;

      setPatient(prevPatient => {
        if (prevPatient) {
          return {
            ...prevPatient,
            entries: [...prevPatient.entries, newEntry],
          };
        }
        return prevPatient;
      });
      setDiagnosisCodes([]);
      setFormToShow('');
      setSuccess(`New entry ${newEntry.type.toLowerCase()} added`);
      setTimeout(() => {
        setSuccess('');
      }, 5000);
      setDescription('');
      setDate('');
      setSpecialist('');
      setDischargeDate('');
      setDischargeCriteria('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }
    }
  };

  const handleOccupationalSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const entryToAdd: OccupationalHealthCareEntryWithoutId = {
      description,
      date,
      specialist,
      employerName,
      diagnosisCodes,
      type: 'OccupationalHealthcare',
    };
    if (sickLeaveStartDate && sickLeaveEndDate) {
      entryToAdd.sickLeave = {
        startDate: sickLeaveStartDate,
        endDate: sickLeaveEndDate,
      };
    }
    try {
      const newEntry = (await patientService.addEntry(
        id as string,
        entryToAdd,
      )) as OccupationalHealthcareEntry;
      setPatient(prevPatient => {
        if (prevPatient) {
          return {
            ...prevPatient,
            entries: [...prevPatient.entries, newEntry],
          };
        }
        return prevPatient;
      });
      setDiagnosisCodes([]);
      setSuccess(`New entry ${newEntry.type.toLowerCase()} added`);
      setTimeout(() => {
        setSuccess('');
      }, 5000);
      setDescription('');
      setDate('');
      setSpecialist('');
      setFormToShow('');
      setEmployerName('');
      setSickLeaveStartDate('');
      setSickLeaveEndDate('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleSpecialistChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSpecialist(e.target.value);
  };

  const handleHealthCheckRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rating = parseInt(e.target.value);
    setHealthCheckRating(rating);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleDischargeDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDischargeDate(e.target.value);
  };
  const handleDischargeCriteriaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDischargeCriteria(e.target.value);
  };

  const handleSickLeaveEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSickLeaveEndDate(e.target.value);
  };

  const handleSickLeaveStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSickLeaveStartDate(e.target.value);
  };

  const handleEmployerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmployerName(e.target.value);
  };

  const occupationalHealthcareEntry = () => {
    return (
      <form onSubmit={handleOccupationalSubmit}>
        {message && <p className='error-message'> {message}</p>}
        <h4>New occupational healthcare entry</h4>
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='description'
          variant='standard'
          value={description}
          onChange={handleDescriptionChange}
        />
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          type='date'
          label=''
          variant='standard'
          value={date}
          onChange={handleDateChange}
        />
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='specialist'
          variant='standard'
          value={specialist}
          onChange={handleSpecialistChange}
        />
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='employer name'
          variant='standard'
          value={employerName}
          onChange={handleEmployerNameChange}
        />
        <div className='discharges'>
          <h4>Sickleave</h4>
          <p>Start date:</p>
          <TextField
            fullWidth
            size='small'
            id='outlined-basic'
            variant='standard'
            type='date'
            value={sickLeaveStartDate}
            onChange={handleSickLeaveStartDateChange}
          />
          <p>end date:</p>
          <TextField
            fullWidth
            size='small'
            id='outlined-basic'
            label=''
            variant='standard'
            type='date'
            value={sickLeaveEndDate}
            onChange={handleSickLeaveEndDateChange}
          />
        </div>
        <MultipleSelect onChangeCodeName={handleCodeNameChange} />
        <div className='button-div'>
          <Button
            onClick={() => setFormToShow('')}
            type='reset'
            className='cancel-btn'
            variant='contained'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='add-btn'
            variant='contained'
            onClick={() => setDiagnosisCodes(diagnosisCodes.concat(code))}
          >
            Add
          </Button>
        </div>
      </form>
    );
  };

  const hospitalForm = () => {
    return (
      <form onSubmit={handleHospitalFormSubmit}>
        {message && <p className='error-message'> {message}</p>}
        <h4>New hospital entry</h4>
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='description'
          variant='standard'
          value={description}
          onChange={handleDescriptionChange}
        />
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          type='date'
          label=''
          variant='standard'
          value={date}
          onChange={handleDateChange}
        />
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='specialist'
          variant='standard'
          value={specialist}
          onChange={handleSpecialistChange}
        />
        <div className='discharges'>
          <h4>Discharges</h4>
          <TextField
            fullWidth
            size='small'
            id='outlined-basic'
            variant='standard'
            type='date'
            value={dischargeDate}
            onChange={handleDischargeDateChange}
          />
          <TextField
            fullWidth
            size='small'
            id='outlined-basic'
            label='discharge'
            variant='standard'
            type='text'
            value={dischargeCriteria}
            onChange={handleDischargeCriteriaChange}
          />
        </div>
        <MultipleSelect onChangeCodeName={handleCodeNameChange} />
        <div className='button-div'>
          <Button
            onClick={() => setFormToShow('')}
            type='reset'
            className='cancel-btn'
            variant='contained'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='add-btn'
            variant='contained'
            onClick={() => setDiagnosisCodes(diagnosisCodes.concat(code))}
          >
            Add
          </Button>
        </div>
      </form>
    );
  };

  const handleCodeNameChange = (codeName: string[]) => {
    setDiagnosisCodes(codeName);

    console.log(diagnosisCodes);
  };

  const healthCheckForm = () => {
    return (
      <form onSubmit={handleHealthCheckSubmit}>
        {message && <p className='error-message'> {message}</p>}
        <h4>New Healthcheck entry</h4>
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='description'
          variant='standard'
          value={description}
          onChange={handleDescriptionChange}
        />
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label=''
          type='date'
          variant='standard'
          value={date}
          onChange={handleDateChange}
        />
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='specialist'
          variant='standard'
          value={specialist}
          onChange={handleSpecialistChange}
        />
        <TextField
          fullWidth
          size='small'
          id='outlined-basic'
          label='healthcheck rating'
          variant='standard'
          type='number'
          value={healthCheckRating}
          onChange={handleHealthCheckRatingChange}
        />
        <MultipleSelect onChangeCodeName={handleCodeNameChange} />
        <div className='button-div'>
          <Button
            onClick={() => setFormToShow('')}
            type='reset'
            className='cancel-btn'
            variant='contained'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='add-btn'
            variant='contained'
            onClick={() => setDiagnosisCodes(diagnosisCodes.concat(code))}
          >
            Add
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <h1>
        {patient?.name}{' '}
        <span style={{ fontSize: '25px' }}>
          {patient?.gender === 'other'
            ? '⚤'
            : patient?.gender === 'male'
            ? '⚦'
            : '♀'}
        </span>
      </h1>
      <p>ssh: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>
      <div className='btn-group'>
        <ButtonGroup variant='outlined' aria-label='outlined button group'>
          <Button onClick={() => setFormToShow('Hospital')}>
            Hospital entry
          </Button>
          <Button onClick={() => setFormToShow('HealthCheck')}>
            Healthcheck entry
          </Button>
          <Button onClick={() => setFormToShow('OccupationalHealthcare')}>
            Occupational entry
          </Button>
        </ButtonGroup>
      </div>
      {success && <p className='success'>{success}</p>}

      {formToShow === 'Hospital'
        ? hospitalForm()
        : formToShow === 'HealthCheck'
        ? healthCheckForm()
        : formToShow === 'OccupationalHealthcare'
        ? occupationalHealthcareEntry()
        : ''}

      <h3>entries</h3>

      <div>{patient && showEntries(patient)}</div>
    </div>
  );
};

export default PatientPage;
