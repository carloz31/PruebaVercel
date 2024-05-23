import React from "react";
import { Modal, Input, Select } from "antd";

const AddUserModal = ({ isModalOpen, handleOk, handleCancel, selectedOption, setSelectedOption, setCodigo, setNombres, setApellidos, setCelular, setCorreo, setTipoUsuario }) => {
  return (
    <Modal
      title="Agregar un usuario"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="formulario inicial">
        <div className="form">
          <div className="campo">
            <label htmlFor="codigo" className="codigo-control">
              Código *
            </label>
            <Input
              type="text"
              id="codigo"
              className="codigo-control"
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="nombres" className="nombres-control">
              Nombres *
            </label>
            <Input
              type="text"
              id="nombres"
              className="nombres-control"
              onChange={(e) => setNombres(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="apellidos" className="apellidos-control">
              Apellidos *
            </label>
            <Input
              type="text"
              id="apellidos"
              className="apellidos-control"
              onChange={(e) => setApellidos(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="celular" className="celular-control">
              Celular *
            </label>
            <Input
              type="text"
              id="celular"
              className="celular-control"
              onChange={(e) => setCelular(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="correo" className="correo-control">
              Correo *
            </label>
            <Input
              type="email"
              id="correo"
              className="correo-control"
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="tipoUsuario" className="tipoUsuario-control">
              Tipo de Usuario *
            </label>
            <Select
              id="tipoUsuario"
              className="tipoUsuario-control"
              onChange={(value) => {
                setTipoUsuario(value);
                setSelectedOption(value);
              }}
              value={selectedOption}
              style={{
                width: 472,
                color:
                  selectedOption === "seleccionar" ? "#727272" : "inherit",
              }}
            >
              <Select.Option
                value="seleccionar"
                disabled
                style={{ color: "#999" }}
              >
                Seleccionar tipo de usuario...
              </Select.Option>
              <Select.Option value="alumno">Alumno</Select.Option>
              <Select.Option value="docente">Docente</Select.Option>
            </Select>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;