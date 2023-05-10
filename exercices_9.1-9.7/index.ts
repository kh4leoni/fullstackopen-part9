import express from 'express';
import { calcultateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { weight, height } = req.query;

  if (!weight || !height) res.json({ error: 'malformatted parameters' });

  if (!isNaN(Number(weight)) && !isNaN(Number(height))) {
    res.json({
      weight: weight,
      height: height,
      bmi: calcultateBmi(Number(height), Number(weight)),
    });
  } else {
    res.json({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises } = req.body;

  if (!target || !daily_exercises)
    return res.status(400).json({ error: 'missing parameters' });

  if (isNaN(Number(target)))
    return res.status(400).json({ error: 'malformatted parameters' });

  const typedDailyExercises = daily_exercises as number[];


  typedDailyExercises.forEach((exercise) => {
    if (isNaN(Number(exercise))) {
      return res.status(400).json('malformatted parameters');
    }
    return;
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(typedDailyExercises, target);
  return res.json(result);
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
