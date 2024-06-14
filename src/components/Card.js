"use client";
import React, { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";

const Card = () => {
  const [alumnos, setAlumnos] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleListarClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/alumnoApi/listarTodosAlumnos`);
      setAlumnos(response.data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div className="bttnContainer">
        <h1 className="labelLista">Lista de Alumnos</h1>
        <button
          className="bttnLista"
          onClick={handleListarClick}
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Listar Alumnos"}
        </button>
      </div>

      <div className="card-container">
        {alumnos.map((alumno) => (
          <div className="card" key={alumno.dni}>
            <h2>
              {alumno.nombre} {alumno.apellidoPaterno} {alumno.apellidoMaterno}
            </h2>
            <p>Teléfono: {alumno.telefono}</p>
            <p>Ciclo de Estudios: {alumno.cicloEstudios}</p>
            <p>DNI: {alumno.dni}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
