"use client";

import moment from 'moment';
import './page.css';
import LayoutComponent from "@/components/LayoutComponent";
import TableComponent from "@/components/TableComponentTipoTutoria";
import { useEffect, useState, useRef } from "react";
import { Button, 
  Flex, 
  Typography, 
  Modal, 
  Input, 
  Form, 
  Radio, 
  Select, 
  Space,
  message, 
  Spin} from "antd";
import axios from "axios";
import { coordinadorItems } from "@/utils/menuItems";
import { SearchOutlined, PicLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
const { Title } = Typography;


export default function Home() {
  //procedures a usar 
  //LISTAR_TIPO_TUTORIA_ACTIVO para listar por estado y por nombre y el listado en general osea las tres posibles listados 
  //INSERTAR_TIPO_TUTORIA generado por el repository
  //BORRAR_TIPO_TUTORIA_LOGICO borrado similar al logico pero con el estado cambiado 
  const [searchValue, setSearchValue] = useState('');
  const { Option } = Select;
  const [isLoading, setIsLoading] = useState(false);
  const [tipoTutorias, setTipoTutorias] = useState([]);
  //Estado de los campos a insertar
  const [flagtable, setflagtable] = useState(false);
  const [estadoboton, setEstadoBoton] = useState('Activo');
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [estadoBuscado, setEstadoBuscado] = useState('Activo'); // Estado seleccionado en el filtro de estado
  const [modalidad, setModalidad] = useState('');
  const [obligatoriedad, setObligatoriedad] = useState('');
  const [nivelRendimiento, setNivelRendimiento] = useState('');
  const [tipoTutor, setTipoTutor] = useState('');
  const [tipoTutorFijo, setTipoTutorFijo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isTipoTutorFijoDisabled, setIsTipoTutorFijoDisabled] = useState(true);
  const [idUsuarioSesion,setIdUsuarioSesion] = useState();
  const router = useRouter(); 

  const get = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.backend}/tipoTutoriaApi/listarTodosTiposTutoria`
      );
      
      const data = response.data.map((tipoTutoria) => ({
        key: tipoTutoria.idTipoTutoria,
        Nombre: tipoTutoria.nombre,
        fechaCreacion: moment(tipoTutoria.fecha_creacion).format('DD/MM/YYYY'),
        estado: tipoTutoria.estado
      }));
      setTipoTutorias(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (nombre,estado) => {
    setIsLoading(true);
    try {
      let url = `${process.env.backend}/tipoTutoriaApi/listarTiposTutoriEstadoNombre?estado=${estado}`;
      if(nombre!=''){
        url+=`&nombre=${nombre}`;
      }
      
      console.log("url:" +url);
      const response = await axios.get(
        url
      );

      const data = response.data.map((tipoTutoria) => ({
        key: tipoTutoria.idTipoTutoria,
        Nombre: tipoTutoria.nombre,
        fechaCreacion: moment(tipoTutoria.fecha_creacion).format('DD/MM/YYYY'),
        estado: tipoTutoria.estado,
        descripcion: tipoTutoria.descripcion,
        modalidad: tipoTutoria.modalidad,
        obligatoriedad: tipoTutoria.obligatoriedad,
        permanencia: tipoTutoria.permanencia,
        tipoTutor: tipoTutoria.tipoTutor,
        tipoTutorFijo: tipoTutoria.tipoTutorFijo
      }));
      console.log(data);
      setTipoTutorias(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };



  //controladores del modal de insercion 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    handleInsertarClick();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const clearInut = () => {
    setNombre("");
    setEstado("");
    setModalidad("");
    setObligatoriedad("");
    setDescripcion("");
    setTipoTutor("");
    setTipoTutorFijo("");
  };


  const handleInsertarClick = async () => {
    try {
      const response = await axios.post(`${process.env.backend}/tipoTutoriaApi/crearTiposTutoria`, {
        nombre,
        estado,
        descripcion,
        modalidad,
        obligatoriedad,
        tipoTutor,
        tipoTutorFijo,
      },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
       // alert("Tipo tutoria insertado exitosamente");

        clearInut();
        await get();
        message.success('Registro Satisfactorio');
        // Puedes hacer alguna acción adicional aquí, como limpiar el formulario
      } else {
       // alert("Error al insertar tipo tutoria");
      }
    } catch (error) {
      console.error("Error al insertar tipo tutoria:", error);
      console.error("Error al insertar tipo tutoria:", error);
      console.error(
        "Detalles de la respuesta del servidor:",
        error.response.data
      );
    }
  };

  const handleTipoTutorChange = (e) => {
    setTipoTutor(e.target.value);
    setIsTipoTutorFijoDisabled(e.target.value !== 'Fijo');
    // Reinicia el estado del tipo de tutor fijo si no es 'Fijo'
    if (e.target.value !== 'Fijo') {
      setTipoTutorFijo('');
    }
  };
  const handleNoSeleccionado = (estado) => {
    debugger;
    setEstado(estado)
  }

  const handleGuardar = (estado) => {
    // Lógica para guardar el estado seleccionado
    debugger;
    setEstadoBuscado(estado)
    console.log('Estado guardado:', estadoBuscado);
    console.log('Estado boton:', estado);
    // Cierra el modal
    
    //handleSearch(searchValue, estadoboton);
    setModalVisible(false);
  };

  const handleFlagTable = (flag) => {
    setflagtable(!flag);

  }
  useEffect(() => {
    // Call handleSearch with 'activo' to only fetch active types on initial load
    handleSearch(searchValue, estado);
  }, [searchValue,estadoBuscado,flagtable]);

  useEffect(() => {
    debugger
    const id = localStorage.getItem("userID")
    if(id !== null && id !== undefined){
      setIdUsuarioSesion(id);
    }
    else{
      console.log("No hay nada");
      router.push('/login');
    }    
  }, [router]);

  if (!idUsuarioSesion) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={coordinadorItems}>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title style={{ textAlign: "left", marginBottom: "8px" }}>Tipos de Tutoría</Title>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input size="large" placeholder="Buscar tipo de tutoría por nombre" prefix={<SearchOutlined />} style={{ width: "50%", marginRight: "16px" }} 
              value={searchValue} 
              onChange={(e) => setSearchValue(e.target.value)} 
              onSearch={() => handleSearch(searchValue)}/>
            <Button icon={<PicLeftOutlined />} size="large" onClick={() => setModalVisible(true)} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "16px" }}>
            <Button type="primary" shape="round" size="small" onClick={showModal}>Añadir Nuevo +</Button>
          </div>
        </div>

        <TableComponent
          isLoading={isLoading}
          tipoTutorias={tipoTutorias}
          flagtable={handleFlagTable}
        ></TableComponent>

      </LayoutComponent>

      <Modal
        closable={false}
        title="Estado"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        maskClosable={true}
        footer={[
          <Button key="guardar" type="primary" onClick={() =>handleGuardar(estado)} >
            Guardar
          </Button>,
        ]}
        style={{ maxWidth: '33vh' }}
      >
        <Select defaultValue="Activo" onChange={(value) =>handleNoSeleccionado(value)} style={{ width: '100%' }}>
          <Option value="Activo">Activo</Option>
          <Option value="Inactivo">Inactivo</Option>
        </Select>
      </Modal>




      <Modal
        open={isModalOpen}
        closable={false} // Desactiva la opción de cerrar con la "X"
        footer={null}    // Desactiva el pie de página (los botones "OK" y "Cancelar")
        style={{ maxWidth: '400px', maxHeight: '670px', margin: 'auto', border: '2px solid #1f87ef', borderRadius: '10px', overflow: 'hidden' }}
      >
        <Form style={{ maxWidth: '400px' }}>

          <Form.Item label="Nombre" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className="botones-formulario" style={{ borderColor: '#1f87ef' }}>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </Form.Item>


          <Form.Item label="Descripción" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className="botones-formulario" extra={<span><InfoCircleOutlined /> Este campo es opcional</span>} style={{ borderColor: '#1f87ef' }}>
            <Input.TextArea className="descripcion-input" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

          </Form.Item>


          <Form.Item label="Modalidad de tutoría" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className="botones-formulario">
            <Radio.Group value={modalidad} onChange={(e) => setModalidad(e.target.value)} >
              <Radio value="Individual">Individual</Radio>
              <Radio value="Grupal">Grupal</Radio>
            </Radio.Group>

          </Form.Item>


          <Form.Item label="Obligatoriedad" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className="botones-formulario">
            <Radio.Group value={obligatoriedad} onChange={(e) => setObligatoriedad(e.target.value)}>
              <Radio value="Obligatoria">Obligatoria</Radio>
              <Radio value="Opcional">Opcional</Radio>
            </Radio.Group>

          </Form.Item>


          


          <Form.Item label="Tipo de tutor" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className="botones-formulario">
            <Radio.Group value={tipoTutor} onChange={handleTipoTutorChange}>
              <Radio value="Fijo">Fijo</Radio>
              <Radio value="Variable">Variable</Radio>
            </Radio.Group>
          </Form.Item>


          <Form.Item label="Tipo de tutor fijo" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className="botones-formulario" >
            <Radio.Group value={tipoTutorFijo} onChange={(e) => setTipoTutorFijo(e.target.value)} disabled={isTipoTutorFijoDisabled}>
              <Radio value="Asignado">Asignado</Radio>
              <Radio value="Solicitado">Solicitado</Radio>
            </Radio.Group>
          </Form.Item>


          <Form.Item wrapperCol={{ offset: 3, span: 18 }} style={{ marginTop: '25px' }} className='botones_form'  >

            <Space size={50}>
              <Button htmlType="button" onClick={handleCancel} className="cancel-button">
                Cancelar
              </Button>
              <Button type="primary" htmlType="button" onClick={handleOk}>
                Guardar
              </Button>
            </Space>

          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}

