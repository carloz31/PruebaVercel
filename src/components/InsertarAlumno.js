"use client";
import React, { useState } from "react";
import axios from "@/utils/axiosConfig";

export default function InsertarAlumno() {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cicloEstudios, setCicloEstudios] = useState("");
  const [dni, setDni] = useState("");

  const handleInsertarClick = async () => {
    try {
      const response = await axios.post(
        `/alumnoApi/crearAlumno`,
        {
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          telefono,
          cicloEstudios,
          historialAcademico: null,
          especialidad: {
            id: 1,
          },
          tipoAlumno: {
            id: 1,
          },
          dni,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        alert("Alumno insertado exitosamente");
        clearInput();
      } else {
        alert("Error al insertar alumno");
      }
    } catch (error) {
      console.error("Error al insertar alumno:", error);
      console.error(
        "Detalles de la respuesta del servidor:",
        error.response.data,
      );
    }
  };

  const clearInput = () => {
    setNombre("");
    setApellidoPaterno("");
    setApellidoMaterno("");
    setTelefono("");
    setCicloEstudios("");
    setDni("");
  };

  return (
    <div className="formulario inicial">
      <h1>Formulario de registro de alumno</h1>
      <div className="form">
        <div className="campo">
          <label htmlFor="nombre" className="nombre-control">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            className="nombre-control"
            onChange={(e) => setNombre(e.target.value)}
            pattern="[a-zA-Z]+"
            title="El nombre solo debe contener letras del alfabeto"
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="apellidoPaterno" className="apellidoPaterno-control">
            Apellido Paterno:
          </label>
          <input
            type="text"
            id="apellidoPaterno"
            className="apellidoPaterno-control"
            onChange={(e) => setApellidoPaterno(e.target.value)}
            pattern="[a-zA-Z]+"
            title="El apellido paterno solo debe contener letras del alfabeto"
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="apellidoMaterno" className="apellidoMaterno-control">
            Apellido Materno:
          </label>
          <input
            type="text"
            id="apellidoMaterno"
            className="apellidoMaterno-control"
            onChange={(e) => setApellidoMaterno(e.target.value)}
            pattern="[a-zA-Z]+"
            title="El apellido materno solo debe contener letras del alfabeto"
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="telefono" className="telefono-control">
            Teléfono:
          </label>
          <input
            type="text"
            id="telefono"
            className="telefono-control"
            onChange={(e) => setTelefono(e.target.value)}
            pattern="[0-9]{0,9}"
            title="El teléfono debe contener hasta 9 números"
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="cicloEstudios" className="cicloEstudios-control">
            Ciclo de Estudios:
          </label>
          <input
            type="text"
            id="cicloEstudios"
            className="cicloEstudios-control"
            onChange={(e) => setCicloEstudios(e.target.value)}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="dni" className="dni-control">
            DNI:
          </label>
          <input
            type="text"
            id="dni"
            className="dni-control"
            onChange={(e) => setDni(e.target.value)}
            pattern="[0-9]{0,8}"
            title="El DNI debe contener hasta 8 números"
            required
          />
        </div>
        <div className="bttnContainer">
          <button className="bttnInsertar" onClick={handleInsertarClick}>
            Insertar
          </button>
        </div>
      </div>
    </div>
  );
}
