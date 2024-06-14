"use client";
//prueba
import moment from "moment";
import "@/app/admin/programa/page.css";
import LayoutComponent from "@/components/LayoutComponent";
import TableComponent from "@/components/TableComponentEspecialidad";
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
  const [programas, setProgramas] = useState([]);
  const [estado, setEstado] = useState("Activo");

  const [coordinadorNombre, setCoordinadorNombre] = useState("");
  const [facultadNombre, setFacultadNombre] = useState("");

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [activo, setActivo] = useState(1);
  const [codigo, setCodigo] = useState("");

  const [estadoBuscado, setEstadoBuscado] = useState(1);

  const [coordinadores, setCoordinadores] = useState([]);
  const [coordinador, setCoordinador] = useState("");

  const [facultades, setFacultades] = useState([]);
  const [facultad, setFacultad] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [flagtable, setflagtable] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [form] = Form.useForm();

  const handleFlagTable = (flag) => {
    setflagtable(!flag);
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [coordinadoresResponse, facultadesResponse] = await Promise.all([
          axios.get(`/coordinadorApi/listarTodosCoordinadores`),
          axios.get(`/facultadApi/listarTodosFacultad`)
        ]);
        setCoordinadores(coordinadoresResponse.data);
        setFacultades(facultadesResponse.data);
        get(facultadesResponse.data); // Pasar facultades aquí
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Call handleSearch with 'activo' to only fetch active types on initial load
    handleSearch(searchValue, activo);
  }, [searchValue, estadoBuscado, flagtable]);

  const get = async (facultades) => {
    setIsLoading(true);
    try {
      debugger;
      const response = await axios.get(
        `/especialidadApi/listarEspecialidadActivoNombre`
      );

      const especialidadesData = response.data;

      const especialidadesIds = especialidadesData.map(
        (especialidad) => especialidad.id,
      );

      const coordinadorPromises = especialidadesIds.map((id) =>
        axios.get(`/especialidadApi/buscarCoordinadorIdEspecialidad?id_especialidad=${id}`)
      );

      const coordinadoresResponse = await Promise.all(coordinadorPromises);

      const data = especialidadesData.map((especialidad, index) => {
        const coordinadorData = coordinadoresResponse[index].data[0];

        const facultadData = facultades.find(
          (facultad) => facultad.id === especialidad.facultad.id,
        );
        return {
          key: especialidad.id,
          nombre: especialidad.nombre,
          //fechaCreacion: moment(especialidad.fecha_creacion).format('DD/MM/YYYY'),
          estado: especialidad.activo,
          codigo: especialidad.codigo,
          coordinadorId: coordinadorData?.id || null,
          coordinadorNombre: coordinadorData
            ? `${coordinadorData.nombre} ${coordinadorData.apellidoPaterno} ${coordinadorData.apellidoMaterno}`
            : "Sin Coordinador",
          coordinadorCorreo: coordinadorData?.correo || "Sin Correo",
          facultadId: facultadData?.id || null,
          facultadNombre: facultadData?.nombre || "Sin Facultad",
          facultadCorreo: facultadData?.correo || "Sin Correo",
        };
      });
      setProgramas(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (nombre, estado) => {
    setIsLoading(true);

    try {
   //   debugger;
      let url = `/especialidadApi/listarEspecialidadActivoNombre?estado=${estado}`;
      if(nombre!=''){
        url+=`&nombre=${nombre}`;
      }

      console.log("url:" + url);
      const response = await axios.get(url);

      const especialidadesData = response.data;

      const especialidadesIds = especialidadesData.map(
        (especialidad) => especialidad.id,
      );

      const coordinadorPromises = especialidadesIds.map((id) =>
        axios.get(`/especialidadApi/buscarCoordinadorIdEspecialidad?id_especialidad=${id}`)
      );

      const coordinadoresResponse = await Promise.all(coordinadorPromises);

      const data = especialidadesData.map((especialidad, index) => {
        const coordinadorData = coordinadoresResponse[index].data[0];
        const facultadData = facultades.find(
          (facultad) => facultad.id === especialidad.facultad.id,
        );
        return {
          key: especialidad.id,
          nombre: especialidad.nombre,
          //fechaCreacion: moment(especialidad.fecha_creacion).format('DD/MM/YYYY'),
          estado: especialidad.activo,
          codigo: especialidad.codigo,
          coordinadorId: coordinadorData?.id || null,
          coordinadorNombre: coordinadorData
            ? `${coordinadorData.nombre} ${coordinadorData.apellidoPaterno} ${coordinadorData.apellidoMaterno}`
            : "Sin Coordinador",
          coordinadorCorreo: coordinadorData?.correo || "Sin Correo",
          facultadId: facultadData?.id || null,
          facultadNombre: facultadData?.nombre || "Sin Facultad",
          facultadCorreo: facultadData?.correo || "Sin Correo",
        };
      });
      setProgramas(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    get();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
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

  const handleFacultadChange = (id) => {
    const selectedFacultad = facultades.find((facultad) => facultad.id === id);
    if (selectedFacultad) {
      setFacultad(selectedFacultad);
      setFacultadNombre(selectedFacultad.nombre);
    }
  };

  const handleInsertarClick = async () => {
    try {
      debugger;
      const response = await axios.post(`/especialidadApi/crearEspecialidad`, {
        nombre:nombre,
        codigo:codigo,
        facultad:facultad,
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
       const especialidad = response.data.id;
       const idCoordinador = coordinador;
       
       console.log("idCoordinador: ", coordinador);
       const intermediaResponse = await axios.post(`/especialidadApi/insertar_especialidad_coordinador/${especialidad}/${coordinador}`, {}, {
        headers: {
            'Content-Type': 'application/json',
        },
        });

        //--------------------------------------
        if (intermediaResponse.status === 200) {
           // clearInut();
           const facultadesResponse = await axios.get(`/facultadApi/listarTodosFacultad`);
           await get(facultadesResponse.data);
            message.success('Registro Satisfactorio');
            form.resetFields();
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

  const handleNoSeleccionado = (estado) => {
    //debugger;
    if (estado == "Activo") {
      setActivo(1);
    } else {
      setActivo(0);
    }
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

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={adminItems}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title style={{ textAlign: "left", marginBottom: "8px" }}>
            Programas
          </Title>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              size="large"
              placeholder="Buscar programa por nombre"
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
              ({programas.length}) Programas
            </span>
            <Button type="primary" onClick={showModal}>
              Añadir Nuevo +
            </Button>
          </div>

          <TableComponent
            isLoading={isLoading}
            programas={programas}
            flagtable={handleFlagTable}
          ></TableComponent>
        </div>
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
            label="Facultad"
            name="facultad"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="botones-formulario"
            rules={[
              { required: true, message: "Por favor, seleccione una facultad" },
            ]}
          >
            <Select
              onChange={handleFacultadChange}
              placeholder="Seleccionar una facultad..."
            >
              {facultades.map((facultad) => (
                <Select.Option key={facultad.id} value={facultad.id}>
                  {facultad.nombre}
                </Select.Option>
              ))}
            </Select>
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
