"use client";
import { useUser } from "@/context/UserContext";
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState, Suspense } from "react";
import { Button, Typography, Spin, List, Avatar, Collapse, Input, Row, Col, Drawer, Select } from "antd";
import { useRouter } from 'next/navigation';
import axios from '@/utils/axiosConfig';
import { coordinadorItems } from "@/utils/menuItems";
import { tutorBreadcrumbNames } from "@/utils/breadcrumbNames";
import CardSolicitud from "@/components/cards/cardSolicitudDerivacion";
import {
  RightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

function Derivaciones() {
  const [isLoading, setIsLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("Todos los estados");
  const [nombreFiltro, setNombreFiltro] = useState("");
  const [programaFiltro, setProgramaFiltro] = useState(null);
  const [oficinaFiltro, setOficinaFiltro] = useState(null);
  const [tipoTutoriaFiltro, setTipoTutoriaFiltro] = useState(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user && user?.id) {
      const getSolicitudes = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `/fichaDerivacionDTOApi/listarSolicitudesDerivacion`,
          );
          setSolicitudes(response.data);
          setSolicitudesFiltradas(response.data);
          console.log(response.data);
        } catch (error) {
          console.error(
            "Error al obtener las solicitudes de derivacion",
            error,
          );
        } finally {
          setIsLoading(false);
        }
      };

      getSolicitudes();
    }
  }, [user]);

  const ordenarSolicitudes = () => {
    const ordenadas = [...solicitudesFiltradas].sort((a, b) => {
      const fechaA = new Date(a.fichaDerivacion.fecha_modificacion);
      const fechaB = new Date(b.fichaDerivacion.fecha_modificacion);
      return ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    });
    setSolicitudesFiltradas(ordenadas);
    setOrdenAscendente(!ordenAscendente);
  };

  const filtrarSolicitudes = (nombre, estado) => {
    let filtered = solicitudes;

    if (estado !== "Todos los estados") {
      filtered = filtered.filter(
        (solicitud) => solicitud.fichaDerivacion.estado === estado,
      );
    }

    if (nombre) {
      filtered = filtered.filter((solicitud) => {
        const nombreCompleto =
          `${solicitud.alumno.nombre} ${solicitud.alumno.apellidoPaterno} ${solicitud.alumno.apellidoMaterno}`.toLowerCase();
        return nombreCompleto.includes(nombre.toLowerCase());
      });
    }

    setSolicitudesFiltradas(filtered);
  };

  const handleNombreSearch = (value) => {
    setNombreFiltro(value);
    filtrarSolicitudes(value, estadoFiltro);
  };

  const handleEstadoChange = (value) => {
    setEstadoFiltro(value);
    filtrarSolicitudes(nombreFiltro, value);
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={coordinadorItems} breadcrumbNames={tutorBreadcrumbNames}>
        <Title style={{ color: "#043B71" }}>Solicitudes de Derivacion</Title>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <div>
            <Row
              justify="space-between"
              align="middle"
              gutter={16}
              style={{ marginBottom: "24px" }}
            >
              <Col span={12}>
                <Input.Search
                  placeholder="Buscar por nombre"
                  onSearch={handleNombreSearch}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={6}>
                <Select
                  defaultValue="Todos los estados"
                  style={{ width: "100%" }}
                  onChange={handleEstadoChange}
                >
                  <Option value="Todos los estados">Todos los estados</Option>
                  <Option value="Pendiente">Pendiente</Option>
                  <Option value="Aprobada">Aprobada</Option>
                  <Option value="Aceptada">Aceptada</Option>
                  <Option value="Rechazada">Rechazada</Option>
                  <Option value="Finalizada">Finalizada</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Button
                  style={{ width: "100%" }}
                  icon={<ClockCircleOutlined />}
                  onClick={ordenarSolicitudes}
                >
                  {ordenAscendente
                    ? "Ordenar de más antiguo a más reciente"
                    : "Ordenar de más reciente a más antiguo"}
                </Button>
              </Col>
            </Row>
            <p style={{ marginBottom: "24px" }}>
              Se obtuvo {solicitudesFiltradas.length} resultado(s)
            </p>
            <List
              itemLayout="horizontal"
              dataSource={solicitudesFiltradas}
              pagination={{ position: "bottom", align: "center", pageSize: 10 }}
              renderItem={(item) => (
                <List.Item style={{ marginBottom: "0", padding: "0" }}>
                  <Collapse
                    size="large"
                    bordered={true}
                    expandIconPosition="left"
                    expandIcon={({ isActive }) => (
                      <div
                        style={{
                          fontSize: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          marginRight: "16px",
                        }}
                      >
                        {" "}
                        {/* Ajusta el tamaño aquí */}
                        <RightOutlined rotate={isActive ? 90 : 0} />
                      </div>
                    )}
                    style={{ width: "100%", background: "#ffffff" }}
                  >
                    <Panel
                      header={<CardSolicitud solicitud={item} />}
                      style={{ background: "#F2F3F7" }}
                      key={item.id}
                    >
                      <Row>
                        <Col
                          span={4}
                          style={{
                            textAlign: "left",
                            paddingRight: "10px",
                            marginLeft: 40,
                          }}
                        >
                          <strong>Solicitud realizada por:</strong>
                        </Col>
                        <Col
                          span={4}
                          style={{ textAlign: "left", paddingLeft: "10px" }}
                        >
                          {`${item.tutor.nombre} ${item.tutor.apellidoPaterno} ${item.tutor.apellidoMaterno}`}
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          span={4}
                          style={{
                            textAlign: "left",
                            paddingRight: "10px",
                            marginLeft: 40,
                          }}
                        >
                          <strong>Tipo Tutoria:</strong>
                        </Col>
                        <Col
                          span={4}
                          style={{ textAlign: "left", paddingLeft: "10px" }}
                        >
                          {item.tipoTutoria.descripcion}
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          span={4}
                          style={{
                            textAlign: "left",
                            paddingRight: "10px",
                            marginLeft: 40,
                          }}
                        >
                          <strong>Programa:</strong>
                        </Col>
                        <Col
                          span={4}
                          style={{ textAlign: "left", paddingLeft: "10px" }}
                        >
                          {item.especialidad.nombre}
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>
                </List.Item>
              )}
            />
          </div>
        )}
      </LayoutComponent>
    </main>
  );
}

function DerivacionesWrapper() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      }
    >
      <Derivaciones />
    </Suspense>
  );
}

export default DerivacionesWrapper;
