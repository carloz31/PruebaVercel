"use client";

import moment from "moment";
import "@/app/admin/facultad/page.css";
import LayoutComponent from "@/components/LayoutComponent";
import TableComponent from "@/components/TableComponentFacultad";
import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Typography,
  Modal,
  Input,
  Form,
  Radio,
  Select,
  Space,
  message,
  Spin,
} from "antd";
import axios from "@/utils/axiosConfig";
import { adminItems } from "@/utils/menuItems";
import {
  SearchOutlined,
  PicLeftOutlined,
  InfoCircleOutlined,
  ProductOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export default function Home() {
  const { Option } = Select;
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [coordinadorNombre, setCoordinadorNombre] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [estadoBuscado, setEstadoBuscado] = useState(1);
  const [flagtable, setflagtable] = useState(false);
  const [facultades, setFacultad] = useState([]);
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  //const [activo, setActivo] = useState(1);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [activo, setActivo] = useState(1);
  const [codigo, setCodigo] = useState("");
  const [coordinadores, setCoordinadores] = useState([]);
  const [coordinador, setCoordinador] = useState("");

  const get = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/facultadApi/listarFacultadActivoNombre`,
      );

      const facultadesData = response.data;

      const facultadIds = facultadesData.map((facultad) => facultad.id);

      const coordinadorPromises = facultadIds.map((id) =>
        axios.get(`/facultadApi/buscarCoordinadorIdFacultad?id_facultad=${id}`),
      );

      const coordinadoresResponse = await Promise.all(coordinadorPromises);

      const data = facultadesData.map((facultad, index) => {
        const coordinadorData = coordinadoresResponse[index].data[0];
        return {
          key: facultad.id,
          nombre: facultad.nombre,
          fechaCreacion: moment(facultad.fecha_creacion).format("DD/MM/YYYY"),
          estado: facultad.activo,
          codigo: facultad.codigo,
          correo: facultad.correo,
          coordinadorId: coordinadorData?.id || null,
          coordinadorNombre: coordinadorData
            ? `${coordinadorData.nombre} ${coordinadorData.apellidoPaterno} ${coordinadorData.apellidoMaterno}`
            : "Sin Coordinador",
        };
      });
      setFacultad(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCoordinador = async () => {
      try {
        const response = await axios.get(
          `${process.env.backend}/coordinadorApi/listarCoordinadorDisponibleFacultad`
        );
        setCoordinadores(response.data);
      } catch (error) {
        console.error("Error al obtener los coordinadores:", error);
      }
    };

    fetchCoordinador();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    // Call handleSearch with 'activo' to only fetch active types on initial load
    handleSearch(searchValue, activo);
  }, [searchValue, estadoBuscado, flagtable]);

  useEffect(() => {
    get();
  }, []);

  const handleSearch = async (nombre, estado) => {
    setIsLoading(true);
    try {
      let url = `/facultadApi/listarFacultadActivoNombre?estado=${estado}`;
      if (nombre != "") {
        url += `&nombre=${nombre}`;
      }

      console.log("url:" + url);
      const response = await axios.get(url);

      const facultadesData = response.data;

      const facultadIds = facultadesData.map((facultad) => facultad.id);

      const coordinadorPromises = facultadIds.map((id) =>
        axios.get(`/facultadApi/buscarCoordinadorIdFacultad?id_facultad=${id}`),
      );

      const coordinadoresResponse = await Promise.all(coordinadorPromises);

      const data = facultadesData.map((facultad, index) => {
        const coordinadorData = coordinadoresResponse[index].data[0];
        return {
          key: facultad.id,
          nombre: facultad.nombre,
          fechaCreacion: moment(facultad.fecha_creacion).format("DD/MM/YYYY"),
          estado: facultad.activo,
          codigo: facultad.codigo,
          correo: facultad.correo,
          coordinadorId: coordinadorData?.id || null,
          coordinadorNombre: coordinadorData
            ? `${coordinadorData.nombre} ${coordinadorData.apellidoPaterno} ${coordinadorData.apellidoMaterno}`
            : "Sin Coordinador",
        };
      });
      setFacultad(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertarClick = async () => {
    try {
      const response = await axios.post(
        `/facultadApi/crearFacultad`,
        {
          nombre,
          codigo,
          correo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        // alert("Tipo tutoria insertado exitosamente");
        //para creacion dentro de tabla intermedia tipotutoria -especialidad
        // debugger;
        const facultad = response.data.id;
        const idCoordinador = coordinador;

        console.log("idCoordinador: ", coordinador);
        const intermediaResponse = await axios.post(
          `/facultadApi/insertar_facultad_coordinador/${facultad}/${coordinador}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        //--------------------------------------
        if (intermediaResponse.status === 200) {
          // clearInut();
          await get();
          message.success("Registro Satisfactorio");
        } else {
          message.error("Error al insertar en la tabla intermedia");
        }

        //--------------------------------------
        // Puedes hacer alguna acción adicional aquí, como limpiar el formulario
      } else {
        // alert("Error al insertar tipo tutoria");
      }
    } catch (error) {
      console.error("Error al insertar facultad:", error);
      console.error(
        "Detalles de la respuesta del servidor:",
        error.response.data,
      );
    }
  };

  const handleFlagTable = (flag) => {
    setflagtable(!flag);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
      handleInsertarClick();
      setIsModalOpen(false);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      // Aquí puedes manejar el error de validación
    }
  };
  const handleNoSeleccionado = (estado) => {
    //debugger;
    if (estado == "Activo") {
      setActivo(1);
    } else {
      setActivo(0);
    }
  };
  const handleGuardar = (estado) => {
    // Lógica para guardar el estado seleccionado
    //debugger;
    setEstadoBuscado(activo);
    console.log("Estado guardado:", estadoBuscado);
    console.log("Estado boton:", estado);
    // Cierra el modal

    //handleSearch(searchValue, estadoboton);
    setModalVisible(false);
  };

  const handleCoordinadorChange = (id) => {
    const selectedCoordinador = coordinadores.find(
      (coordinador) => coordinador.id === id,
    );
    if (selectedCoordinador) {
      setCoordinador(selectedCoordinador.id);
      setCoordinadorNombre(selectedCoordinador.nombre);
    }
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={adminItems}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title style={{ textAlign: "left", marginBottom: "8px" }}>
            Facultad
          </Title>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              size="large"
              placeholder="Buscar facultad por nombre"
              prefix={<SearchOutlined />}
              style={{ width: "50%", marginRight: "16px" }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={() => handleSearch(searchValue)}
            />
            <Button
              icon={<ProductOutlined />}
              size="large"
              onClick={() => setModalVisible(true)}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              marginTop: 10,
            }}
          >
            <span style={{ marginRight: 10, color: "#727272" }}>
              ({facultades.length}) Facultades
            </span>
            <Button type="primary" onClick={showModal}>
              Añadir Nuevo +
            </Button>
          </div>
        </div>

        <TableComponent
          isLoading={isLoading}
          facultades={facultades}
          flagtable={handleFlagTable}
        ></TableComponent>
      </LayoutComponent>

      <Modal
        closable={false}
        title="Estado"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        maskClosable={true}
        footer={[
          <Button
            key="guardar"
            type="primary"
            onClick={() => handleGuardar(estado)}
          >
            Guardar
          </Button>,
        ]}
        style={{ maxWidth: "33vh" }}
      >
        <Select
          defaultValue="Activo"
          onChange={(value) => handleNoSeleccionado(value)}
          style={{ width: "100%" }}
        >
          <Option value="Activo">Activo</Option>
          <Option value="Inactivo">Inactivo</Option>
        </Select>
      </Modal>

      <Modal
        open={isModalOpen}
        closable={false} // Desactiva la opción de cerrar con la "X"
        footer={null} // Desactiva el pie de página (los botones "OK" y "Cancelar")
        style={{
          maxWidth: "400px",
          maxHeight: "428px",
          border: "2px solid #1f87ef",
          overflow: "hidden",
        }}
      >
        <Form form={form} style={{ maxWidth: "400px" }}>
          <Form.Item
            label="Codigo"
            name="codigo"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="botones-formulario"
            style={{ borderColor: "#1f87ef" }}
            rules={[
              { required: true, message: "Por favor, ingrese un codigo" },
            ]}
          >
            <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Nombre"
            name="nombre"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="botones-formulario"
            style={{ borderColor: "#1f87ef" }}
            rules={[
              { required: true, message: "Por favor, ingrese un nombre" },
            ]}
          >
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Coordinador"
            name="coordinador"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="botones-formulario"
            rules={[
              {
                required: true,
                message: "Por favor, seleccione un Coordinador",
              },
            ]}
          >
            <Select
              onChange={handleCoordinadorChange}
              placeholder="Seleccionar un coordinador..."
            >
              {coordinadores.map((coordinador) => (
                <Select.Option key={coordinador.id} value={coordinador.id}>
                  {`${coordinador.nombre} ${coordinador.apellidoPaterno} ${coordinador.apellidoMaterno}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Correo"
            name="correo"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="botones-formulario"
            style={{ borderColor: "#1f87ef" }}
            rules={[
              { required: true, message: "Por favor, ingrese un correo" },
            ]}
          >
            <Input value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 3, span: 18 }}
            style={{ marginTop: "25px" }}
            className="botones_form"
          >
            <Space size={50}>
              <Button
                htmlType="button"
                onClick={handleCancel}
                className="cancel-button"
              >
                Cancelar
              </Button>
              <Button type="primary" htmlType="button" onClick={handleOk}>
                Guardar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
