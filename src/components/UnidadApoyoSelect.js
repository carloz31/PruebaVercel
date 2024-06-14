import React, { useState, useEffect } from "react";
import { Select } from "antd";
import axios from "@/utils/axiosConfig";

const UnidadApoyoSelect = ({ value, onChange, disabled }) => {
  const [unidadesApoyo, setUnidadesApoyo] = useState([]);

  useEffect(() => {
    const fetchUnidadesApoyo = async () => {
      try {
        const response = await axios.get(
          `/unidadApoyoApi/listarTodosUnidadesDeApoyo`,
        );
        setUnidadesApoyo(response.data);
      } catch (error) {
        console.error("Error al obtener las unidades de apoyo:", error);
      }
    };

    fetchUnidadesApoyo();
  }, []);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="Seleccionar la unidad de apoyo a la que deriva..."
      style={{ width: "100%" }}
      disabled={disabled}
    >
      {unidadesApoyo.map((unidad) => (
        <Select.Option key={unidad.id} value={unidad.id}>
          {unidad.nombre}
        </Select.Option>
      ))}
    </Select>
  );
};

export default UnidadApoyoSelect;
