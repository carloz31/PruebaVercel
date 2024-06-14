'use client';
import React, { useEffect, useState } from 'react';
import LayoutComponent from "@/components/LayoutComponent";
import { Button, Typography, message, Spin } from "antd";
import axios from '@/utils/axiosConfig';
import { coordinadorItems } from "@/utils/menuItems";
import CardAlumnoCoordi from "@/components/cards/cardAlumnoCoordi";
import CustomSelect from '@/components/coordinador/CustomSelect';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import './App.css';
import '@/components/cards/cardAlumnoCoordi.css'; 

const { Title, Text } = Typography;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTipoTutoria, setSelectedTipoTutoria] = useState(null);
  const [tiposTutoria, setTiposTutoria] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedAlumnos, setSelectedAlumnos] = useState([]);
  const [asignacionesDelTutor, setAsignacionesDelTutor] = useState([]);
  const [alumnoDropdownValue, setAlumnoDropdownValue] = useState(undefined);
  const [alumnosAsignadosDelTutor, setAlumnosAsignadosDelTutor] = useState([]);
  const [tempRemovedAlumnos, setTempRemovedAlumnos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [tutores, setTutores] = useState([]);
  const { user } = useUser();
  const router = useRouter();
 
  const get = async () => {
    if(user?.rolSeleccionado !== 2 && user?.rolSeleccionado !== 5){ //no está con rol de coordinador
      router.back(); //regresa a la página anterior
      return;
    }
    setIsLoading(true);
    try {
      // Trae los tipos de tutoria que puede gestionar el asesor (de la especialidad o facultad, esencialmente)
      const response = await axios.get(`/tipoTutoriaApi/listarTiposTutoriaTutorAsignadoPorCoordinador/${user.id}/${user.rolSeleccionado}`);
      setTiposTutoria(response.data);
    } catch (error) {
      console.error('Error fetching tiposTutoria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(user && user.id){
      get();
    }
  }, [user]);


  const handleTipoTutoriaChange = async(value) => {
    const numericValue = Number(value);
    const selectedTipo = tiposTutoria.find(tipo => tipo.idTipoTutoria === numericValue);
    try { //trae los tutores y alumnos sin asignar del tipo de tutoria seleccionado
      const [response_tutor, response_alumno] = await Promise.all([
        axios.get(`/tutorApi/listarTutorPorTipoTutoria/${selectedTipo.idTipoTutoria}`),
        axios.get(`/alumnoApi/listarAlumnosSinAsignar/${selectedTipo.idTipoTutoria}`)
      ]);
      setAlumnos(response_alumno.data);
      setTutores(response_tutor.data);
    } catch (error) {
      console.error('Error trayendo miembros del tipo de tutoria:', error);
    } finally {
      setIsLoading(false);
    }
    setSelectedTutor(null);
    setSelectedAlumnos([]);
    setAlumnoDropdownValue(undefined);
    setAlumnosAsignadosDelTutor([]);
    setTempRemovedAlumnos([]);
    setSelectedTipoTutoria(selectedTipo || null);
  };

  const handleSelectAlumno = (value) => {
    setAlumnoDropdownValue(value);
    const alumno = alumnos.find(a => a.persona.id.toString() === value);
    if (alumno && !selectedAlumnos.find(a => a.persona.id === alumno.persona.id)) {
      setSelectedAlumnos([...selectedAlumnos, alumno]);
    }
  };

  const handleSelectTutor = (value) => {
    const tutor = tutores.find(t => t.id === Number(value));
    setSelectedTutor(tutor);
    axios.get(`/alumnoApi/listarAlumnosAsignadosPorTutorPorTipoTutoria/${tutor.persona.id}/${selectedTipoTutoria.idTipoTutoria}`)
      .then(response => setAlumnosAsignadosDelTutor(response.data))
      .catch(error => {
        console.error('Error fetching alumnos asignados:', error);
        setAlumnosAsignadosDelTutor([]);
      });

    const asignacionesUrl = `/asignacionApi/listarAsignacionesTutorPorTipoTutoria/${tutor.persona.id}/${selectedTipoTutoria.idTipoTutoria}`;
    axios.get(asignacionesUrl)
      .then(response => setAsignacionesDelTutor(response.data))
      .catch(error => {
        console.error('Error fetching asignaciones del tutor:', error);
        setAsignacionesDelTutor([]);
      });
  };

  const handleRemoveAlumno = id => {
    if (alumnoDropdownValue === id.toString()) {
      setAlumnoDropdownValue(undefined);
    }
    const alumnoToRemove = asignacionesDelTutor.find(asignacion => asignacion.alumno.id === id);
    if (alumnoToRemove) {
      setTempRemovedAlumnos([...tempRemovedAlumnos, alumnoToRemove]);
    }
    setSelectedAlumnos(selectedAlumnos.filter(alumno => alumno.persona.id !== id));
  };

  const handleReAddAlumno = (id) => {
    const alumnoToReAdd = tempRemovedAlumnos.find(a => a.alumno.id === id);
    if (alumnoToReAdd) {
      setTempRemovedAlumnos(tempRemovedAlumnos.filter(a => a.alumno.id !== id));
    }
  };

  const handleCancel = () => {
    setSelectedTipoTutoria(null);
    setSelectedTutor(null);
    setSelectedAlumnos([]);
    setAlumnoDropdownValue(undefined);
    setAlumnosAsignadosDelTutor([]);
    setTempRemovedAlumnos([]);
  };

  const eliminarAsignacionesExistentes = async () => {
    const requests = tempRemovedAlumnos.map(asignacion =>
      axios.delete(`/asignacionApi/borrarAsignacion/${asignacion.id}`)
    );

    try {
      await Promise.all(requests);
    } catch (error) {
      //console.error('Error removing alumnos:', error);
      message.error("Hubo un error al remover algunas asignaciones.");
    }
  };

  const handleGuardarCambios = async () => {
    if ((!selectedTipoTutoria || !selectedTutor || selectedAlumnos.length === 0) && tempRemovedAlumnos.length === 0) {
      message.error("Debe seleccionar un tipo de tutoría, un tutor y al menos un alumno.");
      return;
    }
    try {
      if (tempRemovedAlumnos.length > 0) {
        await eliminarAsignacionesExistentes();
      }
      if (selectedAlumnos.length > 0) {
        const dataPayload = {
          idTipoTutoria: selectedTipoTutoria.idTipoTutoria,
          idTutores: [selectedTutor.persona.id],
          idAlumnos: selectedAlumnos.map(alumno => alumno.persona.id),
        };
        await axios.post(`/llenarAsignacion`, dataPayload);
      }
      message.success("Cambios guardados exitosamente.");
      handleCancel();
      get();
    } catch (error) {
      console.error('Error saving data:', error);
      message.error("Hubo un error al guardar los cambios.");
    }
  };

  const tipoTutoriaOptions = tiposTutoria.map(tipo => ({
    value: tipo.idTipoTutoria.toString(),
    label: tipo.nombre
  }));

  const tutorOptions = selectedTipoTutoria ? tutores.map(tutor => ({
    value: tutor.id.toString(),
    label: `${tutor.persona.nombre} ${tutor.persona.apellidoPaterno}`
  })) : [];

  const alumnoOptions = selectedTipoTutoria ? alumnos.map(alumno => ({
    value: alumno.persona.id.toString(),
    label: `${alumno.codigo} ${alumno.persona.nombre} ${alumno.persona.apellidoPaterno}`
  })) : [];
  
  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={coordinadorItems} showFooter={false}>
        <Title className="font-semibold" style={{ color: '#043b71', textAlign: 'left' }}>Asignar Tutor</Title>
        <div className="dropdownContainerStyle">
          <Text strong className="titleText">Tipo de Tutoría:</Text>
          <CustomSelect
            showSearch
            placeholder="Seleccione el tipo de tutoría"
            className="dropdownStyle"
            options={tipoTutoriaOptions}
            onChange={handleTipoTutoriaChange}
            value={selectedTipoTutoria ? selectedTipoTutoria.idTipoTutoria.toString() : undefined}
          />
        </div>
        <div className="dropdownContainerStyle">
          <Text strong className="titleText">Tutor:</Text>
          <CustomSelect
            showSearch
            placeholder="Seleccione al tutor"
            className="dropdownStyle"
            options={tutorOptions}
            onChange={handleSelectTutor}
            value={selectedTutor ? selectedTutor.id.toString() : undefined}
            disabled={!selectedTipoTutoria}
          />
        </div>
        <div className="flexContainer">
          <div className="dropdownContainerStyle">
            <Text strong className="titleText">Alumno:</Text>
            <CustomSelect
              showSearch
              placeholder="Busque al alumno por código o nombre"
              className="dropdownStyle"
              options={alumnoOptions}
              onChange={handleSelectAlumno}
              value={alumnoDropdownValue}
              disabled={!selectedTipoTutoria}
            />
          </div>
          <div className="buttonContainerStyle">
            <Button className="buttonStyle" onClick={handleGuardarCambios}>Guardar Cambios</Button>
            <Button className="cancelButtonStyle" onClick={handleCancel}>Cancelar</Button>
          </div>
        </div>
        <div className="cards-container">
          {alumnosAsignadosDelTutor.map(alumno => (
            <CardAlumnoCoordi
              key={alumno.persona.id}
              alumno={alumno}
              onRemove={handleRemoveAlumno}
              onReAdd={handleReAddAlumno}
              disabled={tempRemovedAlumnos.some(a => a.alumno.id === alumno.persona.id)}
            />
          ))}
          {selectedAlumnos.map(alumno => (
            <CardAlumnoCoordi key={alumno.persona.id} alumno={alumno} onRemove={handleRemoveAlumno}
            />
          ))}
        </div>
      </LayoutComponent>
    </main>
  );
}
