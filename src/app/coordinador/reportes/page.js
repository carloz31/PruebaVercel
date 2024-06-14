"use client";
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Typography,
  Modal,
  Input,
  Select,
  DatePicker,
  Avatar,
  Space,
  Spin,
} from "antd";
import { coordinadorItems } from "@/utils/menuItems";
import { UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const { Title } = Typography;

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import axios from "@/utils/axiosConfig";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ChartTitle, // Agrega ChartTitle aquí
  Tooltip,
  Filler,
  Legend,
  ArcElement,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Cantidad de atenciones",
      font: {
        size: 24,
      },
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const dataPie = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export const optionsBar = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Atenciones por tutores",
      font: {
        size: 24,
      },
    },
  },
};

const labelsBar = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
];

export const dataBar = {
  labelsBar,
  datasets: [
    {
      label: "Dataset 1",
      data: labelsBar.map(() =>
        faker.datatype.number({ min: -1000, max: 1000 }),
      ),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labelsBar.map(() =>
        faker.datatype.number({ min: -1000, max: 1000 }),
      ),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const ItemStaditics = ({ title, value }) => (
  <Flex
    vertical
    style={{
      border: "1px solid #D3D3D3",
      padding: "10px",
      borderRadius: "10px",
      margin: "10px",
      backgroundColor: "white",
      flex: 1,
    }}
  >
    <Flex level={5} style={{ margin: 0 }} justify="space-between">
      <Title level={2} style={{ margin: 0 }}>
        {value}
      </Title>
      <Avatar
        size={64}
        icon={<UserOutlined />}
        style={{
          backgroundColor: "transparent",
          color: "black",
          border: 0,
          borderRadius: 0,
        }}
      />
    </Flex>
    <Title level={5} style={{ margin: 0 }}>
      {title}
    </Title>
  </Flex>
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [tutores, setTutores] = useState([]);
  const [tutor, setTutor] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [ciclo, setCiclo] = useState(null);
  const [ciclos, setCiclos] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [idUsuarioSesion, setIdUsuarioSesion] = useState();
  const [reporteData, setReporteData] = useState({});
  const [reporteDataTutor, setReporteDataTutor] = useState({});
  const router = useRouter();
  const { user } = useUser();

  const extractEstadoAtencionesData = () => {
    if (!reporteData || !reporteData.estadoAtenciones) {
      return {
        labels: [],
        data: [],
      };
    }

    const labels = reporteData.estadoAtenciones.map((item) => item.estado);
    const data = reporteData.estadoAtenciones.map(
      (item) => item.cantidadAtenciones,
    );

    return { labels, data };
  };

  const estadoAtencionesData = {
    labels: extractEstadoAtencionesData().labels,
    datasets: [
      {
        data: extractEstadoAtencionesData().data,
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const estadoAtencionesOptions = {
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Estado de sesiones",
        font: {
          size: 24,
        },
      },
    },
  };

  const TipoTutoriaList = ({ data }) => {
    const colors = ["#0072C6", "#002D72", "#00B5F7", "#000000"];

    return (
      <div style={{ marginLeft: "20px" }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Tipo</th>
              <th style={{ textAlign: "right", paddingRight: "50px" }}>
                Valor
              </th>
              <th style={{ textAlign: "right", paddingRight: "50px" }}>%</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: colors[index % colors.length],
                      marginRight: "5px",
                    }}
                  ></div>
                  {item.nombreTipoTutoria}
                </td>
                <td style={{ textAlign: "right", paddingRight: "50px" }}>
                  {item.cantidadAtenciones}
                </td>
                <td style={{ textAlign: "right", paddingRight: "50px" }}>
                  {item.porcentaje}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const extractTipoTutoriaData = () => {
    if (!reporteData || !reporteData.tipoTutoriaAtenciones) {
      return {
        labels: [],
        datasets: [],
        data: [],
      };
    }

    const labels = reporteData.tipoTutoriaAtenciones.map(
      (item) => item.nombreTipoTutoria,
    );
    const datasets = [
      {
        label: "Cantidad de atenciones",
        data: reporteData.tipoTutoriaAtenciones.map(
          (item) => item.cantidadAtenciones,
        ),
        backgroundColor: [
          "#000000",
          "#0072C6",
          "#00B5F7",
          "#7030A0",
          "#002D72",
          "#00B050",
        ],
      },
    ];

    const totalAtenciones = reporteData.tipoTutoriaAtenciones.reduce(
      (sum, item) => sum + item.cantidadAtenciones,
      0,
    );

    const data = reporteData.tipoTutoriaAtenciones.map((item) => ({
      ...item,
      porcentaje: ((item.cantidadAtenciones / totalAtenciones) * 100).toFixed(
        1,
      ),
    }));

    return { labels, datasets, data };
  };

  const tipoTutoriaData = {
    labels: extractTipoTutoriaData().labels,
    datasets: extractTipoTutoriaData().datasets,
  };

  const tipoTutoriaOptions = {
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Tipos de tutoría",
        font: {
          size: 24,
        },
      },
    },
  };

  const extractTutorBarChartData = () => {
    if (!reporteData || !reporteData.tutorAtenciones) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = reporteData.tutorAtenciones.map(
      (item) => item.nombreCompletoTutor,
    );
    const datasets = [
      {
        label: "Cantidad de atenciones",
        data: reporteData.tutorAtenciones.map(
          (item) => item.cantidadAtenciones,
        ),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ];

    return { labels, datasets };
  };

  const barChartData = {
    labels: extractTutorBarChartData().labels,
    datasets: extractTutorBarChartData().datasets,
  };

  const extractLineChartDataTutor = () => {
    if (!reporteDataTutor || !reporteDataTutor.fechaAtenciones) {
      return {
        labels: [],
        data: [],
      };
    }

    const fechaAtenciones = [...reporteDataTutor.fechaAtenciones];
    fechaAtenciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const labels = fechaAtenciones.map((item) => item.fecha);
    const data = fechaAtenciones.map((item) => item.cantAtenciones);

    return { labels, data };
  };

  const lineChartDataTutor = {
    labels: extractLineChartDataTutor().labels,
    datasets: [
      {
        fill: true,
        label: "Atenciones por fecha",
        data: extractLineChartDataTutor().data,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const extractLineChartData = () => {
    if (!reporteData || !reporteData.fechaAtenciones) {
      return {
        labels: [],
        data: [],
      };
    }

    const fechaAtenciones = [...reporteData.fechaAtenciones];
    fechaAtenciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const labels = fechaAtenciones.map((item) => item.fecha);
    const data = fechaAtenciones.map((item) => item.cantAtenciones);

    return { labels, data };
  };

  const lineChartData = {
    labels: extractLineChartData().labels,
    datasets: [
      {
        fill: true,
        label: "Atenciones por fecha",
        data: extractLineChartData().data,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const clearChartData = () => {
    setReporteData({
      alumnosAtendidos: 0,
      tutoresDisponibles: 0,
      ratioAlumnoTutor: 0,
    });
  };

  const verifyReporteData = () => {
    if (!reporteData) {
      clearChartData();
    }
  };
  useEffect(() => {
    // Limpiar el rango de fechas y el tutor seleccionado cuando cambia el ciclo
    setDateRange([]);
    setTutor(null);
    setReporteDataTutor({});
  }, [ciclo]);

  const generateReport = async () => {
    setIsLoading(true);
    if (user && ciclo) {
      try {
        const response = await axios.get(
          `/reporteApi/traerDatosReporteGeneral/${user.id}/${ciclo}`,
        );
        if (response.data) {
          setReporteData(response.data);
        } else {
          clearChartData();
        }
      } catch (error) {
        console.error("Error al generar el reporte:", error);
        clearChartData();
      }
    }

    if (
      tutor &&
      dateRange[0].format("YYYY-MM-DD") &&
      dateRange[1].format("YYYY-MM-DD")
    ) {
      try {
        const response = await axios.get(
          `${process.env.backend}/reporteApi/traerDatosReporteTutor/${
            user.id
          }/${tutor}/${dateRange[0].format("YYYY-MM-DD")}/${dateRange[1].format(
            "YYYY-MM-DD"
          )}`
        );
        if (response.data) {
          setReporteDataTutor(response.data);
          console.log("reporteDataTutor", reporteDataTutor);
        }
      } catch (error) {
        console.error("Error al generar el reporte:", error);
      }
    }

    setIsLoading(false);
    verifyReporteData();
  };

  useEffect(() => {
    if (ciclo || user || dateRange.length === 2 || tutor) {
      generateReport();
    }
  }, [ciclo, user, dateRange, tutor]);

  useEffect(() => {
    const id = localStorage.getItem("userID");
    if (id !== null && id !== undefined) {
      setIdUsuarioSesion(id);
    } else {
      console.log("No hay nada");
      //router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (user && user.id) {
      fetchTutores();
      fetchCiclos();
    }
  }, [user]);

  const fetchTutores = async () => {
    try {
      const response = await axios.get(`/tutorApi/listarTodosTutores`);
      setTutores(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de tutores:", error);
    }
  };

  const fetchCiclos = async () => {
    try {
      const response = await axios.get(`/semestreApi/listarTodosSemestres`);
      const ciclosOrdenados = response.data.sort((a, b) => {
        const [anioA, periodoA] = a.nombre.split("-");
        const [anioB, periodoB] = b.nombre.split("-");
        if (anioA !== anioB) {
          return anioB - anioA;
        }
        return periodoB - periodoA;
      });
      setCiclos(ciclosOrdenados);
      setCiclo(ciclosOrdenados[0]?.id);
    } catch (error) {
      console.error("Error al obtener la lista de ciclos:", error);
    }
  };

  return (
    <main style={{ height: "100vh", fontFamily: "Nunito, sans-serif" }}>
      <LayoutComponent siderItems={coordinadorItems}>
        {!showDetails ? (
          <div>
            <Flex style={{ padding: "20px" }} justify="space-between">
              <Flex
                justify="space-between"
                align="left"
                style={{ marginBottom: "20px" }}
                vertical
              >
                <Title
                  level={2}
                  style={{ margin: 0, flex: 1, color: "#043B71" }}
                >
                  Reportes
                </Title>
                <Title
                  level={3}
                  style={{ margin: 0, marginBottom: "20px", color: "#043B71" }}
                >
                  Dashboard: Ingeniería Informática
                </Title>
              </Flex>

              <Flex
                justify="center"
                align="right"
                style={{ marginBottom: "20px" }}
                vertical
              >
                <Title level={4} style={{ margin: 0, color: "#161616" }}>
                  Ciclo
                </Title>
                <Select
                  value={ciclo}
                  onSelect={(value) => setCiclo(value)}
                  placeholder="Seleccionar ciclo"
                  style={{ width: "200px" }}
                  allowClear
                >
                  {ciclos.map((ciclo) => (
                    <Select.Option key={ciclo.id} value={ciclo.id}>
                      {ciclo.nombre}
                    </Select.Option>
                  ))}
                </Select>
              </Flex>
              <Button
                type="primary"
                onClick={() => setShowDetails(true)}
                style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "20px",
                  zIndex: 1,
                }}
              >
                Ver detalles
              </Button>
            </Flex>
            <Flex style={{ width: "100%" }}>
              <ItemStaditics
                title="Alumnos atendidos"
                value={reporteData?.alumnosAtendidos || 0}
              />
              <ItemStaditics
                title="Tutores totales"
                value={reporteData?.tutoresDisponibles || 0}
              />
              <ItemStaditics
                title="Alumnos atendidos por tutor"
                value={reporteData?.ratioAlumnoTutor || 0}
              />
            </Flex>

            <Flex style={{ width: "100%" }} vertical>
              <Flex
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  margin: "10px",
                  backgroundColor: "white",
                  flex: 1,
                }}
              >
                <Line options={options} data={lineChartData} />
              </Flex>
              <Flex>
                <Flex
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    margin: "10px",
                    backgroundColor: "white",
                    flex: 1,
                    maxHeight: "300px",
                  }}
                >
                  <Pie
                    data={estadoAtencionesData}
                    options={estadoAtencionesOptions}
                  />
                </Flex>
                <Flex
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    margin: "10px",
                    backgroundColor: "white",
                    flex: 1,
                    maxHeight: "300px",
                  }}
                >
                  <Flex>
                    <Pie
                      data={tipoTutoriaData}
                      options={{
                        ...tipoTutoriaOptions,
                        plugins: {
                          ...tipoTutoriaOptions.plugins,
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                    <TipoTutoriaList data={extractTipoTutoriaData().data} />
                  </Flex>
                </Flex>
              </Flex>
              <Flex>
                <Flex
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    margin: "10px",
                    backgroundColor: "white",
                    flex: 1,
                  }}
                >
                  <Bar options={optionsBar} data={barChartData} />
                </Flex>
              </Flex>
            </Flex>
          </div>
        ) : (
          <>
            <Flex
              direction="row"
              align="center"
              style={{ width: "100%", marginBottom: "20px", marginTop: "10px" }}
            >
              <Button type="link" onClick={() => setShowDetails(false)}>
                <div style={{ marginRight: "10px", color: "#0884FC" }}>
                  Reportes &gt;
                </div>
              </Button>
              <div style={{ marginRight: "10px", color: "#161616" }}>
                Detalles
              </div>
            </Flex>
            <Flex
              direction="row"
              align="center"
              style={{ width: "100%", marginBottom: "20px" }}
            >
              <div
                style={{
                  marginRight: "40px",
                  fontWeight: "bold",
                  width: "200px",
                }}
              >
                TIPO DE REPORTE
              </div>
              <Select
                value={reportType}
                onChange={(value) => setReportType(value)}
                placeholder="Selecciona un tipo de reporte"
                style={{ width: "400px" }}
                allowClear
              >
                <Select.Option value="Reporte de Atenciones">
                  Reporte de Atenciones
                </Select.Option>
                <Select.Option value="Reporte de alumnos por tutor">
                  Reporte de alumnos por tutor
                </Select.Option>
                <Select.Option value="Reporte de alumnos en tercera o cuarta">
                  Reporte de alumnos en tercera o cuarta
                </Select.Option>
              </Select>
            </Flex>
            <Flex
              direction="row"
              align="center"
              justify="space-between"
              style={{ width: "100%", marginBottom: "10px", marginTop: "60px" }}
            >
              <div
                style={{
                  marginRight: "10px",
                  fontWeight: "bold",
                  width: "45px",
                }}
              >
                Ciclo *
              </div>
              <Select
                value={ciclo}
                onSelect={(value) => setCiclo(value)}
                placeholder="Seleccionar ciclo"
                style={{ width: "200px", marginRight: "20px" }}
                allowClear
              >
                {ciclos.map((ciclo) => (
                  <Select.Option key={ciclo.id} value={ciclo.id}>
                    {ciclo.nombre}
                  </Select.Option>
                ))}
              </Select>
              <div
                style={{
                  marginRight: "10px",
                  fontWeight: "bold",
                  width: "120px",
                }}
              >
                Rango de fechas *
              </div>
              <DatePicker.RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                style={{ width: "300px", marginRight: "10px" }}
                disabledDate={(current) => {
                  if (!ciclo) {
                    return false;
                  }
                  const selectedCiclo = ciclos.find((c) => c.id === ciclo);
                  if (!selectedCiclo) {
                    return false;
                  }
                  const startDate = new Date(selectedCiclo.fechaInicio);
                  const endDate = new Date(selectedCiclo.fechaFin);
                  return current < startDate || current > endDate;
                }}
                onCalendarChange={(dates) => {
                  // Verificar si el arreglo dates tiene dos fechas (rango completo)
                  if (dates && dates.length === 2) {
                    setDateRange(dates);
                  }
                }}
              />
              <div
                style={{
                  marginRight: "10px",
                  fontWeight: "bold",
                  width: "45px",
                }}
              >
                Tutor *
              </div>
              <Select
                value={tutor}
                onSelect={(value) => setTutor(value)}
                placeholder="Seleccionar tutor"
                style={{ width: "180px" }}
                allowClear
              >
                {tutores.map((tutor) => (
                  <Select.Option key={tutor.id} value={tutor.id}>
                    {`${tutor.nombre} ${tutor.apellidoPaterno}`}
                  </Select.Option>
                ))}
              </Select>
            </Flex>
            {reportType && (
              <Flex style={{ width: "100%" }} vertical>
                {(() => {
                  switch (reportType) {
                    case "Reporte de Atenciones":
                      return (
                        <Line options={options} data={lineChartDataTutor} />
                      );
                    case "Reporte de alumnos por tutor":
                      return (
                        <>
                          <Flex
                            style={{
                              padding: "10px",
                              borderRadius: "10px",
                              margin: "10px",
                              backgroundColor: "white",
                              flex: 2,
                              maxHeight: "400px",
                            }}
                          >
                            <Pie data={dataPie} />
                          </Flex>
                          <Flex
                            style={{
                              padding: "10px",
                              borderRadius: "10px",
                              margin: "10px",
                              backgroundColor: "white",
                              flex: 1,
                            }}
                          >
                            <Pie data={dataPie} />
                          </Flex>
                        </>
                      );
                    case "Reporte de alumnos en tercera o cuarta":
                      return (
                        <Flex
                          style={{
                            padding: "10px",
                            borderRadius: "10px",
                            margin: "10px",
                            backgroundColor: "white",
                            flex: 2,
                          }}
                        >
                          <Bar options={optionsBar} data={dataBar} />
                        </Flex>
                      );
                    default:
                      return null;
                  }
                })()}
              </Flex>
            )}
          </>
        )}
      </LayoutComponent>
    </main>
  );
}
