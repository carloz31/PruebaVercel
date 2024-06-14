"use client";
import React, { useState,useEffect   } from "react";
import { Modal, Input, notification ,Select, Form} from "antd";
import axios from '@/utils/axiosConfig';

const AddUserModalTipo = ({ isModalOpen, handleCancel, tipoUsuario }) => {
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [DNI, setDNI] = useState("");
  const [idFacultad, setIdFacultad] = useState("");
  const [idEspecialidad, setIdEspecialidad] = useState("");
  const [especialidadDescripcion, setEspecialidadDescripcion] = useState("");
  const [linkReunion, setLinkReunion] = useState("");
  const [tipoAlumnoId, setTipoAlumnoId] = useState("");
  const [ciclo, setCiclo] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [tiposAlumno, setTiposAlumno] = useState([]);
  const [tiposTutoria, setTiposTutoria] = useState([]);
  const [tipoTutoriaId, setTipoTutoriaId] = useState("");
  const [filteredEspecialidades, setFilteredEspecialidades] = useState([]);
  const [tutores,setTutores] = useState([]);
  const [tutorId,setTutorId] = useState("");
  const [form] = Form.useForm();

  const { Option } = Select;

  const resetForm = () => {
    setApellidoMaterno("");
    setApellidoPaterno("");
    setNombre("");
    setCodigo("");
    setCelular("");
    setCorreo("");
    setDNI("");
    setIdFacultad("");
    setIdEspecialidad("");
    setEspecialidadDescripcion("");
    setLinkReunion("");
    setTipoAlumnoId("");
    setCiclo("");
    setTipoTutoriaId("");
  };

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await axios.get(`${process.env.backend}/especialidadApi/listarTodosEspecialidad`);
        setEspecialidades(response.data);
      } catch (error) {
        console.error("Error al obtener las especialidades:", error);
      }
    };

    const fetchFacultades = async () => {
      try {
        const response = await axios.get(`${process.env.backend}/facultadApi/listarTodosFacultad`);
        setFacultades(response.data);
      } catch (error) {
        console.error("Error al obtener las facultades:", error);
      }
    };

    const fetchTipoAlumno = async () => {
      try {
        const response = await axios.get(`${process.env.backend}/tipoAlumnoApi/listarTodosTiposAlumno`);
        setTiposAlumno(response.data);
      } catch (error) {
        console.error("Error al obtener las tipos de alumno:", error);
      }
    };

    const fetchTiposTutoria = async () => {
      try {
        const response = await axios.get(`${process.env.backend}/tipoTutoriaApi/listarTodosTiposTutoria`);
        setTiposTutoria(response.data);
      } catch (error) {
        console.error("Error al obtener las tipos de tutoria:", error);
      }
    };

    fetchEspecialidades();
    fetchFacultades();
    fetchTipoAlumno();
    fetchTiposTutoria();
  }, []);

  useEffect(() => {
    if (idFacultad) {
      const filtered = especialidades.filter(especialidad => especialidad.facultad.id === idFacultad);
      setFilteredEspecialidades(filtered);
      setIdEspecialidad("");
    } else {
      setFilteredEspecialidades(especialidades);
    }
  }, [idFacultad, especialidades]);

  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  let tituloModal = "Agregar un usuario";

  // Personaliza el título del modal según el tipo de usuario seleccionado
  if (tipoUsuario) {
    switch (tipoUsuario) {
      case "Administrador":
        tituloModal = "Agregar un Administrador";
        break;
      case "Coordinador de Especialidad":
        tituloModal = "Agregar un Coordinador de Especialidad";
        break;
      case "Coordinador de Facultad":
        tituloModal = "Agregar un Coordinador de Facultad";
        break;
      case "Tutor":
        tituloModal = "Agregar un Tutor";
        break;
      case "Alumno":
        tituloModal = "Agregar un Alumno";
        break;
      case "Tutor de Derivacion":
        tituloModal = "Agregar un Tutor de Derivacion";
        break;
      default:
        tituloModal = "Agregar un usuario";
        break;
    }
  }

  const handleOk = async () => {

    await form.validateFields();

    const values = form.getFieldsValue();

    const admin = {
      nombre: nombre,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno: apellidoMaterno,
      telefono: celular,
      dni: DNI,
    };

    const tutor = {
      nombre: nombre,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno: apellidoMaterno,
      telefono: celular,
      dni: DNI,
    };

    const alumno = {
      nombre: nombre,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno: apellidoMaterno,
      telefono: celular,
      dni: DNI,
    };

    const coordinador_especialidad = {
      nombre: nombre,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno: apellidoMaterno,
      telefono: celular,
      dni: DNI,
    };

    const coordinador_facultad = {
      nombre: nombre,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno: apellidoMaterno,
      telefono: celular,
      dni: DNI,
    };

    try {
      
      if(tipoUsuario == "Administrador"){
        const response = await axios.post(
          `${process.env.backend}/usuarioApi/crearAdministrador`,
          admin, {
            params: {
              codigo: codigo,
              correo: correo,
            },
          },
        );
        console.log("Usuario creado:", response.data);
        openNotificationWithIcon("success", "Administrador creado exitosamente");
        handleCloseModal();
      }
      if(tipoUsuario == "Alumno"){
        const response = await axios.post(
          `${process.env.backend}/usuarioApi/crearAlumno`,
          alumno, {
            params: {
              codigo: codigo,
              correo: correo,
              id_Facu: idFacultad,
              cicloEstudios: ciclo,
              especialidad: idEspecialidad,
              tipoalumno: tipoAlumnoId
            },
          }
        );
        console.log("Usuario creado:", response.data);
        openNotificationWithIcon("success", "Alumno creado exitosamente");
        handleCloseModal();
      }
      if(tipoUsuario == "Coordinador de Facultad"){
        const response = await axios.post(
          `${process.env.backend}/usuarioApi/crearCoordinadorFacultad`,
          coordinador_facultad, {
            params: {
              codigo: codigo,
              correo: correo,
              facultad: idFacultad,
            },
          }
        );
        console.log("Usuario creado:", response.data);
        openNotificationWithIcon("success", "Coordinador de Facultad creado exitosamente");
        handleCloseModal();
      }
      if(tipoUsuario == "Tutor de Derivacion"){
        const response = await axios.post(
          `${process.env.backend}/usuarioApi/crearTutordeDerivacion`,
          coordinador_facultad, {
            params: {
              codigo: codigo,
              correo: correo,
              facultad: idFacultad,
            },
          }
        );
        console.log("Usuario creado:", response.data);
        openNotificationWithIcon("success", "Tutor de Derivacion creado exitosamente");
        handleCloseModal();
      }
      if(tipoUsuario == "Coordinador de Especialidad"){
        debugger
        const response = await axios.post(
          `${process.env.backend}/tutorApi/asignarTutoraEspecialidad/${tutorId}/${2}/${idEspecialidad}`,
        );
        console.log("Tutor asignado correctamente", response.data);
        openNotificationWithIcon("success", "Asignacion exitosa");
        handleCloseModal();
      }
      if(tipoUsuario == "Tutor"){
        const response = await axios.post(
          `${process.env.backend}/usuarioApi/crearTutor`,
          tutor, {
            params: {
              codigo: codigo,
              correo: correo,
              especialidad: idEspecialidad,
              tipo: tipoTutoriaId,
              linkReunion: linkReunion,
              especialidad_id: idEspecialidad
            },
          }
        );
        console.log("Usuario creado:", response.data);
        openNotificationWithIcon("success", "Tutor creado exitosamente");
        handleCloseModal();
      }
      debugger;
      resetForm();
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      openNotificationWithIcon("error", "Error al crear el usuario");
      setSuccessMessage("");
    }

  };

  const handleCloseModal = () => {
    handleCancel(); // Cerrar el modal de creación de usuario
    form.resetFields();
    setShowSuccessModal(true); // Mostrar el modal de éxito
  };

  const fetchTutoresPorEspecialidad = async (idEspecialidad) => {
    try {
      const response = await axios.get(`${process.env.backend}/tutorApi/listarTutorPorEspecialidad/${idEspecialidad}`);
      setTutores(response.data);
      console.log(tutores);
    } catch (error) {
      console.error('Error fetching tutores:', error);
    }
  };

  const setTutor = (tutor) =>{
    debugger;
    setTutorId(tutor);
  }

  return (
    <Modal title={tituloModal} visible={isModalOpen} onOk={handleOk} onCancel={handleCloseModal} maskClosable={false}>
      <Form form={form} autoComplete="off"
              layout="vertical">
        {(tipoUsuario === "Tutor" || tipoUsuario === "Alumno" || tipoUsuario === "Administrador") && (
          <>
        <Form.Item label={<strong>Codigo</strong>} name="codigo" rules={[{ required: true, message: 'Por favor ingrese el código' }]}>
          <Input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)}/>
        </Form.Item>
        <Form.Item label={<strong>DNI</strong>} name="DNI" rules={[{ required: true, message: 'Por favor ingresar los digitos del DNI' },{ pattern: /^\d{8}$/, message: 'El DNI debe tener 8 dígitos' },]}>
          <Input inputMode="numeric" placeholder="DNI" value={DNI} onChange={(e) => setDNI(e.target.value.replace(/\D/g, ''))}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          
        />
        </Form.Item>
        <Form.Item label={<strong>Nombre</strong>} name="nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}>
          <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          onKeyPress={(e) => {
            if (!/[a-zA-Z]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          inputMode="text"
        />
        </Form.Item>
        <Form.Item label={<strong>Apellido Paterno</strong>} name="apellidoPaterno" rules={[{ required: true, message: 'Por favor ingrese el apellido paterno' }]}>
          <Input placeholder="Apellido Paterno" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          onKeyPress={(e) => {
            if (!/[a-zA-Z]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          inputMode="text"
        />
        </Form.Item>
        <Form.Item label={<strong>Apellido Materno</strong>} name="apellidoMaterno" rules={[{ required: true, message: 'Por favor ingrese el apellido materno' }]}>
          <Input placeholder="Apellido Materno" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value.replace(/[^a-zA-Z]/g, ''))}
          onKeyPress={(e) => {
            if (!/[a-zA-Z]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          inputMode="text"
        />
        </Form.Item>
        <Form.Item label={<strong>Telefono</strong>} name="celular" rules={[{ required: true, message: 'Por favor ingrese el teléfono' },{ pattern: /^\d{9}$/, message: 'El teléfono debe tener 9 dígitos' },]}>
          <Input placeholder="Teléfono" value={celular} onChange={(e) => setCelular(e.target.value.replace(/\D/g, ''))}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          
        />
        </Form.Item>
        <Form.Item label={<strong>Correo</strong>} name="correo" rules={[{ required: true, message: 'Por favor ingrese el correo' }]}>
          <Input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)}/>
        </Form.Item>
        </>
        )}
        {(tipoUsuario === "Tutor" || tipoUsuario === "Alumno" || tipoUsuario === "Coordinador de Facultad" || tipoUsuario === "Tutor de Derivacion" || tipoUsuario === "Coordinador de Especialidad") && (
          <Form.Item label={<strong>Facultad</strong>} name="facultad" rules={[{ required: true, message: 'Por favor seleccione la facultad' }]}>
            <Select  id="id"
                className="idEspecialidad-control"
                onChange={(value) => setIdFacultad(value)}
                placeholder="Seleccione una facultad"
                style={{ width: "100%" }}>
              {facultades.map(facultad => (
                <Option key={facultad.id} value={facultad.id}>
                  {facultad.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {(tipoUsuario === "Alumno" || tipoUsuario === "Coordinador de Especialidad" || tipoUsuario === "Tutor") && (
          <Form.Item label={<strong>Especialidad</strong>} name="especialidad" rules={[{ required: true, message: 'Por favor seleccione la especialidad' }]}>
            <Select id="id"
                    className="idEspecialidad-control"
                    onChange={(value) => {
                      fetchTutoresPorEspecialidad(value);
                      setIdEspecialidad(value)}}
                    placeholder="Seleccione una especialidad"
                    value={idEspecialidad}
                    style={{ width: "100%" }}>
              {filteredEspecialidades.map(especialidad => (
                <Option key={especialidad.id} value={especialidad.id}>
                  {especialidad.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {tipoUsuario === "Coordinador de Especialidad" && (
        <>
        <Form.Item
          label={<strong>Tutor</strong>}
          name="tutor"
          rules={[{ required: true, message: 'Por favor seleccione un tutor' }]}
        >
          <Select
            showSearch
            placeholder="Seleccione un tutor"
            optionFilterProp="children"
            onChange={(value) => setTutor(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: "100%" }}
          >
            {tutores.map(tutor => (
              <Option key={tutor.id} value={tutor.id}>
                {tutor.persona.apellidoPaterno} {tutor.persona.apellidoMaterno} {tutor.persona.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
        )}
        {tipoUsuario === "Alumno" && (
          <>
            <Form.Item label={<strong>Tipo de Alumno</strong>} name="tipoAlumno" rules={[{ required: true, message: 'Por favor seleccione el tipo de alumno' }]}>
              <Select id="id"
                    className="idTipoAlumno-control"
                    onChange={(value) => setTipoAlumnoId(value)}
                    placeholder="Seleccione un tipo de alumno"
                    style={{ width: "100%" }}>
                {tiposAlumno.map(tipo => (
                  <Option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={<strong>Ciclo de Estudios</strong>} name="ciclo" rules={[{ required: true, message: 'Por favor ingrese el ciclo' }]}>
              <Input placeholder="Ciclo de Estudios" value={ciclo} onChange={(e) => setCiclo(e.target.value.replace(/\D/g, ''))}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          
        />
            </Form.Item>
          </>
        )}
        {tipoUsuario === "Tutor" && (
          <>
          <Form.Item
          label={<strong>Link de Reunion</strong>}
            name="linkReunion"
            rules={[{ message: 'Por favor ingrese el link de la reunión' }]}
          >
            <Input 
              placeholder="Link de Reunión"
              value={linkReunion}
              onChange={(e) => setLinkReunion(e.target.value)}
            />
          </Form.Item>
          <Form.Item label={<strong>Tipo de Tutoria</strong>} name="tipoTutoria" rules={[{ required: true, message: 'Por favor seleccione el tipo de tutoria' }]}>
          <Select
                    id="idTipoTutoria"
                    className="idTipoTutoria-control"
                    onChange={(value) => setTipoTutoriaId(value)}
                    placeholder="Seleccione un tipo de tutoria"
                    style={{ width: "100%" }}
                  >
                    {tiposTutoria.map((tipo) => (
                      <Option key={tipo.idTipoTutoria} value={tipo.idTipoTutoria}>
                        {tipo.nombre}
                      </Option>
                    ))}
                  </Select>
          </Form.Item>
          </>
        )}
      </Form>
    </Modal>
    
  );
};

export default AddUserModalTipo;