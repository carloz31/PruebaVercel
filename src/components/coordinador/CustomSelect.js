import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const isAllowedKey = (char, keyCode) => {
  return /^[a-z0-9ñÑ]$/i.test(char) || keyCode === 32 || keyCode === 8;
};

const handleKeyPress = (event) => {
  if (!isAllowedKey(event.key, event.keyCode)) {
    event.preventDefault();
  }
};

const sanitizeInput = (input) => {
  return input.replace(/[^a-z0-9ñÑ\s]/gi, '');
};

const CustomSelect = ({ options, onSearch, filterOption, ...props }) => {
  const customOnSearch = (value) => {
    const sanitizedValue = sanitizeInput(value);
    if (onSearch) onSearch(sanitizedValue);
  };

  const customFilterOption = (input, option) => {
    const sanitizedInput = sanitizeInput(input).toLowerCase();
    const labelLowerCase = (option?.label ?? '').toLowerCase();
    return labelLowerCase.includes(sanitizedInput);
  };

  return (
    <Select
      {...props}
      onSearch={customOnSearch}
      filterOption={customFilterOption}
      onInputKeyDown={handleKeyPress}
    >
      {options.map((opt) => (
        <Option key={opt.value} value={opt.value} label={opt.label}>
          {opt.label}
        </Option>
      ))}
    </Select>
  );
};

export default CustomSelect;
