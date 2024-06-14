"use client";
import LayoutComponent from "@/components/LayoutComponent";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Typography,
  Modal,
  message,
  Upload,
  Row,
  Col,
  Spin,
} from "antd";
import axios from "@/utils/axiosConfig";
import { coordinadorItems } from "@/utils/menuItems";
import {
  CloudUploadOutlined,
  InfoCircleOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import CustomSelect from "@/components/coordinador/CustomSelect";
import { useRouter } from "next/navigation";
import "../astipo/App.css";
import { useUser } from "@/context/UserContext";
const { Title, Text } = Typography;
const { Dragger } = Upload;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [idUsuarioSesion, setIdUsuarioSesion] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedTipoTutoria, setSelectedTipoTutoria] = useState(null);
  const [tiposTutoria, setTiposTutoria] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const columns = [
    { title: "Código", dataIndex: "codigo", key: "codigo", width: "auto" },
    {
      title: "Nombres",
      dataIndex: "persona",
      key: "nombres",
      width: "auto",
      render: (persona) => (persona ? persona.nombre : ""),
    },
    {
      title: "Apellidos",
      dataIndex: "persona",
      key: "apellidos",
      width: "auto",
      render: (persona) =>
        persona ? `${persona.apellidoPaterno} ${persona.apellidoMaterno}` : "",
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      width: "auto",
      render: (text) => text || "",
    },
    {
      title: "Tipo de Usuario",
      dataIndex: "tipoUsuario",
      key: "tipoUsuario",
      width: "auto",
      render: (text) => text || "",
    },
  ];

  const get = async () => {
    setIsLoading(true);
    if (user?.rolSeleccionado !== 2 && user?.rolSeleccionado !== 5) {
      //no está con rol de coordinador
      router.back(); //regresa a la página anterior
      return;
    }
    try {
      const response = await axios.get(
        `/tipoTutoriaApi/listarTiposTutoriaPorCoordinador/${user.id}/${user.rolSeleccionado}`,
      );
      console.log(response);
      setTiposTutoria(response.data);
    } catch (error) {
      console.error("Error fetching tiposTutoria:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTutoriaMembers = async (idTipoTutoria) => {
    try {
      const [response_tutor, response_alumno] = await Promise.all([
        axios.get(`/tutorApi/listarTutorPorTipoTutoria/${idTipoTutoria}`),
        axios.get(`/alumnoApi/listarAlumnoPorTipoTutoria/${idTipoTutoria}`),
      ]);

      const combined = [
        ...(response_tutor.data.map((tutor) => ({ ...tutor, tipo: "Tutor" })) ||
          []),
        ...(response_alumno.data.map((alumno) => ({
          ...alumno,
          tipo: "Alumno",
        })) || []),
      ];

      setCombinedData(combined);
    } catch (error) {
      console.error("Error fetching tutoria members:", error);
    }
  };

  useEffect(() => {
    if (selectedTipoTutoria) {
      setIsVerified(false);
      getTutoriaMembers(selectedTipoTutoria.idTipoTutoria);
    }
  }, [selectedTipoTutoria]);

  useEffect(() => {
    if (user && user.id) {
      get();
    }
  }, [user]);

  const props = {
    name: "file",
    showUploadList: false,
    beforeUpload: (file) => {
      if (!selectedTipoTutoria) {
        message.error(
          "Seleccione un tipo de tutoría antes de subir un archivo.",
        );
        return false;
      }

      const isCsv = file.type === "text/csv";
      if (!isCsv) {
        message.error("Solo se puede subir archivos CSV");
      } else {
        setIsLoading(true); // Start loading before parsing
        Papa.parse(file, {
          header: true,
          complete: function (results) {
            const filteredData = results.data.filter((row) => row.codigo);
            setTableData(filteredData);
            setIsLoading(false); // Stop loading after parsing
            setIsModalVisible(true); // Show modal after parsing
          },
        });
      }
      return false;
    },
  };

  const handleCheckUsers = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.post(
        `/usuarioApi/buscarUsuarioPorCodigo`,
        tableData.map((user) => user.codigo),
      );
      const updatedData = tableData.map((user) => {
        const usuario = response.data.find((u) => u.codigo === user.codigo);
        return {
          ...user,
          correo: usuario ? usuario.correo : user.correo,
          persona: usuario ? usuario.persona : user.persona,
          tipoUsuario: usuario ? usuario.tipoUsuario : "Desconocido",
          existe: !!usuario,
        };
      });
      setTableData(updatedData);
      setIsVerified(true);
    } catch (error) {
      console.error("Error al verificar usuarios:", error);
      message.error("Ocurrió un error al verificar usuarios.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleGuardarCambios = async () => {
    setIsSaving(true); // Start saving
    try {
      debugger;
      //Se filtran los que no están en el tipo de tutoria seleccionado para no cargar la bd con el error
      const existingUsers = tableData.filter(
        (user) =>
          user.existe &&
          !combinedData.some((combined) => combined.codigo === user.codigo),
      );

      //si en el archivo hay duplicados, esta parte los consolida
      const idAlumnos = [
        ...new Set(
          existingUsers
            .filter((usuario) => usuario.tipoUsuario === "Alumno")
            .map((usuario) => usuario.persona.id),
        ),
      ];
      const idTutores = [
        ...new Set(
          existingUsers
            .filter((usuario) => usuario.tipoUsuario === "Tutor")
            .map((usuario) => usuario.persona.id),
        ),
      ];

      const dataPayload = {
        idTipoTutoria: selectedTipoTutoria.idTipoTutoria,
        idAlumnos,
        idTutores,
      };
      await axios.post(`/llenarAsignacionesTipoTutoria`, dataPayload);
      message.success("Asignaciones creadas exitosamente");
      setIsModalVisible(false);
      setTableData([]);
    } catch (error) {
      console.error("Error al guardar asignaciones:", error);
      message.error("Ocurrió un error al guardar asignaciones.");
    } finally {
      setIsSaving(false); // Stop saving
    }
  };

  const tipoTutoriaOptions = tiposTutoria.map((tipo) => ({
    value: tipo.idTipoTutoria.toString(),
    label: tipo.nombre,
  }));

  const handleTipoTutoriaChange = async (value) => {
    const numericValue = Number(value);
    const selectedTipo = tiposTutoria.find(
      (tipo) => tipo.idTipoTutoria === numericValue,
    );
    setSelectedTipoTutoria(selectedTipo || null);
  };

  const uniqueUsers = [...new Set(tableData.map((user) => user.codigo))];
  const duplicateUsers = tableData.length - uniqueUsers.length;

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={coordinadorItems}>
        <Spin spinning={isLoading || isSaving} size="large">
          <Title
            className="font-semibold"
            style={{ color: "#043b71", textAlign: "left" }}
          >
            Asignación Masiva de Tipo de Tutoría
          </Title>
          <div className="flexContainer">
            <div className="dropdownContainerStyleTipo">
              <Text strong className="titleText">
                Tipo de Tutoría:
              </Text>
              <CustomSelect
                showSearch
                placeholder="Seleccione Tipo de Tutoría"
                className="dropdownStyleTipo"
                options={tipoTutoriaOptions}
                onChange={handleTipoTutoriaChange}
                value={
                  selectedTipoTutoria
                    ? selectedTipoTutoria.idTipoTutoria.toString()
                    : undefined
                }
              />
            </div>
            <div className="buttonContainerStyle">
              <Button
                className="buttonStyle"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/codigos.csv";
                  link.setAttribute("download", "codigos.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Descargar Formato <FilePdfOutlined />
              </Button>
            </div>
          </div>
          <Row justify="center" style={{ width: "100%", margin: "20px auto" }}>
            <Col span={24}>
              <Dragger {...props} accept=".csv" className="draggerStyle">
                <p className="ant-upload-drag-icon">
                  <CloudUploadOutlined />
                </p>
                <p className="ant-upload-text">
                  Seleccione su archivo o arrastre y suéltelo aquí
                </p>
                <p className="ant-upload-hint">
                  CSV, el archivo no puede superar los 50 MB.
                </p>
                <Button
                  className="large"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "20px auto 0",
                    color: "#0884FC",
                    borderColor: "#0884FC",
                  }}
                >
                  Elegir archivos
                </Button>
              </Dragger>
            </Col>
          </Row>
          <div
            style={{
              width: "100%",
              border: "3px dotted #ccc",
              borderRadius: "10px",
              margin: "20px auto",
              padding: "15px",
              color: "#888",
            }}
          >
            <div className="infoBox">
              <p>
                <InfoCircleOutlined style={{ color: "#0884FC" }} /> Utilizar un
                unico archivo de una columna que incluya los códigos de usuario
                de los nuevos miembros del tipo de tutoria.
              </p>
              <p>
                Si se detecta que alguno de los usuarios ya es parte del tipo de
                tutoría, este será ignorado.
              </p>
              <p>Ejemplo: codigos.csv</p>
            </div>
          </div>
        </Spin>
        <Modal
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width="90vw"
          closable={false}
          footer={[
            <Button
              key="check"
              onClick={handleCheckUsers}
              disabled={isVerified}
            >
              Verificar Usuarios
            </Button>,
            <Button
              key="cancel"
              onClick={() => {
                setIsModalVisible(false);
                setIsVerified(false);
              }}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleGuardarCambios}
              disabled={!isVerified}
            >
              Guardar cambios
            </Button>,
          ]}
          maskClosable={false}
        >
          <Spin spinning={isLoading}>
            <div style={{ marginBottom: "10px" }}>
              Total: {tableData.length} usuarios ({uniqueUsers.length} únicos,{" "}
              {duplicateUsers} duplicados)
            </div>
            <Table
              dataSource={tableData}
              columns={columns}
              rowKey="codigo"
              scroll={{ y: 300 }}
              pagination={false} // Remove pagination if you want to show all rows at once
            />
          </Spin>
        </Modal>
      </LayoutComponent>
    </main>
  );
}
