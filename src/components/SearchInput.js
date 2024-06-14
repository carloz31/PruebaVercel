import React from "react";
import { Input } from "antd";
import { SearchOutlined } from '@ant-design/icons';



const SearchInput = ({ value, onChange, onSearch, placeholder}) => {
  const isAllowedKey = (char, keyCode) => {
    return /^[a-z0-9ñÑ]$/i.test(char) || keyCode === 32 || keyCode === 8;
  };
  
  const handleKeyPress = (event) => {
    if (!isAllowedKey(event.key, event.keyCode)) {
      event.preventDefault();
    }
  };
  return (
    <Input
      placeholder={placeholder || "Buscar"}
      value={value}
      onChange={onChange}
      onPressEnter={onSearch}
      onKeyDown={handleKeyPress}
      prefix={<SearchOutlined />}
    />
  );
};

export default SearchInput;
