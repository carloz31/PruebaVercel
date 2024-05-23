"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";

import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input ,Select,Form} from "antd";
import axios from "axios";
import { alumnoItems } from "@/utils/menuItems";
import {Calendar } from "./Calendario"
const { Title } = Typography;
import  "./horario.css"
import { MinusCircleFilled } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [bloquesDisponibilidad, setBloqueDisponibilidad] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [tutores,setTutores] = useState([]);
  const [tutorSelccionado,setTutorSeleccionado] = useState();
  const [tutorId, setTutorId] = useState();
  const [idDispo, setIdDispo] = useState();
  const [idUsuario,setIdUsuario] = useState();
  const router = useRouter();

  /*useEffect(() => {
    const id = localStorage.getItem("userID")
    if(id != null && id !==undefined){
      const numero = parseInt(id, 10);
      setUsuarioSeleccionado(numero);

    }
    else{
      console.log("No hay nada");
    }

  }, []);*/

  useEffect(() => {
    
    const id = localStorage.getItem("userID")
    if(id !== null && id !== undefined){
      setIdUsuario(id);
    }
    else{
      console.log("No hay nada");
      router.push('/login');
    }    
  }, [router]);

  useEffect(() => {
    // Leer los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    setTutorId(Number(params.get('id')));
    // Hacer algo con el ID (por ejemplo, imprimirlo en la consola)

  }, []); // Ejecutar solo una vez al cargar la página


  const get = async () => {
    setIsLoading(true);
  };

  const handleListarDisponibilidad = async(idTutor)=>{
    try {
      const response = await axios.get(
        `${process.env.backend}/disponibilidadApi/listarDisponibilidadPorTutor/${idTutor}`
      );
      setDisponibilidad(response.data);
      setIdDispo(response.data[response.data.length - 1].idDisponibilidad);
      //console.log({data:response.data});
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
      return [];
    }
  };

  const handlerElementosPorDisponibilidad = async (idDisponibilidad) => {
    try {
      const response = await axios.get(
        `${process.env.backend}/bloqueDisponibilidadApi/listarBloqueDisponibilidadPorDisponibilidad/${idDisponibilidad}`
      );
      setBloqueDisponibilidad(response.data);
      return response.data; // Devuelve la lista de elementos
    } catch (error) {
      console.error("Error al obtener datos de la API: ", error);
      return []; // Devuelve un arreglo vacÃo en caso de error
    }
  };

  const handlerListarTutores = async (id,nombre,idTipo) => {
    setIsLoading(true);
    try{
      const response = await axios.get(
        `${process.env.backend}/tutorApi/listarTutorPorAlumno/${id}/${nombre}/${idTipo}`
      );
      setTutores(response.data);

    } catch(error){
      console.error("Error al obtener datos de la API: listar tutores", error);
    } finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //const idAlumno = 6;
    const textoInicial = '%20';
    handlerListarTutores(idUsuario,textoInicial,-1);

  }, [idUsuario]);

  useEffect(() => {
    if (tutorId && tutores.length > 0) {
      // Si se ha cargado la lista de tutores y el ID de la URL está definido,
      // busca el tutor con el ID correspondiente y establece su ID como el tutor seleccionado
      const tutorSeleccionado = tutores.find(tutor => tutor.persona.id === tutorId);
      if (tutorSeleccionado) {
        setTutorSeleccionado(tutorSeleccionado);
      }
    }
  }, [tutorId, tutores]);

  useEffect(() => {
    if (tutorSelccionado?.persona?.id) {
      handleListarDisponibilidad(tutorSelccionado.persona.id);
    }
  }, [tutorSelccionado]);


  /*disponibilidad.forEach((elemento) => {
     idDispo = elemento.idDisponibilidad;
  });*/


  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const startDate = new Date();
  const monthName = months[startDate.getMonth()]; // Obtén el nombre del mes actual
  const year = startDate.getFullYear();

  const formattedDate = `${monthName} ${year}`;
  useEffect(() => {
    if (idDispo)
      handlerElementosPorDisponibilidad(idDispo);
  }, [idDispo]);

  function handleChange(value) {
    const seleccionadoTutor = tutores.find(tutor => tutor.persona.id === value);
    setTutorSeleccionado(seleccionadoTutor);
  }

  const [isCliente, setIsClient] = useState(false);
  useEffect(()=>{
    setIsClient(true);
  },[]);
  //console.log({tutorSelccionado});
  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={alumnoItems}>

        <div>
          <h1 className="titulo-principal">Agendar citas</h1>
        </div>
        <div className="fila-1">
          <div className="contenedor-fecha">
            <p className="fecha"> {monthName} {year}</p>
          </div>
            {tutores.length > 0 && 
            <div className="combo-box-tutor">
              <Select
                  value = {tutorSelccionado?.persona?.id || tutorId || undefined}
                  placeholder="Seleccione el tutor" // Establecer el valor predeterminado, por ejemplo, el primer elemento del arreglo.
                  style={{
                    width: "359px",
                    height: "38px",
                    border: "2px solid #0663bd",
                    borderRadius: "10px",
                    fontSize: "20px",
                    //colorBgContainer : "#ffffff",
                    //marginLeft: "500px"
                  }}
                  onChange={handleChange}
                  options = {tutores.map(tutor => {
                    return {value: tutor.persona.id, label: `${tutor.persona.nombre} ${tutor.persona.apellidoPaterno} ${tutor.persona.apellidoMaterno}`}
                  })}
                  >
                  {/* {tutores.map((opcion, index) => (
                    <Option key={index} value={opcion.persona.id}>
                      {opcion.persona.nombre} {opcion.persona.apellidoPaterno} {opcion.persona.apellidoMaterno}
                    </Option>
                  ))} */}
                </Select>
            </div>}
        </div>
        <div className="fila-2">

          <ul className="horizontal-list">
          <MinusCircleFilled
            style={{
              color:"#a7eeb8",
              marginRight: "10px"
            }}
          />
            <li className="palabra"> Disponible </li>
            <MinusCircleFilled style={{
              color:"#D4C095",
              marginRight: "10px"
            }}/>
            <li className="palabra"> Ocupado </li>
            <MinusCircleFilled style={{
              color:"#B9D5EF",
              marginRight: "10px"
            }}/>
            <li className="palabra"> Reservado</li>
          </ul>
          
          <button className="boton">Solicitar tutoría Fija</button>
        </div>
        <div className="calendario-contenedor">

          {isCliente && <Calendar bloques={bloquesDisponibilidad} idTutorSeleccionado={tutorSelccionado?.persona?.id} idAlumno = {idUsuario}
          />}
        </div>
      </LayoutComponent>
    </main>

  );
}