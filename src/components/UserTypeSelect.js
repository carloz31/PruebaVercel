import React from "react";
import { Select } from "antd";

const UserTypeSelect = ({ value, onChange}) => {
  return (
    <Select
      value={value}
      onChange={(value) => {
        onChange(value);
      }}
      style={{ width: 500, marginLeft: 10 }}
      placeholder="Seleccione el tipo de usuario"
    >
      <Select.Option value="">Todos</Select.Option>
      <Select.Option value="Alumno">Alumno</Select.Option>
      <Select.Option value="Tutor">Tutor</Select.Option>
    </Select>
  );
};

export default UserTypeSelect;