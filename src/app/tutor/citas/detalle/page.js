"use client";
//prueba
import dynamic from 'next/dynamic';
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Typography,
  Modal,
  Input,
  Divider,
  Radio,
  Space,
  Alert,
} from "antd";
import axios from "axios";
import { tutorItems } from "@/utils/menuItems";
import CardDetalleCita from "@/components/cards/cardDetalleCita";
import CardCitaAlumno from "@/components/cards/cardCitaAlumno";
import {IconChevronRight, IconDownload, IconInfoCircle, IconLoader} from "@tabler/icons-react";
import Paragraph from "antd/es/typography/Paragraph";
const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(pkg => pkg.PDFDownloadLink), {
  ssr: false
});
import PDF from "@/app/tutor/citas/detalle/pdf";
import Link from "next/link";

const { Title } = Typography;

const planAccion = {
  id: 1,
  titulo: "Plan para mejorar rendimiento académico",
  descripcion: "Esto ayudará a mejorar progresivamente el desempeño en evaluaciones",
  fechaCreacion: "2024-05-10T09:24:22.000+00:00",
  fechaFinalizacion: "2024-05-20",
  estado: "Inicio",
  gruposCompromisos: [
    {
      id: 1,
      titulo: "Compromisos académicos",
      fechaCreacion: "2024-05-10T09:28:23.000+00:00",
      compromisos: [
        {
          id: 1,
          descripcion: "Armar un calendario de estudios",
          estado: "INICIO"
        }
      ]
    },
    {
      id: 2,
      titulo: "Compromisos personales",
      fechaCreacion: "2024-05-10T09:28:35.000+00:00",
      compromisos: [
        {
          id: 2,
          descripcion: "Meditar 10 minutos al despertarse",
          estado: "INICIO"
        }
      ]
    }
  ],
  progreso: 0.0
};

const alumno = {
  nombre: "Juan Pérez García",
  codigo: "43587434",
  especialidad: "Ingeniería de Sistemas",
  correo: "a20201233@pucp.edu.pe"
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [asistencia, setAsistencia] = useState("Presente");

  const onChangeAsistencia = (e) => {
    setAsistencia(e.target.value);
  };

  const get = async () => {
    setIsLoading(true);
  };

  useEffect(() => {
    get();
  }, []);



  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent
        siderItems={tutorItems}
      >
        <Title style={{ color: "#043B71" }}>Detalle de Cita</Title>
        <Flex gap="small" vertical>
          <Flex gap="middle">
            <CardDetalleCita></CardDetalleCita>
            <CardCitaAlumno alumno={alumno}></CardCitaAlumno>
          </Flex>
          <Divider />
          <Flex left vertical>
            <Title level={2} style={{ color: "#043B71", marginBottom: 0 }}>
              Resultados
            </Title>
            <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
              Asistencia
            </Title>
            <Radio.Group
              onChange={onChangeAsistencia}
              defaultValue="Presente"
              buttonStyle="solid"
            >
              <Radio.Button value="Presente">Presente</Radio.Button>
              <Radio.Button value="Ausente">Ausente</Radio.Button>
            </Radio.Group>
            <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
              Comentarios
            </Title>
            <Input.TextArea
              rows={4}
              placeholder="Añade una breve descripción u observaciones"
              style={{ resize: "none" }}
            />   
            <Paragraph style={{ color: "gray", marginTop: 6}}>
              Nota: el contenido de estos comentarios es completamente privado para el tutor
            </Paragraph>
            <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
              Toma de acciones
            </Title>
            <Flex gap="small">
              <PDFDownloadLink document={<PDF planAccion={planAccion}/>} fileName="plan-de-accion.pdf">
                {({ loading, url, blob, error }) =>
                  loading ? (
                      <Button icon={<IconLoader size={20} />} />
                    ) : (
                      <Button icon={<IconDownload size={20} />} />
                    )
                }
              </PDFDownloadLink>
              <Button
                icon={<IconChevronRight size={20} />}
                iconPosition="end"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                Plan de Acción
              </Button>
              <Button icon={<IconDownload size={20} />} />
              <Button
                icon={<IconChevronRight size={20} />}
                iconPosition="end"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                Derivación a unidades de apoyo
              </Button>
            </Flex>
            <Flex justify="center">
              <Button type="primary" style={{ marginTop: 20 }}>
                Guardar
              </Button>
              <Button style={{ marginTop: 20, marginLeft: 10 }}>
                <Link href={"/tutor/citas"}>Cancelar</Link>
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </LayoutComponent>
    </main>
  );
}
