interface BmiValues {
  height: number;
  weight: number;
}
const parseArgument = (args: string[]): BmiValues => {
  console.log(args);
  if (args.length < 4) throw new Error('Not enough arguments!');
  if (args.length > 4) throw new Error('Too many arguments!');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calcultateBmi = (height: number, weight: number): string => {
  const bmi = weight / (height / 100) ** 2;

  if (bmi < 18.5) {
    console.log('Underweight');
    return 'Underweight';
  } else if (bmi >= 25) {
    console.log('Overweight');
    return 'Overweight';
  } else {
    console.log('Normal (healthy weight)');
    return 'Normal (healthy weight)';
  }
};

try {
  const { height, weight } = parseArgument(process.argv);
  calcultateBmi(height, weight);
} catch (error: unknown) {
  let errorMessage = 'Something bad happened. ';
  if (error instanceof Error) {
    errorMessage += 'Error: ' + error.message;
  }
  console.log(errorMessage);
}
