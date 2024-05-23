"use client";
import '@/app/coordinador/tipos/page.css';
import React, { useEffect, useState } from "react";
import { Space, Spin, Table, Tag, Button, Flex, Typography, Modal, Input, Form, Radio, Select,message } from "antd";
import axios from "axios";

const { Column, ColumnGroup  } = Table;
import { EditOutlined, DeleteOutlined,SearchOutlined, PicLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";

const TableComponent = ({ isLoading, tipoTutorias,flagtable}) => {
  const [nombre,setNombre]=useState("");
  const [flag,setFlag]=useState(false);
  const [tipoTutoriUpd, setTipoTutoriaUpd] = useState({});
  const [dato,setDato]=useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [idTipoTutoria, setIdTipoTutoria] = useState(0);
  const [estado, setEstado] = useState('Activo');
  const [modalidad, setModalidad] = useState('');
  const [obligatoriedad, setObligatoriedad] = useState('');
  const [nivelRendimiento, setNivelRendimiento] = useState('');
  const [tipoTutor, setTipoTutor] = useState('');
  const [tipoTutorFijo, setTipoTutorFijo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isTipoTutorFijoDisabled, setIsTipoTutorFijoDisabled] = useState(true);


  if (isLoading) return <Spin size="large" />;
  
  
  const handleTipoTutorChange = (e) => {
    setTipoTutor(e.target.value);
    setIsTipoTutorFijoDisabled(e.target.value !== 'Fijo');
    // Reinicia el estado del tipo de tutor fijo si no es 'Fijo'
    if (e.target.value !== 'Fijo') {
      setTipoTutorFijo('');
    }
  };

  const renderEstado = (text, record) => {
    const estadoStyle = {
      padding: '4px 8px',
      borderRadius: '999px',
      color: '#fff',
      textAlign: 'center', // Centro de texto
      display: 'inline-block', // Para que el span no ocupe el ancho completo
    };
    console.log(record);
  
    if (record.estado === 'Activo') {
      estadoStyle.backgroundColor = '#52c41a'; // verde para estado activo
    } else if (record.estado === 'Inactivo') {
      estadoStyle.backgroundColor = '#f5222d'; // rojo para estado inactivo
    }
  
    return <span style={estadoStyle}>{record.estado}</span>;
  };

  const handleModificar = async  () => {
    try {
      debugger;
      console.log(nombre);
      console.log(descripcion);
/*
      const datosActualizados = {
        ...tipoTutoria,
        idTipoTutoria: idTipoTutoria,
        nombre: nombre,
        estado: estado,
        descripcion :descripcion,
        modalidad: modalidad,
        obligatoriedad: obligatoriedad,
        tipoTutor: tipoTutor,
        tipoTutorFijo: tipoTutorFijo,
        // Otros campos actualizados
      };*/
     
      //console.log(datosActualizados);
      // Realizar la solicitud PUT al backend
      const response = await axios.put(`${process.env.backend}/tipoTutoriaApi/actualizarTipoTutoria`, {
        idTipoTutoria: idTipoTutoria,
        nombre: nombre,
        estado: estado,
        descripcion :descripcion,
        modalidad: modalidad,
        obligatoriedad: obligatoriedad,
        tipoTutor: tipoTutor,
        tipoTutorFijo: tipoTutorFijo,},{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setFlag(!flag);
      flagtable && flagtable(flag);
      message.success('Modificacion Satisfactorio');
      // Manejar la respuesta si es necesario
      console.log(response.data);
    } catch (error) {
      console.error('Error al modificar tipo de tutoría:', error);
    }
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



  const buscar_tipo_tutoria = async (id) => {
    try {
     
      let url = `${process.env.backend}/tipoTutoriaApi/buscar_tipo_tutoria_id/${id}`;
      console.log("url:" + url);
      const response = await axios.get(url);
    /* console.log(response.data);
      console.log(response.data.idTipoTutoria);
      //console.log(data);
      const data={
        idTipoTutoria:response.data.idTipoTutoria,
        nombre:response.data.nombre,
        descripcion:response.data.descripcion,
        estado:response.data.estado,
        modalidad:response.data.modalidad,
        obligatoriedad:response.data.obligatoriedad,
        nivelRendimiento:response.data.nivelRendimiento,
        tipoTutor:response.data.tipoTutor,
        tipoTutorFijo:response.data.tipoTutorFijo
      };
      console.log(data);*/
     // setNombre(data.nombre);
      setTipoTutoriaUpd(response.data);
      console.log(tipoTutoriUpd.nombre);
      
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      
    }
  };

  


  const handleUpdate = (record) => {
    debugger;
    setIsModalOpen(true);
    console.log(record);
    setTipoTutoriaUpd(record); // Actualiza el estado con los datos del objeto record
    setEstado(record.estado);
    setModalidad(record.modalidad);
    setObligatoriedad(record.obligatoriedad);
    setNivelRendimiento(record.nivelRendimiento);
    setTipoTutor(record.tipoTutor);
    setTipoTutorFijo(record.tipoTutorFijo);
    setDescripcion(record.descripcion);
    setNombre(record.Nombre);
    setIdTipoTutoria(record.key);

    console.log(dato);
  }

    // Función para manejar el clic en el botón de borrar
    const handleDelete = async (id) => { // async para usar await
      try {
        
        // Realiza la solicitud DELETE utilizando Axios
        const response = await axios.post(`${process.env.backend}/tipoTutoriaApi/borrar_tipo_tutoria/${id}`);
        
        // Verifica si la respuesta es exitosa
        if (response.status === 200) {
          // Si la respuesta es exitosa, muestra un mensaje de éxito
          //message.success('Tipo de tutoría borrado correctamente');
          setFlag(true);
          flagtable && flagtable(flag);
          // Aquí podrías recargar los datos de la tabla si es necesario
        } else {
          // Si hay algún error en la respuesta, muestra un mensaje de error
         // message.error('Error al borrar el tipo de tutoría');
        }
      } catch (error) {
        console.error('Error:', error);
       // message.error('Error al borrar el tipo de tutoría');
      }
    };
  
    
  return (
    <div>
    <Table dataSource={tipoTutorias}>
      <Column
        title="Nº"
        key="index"
        render={(text, record, index) => index + 1}
      />
      
        <Column title="Nombre" dataIndex="Nombre" key="Nombre" />
        <Column
          title="Fecha Creacion"
          dataIndex="fechaCreacion"
          key="fechaCreacion"
        />
        <Column title="Estado" dataIndex="estado" key="estado" render={renderEstado} />
        <Column title="Acción" dataIndex="Acción" key="Acción" 
          render={(text, record) => (
            <Space size="middle">
              <EditOutlined style={{ fontSize: '16px', color: '#0884FC' }} onClick={() => handleUpdate(record)}/>
              <DeleteOutlined style={{ fontSize: '16px', color: '#0884FC' }}  onClick={() => handleDelete(record.key)}/>
            </Space>
          )}
        />
      
      
    </Table>
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
          <Button type="primary" htmlType="button" onClick={handleModificar}>
            Modificar
          </Button>
        </Space>

      </Form.Item>
    </Form>
  </Modal>






</div>
    
  );
};
export default TableComponent;


