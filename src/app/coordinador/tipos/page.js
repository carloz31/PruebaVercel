"use client";
import moment from "moment";
import { useUser } from "@/context/UserContext";
import "./page.css";
import LayoutComponent from "@/components/LayoutComponent";
import TableComponent from "@/components/TableComponentTipoTutoria";
import { useEffect, useState, useRef } from "react";
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
import { coordinadorItems } from "@/utils/menuItems";
import {
  SearchOutlined,
  PicLeftOutlined,
  InfoCircleOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
const { Title } = Typography;

export default function Home() {
  //procedures a usar
  //LISTAR_TIPO_TUTORIA_ACTIVO para listar por estado y por nombre y el listado en general osea las tres posibles listados
  //INSERTAR_TIPO_TUTORIA generado por el repository
  //BORRAR_TIPO_TUTORIA_LOGICO borrado similar al logico pero con el estado cambiado
  const [searchValue, setSearchValue] = useState("");
  const { Option } = Select;
  const [isLoading, setIsLoading] = useState(false);
  const [tipoTutorias, setTipoTutorias] = useState([]);
  const [form] = Form.useForm();
  //Estado de los campos a insertar
  const [flagtable, setflagtable] = useState(false);
  const [estadoboton, setEstadoBoton] = useState("Activo");
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [estadoBuscado, setEstadoBuscado] = useState("Activo"); // Estado seleccionado en el filtro de estado
  const [modalidad, setModalidad] = useState("");
  const [obligatoriedad, setObligatoriedad] = useState("");
  const [nivelRendimiento, setNivelRendimiento] = useState("");
  const [tipoTutor, setTipoTutor] = useState("");
  const [tipoTutorFijo, setTipoTutorFijo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isTipoTutorFijoDisabled, setIsTipoTutorFijoDisabled] = useState(true);
  const { user } = useUser();
  //const router = useRouter();
  const [idUsuarioSesion, setIdUsuarioSesion] = useState(user ? user.id : null);

  const get = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/tipoTutoriaApi/listarTiposTutoriEstadoNombre?id_coordinador=${user.id}&estado=Activo`);
      
      const data = response.data.map((tipoTutoria) => ({
        key: tipoTutoria.idTipoTutoria,
        Nombre: tipoTutoria.nombre,
        fechaCreacion: moment(tipoTutoria.fecha_creacion).format("DD/MM/YYYY"),
        estado: tipoTutoria.estado,
        descripcion: tipoTutoria.descripcion,
        modalidad: tipoTutoria.modalidad,
        obligatoriedad: tipoTutoria.obligatoriedad,
        permanencia: tipoTutoria.permanencia,
        tipoTutor: tipoTutoria.tipoTutor,
        tipoTutorFijo: tipoTutoria.tipoTutorFijo,
      }));
      setTipoTutorias(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      get();
    }
  }, [user]);


  const handleSearch = async (nombre,estado) => {
    setIsLoading(true);
   
    console.log("idUsuarioSesion: ", user?.id);
    try {
      let url = `/tipoTutoriaApi/listarTiposTutoriEstadoNombre?id_coordinador=${user.id}&estado=${estado}`;
      if(nombre!=''){
        url+=`&nombre=${nombre}`;
      }

      console.log("url:" + url);
      const response = await axios.get(url);

      const data = response.data.map((tipoTutoria) => ({
        key: tipoTutoria.idTipoTutoria,
        Nombre: tipoTutoria.nombre,
        fechaCreacion: moment(tipoTutoria.fecha_creacion).format("DD/MM/YYYY"),
        estado: tipoTutoria.estado,
        descripcion: tipoTutoria.descripcion,
        modalidad: tipoTutoria.modalidad,
        obligatoriedad: tipoTutoria.obligatoriedad,
        permanencia: tipoTutoria.permanencia,
        tipoTutor: tipoTutoria.tipoTutor,
        tipoTutorFijo: tipoTutoria.tipoTutorFijo,
      }));
      console.log(data);
      setTipoTutorias(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //controladores del modal de insercion
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
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
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const clearInut = () => {
    setNombre("");
    setEstado("");
    setModalidad("");
    setObligatoriedad("");
    setDescripcion("");
    setTipoTutor("");
    setTipoTutorFijo("");
  };

  const handleInsertarClick = async () => {
    try {
      const response = await axios.post(
        `/tipoTutoriaApi/crearTiposTutoria`,
        {
          nombre,
          estado,
          descripcion,
          modalidad,
          obligatoriedad,
          tipoTutor,
          tipoTutorFijo,
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
       const tipoTutoriaId = response.data.idTipoTutoria;
       const idEspecialidad = user.id;
       
       console.log("tipoTutoriaId: ", tipoTutoriaId);
       const intermediaResponse = await axios.post(`/tipoTutoriaApi/insertarTipoTutoriaEspecialidad/${tipoTutoriaId}/${idEspecialidad}`, {}, {
        headers: {
            'Content-Type': 'application/json',
        }
        });

        //--------------------------------------
        if (intermediaResponse.status === 200) {
          clearInut();
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
      console.error("Error al insertar tipo tutoria:", error);
      console.error(
        "Detalles de la respuesta del servidor:",
        error.response.data,
      );
    }
  };

  const handleTipoTutorChange = (e) => {
    setTipoTutor(e.target.value);
    setIsTipoTutorFijoDisabled(e.target.value !== "Fijo");
    // Reinicia el estado del tipo de tutor fijo si no es 'Fijo'
    if (e.target.value !== "Fijo") {
      setTipoTutorFijo("");
    }
  };
  const handleNoSeleccionado = (estado) => {
    //debugger;
    console.log("idUsuarioSesion: ", user.id);
    setEstado(estado)
  }

  const handleGuardar = (estado) => {
    // Lógica para guardar el estado seleccionado
    //debugger;
    setEstadoBuscado(estado);
    console.log("Estado guardado:", estadoBuscado);
    console.log("Estado boton:", estado);
    // Cierra el modal

    //handleSearch(searchValue, estadoboton);
    setModalVisible(false);
  };

  const handleFlagTable = (flag) => {
    setEstado("Activo");
    setflagtable(!flag);
  };
  useEffect(() => {
    // Call handleSearch with 'activo' to only fetch active types on initial load
    handleSearch(searchValue, estado);
  }, [searchValue,estadoBuscado,flagtable]);

  

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={coordinadorItems}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title style={{ textAlign: "left", marginBottom: "8px" }}>
            Tipos de Tutoría
          </Title>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              size="large"
              placeholder="Buscar tipo de tutoría por nombre"
              prefix={<SearchOutlined />}
              style={{ width: "50%", marginRight: "16px" }}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={() => handleSearch(searchValue)}
              className="responsive-input"
            />
            <Button
              icon={<ProductOutlined />}
              size="large"
              onClick={() => setModalVisible(true)}
              className="responsive-button"
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
              ({tipoTutorias.length}) Tipo Tutorias
            </span>
            <Button type="primary" onClick={showModal}>
              Añadir Nuevo +
            </Button>
          </div>
        </div>

        <TableComponent
          isLoading={isLoading}
          tipoTutorias={tipoTutorias}
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
          maxHeight: "670px",
          margin: "auto",
          border: "2px solid #1f87ef",
          borderRadius: "10px",
          overflow: "hidden",
          width: "100%",
          "@media (max-width: 600px)": {
            maxWidth: "100%",
            maxHeight: "100%",
          },
        }}
      >
        <Form form={form} style={{ maxWidth: "400px" }}>
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
            label="Descripción"
            name="decripcion"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="botones-formulario"
            extra={
              <span>
                <InfoCircleOutlined /> Este campo es opcional
              </span>
            }
            style={{ borderColor: "#1f87ef" }}
          >
            <Input.TextArea
              className="descripcion-input"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Modalidad de tutoría"
            name="modalidad"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="botones-formulario"
            rules={[
              {
                required: true,
                message: "Por favor, seleccione una Modalidad de tutoría",
              },
            ]}
          >
            <Radio.Group
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
            >
              <Radio value="Individual">Individual</Radio>
              <Radio value="Grupal">Grupal</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Obligatoriedad"
            name="obligatoriedad"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="botones-formulario"
            rules={[
              {
                required: true,
                message: "Por favor, seleccione una Obligatoriedad",
              },
            ]}
          >
            <Radio.Group
              value={obligatoriedad}
              onChange={(e) => setObligatoriedad(e.target.value)}
            >
              <Radio value="Obligatoria">Obligatoria</Radio>
              <Radio value="Opcional">Opcional</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Tipo de tutor"
            name="tipo"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="botones-formulario"
            rules={[
              {
                required: true,
                message: "Por favor, seleccione una Tipo de tutor",
              },
            ]}
          >
            <Radio.Group value={tipoTutor} onChange={handleTipoTutorChange}>
              <Radio value="Fijo">Fijo</Radio>
              <Radio value="Variable">Variable</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Tipo de tutor fijo"
            name="tipotutor"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            className="botones-formulario"
            rules={[
              {
                required: !isTipoTutorFijoDisabled,
                message: "Por favor, seleccione una Tipo de tutor fijo",
              },
            ]}
          >
            <Radio.Group
              value={tipoTutorFijo}
              onChange={(e) => setTipoTutorFijo(e.target.value)}
              disabled={isTipoTutorFijoDisabled}
            >
              <Radio value="Asignado">Asignado</Radio>
              <Radio value="Solicitado">Solicitado</Radio>
            </Radio.Group>
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
