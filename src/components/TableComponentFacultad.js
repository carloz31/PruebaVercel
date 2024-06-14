"use client";
import "@/app/admin/facultad/page.css";
import React, { useEffect, useState } from "react";
import {
  Space,
  Spin,
  Table,
  Tag,
  Button,
  Flex,
  Typography,
  Modal,
  Input,
  Form,
  Radio,
  Select,
  message,
  Col,
} from "antd";
import axios from "@/utils/axiosConfig";

const { Column, ColumnGroup } = Table;
import {
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
  MinusCircleOutlined,
  PicLeftOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";

const TableComponent = ({ isLoading, facultades, flagtable }) => {
  const [nombre, setNombre] = useState("");
  const [flag, setFlag] = useState(false);
  const [tipoTutoriUpd, setTipoTutoriaUpd] = useState({});
  const [dato, setDato] = useState({});

  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setid] = useState(0);
  const [activo, setActivo] = useState(1);
  const [codigo, setCodigo] = useState("");
  const [correo, setCorreo] = useState("");
  const [coordinadores, setCoordinadores] = useState([]);
  const [coordinador, setCoordinador] = useState("");
  const [coordinadorNombre, setCoordinadorNombre] = useState("");
  const [numProgramas, setNumProgramas] = useState({});

  useEffect(() => {
    const fetchCoordinadores = async () => {
      try {
        const response = await axios.get(
          `/coordinadorApi/listarTodosCoordinadores`,
        );
        setCoordinadores(response.data);
      } catch (error) {
        console.error("Error al obtener los coordinadores:", error);
      }
    };
    fetchCoordinadores();
  }, []);

  useEffect(() => {
    const fetchNumProgramas = async () => {
      try {
        const programasPromises = facultades.map(async (facultad) => {
          const response = await axios.get(
            `/especialidadApi/listarEspecialidadIDFacultad?id_facultad=${facultad.key}`,
          );
          return { id: facultad.key, numProgramas: response.data.length };
        });

        const programasData = await Promise.all(programasPromises);
        const programasMap = programasData.reduce((acc, curr) => {
          acc[curr.id] = curr.numProgramas;
          return acc;
        }, {});

        setNumProgramas(programasMap);
      } catch (error) {
        console.error("Error al obtener el número de programas:", error);
      }
    };
    fetchNumProgramas();
  }, [facultades]);

  if (isLoading) return <Spin size="large" />;

  const getCoordinadorNombre = async (facultadId) => {
    try {
      const response = await axios.get(
        `/facultadApi/buscarCoordinadorIdFacultad?id_facultad=${facultadId}`,
      );
      const coordinador = response.data[0]; // Suponiendo que siempre hay un solo coordinador en la respuesta
      return `${coordinador.nombre} ${coordinador.apellidoPaterno} ${coordinador.apellidoMaterno}`;
    } catch (error) {
      console.error("Error al obtener el nombre del coordinador:", error);
      return "Error";
    }
  };

  const renderEstado = (text, record) => {
    const estadoStyle = {
      padding: "4px 8px",
      borderRadius: "999px",
      color: "#fff",
      textAlign: "center", // Centro de texto
      display: "inline-block", // Para que el span no ocupe el ancho completo
    };
    console.log(record);

    return <span style={estadoStyle}>{record.estado}</span>;
  };

  const handleModificar = async () => {
    try {
      //debugger;
      console.log(nombre);

      const values = await form.validateFields();
      //console.log(datosActualizados);
      // Realizar la solicitud PUT al backend
      const response = await axios.put(
        `/facultadApi/actualizarFacultad`,
        {
          id: id,
          nombre: nombre,
          codigo: codigo,
          correo: correo,
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
        //debugger;
        const facultad = response.data.id;
        const idCoordinador = coordinador;

        console.log("idCoordinador: ", coordinador);
        const intermediaResponse = await axios.post(
          `/facultadApi/insertar_facultad_coordinador/${facultad}/${idCoordinador}`,
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

      setFlag(!flag);
      flagtable && flagtable(flag);
      message.success("Modificacion Satisfactorio");
      // Manejar la respuesta si es necesario
      console.log(response.data);
    } catch (error) {
      console.error("Error al modificar tipo de tutoría:", error);
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleInsertarClick = async () => {
    try {
      //debugger;
      const values = await form.validateFields();
      const response = await axios.put(
        `/facultadApi/actualizarFacultad`,
        {
          id: id,
          nombre: values.nombre,
          codigo: values.codigo,
          correo: values.correo,
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

        const facultad = id;
        const idCoordinador = coordinador;

        console.log("idCoordinador: ", coordinador);
        const intermediaResponse = await axios.post(
          `/facultadApi/insertar_facultad_coordinador/${facultad}/${idCoordinador}`,
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
          //  await get();
          setFlag(!flag);
          flagtable && flagtable(flag);
          message.success("Modificacion Satisfactorio");
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

  const handleUpdate = (record) => {
    // debugger;
    setIsModalOpen(true);
    setid(record.key);
    setCoordinador(record.coordinadorId); // Asigna el ID del coordinador
    form.setFieldsValue({
      nombre: record.nombre,
      codigo: record.codigo,
      correo: record.correo,
      coordinador: record.coordinadorId,
    });
  };

  // Función para manejar el clic en el botón de borrar
  const handleDelete = async (id) => {
    // async para usar await
    try {
      debugger;
      // Realiza la solicitud DELETE utilizando Axios
      const response = await axios.post(`/facultadApi/borrar_facultades/${id}`);

      // Verifica si la respuesta es exitosa
      if (response.status === 200) {
        // Si la respuesta es exitosa, muestra un mensaje de éxito
        //message.success('Tipo de tutoría borrado correctamente');
        setFlag(true);
        flagtable && flagtable(flag);
        // Aquí podrías recargar los datos de la tabla si es necesario
      } else {
        // Si hay algún error en la respuesta, muestra un mensaje de error
        // message.error('Error al borrar el tipo de tutoría');
      }
    } catch (error) {
      console.error("Error:", error);
      // message.error('Error al borrar el tipo de tutoría');
    }
  };

  const AsyncCoordinadorNombre = ({ facultadId, getCoordinadorNombre }) => {
    debugger;
    const [nombre, setNombre] = useState("Cargando...");

    useEffect(() => {
      const fetchNombre = async () => {
        const nombre = await getCoordinadorNombre(facultadId);
        setNombre(nombre);
      };
      fetchNombre();
    }, [facultadId, getCoordinadorNombre]);

    return <>{nombre}</>;
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
    <div>
      <Table
        dataSource={facultades.map((facultad) => ({
          ...facultad,
          numProgramas: numProgramas[facultad.key] || "0",
        }))}
      >
        <Column title="Codigo" dataIndex="codigo" key="Codigo"></Column>
        <Column title="Nombre" dataIndex="nombre" key="Nombre" />
        <Column title="Correo" dataIndex="correo" key="correo" />
        <Column
          title="Coordinador"
          dataIndex="coordinadorNombre"
          key="coordinadorNombre"
        />
        <Column
          title="N° Programas"
          dataIndex="numProgramas"
          key="numProgramas"
        />

        <Column
          title="Acción"
          dataIndex="Acción"
          key="Acción"
          render={(text, record) => (
            <Space size="middle">
              <EditOutlined
                style={{ fontSize: "16px", color: "#0884FC" }}
                onClick={() => handleUpdate(record)}
              />
              {
                (record.estado = 0 ? (
                  <MinusCircleOutlined
                    style={{ fontSize: "16px", color: "#0884FC" }}
                    onClick={() => handleDelete(record.key)}
                  />
                ) : (
                  <PlusCircleOutlined
                    style={{ fontSize: "16px", color: "#0884FC" }}
                    onClick={() => handleDelete(record.key)}
                  />
                ))
              }
            </Space>
          )}
        />
      </Table>
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
              {coordinadores &&
                coordinadores.map((coordinador) => (
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
    </div>
  );
};
export default TableComponent;
