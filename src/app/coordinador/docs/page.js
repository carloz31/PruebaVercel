"use client";
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Table, Button, Flex, Typography, Modal, Input, Row, Col } from "antd";
import { message, Upload } from "antd";

import { coordinadorItems } from "@/utils/menuItems";
import {
  StarOutlined,
  InfoCircleOutlined,
  FilePdfOutlined,
  StarTwoTone,
  InboxOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import axios from "@/utils/axiosConfig";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Dragger } = Upload;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [fileListNotFound, setFileListNotFound] = useState([]);
  const { user } = useUser();
  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const checkUserRole = () => {
      if (user?.rolSeleccionado !== 2 && user?.rolSeleccionado !== 5) {
        // El usuario no tiene el rol de coordinador
        router.back(); // Redirige a la página anterior
      }
    };

    checkUserRole();
  }, [user, router]);

  const get = async () => {
    setIsLoading(true);
  };

  useEffect(() => {
    get();
  }, []);

  // const handleRemoveFile = async (index, fileName) => {
  //   try {
  //     const codigo = fileName.substring(0, fileName.lastIndexOf("."));
  //     const response = await axios.post(
  //       `${process.env.backend}/usuarioApi/buscarUsuarioPorCodigo`,
  //       [codigo]
  //     );

  //     if (response.data.length > 0) {
  //       const usuario = response.data[0];
  //       console.log("Usuario encontrado:", usuario);
  //       // Realiza las acciones necesarias con el usuario encontrado

  //       const updatedPdfFiles = [...pdfFiles];
  //       const updatedFileNames = [...fileNames];
  //       const updatedFileList = [...fileList];
  //       const updatedSelectedUsers = [...selectedUsers]; // Agregar esta línea

  //       updatedPdfFiles.splice(index, 1);
  //       updatedFileNames.splice(index, 1);
  //       updatedFileList.splice(index, 1);
  //       updatedSelectedUsers.splice(index, 1); // Agregar esta línea

  //       setPdfFiles(updatedPdfFiles);
  //       setFileNames(updatedFileNames);
  //       setFileList(updatedFileList);
  //       setSelectedUsers(updatedSelectedUsers); // Agregar esta línea
  //     } else {
  //       console.log("Usuario no encontrado");
  //       // Realiza las acciones necesarias cuando no se encuentra el usuario
  //     }
  //   } catch (error) {
  //     console.error("Error al buscar el usuario:", error);
  //     // Maneja el error de manera adecuada
  //   }
  // };

  const handleSaveChanges = async () => {
    try {
      const uploadPromises = fileList.map(async (file, index) => {
        const usuario = selectedUsers[index];
        const personaId = usuario.persona.id;
        const formData = new FormData();
        formData.append("pdf", file);
        await axios.put(
          `${process.env.backend}/alumnoApi/subirHistorialAcademico/${personaId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      });

      await Promise.all(uploadPromises);
      message.success("Archivos subidos exitosamente");
      setIsModalVisible(false);
      setFileList([]);
      setFileListNotFound([]);
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error al subir los archivos:", error);
      message.error("Ocurrió un error al subir los archivos");
    }
  };

  const columnsFiles = [
    {
      title: "Nombre del archivo",
      dataIndex: "name",
      key: "name",
    },
    // {
    //   title: "Acciones",
    //   key: "actions",
    //   render: (_, record, index) => (
    //     <Button
    //       type="link"
    //       onClick={() => handleRemoveFile(index)}
    //       style={{ color: "red" }}
    //     >
    //       Eliminar
    //     </Button>
    //   ),
    // },
  ];

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,

    beforeUpload: async (file) => {
      const isPdf = file.type === "application/pdf";

      if (!isPdf) {
        message.error("Solo se pueden subir archivos PDF");
      } else {
        const isFileAlreadySelected = fileList.some(
          (selectedFile) => selectedFile.name === file.name
        );

        if (!isFileAlreadySelected) {
          const fileName = file.name;
          const codigo = fileName.substring(0, fileName.lastIndexOf("."));

          try {
            const response = await axios.post(
              `${process.env.backend}/usuarioApi/buscarUsuarioPorCodigo`,
              [codigo]
            );

            if (response.data.length > 0) {
              // El usuario existe en la base de datos
              const usuario = response.data[0];
              setPdfFiles((prevFiles) => [...prevFiles, file]);
              setFileNames((prevNames) => [...prevNames, file.name]);
              setFileList((prevList) => [...prevList, file]);
              setSelectedUsers((prevUsers) => [...prevUsers, usuario]); // Agregar esta línea
            } else {
              // El usuario no existe en la base de datos
              setFileListNotFound((prevList) => [...prevList, file]);
              console.log(
                `El usuario con código ${codigo} no existe en la base de datos`
              );
            }
          } catch (error) {
            console.error("Error al buscar el usuario:", error);
            // Maneja el error de manera adecuada
          }
        }

        setIsModalVisible(true);
      }

      console.log("Archivos guardados:", pdfFiles);
      console.log("Usuarios seleccionados:", selectedUsers); // Agregar esta línea

      return false;
    },
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={coordinadorItems}>
        <Modal
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setFileList([]);
            setFileListNotFound([]);
          }}
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
            <Button
              key="submit"
              type="primary"
              style={{ textAlign: "right" }}
              onClick={handleSaveChanges}
            >
              Guardar cambios
            </Button>
          </Row>

          {fileList.length > 0 && (
            <div>
              <Title level={4}>Archivos seleccionados:</Title>
              <Table
                dataSource={fileList}
                columns={columnsFiles}
                pagination={false}
              />
            </div>
          )}

          {fileListNotFound.length > 0 && (
            <div>
              <Title level={4}>Archivos no encontrados:</Title>
              <ul>
                {fileListNotFound.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
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
              Registro de Histórico Académico
            </Title>
          </Col>
          {/* <Col>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="primary"
                size="large"
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/alumnos.pdf";
                  link.setAttribute("download", "alumnos.pdf");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Descargar formato
                <FilePdfOutlined />
              </Button>
            </div>
          </Col> */}
        </Row>

        <div style={{ marginTop: "20px" }}>
          <Dragger
            {...props}
            accept=".pdf"
            style={{ width: "95%", margin: "0 auto" }}
          >
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">
              Seleccione su archivo o arrastre y suéltelo aquí
            </p>
            <p className="ant-upload-hint">
              PDF, el archivo no puede superar los 2 MB.
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
            <InfoCircleOutlined style={{ color: "#0884FC" }} /> Se permite subir
            un documento con históricos académicos de diferentes alumnos. Se
            tomará como histórico del alumno el último documento subido.
          </p>
          <p>El archivo deberá tener como nombre "CodigoAlumno.pdf"</p>
        </div>
      </LayoutComponent>
    </main>
  );
}
