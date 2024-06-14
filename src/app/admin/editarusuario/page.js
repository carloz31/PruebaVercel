"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Typography,
  Modal,
  Input,
  Table,
  Space,
  Breadcrumb,
} from "antd";
import { MinusCircleFilled } from "@ant-design/icons";
import axios from "@/utils/axiosConfig";
import { adminItems } from "@/utils/menuItems";
import InsertarAlumno from "@/components/InsertarAlumno";
import AddUserModalTipo from "@/components/admin/AddUserModalTipo";

const { Title } = Typography;

export default function Home() {
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [valorInput, setValorInput] = useState("");
  const [nombreTipoUsuario, setNombreTipoUsuario] = useState(null);

  const inputStyle = {
    width: "700px",
    marginTop: "15px",
    marginBottom: "10px",
  };
  const buttonStyle = {
    width: "200px",
    color: "white",
    backgroundColor: "#0884FC",
    marginLeft: "100px",
  };

  const h1Style = {
    color: "grey",
    marginTop: "10px",
    marginBottom: "10px",
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "persona.nombre",
      key: "persona.nombre",
      render: (text, record) => (
        <span>{`${record.persona.apellidoPaterno} ${record.persona.apellidoMaterno}, ${record.persona.nombre}`}</span>
      ),
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
    },
    {
      title: "Tipo de Usuario",
      dataIndex: "tipoUsuario",
      key: "tipoUsuario",
    },
    {
      title: "Acción",
      dataIndex: "acción",
      key: "action", // Corregido el error tipográfico
      render: (_, record) => (
        <span size="middle">
          <MinusCircleFilled
            style={{ fontSize: "16px", color: "red" }}
            onClick={() => onRemove(record)}
          />
        </span>
      ),
    },
  ];

  const onRemove = async (userId) => {
    Modal.confirm({
      title: "¿Está seguro de eliminar al usuario seleccionado?",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk: async () => {
        debugger;
        try {
          const userIdInt = parseInt(userId.id, 10);
          const url = `/usuarioApi/borrarUsuario/${userIdInt}`;
          await axios.delete(url);
          setUsuarios((prevUsuarios) =>
            prevUsuarios.filter((usuario) => usuario.id !== userId),
          );
          message.success("Usuario eliminado exitosamente");
        } catch (error) {
          console.error("Error al eliminar el usuario:", error);
        }
      },
    });
  };

  useEffect(() => {
    // Obtener el id de la query string
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");
    const nombre_rol = params.get("rol");
    setId(userId);
    setNombreTipoUsuario(nombre_rol);
    if (!userId) return;
  }, []);

  useEffect(() => {
    // Define una función asincrónica para hacer la solicitud a la API
    const fetchData = async () => {
      try {
        const url = `/usuarioApi/listarTodosUsuariosXnombre?nombre=${valorInput}&id_tipo=${id}`;
        const response = await axios.get(url);
        setUsuarios(response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Error al obtener datos de la API: Listar alumnos por nombre",
          error,
        );
      }
    };
    // Llama a la función fetchData
    fetchData();
  }, [valorInput, usuarios, id]);

  const [mostrarModal, setMostrarModal] = useState(false);

  const handleMostrarModal = () => {
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
  };

  const handleInputChange = (event) => {
    const nuevoValor = event.target.value;
    setValorInput(nuevoValor);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // Lógica para manejar el botón "Ok" del modal
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    // Lógica para manejar el botón "Cancelar" del modal
    setIsModalOpen(false);
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={adminItems}>
        <Breadcrumb
          items={[
            {
              title: <a href={`/admin/roles`}>Roles</a>,
            },
            {
              title: `Usuarios (${nombreTipoUsuario})`,
            },
          ]}
        />
        <Input
          placeholder="Buscar usuarios por nombre o código..."
          value={valorInput}
          onInput={handleInputChange}
          style={inputStyle}
        ></Input>
        <Button onClick={handleOpenModal} style={buttonStyle}>
          Agregar Usuario
        </Button>
        <AddUserModalTipo
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          tipoUsuario={nombreTipoUsuario}
          // Pasa aquí las funciones para establecer los valores de los campos
          // Ejemplo:
          // setCodigo={setCodigo}
          // setNombres={setNombres}
          // setApellidos={setApellidos}
          // setCelular={setCelular}
          // setCorreo={setCorreo}
          // setTipoUsuario={setTipoUsuario}
        />
        <h1
          style={h1Style}
        >{`Usuarios ${nombreTipoUsuario} (${usuarios.length})`}</h1>
        <Table columns={columns} dataSource={usuarios}></Table>
      </LayoutComponent>
    </main>
  );
}
