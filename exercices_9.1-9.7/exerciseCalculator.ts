interface Results {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface Values {
  target: number;
  numbers: number[];
}

const parseArguments = (args: string[]): Values => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (isNaN(Number(args[2]))) throw new Error('All arguments were not numbers');

  const argsArray = process.argv.slice(3);
  const numbers: number[] = [];

  argsArray.forEach((arg) => {
    if (!isNaN(Number(arg))) {
      numbers.push(Number(arg));
    } else {
      throw new Error('All argument were not numbers!');
    }
  });
  return {
    target: Number(args[2]),
    numbers: numbers,
  };
};
export const calculateExercises = (
  trainingHours: number[],
  target: number
): Results => {
  const periodLength = trainingHours.length;
  let trainingDays = 0;
  let sum = 0;

  trainingHours.forEach((day) => {
    sum += day;
    if (day !== 0) trainingDays++;
  });
  const avg: number = sum / periodLength;

  const rating = (): number => {
    if (target - avg <= 0) {
      return 3;
    } else if (target - avg > 0 && target - avg < 0.5) {
      return 2;
    } else {
      return 1;
    }
  };

  const ratingDescription = (rating: number): string => {
    switch (rating) {
      case 3:
        return 'Excellent';
      case 2:
        return 'Good but could be better';
      case 1:
        return 'Bad';
      default:
        throw new Error('Something went wrong, incorrect rating');
    }
  };
  const success: boolean = avg >= target;

  return {
    periodLength: periodLength,
    trainingDays: trainingDays,
    success: success,
    rating: rating(),
    ratingDescription: ratingDescription(rating()),
    target: target,
    average: avg,
  };
};

try {
  const { target, numbers } = parseArguments(process.argv);
  console.log(calculateExercises(numbers, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened. ';
  if (error instanceof Error) {
    errorMessage += 'Error: ' + error.message;
  }
  console.log(errorMessage);
}
