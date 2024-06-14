import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Card,
  message,
  List,
  Empty,
  Space,
  Row,
  Col,
  Spin,
} from "antd";
import axios from "@/utils/axiosConfig";
import debounce from "lodash/debounce";

const ModalAsignacionTipo = ({
  isModalOpen,
  handleCancel,
  handleSave,
  existingMembers,
}) => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading spinner
  const [hasSearched, setHasSearched] = useState(false); // State to track if a search has been performed
  const existingMemberSet = new Set(existingMembers.map((user) => user.codigo));

  useEffect(() => {
    form.resetFields();
    setSearchResults([]);
    setSelectedUsers([]);
    setHasSearched(false); // Reset hasSearched when the modal is opened
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation(); // Prevents modal from closing
        form.resetFields(["usercodigo"]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [form]);

  const handleSearch = useCallback(
    debounce(async (codigoNombre) => {
      if (!codigoNombre) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      setLoading(true); // Start loading spinner
      setHasSearched(true); // Indicate that a search has been performed
      try {
        const [response_tutor, response_alumno] = await Promise.all([
          axios.get(
            `/usuarioApi/listarTodosUsuariosXnombre?nombre=${codigoNombre}&id_tipo=${3}`,
          ),
          axios.get(
            `/usuarioApi/listarTodosUsuariosXnombre?nombre=${codigoNombre}&id_tipo=${4}`,
          ),
        ]);

        const combinedResults = [
          ...response_tutor.data,
          ...response_alumno.data,
        ];
        const results = combinedResults.map((user) => {
          const { persona } = user;
          const nombreCompleto = persona
            ? `${persona.nombre || ""} ${persona.apellidoPaterno || ""} ${persona.apellidoMaterno || ""}`.trim()
            : "";
          return { ...user, nombreCompleto, seleccionado: false };
        });
        setSearchResults(results);
      } catch (error) {
        console.error("Error con respuesta de búsqueda", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    }, 300),
    [],
  );

  const handleSearchButtonClick = () => {
    const codigoNombre = form.getFieldValue("usercodigo");
    if (codigoNombre) {
      handleSearch(codigoNombre);
    } else {
      message.error("Ingrese un código o nombre a buscar");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleSearchButtonClick();
    }
  };

  const handleSelectUser = (user) => {
    if (!selectedUsers.some((u) => u.codigo === user.codigo)) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchResults(
        searchResults.map((result) =>
          result.codigo === user.codigo
            ? { ...result, seleccionado: true }
            : result,
        ),
      );
    }
  };

  const handleRemoveUser = (codigo) => {
    setSelectedUsers(selectedUsers.filter((user) => user.codigo !== codigo));
    setSearchResults(
      searchResults.map((result) =>
        result.codigo === codigo ? { ...result, seleccionado: false } : result,
      ),
    );
  };

  const handleClear = () => {
    setSearchResults([]);
    setSelectedUsers([]);
    form.resetFields();
    setHasSearched(false); // Reset hasSearched when clearing the form
  };

  const handleSaveClick = () => {
    handleSave(selectedUsers);
  };

  return (
    <Modal
      open={isModalOpen}
      footer={null}
      closable={false}
      onCancel={handleCancel}
      maskClosable={false} // Prevent modal from closing when clicking outside
      width="70%"
      centered
      style={{ top: 20 }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
        <Form form={form} layout="vertical" onKeyPress={handleKeyPress}>
          <Form.Item>
            <Row gutter={8}>
              <Col flex="auto">
                <Form.Item name="usercodigo" noStyle>
                  <Input placeholder="Buscar usuario por nombre o código" />
                </Form.Item>
              </Col>
              <Col>
                <Button type="primary" onClick={handleSearchButtonClick}>
                  Buscar Miembro
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "8px",
            marginBottom: "10px",
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #f1f1f1",
          }}
        >
          <style>
            {`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }

              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
              }

              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 10px;
                border: 3px solid #f1f1f1;
              }

              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #555;
              }
            `}
          </style>
          <div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "semi-bold",
                color: "#043b71",
                marginBottom: "10px",
              }}
            >
              Usuarios Seleccionados
            </h3>
            {selectedUsers.length === 0 ? (
              <Empty description="No hay usuarios seleccionados" />
            ) : (
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={selectedUsers}
                renderItem={(user) => (
                  <List.Item>
                    <Card
                      key={user.codigo}
                      title={user.nombreCompleto}
                      extra={
                        <Button
                          onClick={() => handleRemoveUser(user.codigo)}
                          style={{
                            width: "100px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          Remover
                        </Button>
                      }
                      style={{
                        fontSize: "12px",
                        padding: "5px",
                        height: "100%",
                        marginBottom: 16,
                      }}
                    >
                      <p>
                        <strong>Tipo de Usuario:</strong> {user.tipoUsuario}
                      </p>
                      <p>
                        <strong>codigo:</strong> {user.codigo}
                      </p>
                      <p>
                        <strong>correo:</strong> {user.correo}
                      </p>
                    </Card>
                  </List.Item>
                )}
              />
            )}
            <hr />
            <div className="custom-scrollbar" style={{ marginBottom: 10 }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "semi-bold",
                  color: "#043b71",
                  marginBottom: "10px",
                }}
              >
                Resultados
              </h3>
              <Spin spinning={loading}>
                {hasSearched &&
                  (searchResults.length > 0 ? (
                    <List
                      grid={{ gutter: 16, column: 2 }}
                      dataSource={searchResults}
                      locale={{ emptyText: null }}
                      renderItem={(user) => (
                        <List.Item>
                          <Card
                            title={user.nombreCompleto}
                            extra={
                              <Button
                                onClick={() => handleSelectUser(user)}
                                disabled={
                                  existingMemberSet.has(user.codigo) ||
                                  user.seleccionado
                                }
                                style={{
                                  width: "100px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {existingMemberSet.has(user.codigo)
                                  ? "Miembro"
                                  : user.seleccionado
                                    ? "Seleccionado"
                                    : "Seleccionar"}
                              </Button>
                            }
                            style={{
                              fontSize: "12px",
                              padding: "5px",
                              height: "100%",
                            }}
                          >
                            <p>
                              <strong>Tipo de Usuario:</strong>{" "}
                              {user.tipoUsuario}
                            </p>
                            <p>
                              <strong>codigo:</strong> {user.codigo}
                            </p>
                            <p>
                              <strong>correo:</strong> {user.correo}
                            </p>
                          </Card>
                        </List.Item>
                      )}
                    />
                  ) : (
                    !loading && (
                      <Empty description="No se hallaron usuarios que coincidan con la búsqueda" />
                    )
                  ))}
              </Spin>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", marginTop: "auto" }}>
          <Space>
            <Button onClick={handleClear}>Limpiar</Button>
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button type="primary" onClick={handleSaveClick}>
              Guardar
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAsignacionTipo;
