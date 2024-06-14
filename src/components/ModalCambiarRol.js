// components/ModalCambiarRol.js
import React, { useState } from 'react';
import { Modal, Radio, Button } from 'antd';

const ModalCambiarRol = ({ isOpen, onRequestClose, onChangeRole, roles, selectedRoleOut }) => {
  const [selectedRole, setSelectedRole] = useState(selectedRoleOut);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    console.log('Role selected:', e.target.value);
  };

  const handleSubmit = () => {
    console.log('Submit clicked with role:', selectedRole);
    onChangeRole(selectedRole);
    onRequestClose();
  };

  console.log('Modal isOpen:', isOpen);
  console.log('Roles:', roles);

  return (
    <Modal 
      closable={false}
      title="Cambiar de Rol" 
      footer={null}
      open={isOpen} 
      onOk={handleSubmit} 
      onCancel={onRequestClose}
    >
      <Radio.Group onChange={handleRoleChange} value={selectedRole}>
        {roles.map((role) => (
          <Radio key={role.id} value={role.id}>
          {role.nombre_rol}
        </Radio>
        ))}
      </Radio.Group>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button onClick={onRequestClose} style={{ marginRight: '10px' }}>Cancelar</Button>
        <Button type="primary" onClick={handleSubmit}>Confirmar</Button>
      </div>
    </Modal>
  );
};

export default ModalCambiarRol;
