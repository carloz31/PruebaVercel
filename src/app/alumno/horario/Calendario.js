import React, { useState, useRef, useEffect } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "./CalendarStyle.css";
import { Modal, Button, Form, Input, DatePicker, ConfigProvider, TimePicker, Radio, Select, Space } from 'antd';
import { InfoCircleOutlined, RightOutlined, LeftOutlined  } from '@ant-design/icons';
import locale from 'antd/lib/locale/es_ES';
import moment from 'moment';
import 'moment/locale/es';
import './modalStyle.css';
import axios from 'axios';

const styles = {
  wrap: {
    display: "flex"
  },
  left: {
    marginRight: "10px"
  },
  main: {
    flexGrow: "1"
  }
};

export function Calendar ({bloques, idTutorSeleccionado, idAlumno}) {
  const calendarRef = useRef();
  const [tiposTutoria,setTiposTutoria] = useState([]);
  const [usuarioAlumno, setUsuarioAlumno] = useState([]);
  const [position, setPosition] = useState(0);
  
  const handlerListarTemasPorTutor = async (idUsuario, idTutor) => {
    try{
      const response = await axios.get(
        `${process.env.backend}/tipoTutoriaApi/listarTiposTutoriaCompatiblesXTutor/${idUsuario}/${idTutor}`
      );
      setTiposTutoria(response.data);
      return response.data;
     
    } catch(error){
      console.error("Error al obtener datos de la API: Tipos tutoria", error);
    } finally{
    }
  };

  const handlerBuscarAlumno = async (id) => {
    try{
      const response = await axios.get(
        `${process.env.backend}/alumnoApi/listarAlumnoPorIdUsuario/${id}`
      );
      setUsuarioAlumno(response.data);
      return response.data;
     
    } catch(error){
      console.error("Error al obtener datos de la API: Alumno", error);
    } finally{
    }
  };

  useEffect(() => {
    if (idTutorSeleccionado && idAlumno){
      handlerListarTemasPorTutor(idAlumno, idTutorSeleccionado);
      handlerBuscarAlumno(idAlumno);
    }
  }, [idTutorSeleccionado, idAlumno]);
  
  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    timeRangeStart: '08:00:00', // Set the start time to 8:00 AM
    timeRangeEnd: '20:00:00',
  
    onEventClick: args => {
        openEditModal(args.e.data); // Llama a la función para abrir el modal de edición con los datos del evento
    },
    onBeforeEventRender: args => {
        // Configuración visual de los eventos
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoPresencialidad, setTipoPresencialidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [temaSeleccionado, setTemaSeleccioando] = useState();
  const [horaInicio,setHoraInicio] = useState();
  const [horaFin, setHoraFin] = useState();
  const [fecha,setFecha] = useState();
  const [eventoSeleccionado,setEventoSeleccionado] = useState({inicio:'',fin: '',fechaEven:'',});
  
  const openEditModal = (eventData) => {
    
    if(eventData.libre === 1){
      setIsModalOpen(true);
      const evento ={
        inicio : eventData.hora_start,
        fin : eventData.hora_end,
        fechaEven : eventData.fecha,
      };
      eventoSeleccionado.inicio = evento.inicio;
      eventoSeleccionado.fin = evento.fin;
      eventoSeleccionado.fechaEven = evento.fechaEven;
    }
        
  };

  useEffect(() => {
    setHoraInicio(eventoSeleccionado.inicio.toString().slice(11,19));
    setHoraFin(eventoSeleccionado.fin.toString().slice(11,19));
    setFecha(eventoSeleccionado.fechaEven);
  }, [eventoSeleccionado.inicio, eventoSeleccionado.fin, eventoSeleccionado.fechaEven]);

  const handleOk = () => {
    handleInsertarClick();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
      setIsModalOpen(false);
  };

  const handleTipoPresencialidadChange = (e) => {
      setTipoPresencialidad(e.target.value);
  };

  const handleTemaSeleccionado = (estado) => {
      setTemaSeleccioando(estado);
  }
  
  useEffect(() => {
    let eventos = [];
    if (bloques) {
      bloques.forEach(bloque => {
        let color = bloque.libre === 1 ? "#a7eeb8" : "#D4C095";
        let text = bloque.libre === 1 ? "" : "Ocupado"
        eventos.push({
          id: bloque.idBloque,
          text: text,
          libre: bloque.libre,
          fecha: bloque.fecha,
          hora_start: bloque.horaInicio.toString(), // Asumiendo que horaInicio es un objeto Date
          hora_end: bloque.horaFin.toString(),
          start: bloque.horaInicio.toString(), // Asumiendo que horaInicio es un objeto Date
          end: bloque.horaFin.toString(), // Asumiendo que horaFin es un objeto Date
          backColor: color,
        });
        
      });
    }

    const events = [
      // Otros eventos
    ].concat(eventos);

    const startDate = new Date(new Date().setDate(new Date().getDate() + 7*position)).toISOString().slice(0, 10);
    
    calendarRef.current.control.update({ startDate, events });
  }, [bloques, position]);

  return (
    <div>
      <div>
        <Space>
          <Radio.Group value={position} onChange={(e) => {setPosition( Number(e.target.value))}}>
          <Radio.Button value={position - 1}><LeftOutlined /></Radio.Button>
          <Radio.Button value={position + 1}><RightOutlined /></Radio.Button>
          </Radio.Group>
        </Space>
      </div>
      <div style={styles.wrap}>
        <div style={styles.main}>
          <DayPilotCalendar
            
            {...calendarConfig}
            ref={calendarRef}
            
          />
          <Modal
              title={<span style={{ fontSize: '22px' }}>Registrar cita</span>}
              open={isModalOpen}
              closable={false} // Desactiva la opción de cerrar con la "X"
              footer={null}    // Desactiva el pie de página (los botones "OK" y "Cancelar")
              style={{ maxWidth: '400px', maxHeight: '680px', margin: 'auto', border: '2px solid #1f87ef', borderRadius: '10px', overflow: 'hidden', top: '8%' }}
          >
              <Form style={{ maxWidth: '400px' }}>
                  <Form.Item label="Nombre alumno" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className="botones-formulario" style={{ borderColor: '#1f87ef' }}>
                      <Input value={`${usuarioAlumno[0]?.persona?.nombre} ${usuarioAlumno[0]?.persona?.apellidoPaterno} ${usuarioAlumno[0]?.persona?.apellidoMaterno}`} disabled/>
                  </Form.Item>

                  <Form.Item
                          label="Fecha"
                          labelCol={{ span: 24 }}
                          wrapperCol={{ span: 24 }}
                          className="botones-formulario"
                          style={{ borderColor: '#1f87ef' }}
                  >
                      <ConfigProvider locale={locale}>
                          <DatePicker key={`${fecha}`} defaultValue={moment(fecha, 'YYYY-MM-DD')} disabled style={{ width: '100%' }}/>
                      </ConfigProvider>
                  </Form.Item>

                  {<Form.Item
                      label="Hora"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      className="botones-formulario"
                      style={{ borderColor: '#1f87ef' }}
                  >
                      <TimePicker.RangePicker
                          key={`${horaInicio}-${horaFin}`}
                          defaultValue={[moment(horaInicio, 'HH:mm'), moment(horaFin, 'HH:mm')]} // Establece el rango de horas predeterminado
                          disabled // Hace que el RangePicker sea de solo lectura
                          style={{ width: '100%' }} // Ajusta el ancho del RangePicker al 100%
                          separator={'-'}
                      />
                  </Form.Item>}

                  <Form.Item label="Presencialidad" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className="botones-formulario" >
                      <Radio.Group value={tipoPresencialidad} onChange={handleTipoPresencialidadChange} 
                      style={{ width: '100%'}}>
                          <Radio style={{ marginLeft: '20px', marginTop: '3px' }} value="Presencial">Presencial</Radio>
                          <Radio style={{ marginLeft: '90px', marginTop: '3px' }} value="Virtual">Virtual</Radio>
                      </Radio.Group>
                  </Form.Item>

                  <Form.Item label="Tema" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className="botones-formulario" >
                      <Select defaultValue= {undefined} placeholder="Seleccionar tema" 
                      onChange={(value) =>handleTemaSeleccionado(value)} 
                      style={{ width: '100%' }}
                      options = {tiposTutoria?.map((opcion, index) => {
                          return {value: opcion.idTipoTutoria, label: opcion.nombre}
                        })}
                      >
                      </Select>
                  </Form.Item>

                  <Form.Item label="Descripción" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} className="botones-formulario" 
                  style={{ borderColor: '#1f87ef' }} extra={<span><InfoCircleOutlined /> Este campo es opcional</span>}>
                      <Input.TextArea className="descripcion-input" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}/>
                  </Form.Item>
                  
                  <Form.Item wrapperCol={{ offset: 3, span: 18 }} style={{ marginTop: '20px', marginLeft: '15px' }} className='botones_form'  >
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
        
        </div>
        
      </div>
    </div>
  );
}
