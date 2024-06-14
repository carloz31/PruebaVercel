import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import TipoTutoriaSelect from "./TipoTutoriaSelect";
import axios from "@/utils/axiosConfig";

const EditUserModal = ({
  isModalOpen,
  handleOk,
  handleCancel,
  usuarioEditando,
  form,
  setTipoUsuarioSeleccionado,
  setEspecialidad,
  setTipoTutoria,
  setCorreoOriginal,
  especialidades,
}) => {
  const [tipoUsuarioSeleccionadoLocal, setTipoUsuarioSeleccionadoLocal] = useState("");
  const [especialidadLocal, setEspecialidadLocal] = useState("");
  const [tipoTutoriaLocal, setTipoTutoriaLocal] = useState(null);
  const [correoOriginalLocal, setCorreoOriginalLocal] = useState("");
  const [usuarioDetalles, setUsuarioDetalles] = useState(null);

  useEffect(() => {
    if (usuarioEditando) {
      fetchUsuarioDetalles(usuarioEditando.id);
    } else {
      clearForm();
    }
  }, [usuarioEditando]);

  const clearForm = () => {
    setTipoUsuarioSeleccionadoLocal("");
    setEspecialidadLocal("");
    setTipoTutoriaLocal(null);
    setCorreoOriginalLocal("");
    setUsuarioDetalles(null);
    form.resetFields();
  };

  const fetchUsuarioDetalles = async (usuarioId) => {
    try {
      const response = await axios.get(
        `/usuarioApi/buscarUsuarioPorId/${usuarioId}`,
      );
      const usuarioData = response.data;
      setUsuarioDetalles(usuarioData);
      form.setFieldsValue({
        codigo: usuarioData.persona.dni,
        nombres: usuarioData.persona.nombre,
        apellidos: `${usuarioData.persona.apellidoPaterno} ${usuarioData.persona.apellidoMaterno}`,
        celular: usuarioData.persona.telefono,
        correo: usuarioData.correo,
        tipoUsuario: usuarioData.tipoUsuario,
      });
      setTipoUsuarioSeleccionadoLocal(usuarioData.tipoUsuario);
      if (usuarioData.tipoUsuario === "Alumno") {
        setEspecialidadLocal(usuarioData.persona.especialidad?.id);
      } else if (usuarioData.tipoUsuario === "Tutor") {
        setTipoTutoriaLocal(usuarioData.persona.tipoTutoria?.id);
      }
      setCorreoOriginalLocal(usuarioData.correo);
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
    }
  };

  const handleTipoUsuarioChange = (value) => {
    setTipoUsuarioSeleccionadoLocal(value);
    setTipoUsuarioSeleccionado(value);
    setTipoTutoriaLocal(null);
    setTipoTutoria(null);
  };

  const handleOkClick = async () => {
    try {
      const values = await form.validateFields();

      const personaData = {
        fecha_creacion: usuarioDetalles.persona.fecha_creacion,
        fecha_modificacion: new Date().toISOString(),
        id: usuarioDetalles.persona.id,
        nombre: values.nombres,
        apellidoPaterno: values.apellidos.split(" ")[0],
        apellidoMaterno: values.apellidos.split(" ")[1] || "",
        telefono: values.celular,
        linkReunion: usuarioDetalles.persona.linkReunion,
        especialidad: especialidadLocal ? { id: especialidadLocal } : usuarioDetalles.persona.especialidad,
        dni: values.codigo,
      };

      const usuarioData = {
        fecha_creacion: usuarioDetalles.fecha_creacion,
        fecha_modificacion: new Date().toISOString(),
        id: usuarioDetalles.id,
        codigo: values.codigo,
        password: usuarioDetalles.password,
        foto: usuarioDetalles.foto,
        tipoUsuario: tipoUsuarioSeleccionadoLocal,
        correo: values.correo,
        persona: personaData,
        institucion: usuarioDetalles.institucion,
      };

      await axios.put(
        `${process.env.backend}/usuarioApi/actualizarUsuario`,
        usuarioData
      );

      message.success("Usuario actualizado exitosamente");
      handleOk();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      message.error("Error al actualizar usuario");
    }
  };

  return (
    <Modal
      title="Editar usuario"
      open={isModalOpen}
      onOk={handleOkClick}
      onCancel={handleCancel}
      okText="Actualizar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="codigo"
          label="DNI"
          rules={[
            { required: true, message: "Por favor, ingrese el DNI" },
            { pattern: /^\d{0,8}$/, message: "El DNI debe contener hasta 8 números" },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="nombres"
          label="Nombres"
          rules={[
            { required: true, message: "Por favor, ingrese los nombres" },
            { pattern: /^[a-zA-Z\s]+$/, message: "Los nombres solo deben contener letras del alfabeto" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="apellidos"
          label="Apellidos"
          rules={[
            { required: true, message: "Por favor, ingrese los apellidos" },
            { pattern: /^[a-zA-Z\s]+$/, message: "Los apellidos solo deben contener letras del alfabeto" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="celular"
          label="Teléfono"
          rules={[
            { required: true, message: "Por favor, ingrese el número de teléfono" },
            { pattern: /^\d{0,9}$/, message: "El teléfono debe contener hasta 9 números" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="correo"
          label="Correo"
          rules={[
            { required: true, message: "Por favor, ingrese el correo electrónico" },
            { type: "email", message: "Por favor, ingrese un correo electrónico válido" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="tipoUsuario"
          label="Tipo de Usuario"
          rules={[
            { required: true, message: "Por favor, seleccione el tipo de usuario" },
          ]}
        >
          <Select
            value={tipoUsuarioSeleccionadoLocal}
            onChange={handleTipoUsuarioChange}
            placeholder="Seleccionar tipo de usuario..."
            disabled
          >
            <Select.Option value="Alumno">Alumno</Select.Option>
            <Select.Option value="Tutor">Tutor</Select.Option>
          </Select>
        </Form.Item>
        {tipoUsuarioSeleccionadoLocal === "Alumno" && (
          <Form.Item
            name="especialidad"
            label="Especialidad"
            rules={[
              { required: true, message: "Por favor, seleccione la especialidad del alumno" },
            ]}
          >
            <Select
              value={especialidadLocal}
              onChange={(value) => setEspecialidadLocal(value)}
              placeholder="Seleccionar la especialidad del alumno..."
            >
              {especialidades.map((especialidad) => (
                <Select.Option key={especialidad.id} value={especialidad.id}>
                  {especialidad.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {tipoUsuarioSeleccionadoLocal === "Tutor" && (
          <Form.Item
            name="tipoTutoria"
            label="Tipo de Tutoría"
            rules={[
              { required: true, message: "Por favor, seleccione el tipo de tutoría" },
            ]}
          >
            <TipoTutoriaSelect
              value={tipoTutoriaLocal}
              onChange={(value) => setTipoTutoriaLocal(value)}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default EditUserModal;
