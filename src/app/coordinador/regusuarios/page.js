"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import Papa from "papaparse";
//import fs from 'fs';
import { saveAs } from 'file-saver';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from "react";
import { Table, Button, Flex, Typography, Modal, Input, Row, Col } from "antd";
import axios from "@/utils/axiosConfig";
import { coordinadorItems } from "@/utils/menuItems";
//import { useRouter } from 'next/navigation';

import { message, Upload } from 'antd';
//import tutores from './tutores.csv';
import { StarOutlined,InfoCircleOutlined, FilePdfOutlined,ExclamationCircleOutlined, StarTwoTone,InboxOutlined,CloudUploadOutlined  } from '@ant-design/icons';
const { Title } = Typography;
const { Dragger } = Upload;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  //const router = useRouter(); 
  const [idUsuarioSesion,setIdUsuarioSesion] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const [tiposTutoria, setTiposTutoria] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const [validTableData, setValidTableData] = useState([]); //para las lineas que estan correctas
  //const [isValido,setIsValido]=useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.id) {
      get();
    }
  }, [user]);


  const get = async () => {
    setIsLoading(true);
  };

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        console.log("idUsuarioSesion: ",user.id);
        const response = await axios.get(
          `${process.env.backend}/especialidadApi/listarEspecialidadesPorIdUsuario/${user.id}`
        );
        setEspecialidades(response.data);
      } catch (error) {
        console.error("Error al obtener las especialidades:", error);
      }
    };
    fetchEspecialidades();
  }, [user]);


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
    get();
  }, []);

  const validateCodigo = (codigo) => {
    return codigo.length > 1;
  };
  const validateDNI = (dni) => {
    return dni.length === 8  && !isNaN(dni);
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
  const validateCorreo = (correo) => {
    //debugger
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

  const validateApellido = (apellidos) => {
    // Expresión regular para verificar si el nombre contiene solo letras (sin espacios)
    const regex = /^[A-Za-z]+ [A-Za-z]+$/;
    // Devuelve true si el nombre cumple con la expresión regular, de lo contrario, devuelve false
    return regex.test(apellidos);
  };

  const columnsTutor = [
    { title: 'Codigo', dataIndex: 'codigo', key: 'codigo',render: text => renderTextWithValidation(text, validateCodigo(text)) },
    {title: 'DNI', dataIndex: 'dni', key: 'dni',render: text => renderTextWithValidation(text, validateDNI(text))},
    { title: 'Nombres', dataIndex: 'nombres', key: 'nombres', render: text => renderTextWithValidation(text, validateNombre(text)) },
    { title: 'Apellidos', dataIndex: 'apellidos', key: 'apellidos' , render: text => renderTextWithValidation(text, validateApellido(text))},
    { title: 'Correo', dataIndex: 'correo', key: 'correo' ,render: text => {
      const isValid = validateCorreo(text);
      return <span style={{ color: isValid!='El formato del correo no es válido' ? 'inherit' : 'red' }}>{text}</span>;
    }},
    { title: 'Celular', dataIndex: 'celular', key: 'celular', render: text => renderTextWithValidation(text, validateCelular(text)) },
    { title: 'Especialidad', dataIndex: 'especialidad', key: 'especialidad',render: text => {
        const isValid = validateEspecialidad(text);
        return <span style={{ color: isValid ? 'inherit' : 'red' }}>{text}</span>;
      }},
    { title: 'Tipo Tutoria', dataIndex: 'tipo_tutoria', key: 'tipo_tutoria'
    ,render: text => {
      const isValid = validateTipoTutoria(text);
      return <span style={{ color: isValid ? 'inherit' : 'red' }}>{text}</span>;
    }
     },
  ];

  const columnsAlumno = [
    { title: 'Codigo', dataIndex: 'codigo', key: 'codigo', render: text => renderTextWithValidation(text, validateCodigo(text)) },
    {title: 'DNI', dataIndex: 'dni', key: 'dni',render: text => renderTextWithValidation(text, validateDNI(text))},
    { title: 'Nombres', dataIndex: 'nombres', key: 'nombres', render: text => renderTextWithValidation(text, validateNombre(text)) },
    { title: 'Apellidos', dataIndex: 'apellidos', key: 'apellidos', render: text => renderTextWithValidation(text, validateApellido(text)) },
    { title: 'Correo', dataIndex: 'correo', key: 'correo' ,render: text => {
      const isValid = validateCorreo(text);
      return <span style={{ color:  isValid!='El formato del correo no es válido' ? 'inherit' : 'red' }}>{text}</span>;
    }},
    { title: 'Celular', dataIndex: 'celular', key: 'celular', render: text => renderTextWithValidation(text, validateCelular(text))  },
    { title: 'Especialidad', dataIndex: 'especialidad', key: 'especialidad',render: text => {
      const isValid = validateEspecialidad(text);
      return <span style={{ color: isValid ? 'inherit' : 'red' }}>{text}</span>;
    }
    },
  ];

  const renderTextWithValidation = (text, isValid) => {
    return <span style={{ color: isValid ? "inherit" : "red" }}>{text}</span>;
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setErrorMessages([]); // Clear error messages on cancel
    setIsSaveButtonDisabled(false); // Enable save button on cancel
  };

  const props = {
    name: "file",
    showUploadList: false,

    beforeUpload: (file) => {
      setErrorMessages([]); // Clear error messages
      setIsSaveButtonDisabled(false);

      const isCsv = file.type === "text/csv";
      const isAllowedName =
        file.name === "tutores.csv" || file.name === "alumnos.csv";
      if (!isCsv) {
        message.error("Solo se puede subir archivos CSV");
      } else if (!isAllowedName) {
        message.error(
          'Solo se pueden subir archivos llamados "tutores" o "alumnos"',
        );
      } else {
        setFileName(file.name); // Guarda el nombre del archivo
        // debugger

    Papa.parse(file, {
      header: true,
      complete: function (results) {
        const filteredData = results.data.filter(row => {
          return !Object.values(row).every(x => (x === null || x === ''));
        });
        debugger
        console.log("Especialidades :", especialidades);
        console.log("Filtered Data: ", filteredData); // Para depurar
        const errorTypes = new Set();
        const validationErrors = [];
        const validData = [];//para los datos que estan correctos
       // setIsValido(true);
       // console.log("is valido",isValido);
        filteredData.forEach(usuario => {
          let isValido = true;
          //setIsValido(true);
          console.log("is valido 2",isValido);
          if (!validateCodigo(usuario.codigo) && !errorTypes.has('codigo')) {
            validationErrors.push(`El código debe tener al menos 1 caracter.`);
            errorTypes.add('codigo');
            isValido = false;
           // setIsValido(false);
          }
          if (!validateDNI(usuario.dni) && !errorTypes.has('dni')) {
            validationErrors.push(`El dni debe tener exactamente 8 caracteres.`);
            errorTypes.add('dni');
            isValido = false;
           // setIsValido(false);
          }
          if (!validateNombre(usuario.nombres) && !errorTypes.has('nombre')) {
            validationErrors.push(`El nombre contiene caracteres no válidos.`);
            errorTypes.add('nombre');
            isValido = false;
           // setIsValido(false);
          }
          if (!validateApellido(usuario.apellidos) && !errorTypes.has('apellidos')) {
            validationErrors.push(`El apellido contiene caracteres no válidos o no esta conformado por dos palabras.`);
            //para que solo se agrege una vez a la lista de errores
            errorTypes.add('apellidos');
            isValido = false;
           // setIsValido(false);
          }
          if (!validateCelular(usuario.celular) && !errorTypes.has('celular')) {
            validationErrors.push(`El número de celular debe tener exactamente 9 dígitos.`);
            errorTypes.add('celular');
            isValido = false;
           // setIsValido(false);
          }
          const correoValido = validateCorreo(usuario.correo);
          if (typeof correoValido === "string"  && !errorTypes.has('correo')) {
            validationErrors.push(correoValido);
            errorTypes.add('correo');
            isValido = false;
           // setIsValido(false);
          }

         // if (file.name === 'alumnos.csv'){
            const especialidadEncontrada = especialidades.find(especialidades => especialidades.nombre === usuario.especialidad);
            if (!especialidadEncontrada && !errorTypes.has('especialidad')) {
              validationErrors.push(`La especialidad no fue encontrada.`);
              errorTypes.add('especialidad');
              isValido = false;
           //   setIsValido(false);
            }
          //}else 
          if (file.name === 'tutores.csv'){
            const tipotutoriaencontrado = tiposTutoria.find(tiposTutoria => tiposTutoria.nombre === usuario.tipo_tutoria);
            if (!tipotutoriaencontrado && !errorTypes.has('tipoTutoria')) {
              validationErrors.push(`El tipo tutoria no fue encontrado.`);
              errorTypes.add('tipoTutoria');
              isValido = false;
             // setIsValido(false);
            }
          }
          if (isValido) {
            console.log("is valido 3",isValido);
            validData.push(usuario); // Agregar fila válida a validData
          }
        });
        
          
          console.log("data valida",validData);
          setTableData(filteredData);
          setValidTableData(validData); // Guardar datos válidos en el estado
          setErrorMessages(validationErrors);
          setIsModalVisible(true);
          setIsSaveButtonDisabled(validationErrors.length > 0);
      },
      error: function (error) {
        console.error("Error parsing CSV: ", error);
      }
    });
    
      // Evita que se suba el archivo
      return false;
    }
    
    //comment
  }
  };

  
  //const tipoUsuario = fileName === 'tutores.csv' ? 'Tutor' : 'Alumno';

  const handleInsertarClick = async (usuario) => {
    try {
      // debugger
      const tipoUsuario = fileName === "tutores.csv" ? "Tutor" : "Alumno";

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
          cicloEstudios: 202401,
          historialAcademico: null,
          activo: 1,
          especialidad: {
            id: especialidadEncontrada.id,
          },
          tipoAlumno: {
            id: 1,
          },
          dni: usuario.dni,
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
            estado:1,
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
              dni: usuario.dni,
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
          setErrorMessages((prevErrors) => [
            ...prevErrors,
            `La especialidad "${usuario.especialidad}" no fue encontrada.`,
          ]);
          setIsSaveButtonDisabled(true);
          return;
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
          dni: usuario.dni,
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
              dni: usuario.dni,
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
          setErrorMessages((prevErrors) => [
            ...prevErrors,
            `El tipo tutoria "${usuario.tipo_tutoria}" no fue encontradado.`,
          ]);
          setIsSaveButtonDisabled(true);
          return;
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
    try {
        Modal.confirm({
            title: 'Confirmación',
            icon: <ExclamationCircleOutlined />,
            content: `Estás a punto de insertar ${validTableData.length} datos. ¿Deseas continuar?`,
            onOk: async () => {
                for (const usuario of validTableData) {
                //console.log("usuario", usuario);
                await handleInsertarClick(usuario);
                }
                message.success("Usuarios insertados exitosamente");
                setIsModalVisible(false);
                setSelectedFile(null);
                setTableData([]);
                },
            onCancel() {
                // Acciones a realizar si el usuario cancela la operación
            },
            });
    } catch (error) {
      console.error("Error al insertar usuarios:", error);
      message.error("Ocurrió un error al insertar usuarios.");
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
      <LayoutComponent siderItems={coordinadorItems}>
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
              onClick={handleGuardarCambiosClick}
              style={{ textAlign: "right" }}
            >
              Guardar cambios
            </Button>
          </Row>
          <Row>
            <p>Elementos válidos a insertar: {validTableData.length}</p>
          </Row>

          {fileName === "tutores.csv" ? (
            <Table dataSource={tableData} columns={columnsTutor} />
          ) : fileName === "alumnos.csv" ? (
            <Table dataSource={tableData} columns={columnsAlumno} />
          ) : null}
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
              <Button
                type="primary"
                size="large"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "10px",
                }}
                // onClick={descargarFormato}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/tutores.csv";
                  link.setAttribute("download", "tutores.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Descargar Formato Tutor
                <FilePdfOutlined />
              </Button>

              <Button
                type="primary"
                size="large"
                style={{ display: "flex", alignItems: "center" }}
                // onClick={descargarFormato}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/alumnos.csv";
                  link.setAttribute("download", "alumnos.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Descargar Formato Alumno
                <FilePdfOutlined />
              </Button>
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
            admisible para tutores y alumnos.
          </p>
          <p>
            El formato de los campos diferencia entre mayusculas y minusculas.
          </p>
          <p>
            El formato de alumnos debe incluir los siguientes datos en dicho orden: código, dni, nombres, apellidos, correo, celular y especialidad.
          </p>
          <p>
            El documento de tutores debe incluir los siguientes datos en dicho orden: código, dni, nombres, apellidos, correo, celular, especialidad y tipo de tutoría
          </p>
          <p>Especialidades disponibles:</p>
          {especialidades.map((especialidad, index) => (
            <p key={index}>{especialidad.nombre}</p>
          ))}
          <p>El archivo debe tener únicamente el tipo de usuario como nombre</p>
          <p>Ejemplo: tutores.csv y alumnos.csv</p>
        </div>
      </LayoutComponent>
    </main>
  );
}