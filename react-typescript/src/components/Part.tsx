import { CoursePart } from '../types';
import '../Part.css';

interface PartProps {
  parts: CoursePart[];
}

const Part = (props: PartProps) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };
  const typeCheck = (parts: CoursePart[]) => {
    const partElements = parts.map((part) => {
      switch (part.kind) {
        case 'basic':
          return (
            <div key={part.name}>
              <p className="name">
                {part.name} {part.exerciseCount}
              </p>
              <p className="description">{part.description}</p>
            </div>
          );

        case 'group':
          return (
            <div key={part.name}>
              <p className="name">
                {part.name} {part.exerciseCount}
              </p>
              <p>project exercises: {part.groupProjectCount}</p>
            </div>
          );
        case 'background':
          return (
            <div key={part.name}>
              <p className="name">
                {part.name} {part.exerciseCount}
              </p>
              <p className="description">{part.description}</p>
              <p>submit to: {part.backgroundMaterial}</p>
            </div>
          );
        case 'special':
          return (
            <div key={part.name}>
              <p className="name">
                {part.name} {part.exerciseCount}
              </p>
              <p className="description">{part.description}</p>
              <p>
                required skills:{' '}
                {part.requirements.map((req) => req).join(', ')}
              </p>
            </div>
          );
        default:
          return assertNever(part);
      }
    });
    return <div>{partElements}</div>;
  };

  return <div>{typeCheck(props.parts)}</div>;
};

export default Part;
