import React, { Component, useState } from 'react';
import Select from 'react-select';
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const TextInput = () => {
  const [value, setValue] = useState(null);
  const [selectValue, setSelectValue] = useState<any>([]);
  const handleChange = (value: any) => {
    setValue(value);
    setSelectValue([...selectValue, value]);
    console.log(`Option selected:`, value);
    console.log(`Option :==`, value);
  };
  return <Select value={value} onChange={handleChange} options={options} />;
};

export default TextInput;
