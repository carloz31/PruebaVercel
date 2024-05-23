"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Typography, Card, Avatar, Spin, Flex, Button } from 'antd';
import LayoutComponent from "@/components/LayoutComponent";
import { tutorItems } from "@/utils/menuItems";
import Documentos from "@/components/Expediente";
import Link from "next/link";

const { Title } = Typography;

function AlumnoPerfil() {
  const [alumno, setAlumno] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const user = JSON.parse(searchParams.get('user'));
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchAlumno = async (id) => {
      setIsLoading(true);
      try {
        console.log(id);
        const response = await axios.get(`${process.env.backend}/alumnoApi/buscarAlumno/${id}`);
        setAlumno(response.data);
        const resDoc = await axios.get(`${process.env.backend}/planDeAccionApi/listarPlanesAccionPorIdAlumno/${id}`);
        
        const data = resDoc.data.map((documento) => ({
          key: documento.id,
          id: documento.id,
          titulo: documento.titulo,
          tipo: "Plan de Acción",
          acciones: ['visualizar', 'descargar']
        }));
        console.log(data);  
        setDocumentos(data);
        console.log(documentos);
      } catch (error) {
        console.error('Error fetching alumno details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAlumno(id);
    }
  }, [id]);

  if (isLoading || !alumno) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <LayoutComponent siderItems={tutorItems} showFooter={false}>
      <Flex style={{ alignItems: "center" }}>
        <Title style={{ textAlign: "left", color: '#043b71' }}>Perfil del Estudiante</Title>
      </Flex>
      <Card title={<Title level={3} style={{ textAlign: "left" }}>{alumno.nombre} {alumno.apellidoPaterno} {alumno.apellidoMaterno}</Title>} style={{ width: "100%", fontFamily: 'Nunito, sans-serif', color: 'black' }}>
        <Flex style={{ display: "flex", justifyContent: "flex-start" }}>
          <Flex>
            <Avatar size={100} style={{ backgroundColor: 'gray', verticalAlign: 'middle', color: 'black' }}>
              {`${alumno.nombre.charAt(0)}${alumno.apellidoPaterno.charAt(0)}`}
            </Avatar>
          </Flex>
          <div style={{ textAlign: "left", marginLeft: "50px" }}>
            <p>Código:</p>
            <p>Especialidad:</p>
            <p>Correo académico:</p>
            <p>Celular:</p>
            <p>Condición:</p>
          </div>
          <div style={{ textAlign: "left", marginLeft: "50px" }}>
            <p style={{ fontWeight: "bold" }}>{user.codigo}</p>
            <p style={{ fontWeight: "bold" }}>{alumno.especialidad.nombre}</p>
            <p style={{ fontWeight: "bold" }}>{user.correo}</p>
            <p style={{ fontWeight: "bold" }}>{alumno.telefono}</p>
            <p style={{ fontWeight: "bold" }}>{alumno.tipoAlumno.nombre}</p>
          </div>
        </Flex>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
          <Link href={{
            pathname: `/tutor/alumnos/perfil/historial-academico`,
            query: {
              id: alumno.id,
              nombre: alumno.nombre,
              apellido: alumno.apellidoPaterno + ' ' + alumno.apellidoMaterno,
              codigo: user.codigo
            },
          }} style={{ flex: 1, marginRight: "10px" }}>
            <Button type="primary" size="large" style={{ fontFamily: 'Nunito, sans-serif', flex: 1, marginRight: "10px", borderColor: "black", color: "black", backgroundColor: "white", width: '100%' }}>Ver Historial Académico</Button>
          </Link>
          <Button type="primary" size="large" style={{ fontFamily: 'Nunito, sans-serif', flex: 1 }}>Ver Historial de Citas</Button>
        </div>
      </Card>
      <Card title={<Title level={2} style={{ textAlign: "left", color: '#043b71' }}>Expediente</Title>} style={{ color: '#043b71', width: "100%", fontFamily: 'Nunito, sans-serif', marginTop: "20px" }}>
        <Documentos docs={documentos} />
      </Card>
    </LayoutComponent>
  );
}

function AlumnoPerfilWrapper() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><Spin size="large" /></div>}>
      <AlumnoPerfil />
    </Suspense>
  );
}

export default AlumnoPerfilWrapper;
