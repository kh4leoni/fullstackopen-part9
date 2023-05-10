import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const codes = [
  'M24.2',
  'M51.2',
  'S03.5',
  'J10.1',
  'J06.9',
  'Z57.1',
  'N30.0',
  'H54.7',
  'J03.0',
  'L60.1',
  'Z74.3',
  'L20',
  'F43.2',
  'S62.5',
  'H35.29',
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
interface MultipleSelectProps {
  onChangeCodeName: (codeName: string[]) => void;
}

export default function MultipleSelect({
  onChangeCodeName,
}: MultipleSelectProps) {
  const theme = useTheme();
  const [codeName, setCodeName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof codeName>) => {
    const {
      target: { value },
    } = event;
    setCodeName(prevCodeName => {
      const updatedCodeName =
        typeof value === 'string' ? value.split(',') : value;
      onChangeCodeName(updatedCodeName);
      return updatedCodeName;
    });
  };

  return (
    <div>
      <FormControl style={{ minWidth: '100%' }} sx={{ m: 1, width: 300 }}>
        <InputLabel id='demo-multiple-name-label'>Diagnosis Codes</InputLabel>
        <Select
          labelId='demo-multiple-name-label'
          id='demo-multiple-name'
          multiple
          value={codeName}
          onChange={handleChange}
          input={<OutlinedInput label='Name' />}
          MenuProps={MenuProps}
        >
          {codes.map(code => (
            <MenuItem
              key={code}
              value={code}
              style={getStyles(code, codeName, theme)}
            >
              {code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
