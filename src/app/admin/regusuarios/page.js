"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import Papa from "papaparse";
//import fs from 'fs';
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Flex,
  Typography,
  Modal,
  Input,
  Row,
  Col,
  Tooltip,
  Dropdown,
} from "antd";
import axios from "@/utils/axiosConfig";
import { adminItems } from "@/utils/menuItems";
import { useRouter } from "next/navigation";
import { message, Upload } from "antd";
//import tutores from './tutores.csv';
import {
  StarOutlined,
  InfoCircleOutlined,
  FilePdfOutlined,
  StarTwoTone,
  InboxOutlined,
  CloudUploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
const { Title } = Typography;
const { Dragger } = Upload;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [idUsuarioSesion, setIdUsuarioSesion] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const [tiposTutoria, setTiposTutoria] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);

  const items = [
    {
      key: "1",
      label: "Formato para Administradores",
    },
    {
      key: "2",
      label: "Formato para Coordinadores de Especialidad",
    },
    {
      key: "3",
      label: "Formato para Coordinadores de Facultad",
    },
    {
      key: "4",
      label: "Formato para Tutor de Derivacion",
    },
    {
      key: "5",
      label: "Formato para Tutores",
    },
    {
      key: "6",
      label: "Formato para Alumnos",
    },
  ];

  const validateCodigo = (codigo) => {
    debugger;
    return codigo.length === 8;
  };

  const validateCodigoUser = (codigo) => {
    return codigo.length === 6;
  };

  const validateCelular = (celular) => {
    return celular.length === 9 && !isNaN(celular);
  };
  const validateEspecialidad = (especialidad) => {
    return especialidades.find((e) => e.nombre === especialidad);
  };
  // especialidades.find(especialidad => especialidad.nombre === usuario.especialidad);
  const validateTipoTutoria = (tipoTutoria) => {
    return tiposTutoria.find((t) => t.nombre === tipoTutoria);
  };
  const validateFacultad = (facultad) => {
    return facultades.find((t) => t.nombre === facultad);
  };
  const validateCorreo = (correo) => {
    debugger;
    const emailRegex =
      /^[\w-]+(\.[\w-]+)*@([pP][uU][cC][pP]\.[eE][dD][uU]\.[pP][eE]|gmail\.com)$/i;
    if (emailRegex.test(correo)) {
      return true; // Correo válido
    } else {
      return "El formato del correo no es válido";
    }
  };
  const validateNombre = (nombre) => {
    // Expresión regular para verificar si el nombre contiene solo letras (sin espacios)
    const regex = /^[A-Za-z]+( [A-Za-z]+)?$/;
    // Devuelve true si el nombre cumple con la expresión regular, de lo contrario, devuelve false
    return regex.test(nombre);
  };

  const validateDNI = (DNI) => {
    // Expresión regular para verificar si el DNI contiene exactamente 8 dígitos numéricos
    const regex = /^\d{8}$/;
    // Devuelve true si el DNI cumple con la expresión regular, de lo contrario, devuelve false
    return regex.test(DNI);
  };

  const validateApellido = (apellidos) => {
    // Expresión regular para verificar si el nombre contiene solo letras (sin espacios)
    const regex = /^[A-Za-z]+ [A-Za-z]+$/;
    // Devuelve true si el nombre cumple con la expresión regular, de lo contrario, devuelve false
    return regex.test(apellidos);
  };

  const columnsTutor = [
    {
      title: "Codigo",
      dataIndex: "codigo",
      key: "codigo",
      render: (text) => renderTextWithValidation(text, validateCodigo(text)),
    },
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
      render: (text) => renderTextWithValidation(text, validateNombre(text)),
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
      render: (text) => renderTextWithValidation(text, validateApellido(text)),
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      render: (text) => {
        const isValid = validateCorreo(text);
        return (
          <span
            style={{
              color:
                isValid != "El formato del correo no es válido"
                  ? "inherit"
                  : "red",
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
      render: (text) => renderTextWithValidation(text, validateCelular(text)),
    },
    { title: "Especialidad", dataIndex: "especialidad", key: "especialidad" },
    {
      title: "Tipo Tutoria",
      dataIndex: "tipo_tutoria",
      key: "tipo_tutoria",
      render: (text) => {
        const isValid = validateTipoTutoria(text);
        return (
          <span style={{ color: isValid ? "inherit" : "red" }}>{text}</span>
        );
      },
    },
  ];

  const columnsAlumno = [
    {
      title: "Codigo",
      dataIndex: "codigo",
      key: "codigo",
      render: (text) => renderTextWithValidation(text, validateCodigo(text)),
    },
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
      render: (text) => renderTextWithValidation(text, validateNombre(text)),
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
      render: (text) => renderTextWithValidation(text, validateApellido(text)),
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      render: (text) => {
        const isValid = validateCorreo(text);
        return (
          <span
            style={{
              color:
                isValid != "El formato del correo no es válido"
                  ? "inherit"
                  : "red",
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
      render: (text) => renderTextWithValidation(text, validateCelular(text)),
    },
    {
      title: "Especialidad",
      dataIndex: "especialidad",
      key: "especialidad",
      render: (text) => {
        const isValid = validateEspecialidad(text);
        return (
          <span style={{ color: isValid ? "inherit" : "red" }}>{text}</span>
        );
      },
    },
  ];

  const columnsCoordinadorEspecialidad = [
    { title: "Codigo", dataIndex: "codigo", key: "codigo" },
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
      render: (text) => renderTextWithValidation(text, validateNombre(text)),
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
      render: (text) => renderTextWithValidation(text, validateApellido(text)),
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      render: (text) => {
        const isValid = validateCorreo(text);
        return (
          <span
            style={{
              color:
                isValid != "El formato del correo no es válido"
                  ? "inherit"
                  : "red",
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
      render: (text) => renderTextWithValidation(text, validateCelular(text)),
    },
    {
      title: "DNI",
      dataIndex: "DNI",
      key: "DNI",
      render: (text) => renderTextWithValidation(text, validateDNI(text)),
    },
    {
      title: "Especialidad",
      dataIndex: "especialidad",
      key: "especialidad",
      render: (text) => {
        const isValid = validateEspecialidad(text);
        return (
          <span style={{ color: isValid ? "inherit" : "red" }}>{text}</span>
        );
      },
    },
  ];

  const columnsCoordinadorFacultad = [
    { title: "Codigo", dataIndex: "codigo", key: "codigo" },
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
      render: (text) => renderTextWithValidation(text, validateNombre(text)),
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
      render: (text) => renderTextWithValidation(text, validateApellido(text)),
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      render: (text) => {
        const isValid = validateCorreo(text);
        return (
          <span
            style={{
              color:
                isValid != "El formato del correo no es válido"
                  ? "inherit"
                  : "red",
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
      render: (text) => renderTextWithValidation(text, validateCelular(text)),
    },
    {
      title: "DNI",
      dataIndex: "DNI",
      key: "DNI",
      render: (text) => renderTextWithValidation(text, validateDNI(text)),
    },
    {
      title: "Facultad",
      dataIndex: "facultad",
      key: "facultad",
      render: (text) => renderTextWithValidation(text, validateFacultad(text)),
    },
  ];

  const columnsTutorDerivacion = [
    { title: "Codigo", dataIndex: "codigo", key: "codigo" },
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
      render: (text) => renderTextWithValidation(text, validateNombre(text)),
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
      render: (text) => renderTextWithValidation(text, validateApellido(text)),
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      render: (text) => {
        const isValid = validateCorreo(text);
        return (
          <span
            style={{
              color:
                isValid != "El formato del correo no es válido"
                  ? "inherit"
                  : "red",
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
      render: (text) => renderTextWithValidation(text, validateCelular(text)),
    },
    {
      title: "DNI",
      dataIndex: "DNI",
      key: "DNI",
      render: (text) => renderTextWithValidation(text, validateDNI(text)),
    },
    {
      title: "Facultad",
      dataIndex: "facultad",
      key: "facultad",
      render: (text) => renderTextWithValidation(text, validateFacultad(text)),
    },
  ];

  const columnsAdministrador = [
    { title: "Codigo", dataIndex: "codigo", key: "codigo" },
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
      render: (text) => renderTextWithValidation(text, validateNombre(text)),
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
      render: (text) => renderTextWithValidation(text, validateApellido(text)),
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      render: (text) => {
        const isValid = validateCorreo(text);
        return (
          <span
            style={{
              color:
                isValid != "El formato del correo no es válido"
                  ? "inherit"
                  : "red",
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Celular",
      dataIndex: "celular",
      key: "celular",
      render: (text) => renderTextWithValidation(text, validateCelular(text)),
    },
    {
      title: "DNI",
      dataIndex: "DNI",
      key: "DNI",
      render: (text) => renderTextWithValidation(text, validateDNI(text)),
    },
  ];

  const renderTextWithValidation = (text, isValid) => {
    return <span style={{ color: isValid ? "inherit" : "red" }}>{text}</span>;
  };

  const onClick = ({ key }) => {
    debugger;
    if (key === "1") {
      //Administradores
      const link = document.createElement("a");
      link.href = "/administradores.csv";
      link.setAttribute("download", "administradores.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (key === "2") {
      //Coordinador de Especialidad
      const link = document.createElement("a");
      link.href = "/coordinadoresEspecialidad.csv";
      link.setAttribute("download", "coordinadoresEspecialidad.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (key === "3") {
      //Coordinador de Facultad
      const link = document.createElement("a");
      link.href = "/coordinadoresFacultad.csv";
      link.setAttribute("download", "coordinadoresFacultad.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (key === "4") {
      //Tutor de Derivacion
      const link = document.createElement("a");
      link.href = "/tutoresDerivacion.csv";
      link.setAttribute("download", "tutoresDerivacion.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (key === "5") {
      //Tutores
      const link = document.createElement("a");
      link.href = "/tutores.csv";
      link.setAttribute("download", "tutores.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (key === "6") {
      //Alumnos
      const link = document.createElement("a");
      link.href = "/alumnos.csv";
      link.setAttribute("download", "alumnos.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("userID");
    if (id !== null && id !== undefined) {
      setIdUsuarioSesion(id);
    } else {
      console.log("No hay nada");
      //router.push('/login');
    }
  }, [router]);

  const get = async () => {
    setIsLoading(true);
  };

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await axios.get(
          `/especialidadApi/listarTodosEspecialidad`,
        );
        setEspecialidades(response.data);
      } catch (error) {
        console.error("Error al obtener las especialidades:", error);
      }
    };
    fetchEspecialidades();
  }, []);

  useEffect(() => {
    const fetchTiposTutoria = async () => {
      try {
        const response = await axios.get(
          `/tipoTutoriaApi/listarTodosTiposTutoria`,
        );
        setTiposTutoria(response.data);
      } catch (error) {
        console.error("Error al obtener los tipos de tutoría:", error);
      }
    };

    fetchTiposTutoria();
  }, []);

  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        const response = await axios.get(`/facultadApi/listarTodosFacultad`);
        setFacultades(response.data);
      } catch (error) {
        console.error("Error al obtener las facultades:", error);
      }
    };

    fetchFacultades();
  }, []);

  useEffect(() => {
    get();
  }, []);

  const props = {
    name: "file",
    showUploadList: false,

    beforeUpload: (file) => {
      setErrorMessages([]); // Clear error messages
      setIsSaveButtonDisabled(false);
      const isCsv = file.type === "text/csv";
      const isAllowedName =
        file.name === "tutores.csv" ||
        file.name === "alumnos.csv" ||
        file.name === "coordinadoresEspecialidad.csv" ||
        file.name === "coordinadoresFacultad.csv" ||
        file.name === "tutoresDerivacion.csv" ||
        file.name === "administradores.csv";
      if (!isCsv) {
        message.error("Solo se puede subir archivos CSV");
      } else if (!isAllowedName) {
        message.error(
          'Solo se pueden subir archivos llamados "tutores", "alumnos" , "coordinadoresEspecialidad" , "coordinadoresFacultad","tutoresDerivacion" y "administradores"',
        );
      } else {
        setFileName(file.name); // Guarda el nombre del archivo
        debugger;

        Papa.parse(file, {
          header: true,
          complete: function (results) {
            const filteredData = results.data.filter((row) => {
              return !Object.values(row).every((x) => x === null || x === "");
            });
            debugger;
            console.log("Filtered Data: ", filteredData); // Para depurar
            const errorTypes = new Set();
            const validationErrors = [];
            filteredData.forEach((usuario) => {
              console.log(usuario.codigo);
              if (
                !validateNombre(usuario.nombres) &&
                !errorTypes.has("nombre")
              ) {
                validationErrors.push(
                  `El nombre contiene caracteres no válidos.`,
                );
                errorTypes.add("nombre");
              }
              if (
                !validateApellido(usuario.apellidos) &&
                !errorTypes.has("apellidos")
              ) {
                validationErrors.push(
                  `El apellido contiene caracteres no válidos o no esta conformado por dos palabras.`,
                );
                //para que solo se agrege una vez a la lista de errores
                errorTypes.add("apellidos");
              }
              if (
                !validateCelular(usuario.celular) &&
                !errorTypes.has("celular")
              ) {
                validationErrors.push(
                  `El número de celular debe tener exactamente 9 dígitos.`,
                );
                errorTypes.add("celular");
              }
              const correoValido = validateCorreo(usuario.correo);
              if (
                typeof correoValido === "string" &&
                !errorTypes.has("correo")
              ) {
                validationErrors.push(correoValido);
                errorTypes.add("correo");
              }
            });

            if (file.name === "alumnos.csv") {
              filteredData.forEach((usuario) => {
                const especialidadEncontrada = especialidades.find(
                  (especialidades) =>
                    especialidades.nombre === usuario.especialidad,
                );
                if (
                  !especialidadEncontrada &&
                  !errorTypes.has("especialidad")
                ) {
                  validationErrors.push(`La especialidad no fue encontrada.`);
                  errorTypes.add("especialidad");
                }
              });
            } else if (file.name === "tutores.csv") {
              filteredData.forEach((usuario) => {
                const tipotutoriaencontrado = tiposTutoria.find(
                  (tiposTutoria) =>
                    tiposTutoria.nombre === usuario.tipo_tutoria,
                );
                if (!tipotutoriaencontrado && !errorTypes.has("tipoTutoria")) {
                  validationErrors.push(`El tipo tutoria no fue encontrado.`);
                  errorTypes.add("tipoTutoria");
                }
              });
            } else if (file.name === "administradores.csv") {
              debugger;
              filteredData.forEach((usuario) => {
                if (!validateDNI(usuario.DNI)) {
                  validationErrors.push(`El DNI debe contener 8 caracteres`);
                  //para que solo se agrege una vez a la lista de errores
                  errorTypes.add("DNI");
                }
              });
            } else if (file.name === "coordinadoresEspecialidad.csv") {
              filteredData.forEach((usuario) => {
                const especialidadEncontrada = especialidades.find(
                  (especialidades) =>
                    especialidades.nombre === usuario.especialidad,
                );
                if (
                  !especialidadEncontrada &&
                  !errorTypes.has("especialidad")
                ) {
                  validationErrors.push(`La especialidad no fue encontrada.`);
                  errorTypes.add("especialidad");
                }
                if (!validateDNI(usuario.DNI)) {
                  validationErrors.push(`El DNI debe contener 8 caracteres`);
                  //para que solo se agrege una vez a la lista de errores
                  errorTypes.add("DNI");
                }
              });
            } else if (file.name === "coordinadoresFacultad.csv") {
              filteredData.forEach((usuario) => {
                const facultadEncontrada = facultades.find(
                  (facultades) => facultades.nombre === usuario.facultad,
                );
                if (!facultadEncontrada && !errorTypes.has("facultad")) {
                  validationErrors.push(`La facultad no fue encontrada.`);
                  errorTypes.add("facultad");
                }
                if (!validateDNI(usuario.DNI)) {
                  validationErrors.push(`El DNI debe contener 8 caracteres`);
                  //para que solo se agrege una vez a la lista de errores
                  errorTypes.add("DNI");
                }
              });
            } else if (file.name === "tutoresDerivacion.csv") {
              filteredData.forEach((usuario) => {
                const facultadEncontrada = facultades.find(
                  (facultades) => facultades.nombre === usuario.facultad,
                );
                if (!facultadEncontrada && !errorTypes.has("facultad")) {
                  validationErrors.push(`La facultad no fue encontrada.`);
                  errorTypes.add("facultad");
                }
                if (!validateDNI(usuario.DNI)) {
                  validationErrors.push(`El DNI debe contener 8 caracteres`);
                  //para que solo se agrege una vez a la lista de errores
                  errorTypes.add("DNI");
                }
              });
            }

            if (validationErrors.length > 0) {
              setTableData(filteredData);
              setErrorMessages(validationErrors);
              setIsModalVisible(true);
              setIsSaveButtonDisabled(true);
              //  message.error("Se encontraron errores en el archivo CSV.");
            } else {
              setTableData(filteredData);
              setIsModalVisible(true);
              setIsSaveButtonDisabled(false);
            }
          },
          error: function (error) {
            console.error("Error parsing CSV: ", error);
          },
        });
      }

      // Evita que se suba el archivo
      return false;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
        setSelectedFile(info.file);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    //comment
  };
  //const tipoUsuario = fileName === 'tutores.csv' ? 'Tutor' : 'Alumno';

  const handleInsertarClick = async (usuario) => {
    debugger;
    try {
      debugger;
      let tipoUsuario;
      switch (fileName) {
        case "tutores.csv":
          tipoUsuario = "Tutor";
          break;
        case "alumnos.csv":
          tipoUsuario = "Alumno";
          break;
        case "coordinadoresEspecialidad.csv":
          tipoUsuario = "Coordinador de Especialidad";
          break;
        case "coordinadoresFacultad.csv":
          tipoUsuario = "Coordinador de Facultad";
          break;
        case "administradores.csv":
          tipoUsuario = "Administrador";
          break;
        case "tutoresDerivacion.csv":
          tipoUsuario = "Tutor de Derivacion";
          break;
        default:
          throw new Error("Tipo de usuario no reconocido");
      }

      if (tipoUsuario === "Alumno") {
        //buscar la especidad
        const especialidadEncontrada = especialidades.find(
          (especialidades) => especialidades.nombre === usuario.especialidad,
        );

        if (especialidadEncontrada) {
          // Asignar el ID de la especialidad al usuario
          // Crear alumno
          const alumnoData = {
            nombre: usuario.nombres,
            apellidoPaterno: usuario.apellidos.split(" ")[0],
            apellidoMaterno: usuario.apellidos.split(" ")[1] || "",
            telefono: usuario.celular,
            cicloEstudios: 1,
            historialAcademico: null,
            activo: 1,
            especialidad: {
              id: especialidadEncontrada.id,
            },
            tipoAlumno: {
              id: 1,
            },
            dni: usuario.codigo,
          };

          const alumnoResponse = await axios.post(
            `/alumnoApi/crearAlumno`,
            alumnoData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (alumnoResponse.status === 200) {
            const alumnoId = alumnoResponse.data.id;

            // Crear usuario del alumno
            const usuarioData = {
              codigo: usuario.codigo,
              estado: 1,
              password: null,
              foto: null,
              tipoUsuario: "Alumno",
              correo: usuario.correo,
              persona: {
                id: alumnoId,
                nombre: usuario.nombres,
                apellidoPaterno: usuario.apellidos.split(" ")[0],
                apellidoMaterno: usuario.apellidos.split(" ")[1] || "",
                telefono: null,
                dni: null,
              },
              institucion: {
                id: 1,
                siglas: null,
                direccion: null,
                logo: null,
                telefono: null,
              },
            };

            const usuarioResponse = await axios.post(
              `/usuarioApi/crearUsuario`,
              usuarioData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );

            if (usuarioResponse.status === 200) {
              console.log("Usuario del alumno creado exitosamente");
              // alert("Alumno y usuario creados exitosamente");
              //clearInput();
              //handleOk();
            } else {
              console.error("Error al crear el usuario del alumno");
              // alert("Error al crear el usuario del alumno");
            }
          } else {
            console.error("Error al crear el alumno");
            //   alert("Error al crear el alumno");
          }
        } else {
          throw new Error(
            `La especialidad "${usuario.especialidad}" no fue encontrada.`,
          );
        }
      } else if (tipoUsuario === "Tutor") {
        const tipotutoriaencontrado = tiposTutoria.find(
          (tiposTutoria) => tiposTutoria.nombre === usuario.tipo_tutoria,
        );
        if (tipotutoriaencontrado) {
          // Crear tutor
          const tutorData = {
            nombre: usuario.nombres,
            apellidoPaterno: usuario.apellidos.split(" ")[0],
            apellidoMaterno: usuario.apellidos.split(" ")[1] || "",
            telefono: usuario.celular,
            linkReunion: null,
            especialidad: usuario.especialidad,
            dni: usuario.codigo,
          };

          const tutorResponse = await axios.post(
            `/tutorApi/crearTutor`,
            tutorData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (tutorResponse.status === 200) {
            const tutorId = tutorResponse.data.id;

            // Asignar tipo de tutoría al tutor
            if (tipotutoriaencontrado.idTipoTutoria) {
              await axios.post(
                `/tipoTutoriaApi/asignarTipoTutoriaATutor/${tipotutoriaencontrado.idTipoTutoria}/${tutorId}`,
              );
            }

            // Crear usuario del tutor
            const usuarioData = {
              codigo: usuario.codigo,
              password: null,
              foto: null,
              tipoUsuario: "Tutor",
              correo: usuario.correo,
              persona: {
                id: tutorId,
                nombre: usuario.nombres,
                apellidoPaterno: usuario.apellidos.split(" ")[0],
                apellidoMaterno: usuario.apellidos.split(" ")[1] || "",
                telefono: null,
                dni: null,
              },
              institucion: {
                id: 1,
                siglas: null,
                direccion: null,
                logo: null,
                telefono: null,
              },
            };

            const usuarioResponse = await axios.post(
              `/usuarioApi/crearUsuario`,
              usuarioData,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );

            if (usuarioResponse.status === 200) {
              console.log("Usuario del tutor creado exitosamente");
              // alert("Tutor, tipo de tutoría y usuario creados exitosamente");
              //clearInput();
              //handleOk();
            } else {
              console.error("Error al crear el usuario del tutor");
              //  alert("Error al crear el usuario del tutor");
            }
          } else {
            console.error("Error al crear el tutor");
            //   alert("Error al crear el tutor");
          }
        } else {
          throw new Error(
            `El tipo tutoria "${usuario.tipo_tutoria}" no fue encontradado.`,
          );
        }
      } else if (tipoUsuario === "Coordinador de Especialidad") {
        const especialidadEncontrada = especialidades.find(
          (especialidades) => especialidades.nombre === usuario.especialidad,
        );
        if (especialidadEncontrada) {
          const coordinador_especialidad = {
            nombre: usuario.nombres,
            apellidoPaterno: usuario.apellidos.split(" ")[0],
            apellidoMaterno: usuario.apellidos.split(" ")[1] || "",
            telefono: usuario.celular,
            dni: usuario.DNI,
          };

          const response = await axios.post(
            `/usuarioApi/crearCoordinadorEspecialidad`,
            coordinador_especialidad,
            {
              params: {
                codigo: usuario.codigo,
                correo: usuario.correo,
                especialidad: especialidadEncontrada.id,
              },
            },
          );
          if (response.status === 200) {
            console.log(
              "Usuario Coordinador de Especialidad creado exitosamente",
            );
          }
        } else {
          console.error(
            "Error al crear el usuario Coordinador de Especialidad",
          );
        }
      } else if (tipoUsuario === "Coordinador de Facultad") {
        const facultadEncontrada = facultades.find(
          (facultades) => facultades.nombre === usuario.facultad,
        );
        if (facultadEncontrada) {
          const coordinador_facultad = {
            nombre: usuario.nombres,
            apellidoPaterno: usuario.apellidos.split(" ")[0],
            apellidoMaterno: usuario.apellidos.split(" ")[1] || "",
            telefono: usuario.celular,
            dni: usuario.DNI,
          };
          const response = await axios.post(
            `/usuarioApi/crearCoordinadorFacultad`,
            coordinador_facultad,
            {
              params: {
                codigo: usuario.codigo,
                correo: usuario.correo,
                facultad: facultadEncontrada.id,
              },
            },
          );
          if (response.status === 200) {
            console.log("Usuario Coordinador de Facultad creado exitosamente");
          }
        } else {
          console.error("Error al crear el usuario Coordinador de Facultad");
        }
      } else if (tipoUsuario === "Administrador") {
        const admin = {
          nombre: usuario.nombres,
          apellidoPaterno: usuario.apellidos.split(" ")[0],
          apellidoMaterno: usuario.apellidos.split(" ")[1] || "",
          telefono: usuario.celular,
          dni: usuario.DNI,
        };
        const response = await axios.post(
          `/usuarioApi/crearAdministrador`,
          admin,
          {
            params: {
              codigo: usuario.codigo,
              correo: usuario.correo,
            },
          },
        );
        if (response.status == 200) {
          console.log("Usuario Administrador creado exitosamente");
        } else {
          console.error("Error al crear el usuario Administrador");
        }
      } else if (tipoUsuario === "Tutor de Derivacion") {
        const facultadEncontrada = facultades.find(
          (facultades) => facultades.nombre === usuario.facultad,
        );
        if (facultadEncontrada) {
          const coordinador_facultad = {
            nombre: usuario.nombres,
            apellidoPaterno: usuario.apellidos.split(" ")[0],
            apellidoMaterno: usuario.apellidos.split(" ")[1] || "",
            telefono: usuario.celular,
            dni: usuario.DNI,
          };
          const response = await axios.post(
            `/usuarioApi/crearTutordeDerivacion`,
            coordinador_facultad,
            {
              params: {
                codigo: usuario.codigo,
                correo: usuario.correo,
                facultad: facultadEncontrada.id,
              },
            },
          );
          if (response.status === 200) {
            console.log("Usuario Tutor de Derivacion creado exitosamente");
          }
        } else {
          console.error("Error al crear el usuario Tutor de Derivacion");
        }
      }
    } catch (error) {
      console.error("Error al insertar usuario:", error);
      console.error(
        "Detalles de la respuesta del servidor:",
        error.response.data,
      );
    }
  };

  const handleGuardarCambiosClick = async () => {
    //console.log("tableData", tableData);
    for (const usuario of tableData) {
      //console.log("usuario", usuario);
      await handleInsertarClick(usuario);
    }
  };

  const handleInsertarUsuarios = async () => {
    try {
      const insertPromises = tableData.map((usuario) =>
        handleInsertarClick(usuario),
      );
      await Promise.all(insertPromises);
      message.success("Usuarios insertados exitosamente");
      setIsModalVisible(false);
      setSelectedFile(null);
      setTableData([]);
    } catch (error) {
      console.error("Error al insertar usuarios:", error);
      message.error("Ocurrió un error al insertar usuarios.");
    }
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={adminItems}>
        <Modal
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={1500}
          modalRender={(node) => (
            <div style={{ backgroundColor: "#0000FF" }}>{node}</div>
          )}
          footer={null}
          maskClosable={false}
        >
          <Row>
            <Title
              className="font-semibold"
              style={{
                color: "#043b71",
                textAlign: "left",
                marginBottom: "8px",
              }}
            >
              Vista Previa
            </Title>
          </Row>
          <Row justify="end" style={{ marginBottom: "20px" }}>
            {errorMessages.length > 0 && (
              <div style={{ color: "red", marginRight: "20px" }}>
                <div style={{ display: "inline" }}>
                  {errorMessages.join(" - ")}
                </div>
              </div>
            )}
            <Button
              key="submit"
              type="primary"
              onClick={handleInsertarUsuarios}
              style={{ textAlign: "right" }}
              disabled={isSaveButtonDisabled}
            >
              Guardar cambios
            </Button>
          </Row>

          <>
            {fileName === "tutores.csv" ? (
              <Table dataSource={tableData} columns={columnsTutor} />
            ) : fileName === "alumnos.csv" ? (
              <Table dataSource={tableData} columns={columnsAlumno} />
            ) : fileName === "coordinadoresEspecialidad.csv" ? (
              <Table
                dataSource={tableData}
                columns={columnsCoordinadorEspecialidad}
              />
            ) : fileName === "coordinadoresFacultad.csv" ? (
              <Table
                dataSource={tableData}
                columns={columnsCoordinadorFacultad}
              />
            ) : fileName === "administradores.csv" ? (
              <Table dataSource={tableData} columns={columnsAdministrador} />
            ) : fileName === "tutoresDerivacion.csv" ? (
              <Table dataSource={tableData} columns={columnsTutorDerivacion} />
            ) : null}
          </>
        </Modal>

        <Row
          justify="space-between"
          align="middle"
          style={{ width: "95%", margin: "0 auto 40px" }}
        >
          <Col>
            <Title
              className="font-semibold"
              style={{
                color: "#043b71",
                textAlign: "left",
                marginBottom: "8px",
              }}
            >
              Registro Masivo de Usuarios
            </Title>
          </Col>
          <Col>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Tooltip>
                <Dropdown
                  menu={{
                    items,
                    onClick,
                  }}
                  shape="rectangle"
                >
                  <Button
                    shape="rectangle"
                    style={{ color: "#0884FC", borderColor: "#0884FC" }}
                  >
                    Descargar formato en CSV
                  </Button>
                </Dropdown>
              </Tooltip>
            </div>
          </Col>
        </Row>
        <div>
          <Dragger
            {...props}
            accept=".csv"
            style={{ width: "95%", margin: "0 auto" }}
          >
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">
              Seleccione su archivo o arrastre y suéltelo aquí
            </p>
            <p className="ant-upload-hint">
              CSV,el archivo no puede superar los 50 MB.
            </p>
            <Button
              size="large"
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
        </div>

        <div
          style={{
            width: "95%",
            border: "3px dotted #ccc",
            borderRadius: "10px",
            margin: "20px auto",
            padding: "15px",
            color: "#888",
          }}
        >
          <p>
            <InfoCircleOutlined style={{ color: "#0884FC" }} /> No se deben
            combinar tipos de usuario en el csv. La carga masiva solo es
            admisible para tutores, alumnos, coorinadores de Especialidad,
            coordinadores de Facultad, tutores de derivacion y administradores.
          </p>
          <p>
            El formato de alumnos debe incluir los siguientes datos en dicho
            orden: código, nombres, apellidos, correo, celular, especialidad y
            condición
          </p>
          <p>
            El formato de tutores debe incluir los siguientes datos en dicho
            orden: código, nombres, apellidos, correo, celular, especialidad y
            tipo de tutoría
          </p>
          <p>
            El formato de coordinadores de Especialidad debe incluir los
            siguientes datos en dicho orden: codigo, nombres, apellidos, correo,
            celular, DNI, especialidad
          </p>
          <p>
            El formato de coordinadores de Facultad debe incluir los siguientes
            datos en dicho orden: codigo, nombres, apellidos, correo, celular,
            DNI, facultad
          </p>
          <p>
            El formato de tutores de Derivacion debe incluir los siguientes
            datos en dicho orden: codigo, nombres, apellidos, correo, celular,
            DNI, facultad
          </p>
          <p>
            El formato de Administradores debe incluir los siguientes datos en
            dicho orden: codigo, nombres, apellidos, correo, celular, DNI
          </p>
          <p>El archivo debe tener únicamente el tipo de usuario como nombre</p>
          <p>Las facultades permitidas son:</p>
          <p>
            {facultades.map((facultad) => (
              <span key={facultad.id}>{facultad.nombre}, </span>
            ))}
          </p>
          <p>Las especialidades permitidas son:</p>
          <p>
            {especialidades.map((especialidad) => (
              <span key={especialidad.id}>{especialidad.nombre}, </span>
            ))}
          </p>
          <p>
            Ejemplo: tutores.csv, administradores.csv, tutoresDerivacion.csv,
            coordinadoresEspecialidad.csv,coordinadoresFacultad.csv
          </p>
        </div>
      </LayoutComponent>
    </main>
  );
}
