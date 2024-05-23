import React from "react";
import { Input } from "antd";

const SearchInput = ({ value, onChange, onSearch }) => {
  return (
    <Input
      placeholder="Buscar"
      value={value}
      onChange={onChange}
      onPressEnter={onSearch}
    />
  );
};

export default SearchInput;
