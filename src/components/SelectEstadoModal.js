import React from "react";
import { Modal, Select, Button } from "antd";

const SelectEstadoModal = ({
  isModalVisible,
  setIsModalVisible,
  selectedEstado,
  setSelectedEstado,
  onSearch,
}) => {
  const handleOk = () => {
    setIsModalVisible(false);
    onSearch();
  };

  const handleEstadoChange = (value) => {
    setSelectedEstado(value);
  };

  return (
    <Modal
      title="Seleccionar Estado"
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={[
        <Button key="guardar" type="primary" onClick={handleOk}>
          Guardar
        </Button>,
      ]}
    >
      <Select
        value={selectedEstado}
        onChange={handleEstadoChange}
        style={{ width: "100%" }}
        placeholder="Seleccione el estado"
      >
        <Select.Option value={1}>Activo</Select.Option>
        <Select.Option value={0}>Inactivo</Select.Option>
      </Select>
    </Modal>
  );
};

export default SelectEstadoModal;