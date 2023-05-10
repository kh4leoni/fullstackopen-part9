import React, { useEffect, useState } from 'react';
import { DiaryEntry } from './types';
import axios from 'axios';
import './App.css';

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios
      .get<DiaryEntry[]>('http://localhost:3009/api/diaries')
      .then(res => setDiaryEntries(res.data));
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const diaryEntryToAdd = {
      date,
      visibility,
      weather,
      comment,
    };

    axios
      .post<DiaryEntry>('http://localhost:3009/api/diaries', diaryEntryToAdd)
      .then(res => {
        setDiaryEntries([...diaryEntries, res.data]);
        setComment('');
        setDate('');
      })
      .catch(error => setMessage(error.response.data));
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  return (
    <div>
      <div>
        {message && <p style={{ color: 'red' }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            date
            <input
              type='date'
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <div>
            visibility:
            <label htmlFor='great'>great</label>
            <input
              name='visibility'
              type='radio'
              id='great'
              value='great'
              onChange={() => setVisibility('great')}
            />
            <label htmlFor='good'>good</label>
            <input
              name='visibility'
              type='radio'
              id='good'
              value='good'
              onChange={() => setVisibility('good')}
            />
            <label htmlFor='ok'>ok</label>
            <input
              name='visibility'
              type='radio'
              id='ok'
              value='ok'
              onChange={() => setVisibility('ok')}
            />
            <label htmlFor='poor'>poor</label>
            <input
              name='visibility'
              type='radio'
              id='poor'
              value='poor'
              onChange={() => setVisibility('poor')}
            />
          </div>

          <div>
            weather:
            <label htmlFor='sunny'>sunny</label>
            <input
              name='weather'
              type='radio'
              id='sunny'
              value='sunny'
              onChange={() => setWeather('sunny')}
            />
            <label htmlFor='rainy'>rainy</label>
            <input
              name='weather'
              type='radio'
              id='rainy'
              value='rainy'
              onChange={() => setWeather('rainy')}
            />
            <label htmlFor='cloudy'>cloudy</label>
            <input
              name='weather'
              type='radio'
              id='cloudy'
              value='cloudy'
              onChange={() => setWeather('cloudy')}
            />
            <label htmlFor='stormy'>stormy</label>
            <input
              name='weather'
              type='radio'
              id='stormy'
              value='stormy'
              onChange={() => setWeather('stormy')}
            />
            <label htmlFor='windy'>windy</label>
            <input
              name='weather'
              type='radio'
              id='windy'
              value='windy'
              onChange={() => setWeather('windy')}
            />
          </div>

          <div>
            comment
            <input
              type='text'
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <button type='submit'>add</button>
        </form>
      </div>
      <h1>Diary Entries</h1>
      <div>
        {diaryEntries.map(diaryEntry => (
          <div key={diaryEntry.id}>
            <h2>{diaryEntry.date}</h2>
            <p>visibility: {diaryEntry.visibility}</p>
            <p>weather: {diaryEntry.weather}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default App;
