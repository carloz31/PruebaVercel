"use client";
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Spin,
  Table,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import axios from "@/utils/axiosConfig";
import { coordinadorItems } from "@/utils/menuItems";
import Image from "next/image";
import CustomSelect from "@/components/coordinador/CustomSelect";
import ModalAsignacionTipo from "@/components/coordinador/ModalAsignacionTipo";
import SearchInput from "@/components/SearchInput";
import UserTypeSelect from "@/components/UserTypeSelect";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import "./App.css";

const { Title, Text } = Typography;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [idUsuarioSesion, setIdUsuarioSesion] = useState();
  const [selectedTipoTutoria, setSelectedTipoTutoria] = useState(null);
  const [tiposTutoria, setTiposTutoria] = useState([]);
  const [selectedTipoUsuario, setSelectedTipoUsuario] = useState("");
  const [busquedaInput, setBusquedaInput] = useState("");
  const [selectionType, setSelectionType] = useState("checkbox");
  const [filterApplied, setFilterApplied] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [combinedData, setCombinedData] = useState([]); // Initialize combinedData state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingTutors, setLoadingTutors] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { user } = useUser();
  const router = useRouter();
  const [form] = Form.useForm();

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
    setLoadingTutors(true);
    setLoadingStudents(true);
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
      combined.sort((a, b) => a.codigo.localeCompare(b.codigo));

      setCombinedData(combined);
      setFilteredData(combined);
    } catch (error) {
      console.error("Error fetching tutoria members:", error);
    } finally {
      setLoadingTutors(false);
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      get();
    }
  }, [user]);

  const tipoTutoriaOptions = tiposTutoria.map((tipo) => ({
    value: tipo.idTipoTutoria.toString(),
    label: tipo.nombre,
  }));

  useEffect(() => {
    if (selectedTipoTutoria) {
      getTutoriaMembers(selectedTipoTutoria.idTipoTutoria);
    }
  }, [selectedTipoTutoria]);

  const handleBusquedaChange = (e) => {
    debugger;
    const value = e.target.value;
    setBusquedaInput(value);

    const filtered = combinedData.filter((item) => {
      const matchesSearch =
        item.codigo.toLowerCase().includes(value.toLowerCase()) ||
        `${item.persona.nombre} ${item.persona.apellidoPaterno} ${item.persona.apellidoMaterno}`
          .toLowerCase()
          .includes(value.toLowerCase());
      const matchesType =
        selectedTipoUsuario === "" || item.tipo === selectedTipoUsuario; //vacio es todo tipo de usuario (alumnos y tutores)
      return matchesSearch && matchesType;
    });

    setFilteredData(filtered);
  };

  const handleTipoTutoriaChange = async (value) => {
    const numericValue = Number(value);
    const selectedTipo = tiposTutoria.find(
      (tipo) => tipo.idTipoTutoria === numericValue,
    );
    setSelectedTipoTutoria(selectedTipo || null);
    if (!filterApplied) {
      setFilterApplied(true);
    }
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
    console.log("Call to action clicked!");
  };

  const columns = [
    {
      title: "Código",
      dataIndex: "codigo",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Nombre completo",
      dataIndex: "persona",
      render: (persona) => (
        <p>{`${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno}`}</p>
      ),
    },
    {
      title: "Correo",
      dataIndex: "correo",
    },
    {
      title: "Tipo de usuario",
      dataIndex: "tipo",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.nombre === "Disabled User",
      name: record.persona.nombre,
    }),
  };

  useEffect(() => {
    const filtered = combinedData.filter(
      (item) => selectedTipoUsuario === "" || item.tipo === selectedTipoUsuario,
    );
    setFilteredData(filtered);
  }, [combinedData, selectedTipoUsuario]);

  const getEmptyText = () => {
    if (!filterApplied) {
      return (
        <div className="empty-text-wrapper">
          <p className="bold-text">Seleccione un tipo de tutoría</p>
          <Image
            src="/filter.png"
            alt="Filtrar"
            width={50}
            height={50}
            className="empty-image"
          />
        </div>
      );
    }
    if (filterApplied && filteredData.length === 0) {
      if (busquedaInput) {
        return (
          <div className="empty-text-wrapper">
            <p className="bold-text">
              No se encontraron miembros que coincidan con la búsqueda
            </p>
            <Image
              src="/community.png"
              alt="No hay miembros"
              width={80}
              height={80}
              className="empty-image"
            />
            <Button type="primary" onClick={handleButtonClick}>
              Asignar miembros
            </Button>
          </div>
        );
      } else {
        return (
          <div className="empty-text-wrapper">
            <p className="bold-text">
              Este tipo de tutoría no tiene miembros asignados
            </p>
            <Image
              src="/desierto.png"
              alt="No hay miembros"
              width={80}
              height={80}
              className="empty-image"
            />
            <Button type="primary" onClick={handleButtonClick}>
              Asignar miembros
            </Button>
          </div>
        );
      }
    }
    return null;
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSaveModal = async (selectedMembers) => {
    try {
      if (selectedMembers.length > 0) {
        const dataPayload = {
          idTipoTutoria: selectedTipoTutoria.idTipoTutoria,
          idAlumnos: selectedMembers
            .filter((usuario) => usuario.tipoUsuario === "Alumno")
            .map((usuario) => usuario.persona.id),
          idTutores: selectedMembers
            .filter((usuario) => usuario.tipoUsuario === "Tutor")
            .map((usuario) => usuario.persona.id),
        };
        await axios.post(`/llenarAsignacionesTipoTutoria`, dataPayload);
      }
      message.success(
        `Se asignaron los miembros a Tipo de Tutoría ${selectedTipoTutoria.nombre}`,
      );
      setIsModalOpen(false);
      // Fetch updated members after saving
      getTutoriaMembers(selectedTipoTutoria.idTipoTutoria);
    } catch (error) {
      message.error("Failed to save members");
      console.error("Save members error:", error);
    }
  };

  const handleDeleteClick = async () => {
    Modal.confirm({
      title: "¿Está seguro de eliminar las asignaciones seleccionadas?",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk: async () => {
        try {
          const dataPayload = {
            idTipoTutoria: selectedTipoTutoria.idTipoTutoria,
            idPersonas: selectedRowKeys,
          };
          await axios.post(`/eliminarAsignacionesTipoTutoria`, dataPayload);
          message.success(
            `Se eliminaron los miembros seleccionados de Tipo de Tutoría ${selectedTipoTutoria.nombre}`,
          );
          // Fetch updated members after deleting
          getTutoriaMembers(selectedTipoTutoria.idTipoTutoria);
          setSelectedRowKeys([]); // Clear selection
        } catch (error) {
          message.error("Hubo un error eliminando asignaciones");
          console.error("Delete members error:", error);
        }
      },
    });
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={coordinadorItems}>
        <Title
          className="font-semibold"
          style={{ color: "#043b71", textAlign: "left" }}
        >
          Asignar Tipo de Tutoría
        </Title>
        <div className="dropdownContainerStyleTipo">
          <Text strong className="titleText">
            Tipo de Tutoría:
          </Text>
          <CustomSelect
            showSearch
            placeholder="Seleccione el tipo de tutoría"
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
        <div className="flexContainer">
          <div className="dropdownContainerStyleTipo">
            <SearchInput
              value={busquedaInput}
              onChange={handleBusquedaChange}
              placeholder="Busque miembros por nombre o código"
            />
            <Text strong className="titleTextMiddle">
              Rol:
            </Text>
            <UserTypeSelect
              value={selectedTipoUsuario}
              onChange={setSelectedTipoUsuario}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            margin: 5,
          }}
        >
          <span
            style={{
              marginRight: 10,
              color: "#727272",
              minWidth: "40px",
              display: "inline-block",
              textAlign: "right",
            }}
          >
            ({filteredData.length.toString().padStart(2, "0")}) Miembros
          </span>
          <Button
            type="primary"
            onClick={handleButtonClick}
            disabled={!selectedTipoTutoria}
          >
            Asignar Nuevo +
          </Button>
          <Button
            danger
            type="primary"
            onClick={handleDeleteClick}
            disabled={selectedRowKeys.length === 0}
            style={{ marginLeft: "10px" }}
          >
            Eliminar Seleccionados
          </Button>
        </div>
        <Spin spinning={loadingTutors || loadingStudents}>
          <Table
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.persona.id}
            locale={{
              emptyText: getEmptyText(),
            }}
            className="custom-table"
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </LayoutComponent>
      <ModalAsignacionTipo
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSave={handleSaveModal}
        existingMembers={combinedData}
      />
    </main>
  );
}
