import React, { useState, useEffect } from "react";
import { Select } from "antd";
import axios from "@/utils/axiosConfig";

const TipoTutoriaSelect = ({ value, onChange }) => {
  const [tiposTutoria, setTiposTutoria] = useState([]);

  useEffect(() => {
    const fetchTiposTutoria = async () => {
      try {
        const response = await axios.get(
          `/tipoTutoriaApi/listarTodosTiposTutoria`,
        );
        setTiposTutoria(response.data);
      } catch (error) {
        console.error("Error al obtener los tipos de tutoría:", error);
      }
    };

    fetchTiposTutoria();
  }, []);

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder="Seleccionar el tipo de tutoría que brinda el tutor..."
    >
      {tiposTutoria.map((tipo) => (
        <Select.Option key={tipo.idTipoTutoria} value={tipo.idTipoTutoria}>
          {tipo.nombre}
        </Select.Option>
      ))}
    </Select>
  );
};

export default TipoTutoriaSelect;
