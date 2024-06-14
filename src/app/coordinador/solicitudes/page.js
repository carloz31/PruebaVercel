"use client";
import React, { useEffect, useState } from "react";
import LayoutComponent from "@/components/LayoutComponent";
import { Button, Typography, message, Spin } from "antd";
import axios from "@/utils/axiosConfig";
import { coordinadorItems } from "@/utils/menuItems";
import CardAlumnoCoordiSolicitud from "@/components/cards/cardAlumnoCoordiSolicitud";
import CustomSelect from "@/components/coordinador/CustomSelect";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import "./App.css";
import "@/components/cards/cardAlumnoCoordi.css";

const { Title, Text } = Typography;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTipoTutoria, setSelectedTipoTutoria] = useState(null);
  const [tiposTutoria, setTiposTutoria] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [tutores, setTutores] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const get = async () => {
    debugger
    if(user?.rolSeleccionado !== 2 && user?.rolSeleccionado !== 5){ //no está con rol de coordinador
      router.back(); //regresa a la página anterior
      return;
    }
    setIsLoading(true);
    try {
      const tipoTutoriaResponse = await axios.get(`/tipoTutoriaApi/listarTiposTutoriaTutorAsignadoPorCoordinador/${user.id}/${user.rolSeleccionado}`);
      setTiposTutoria(tipoTutoriaResponse.data);
      await getSolicitudes(null, null); // Fetch inicial sin filtros aplicados
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

  const getSolicitudes = async (selectedTipoTutoria, selectedTutor) => {
    setIsLoading(true);
    try {
      let url = `/asignacionApi/listarSolicitudes/${user.id}`;

      if (selectedTipoTutoria) {
        console.log('Tipo de tutoría seleccionado:', selectedTipoTutoria.idTipoTutoria);
        url += `?idTipoTutoria=${selectedTipoTutoria.idTipoTutoria}`;
        if (selectedTutor) {
          console.log("tutor");
          url += `&idTutor=${selectedTutor.persona.id}`;
        }
      }

      const response = await axios.get(url);
      setSolicitudes(response.data);
    } catch (error) {
      console.error("Error fetching solicitudes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTipoTutoriaChange = async (value) => {
    debugger;
    const numericValue = Number(value);
    const selectedTipo = tiposTutoria.find(
      (tipo) => tipo.idTipoTutoria === numericValue,
    );
    try {
      //trae los tutores del tipo de tutoria seleccionado
      const response_tutor = await axios.get(
        `/tutorApi/listarTutorPorTipoTutoria/${selectedTipo.idTipoTutoria}`,
      );
      setTutores(response_tutor.data);
    } catch (error) {
      console.error("Error trayendo tutores del tipo de tutoria:", error);
    } finally {
      setIsLoading(false);
    }
    setSelectedTutor(null);
    setSolicitudes([]);
    setSelectedTipoTutoria(selectedTipo || null);
  };

  const handleRejectSolicitud = async (idSolicitud) => {
    setIsLoading(true);
    try {
      await axios.post(
        `/asignacionApi/cambiarEstadoSolicitud/${idSolicitud}/Rechazada`,
      );
      await getSolicitudes(selectedTipoTutoria, selectedTutor); // Vuelve a cargar las solicitudes
      message.success("La solicitud fue rechazada exitosamente.");
    } catch (error) {
      console.error("Error al rechazar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSolicitud = async (idSolicitud) => {
    setIsLoading(true);
    try {
      await axios.post(
        `/asignacionApi/cambiarEstadoSolicitud/${idSolicitud}/Aprobada`,
      );
      await getSolicitudes(selectedTipoTutoria, selectedTutor); // Vuelve a cargar las solicitudes
      message.success("La solicitud fue aprobada exitosamente.");
    } catch (error) {
      console.error("Error al aprobar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTipoTutoria || selectedTutor) {
      getSolicitudes(selectedTipoTutoria, selectedTutor);
    }
  }, [selectedTipoTutoria, selectedTutor]);

  const handleSelectTutor = (value) => {
    const tutor = tutores.find((t) => t.id === Number(value));
    setSelectedTutor(tutor || null);
  };

  const tipoTutoriaOptions = tiposTutoria.map((tipo) => ({
    value: tipo.idTipoTutoria.toString(),
    label: tipo.nombre,
  }));

  const tutorOptions = selectedTipoTutoria
    ? tutores.map((tutor) => ({
        value: tutor.id.toString(),
        label: `${tutor.persona.nombre} ${tutor.persona.apellidoPaterno}`,
      }))
    : [];

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={coordinadorItems} showFooter={false}>
        <Title
          className="font-semibold"
          style={{ color: "#043b71", textAlign: "left" }}
        >
          Gestionar Solicitudes
        </Title>

        <div className="dropdownContainerStyle">
          <Text strong className="titleText">
            Tipo de Tutoría:
          </Text>
          <CustomSelect
            showSearch
            placeholder="Seleccione el tipo de tutoría"
            className="dropdownStyle"
            options={tipoTutoriaOptions}
            onChange={handleTipoTutoriaChange}
            value={
              selectedTipoTutoria
                ? selectedTipoTutoria.idTipoTutoria.toString()
                : undefined
            }
          />
        </div>

        <div className="dropdownContainerStyle">
          <Text strong className="titleText">
            Tutor:
          </Text>
          <CustomSelect
            showSearch
            placeholder="Busque al tutor por código o nombre"
            className="dropdownStyle"
            options={tutorOptions}
            onChange={handleSelectTutor}
            value={selectedTutor ? selectedTutor.id.toString() : undefined}
            disabled={!selectedTipoTutoria}
          />
        </div>

        <div className="cards-container">
          {solicitudes.map((solicitud) => (
            <CardAlumnoCoordiSolicitud
              key={solicitud.id}
              solicitud={solicitud}
              onReject={handleRejectSolicitud}
              onApprove={handleApproveSolicitud}
            />
          ))}
        </div>
      </LayoutComponent>
    </main>
  );
}
