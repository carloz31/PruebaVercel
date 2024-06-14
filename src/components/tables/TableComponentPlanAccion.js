"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Popconfirm,
  Row,
  Space,
  Spin,
  Form,
  Tag,
  Col,
  Flex,
  Typography,
  Button,
  Input,
  Select,
  message,
} from "antd";
import axios from '@/utils/axiosConfig';
import {
  IconChevronRight,
  IconCircleCheck,
  IconCirclePlus,
  IconCircleX,
  IconEdit,
  IconInfoCircle,
  IconSquareRounded,
  IconSquareRoundedFilled,
  IconTrashX,
} from "@tabler/icons-react";
import "./TableComponentPlanAccion.css";
import RowPlanAccion from "@/components/tables/RowPlanAccion";
import { compareRouterStates } from "next/dist/shared/lib/router/utils/compare-states";

const { Title, Text } = Typography;

const colorArray = ["#0663BD", "#049ECD", "#16C1B7", "#26C387", "#33BB55"];

const TableComponentCitas = ({
  grupoCompromiso,
  index,
  isEditingGrupo,
  isLoading,
  handleInputGrupoChange,
  editingGrupos,
  handleEditGrupo,
  handleSaveGrupo,
  handleCancelGrupo,
  handleDeleteGrupo,
  handleUpdateCompromisos,
  estadoSeleccionado,
}) => {
  if (isLoading) return <Spin size="large" />;

  const [flag, setFlag] = useState(false);
  const [isEditing, setIsEditing] = useState({});
  const [flagChanged, setFlagChanged] = useState(false);
  const [compromisos, setCompromisos] = useState(grupoCompromiso.compromisos);
  const [editingCompromisos, setEditingCompromisos] = useState({});
  const [originalCompromisos, setOriginalCompromisos] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (flagChanged) {
      handleUpdateCompromisos(compromisos, index);
      setFlagChanged(false);
    }
  }, [flagChanged]);

  useEffect(() => {
    setCompromisos(grupoCompromiso.compromisos);
  }, [grupoCompromiso]);

  const handleAgregarCompromiso = () => {
    const nuevoCompromiso = {
      fecha_creacion: new Date().toISOString(),
      fecha_modificación: new Date().toISOString(),
      id: null,
      descripcion: "Nuevo Compromiso",
      estado: estadoSeleccionado === "" ? "Inicio" : estadoSeleccionado,
    };

    setCompromisos([...compromisos, nuevoCompromiso]);
    setFlagChanged(true);
  };

  const handleDeleteCompromiso = (indexComp) => {
    const newCompromisos = [...compromisos];
    newCompromisos.splice(indexComp, 1);
    setCompromisos(newCompromisos);
    setFlagChanged(true);
  };

  const handleEditCompromiso = (indexComp) => {
    setEditingCompromisos({
      ...editingCompromisos,
      [indexComp]: compromisos[indexComp],
    });
    setOriginalCompromisos({
      ...originalCompromisos,
      [indexComp]: { ...compromisos[indexComp] },
    });
    changeEditState(indexComp, true);
  };

  const handleSaveCompromiso = (indexComp) => {
    setCompromisos(
      compromisos.map((compromiso, index) =>
        index === indexComp ? editingCompromisos[indexComp] : compromiso,
      ),
    );
    const { [indexComp]: value, ...remaining } = editingCompromisos;
    setEditingCompromisos(remaining);
    const { [indexComp]: originalValue, ...remainingOriginal } =
      originalCompromisos;
    setOriginalCompromisos(remainingOriginal);

    changeEditState(indexComp, false);
    setFlagChanged(true);
  };

  const handleCancelCompromiso = (indexComp) => {
    setCompromisos(
      compromisos.map((compromiso, index) =>
        index === indexComp ? originalCompromisos[indexComp] : compromiso,
      ),
    );
    const { [indexComp]: value, ...remaining } = editingCompromisos;
    setEditingCompromisos(remaining);
    const { [indexComp]: originalValue, ...remainingOriginal } =
      originalCompromisos;
    setOriginalCompromisos(remainingOriginal);
    changeEditState(indexComp, false);
  };

  const changeEditState = (index, bool) => {
    setIsEditing({ ...isEditing, [index]: bool });
  };

  const handleInputChange = (indexComp, event) => {
    setEditingCompromisos({
      ...editingCompromisos,
      [indexComp]: {
        ...editingCompromisos[indexComp],
        descripcion: event.target.value,
      },
    });
  };

  const handleSelectChange = (indexComp, value) => {
    setEditingCompromisos({
      ...editingCompromisos,
      [indexComp]: {
        ...editingCompromisos[indexComp],
        estado: value,
      },
    });
  };

  return (
    <Flex vertical>
      <Flex gap="small" style={{ marginBottom: 4 }}>
        {isEditingGrupo[index] ? (
          <Space size="middle">
            {contextHolder}
            <IconCircleCheck
              size={20}
              style={{
                cursor: "pointer",
                color: "#0884FC",
              }}
              onClick={() => {
                editingGrupos[index]?.titulo
                  ? handleSaveGrupo(index)
                  : messageApi.open({
                      type: "error",
                      content: "El campo título no puede estar vacío",
                    });
              }}
            />
            <IconCircleX
              size={20}
              style={{
                cursor: "pointer",
                color: "#f5222d",
              }}
              onClick={() => {
                handleCancelGrupo(index);
              }}
            />
          </Space>
        ) : (
          <Space size="small">
            <IconEdit
              size={20}
              style={{
                cursor: "pointer",
                color: "#0884FC",
              }}
              onClick={() => handleEditGrupo(index)}
            />
            <Popconfirm
              title="¿Estás seguro de eliminar este compromiso?"
              onConfirm={() => handleDeleteGrupo(index)}
            >
              <IconTrashX
                size={20}
                style={{ cursor: "pointer", color: "#f5222d" }}
              />
            </Popconfirm>
          </Space>
        )}
      </Flex>
      <Row
        align="middle"
        justify="center"
        className={"fila"}
        style={{
          borderLeft: `20px solid ${colorArray[index % 5]}`,
          paddingRight: 8,
        }}
      >
        <Col span={14} style={{ textAlign: "center" }}>
          <Input
            variant={isEditingGrupo[index] ? "outlined" : "borderless"}
            disabled={!isEditingGrupo[index]}
            value={
              isEditingGrupo[index]
                ? editingGrupos[index].titulo
                : grupoCompromiso.titulo
            }
            style={{
              color: "black",
              fontSize: 16,
              fontWeight: 700,
              textAlign: "center",
            }}
            onChange={(event) => handleInputGrupoChange(index, event)}
            status={editingGrupos[index]?.titulo ? "success" : "error"}
          />
        </Col>
        <Col span={5} style={{ textAlign: "center" }}>
          <Title level={5} style={{ marginBottom: 0 }}>
            Estado
          </Title>
        </Col>
        <Col span={5} style={{ textAlign: "center" }}>
          <Title level={5} style={{ marginBottom: 0 }}>
            Opciones
          </Title>
        </Col>
      </Row>
      {compromisos.length === 0
        ? handleAgregarCompromiso()
        : compromisos.map((compromiso, indexComp) => {
            if (
              compromiso.estado === estadoSeleccionado ||
              estadoSeleccionado === ""
            ) {
              return (
                <RowPlanAccion
                  compromiso={compromiso}
                  index={indexComp}
                  isEditing={isEditing}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  handleEditCompromiso={handleEditCompromiso}
                  handleSaveCompromiso={handleSaveCompromiso}
                  handleCancelCompromiso={handleCancelCompromiso}
                  handleDeleteCompromiso={handleDeleteCompromiso}
                  color={colorArray[index % 5]}
                  editingCompromisos={editingCompromisos}
                />
              );
            }
          })}
      <Row align="middle" justify="center" className={"fila"}>
        <Button
          style={{
            display: "inline-flex",
            alignItems: "center",
            width: "100%",
          }}
          icon={<IconCirclePlus size={20} />}
          iconPosition="start"
          onClick={() => {
            handleAgregarCompromiso();
          }}
        >
          Añadir nuevo compromiso
        </Button>
      </Row>
    </Flex>
  );
};

export default TableComponentCitas;
