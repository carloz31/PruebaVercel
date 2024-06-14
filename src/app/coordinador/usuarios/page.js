"use client";
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, message } from "antd";
import { ProductOutlined } from "@ant-design/icons";
import TableComponent from "@/components/TableComponent";
import { useRouter } from 'next/navigation';
import axios from '@/utils/axiosConfig';
import { useUser } from '@/context/UserContext';
import { coordinadorItems } from "@/utils/menuItems";
import SearchInput from "@/components/SearchInput";
import UserTypeSelect from "@/components/UserTypeSelect";
import SelectEstadoModal from "@/components/SelectEstadoModal";
import UserForm from "@/components/UserForm";
import EditUserModal from "@/components/EditUserModal";
import { Form } from "antd";

const { Title } = Typography;

export default function Home() {
  const [codigo, setCodigo] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [busquedaInput, setBusquedaInput] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTipoUsuario, setSelectedTipoUsuario] = useState("");
  const [isEstadoModalVisible, setIsEstadoModalVisible] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState(1);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [form] = Form.useForm();
  const [especialidades, setEspecialidades] = useState([]);
  const [tipoUsuarioSeleccionado, setTipoUsuarioSeleccionado] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [tipoTutoria, setTipoTutoria] = useState(null);
  const [correoOriginal, setCorreoOriginal] = useState("");
  const { user } = useUser();
  const router = useRouter();

  const onSearch = async () => {
    await get();
  };

  const get = async () => {
    if(user?.rolSeleccionado !== 2 && user?.rolSeleccionado !== 5){ //no está con rol de coordinador
      router.back(); //regresa a la página anterior
      return;
    }
    setIsLoading(true);
    try {
      let url = `${process.env.backend}/usuarioApi/usuariosFiltrados/${user.id}/${user.rolSeleccionado}`;

      if (busquedaInput || selectedEstado !== "1" || selectedTipoUsuario) {
        url += `?codigoNombre=${
          busquedaInput || ""
        }&estado=${selectedEstado}&tipoUsuario=${selectedTipoUsuario || ""}`;
      }

      const response = await axios.get(url);

      console.log("response", response.data);

      const data = response.data.map((usuario) => ({
        key: usuario.id,
        id: usuario.id,
        idPersona: usuario.persona.id,
        nombres: `${usuario.persona.nombre} ${usuario.persona.apellidoPaterno} ${usuario.persona.apellidoMaterno}`,
        correo: usuario.correo,
        nombre: usuario.persona.nombre,
        apellidos: `${usuario.persona.apellidoPaterno} ${usuario.persona.apellidoMaterno}`,
        celular: usuario.persona.celular,
        dni: usuario.persona.dni,
        tipoUsuario: usuario.tipoUsuario,
        estado: selectedEstado === 1 ? "Activo" : "Inactivo",
      }));

      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(user && user.id){
      get();
    }
  }, [user]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      onSearch();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [busquedaInput, selectedTipoUsuario, selectedEstado]);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        debugger
        const response = await axios.get(
          `/especialidadApi/listarEspecialidadesActivasPorIdUsuario/${user.id}/${user.rolSeleccionado}`
        );
        setEspecialidades(response.data);
      } catch (error) {
        console.error("Error al obtener las especialidades:", error);
      }
    };
    fetchEspecialidades();
  }, []);

  
  const handleChangeEstado = async (record) => {
    debugger
    try {
      let estado = record.estado === "Activo" ? 0 : 1; // Determinar el nuevo estado

      if (record.tipoUsuario === "Alumno") {
        // Si es alumno, cambiar el estado del alumno
        await axios.post( 
          `${process.env.backend}/alumnoApi/cambiarEstadoAlumno/${record.idPersona}/${estado}`
        );
        message.success("El alumno fue desactivado satisfactoriamente.");
      } else if (record.tipoUsuario === "Tutor") {
        // Si es tutor, cambiar el estado del tutor
        await axios.post(
          `${process.env.backend}/tutorApi/cambiarEstadoTutor/${record.idPersona}/${estado}`
        );
        message.success("El tutor fue desactivado satisfactoriamente.");
      }

      await get(); // Actualizar la lista de usuarios después de cambiar el estado
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    }
  };

  const handleEdit = (usuario) => {
    setUsuarioEditando(usuario);
    setIsEditModalOpen(true);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleBusquedaChange = (e) => {
    const value = e.target.value;
    setBusquedaInput(value);

    if (value === "") {
      onSearch();
    }
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={coordinadorItems}>
        <Flex style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <Title style={{ textAlign: "left", color: "#043B71" }}>
            Lista de Usuarios
          </Title>
          <Flex style={{ alignItems: "center" }}>
            <SearchInput
              value={busquedaInput}
              onChange={handleBusquedaChange}
            />
            <UserTypeSelect
              value={selectedTipoUsuario}
              onChange={setSelectedTipoUsuario}
            />
            <Button
              icon={<ProductOutlined />}
              onClick={() => setIsEstadoModalVisible(true)}
              style={{ marginLeft: 10, width: 60, height: 40 }}
            />
          </Flex>
          <Flex style={{ alignItems: "center", marginTop: 10 }}>
            <span style={{ marginRight: 10, color: "#727272" }}>
              ({usuarios.length}) Usuarios
            </span>
            <Button
              type="primary"
              onClick={showModal}
              style={{
                backgroundColor: "#0092FF",
                borderColor: "#0092FF",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: 8 }}>Añadir nuevo</span>
              <span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 6V18M6 12H18"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Button>
          </Flex>
        </Flex>
        <TableComponent
          isLoading={isLoading}
          usuarios={usuarios.map((usuario, index) => ({
            ...usuario,
            key: index + 1,
            estado: selectedEstado === 1 ? "Activo" : "Inactivo",
          }))}
          handleChangeEstado={handleChangeEstado}
          handleEdit={handleEdit}
        />
      </LayoutComponent>

      <UserForm
        isModalOpen={isModalOpen}
        handleOk={() => {
          setIsModalOpen(false);
          get();
        }}
        handleCancel={() => setIsModalOpen(false)}
        setCodigo={setCodigo}
        setNombres={setNombres}
        setApellidos={setApellidos}
        setCelular={setCelular}
        setCorreo={setCorreo}
        setTipoUsuario={setTipoUsuario}
        especialidadesProp={especialidades}
      />

      <EditUserModal
        isModalOpen={isEditModalOpen}
        handleOk={() => {
          setIsEditModalOpen(false);
          get();
        }}
        handleCancel={() => setIsEditModalOpen(false)}
        usuarioEditando={usuarioEditando}
        form={form}
        setTipoUsuarioSeleccionado={setTipoUsuarioSeleccionado}
        setEspecialidad={setEspecialidad}
        setTipoTutoria={setTipoTutoria}
        setCorreoOriginal={setCorreoOriginal}
        especialidades={especialidades}
      />

      <SelectEstadoModal
        isModalVisible={isEstadoModalVisible}
        setIsModalVisible={setIsEstadoModalVisible}
        selectedEstado={selectedEstado}
        setSelectedEstado={setSelectedEstado}
        onSearch={onSearch}
      />
    </main>
  );
}
