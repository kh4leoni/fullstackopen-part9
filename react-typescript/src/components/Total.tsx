interface TotalProps {
  exercises: number[];
}
const Total = (props: TotalProps) => {
  return (
    <div>
      <p>
        Number of exercises {props.exercises.reduce((acc, cur) => acc + cur, 0)}
      </p>
    </div>
  );
};

export default Total;
