"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input ,Select,Text } from "antd";
import axios from "axios";
import { alumnoItems } from "@/utils/menuItems";
import { TutorCard } from "./cardTutor";
const { Title } = Typography;
import {  cardTutor } from './cardTutor.css'
import { Divider } from "antd";
import "./app.css";
import { userAgent } from "next/server";
import { Option } from "antd/es/mentions";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [tutores,setTutores] = useState([]);
  const [tiposTutoria,setTiposTutoria] = useState([]);
  const [tutoresPrueba,setTutoresPrueba] = useState([]);
  const [texto,setTexto ] = useState("");
  const [tiposTutoriaAlumno,setTiposTutoriaAlumno] = useState([]);
  const [tutoriaSelccionado,setTutoriaSeleccionado] = useState(-1);
  const [idUsuario,setIdUsuario] = useState();
  const router = useRouter();
  // correo : juanito@example.com
  // pasword : your_password



  /*useEffect(() => {
    const id = localStorage.getItem("userID")
    if(id != null && id !==undefined){
      const numero = parseInt(id, 10);
      setIdUsuario(numero);

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

  const handlerListarTemasPorTutor = async (idUsuario,idTutor) => {
    setIsLoading(true);
    try{
      const response = await axios.get(
        `${process.env.backend}/tipoTutoriaApi/listarTiposTutoriaCompatiblesXTutor/${idUsuario}/${idTutor}`
      );
      setTiposTutoria(response.data);
      return response.data;

    } catch(error){
      console.error("Error al obtener datos de la API: Tipos tutoria", error);
    } finally{
      setIsLoading(false);
    }
  };

  const handlerListarTutoriasPorAlumno = async (idUsuario) => {
    setIsLoading(true);
    try{
      const response = await axios.get(
        `${process.env.backend}/tipoTutoriaApi/listarTiposTutoriaXAlumno/${idUsuario}`
      );
      setTiposTutoriaAlumno(response.data);
      return response.data;

    } catch(error){
      console.error("Error al obtener datos de la API: Tipos tutoria por alumno", error);
    } finally{
      setIsLoading(false);
    }
  };


  const llenarTiposTutoria = async (tutoresParametro) => {
    const nuevosTutores = await Promise.all(
      tutoresParametro.map(async (elemento) => {

        const tiposTutoriaA = await handlerListarTemasPorTutor(6, elemento.persona.id);
        const tutor = {
          id: elemento.persona.id,
          tiposDeTutoria: tiposTutoriaA,
          codigo : elemento.codigo,
          nombre : elemento.persona.nombre,
          apellidoPaterno : elemento.persona.apellidoPaterno,
          apellidoMaterno : elemento.persona.apellidoMaterno,
          foto :elemento.foto,

        };
        return tutor;
      })
    );
    setTutoresPrueba(nuevosTutores);
  };

  useEffect(() => {
    //const idAlumno = 6;
    if(idUsuario!== undefined && idUsuario!== null){
      if ( texto === null || texto === ''){
        handlerListarTutores(idUsuario, '%20' ,tutoriaSelccionado );
      }
      else{
        handlerListarTutores(idUsuario, texto ,tutoriaSelccionado );
      }// Debes proporcionar el id del alumno aquí
    }
  }, [idUsuario,texto,tutoriaSelccionado])


  useEffect(() => {

    //const idUsuario = 6; // Debes proporcionar el id del alumno aquí
    if(idUsuario !== null && idUsuario !== undefined)
      handlerListarTutoriasPorAlumno(idUsuario);

  }, [idUsuario])

  useEffect(() => {
    //const idAlumno = 6;
    const textoInicial = '%20';
    if(idUsuario)
      handlerListarTutores(idUsuario,textoInicial,-1 );
     // Suponiendo que necesitas realizar una acción similar a esta
}, [idUsuario]);

  //ARREGLAR EL ID
  //------------------------------------------------------------------------------
  /*useEffect(() => {

    const idUsuario = 6; // Debes proporcionar el id del alumno aquí
    handlerListarTutoriasPorAlumno(idUsuario);

  }, [])






  useEffect(() => {
      const idAlumno = 6;
      const textoInicial = '%20';
      handlerListarTutores(idAlumno,textoInicial,-1 );
       // Suponiendo que necesitas realizar una acción similar a esta
  }, []);  */

  // HASTA AQUI
  // ----------------------------------------------------------------------------------------------------------------
  useEffect(() => {

    llenarTiposTutoria(tutores);

  }, [tutores]);



  function handleChange(value,txt) {
    setTutoriaSeleccionado(value);
    //handlerListarTutores(1,' ',value);

  }



  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={alumnoItems}>
        <div className="titulo-principal">
          <h1>Lista de tutores</h1>
        </div>
        <div>
          <Divider orientation="left"
           style={{ color: '#727272',
                  fontFamily: "Nunito",
                  fontWeight: "light",
                  fontSize: '18px' ,
                  colorBorderSecondary : 'rgba(114, 114,144, 10)'}}>Tutores asignados
           </Divider>
        </div>
        <div className="otros-tutores"  >
          <Divider orientation="left"
                  style={{ color: '#727272',
                  fontFamily: "Nunito",
                  fontSize: '18px' }}>Otros tutores</Divider>
          <div className="buscadores">
            <Input
              placeholder="Buscar tutor por nombre"
              value=  {texto}
              onChange={(e) => {
                const valor = e.target.value;
                setTexto(valor === null ? '%20' : valor);
                //setTexto(e.target.value);
              }}
              //onPressEnter={handlerListarTutores(1,"a",-1)}
              style={{
                borderRadius: "20px",
                border: "2px solid #0663bd",
                padding: "10px",
                fontSize: "20px",
                width: "670px",
                height: "50px",
                marginLeft : "60px",
                marginRight : "170px"
              }}
            />
            <div className="dropdownContainerStyle">

            <Select
                defaultValue={tiposTutoriaAlumno[0]}
                placeholder="Seleccione el tema" // Establecer el valor predeterminado, por ejemplo, el primer elemento del arreglo.
                style={{
                  width: "359px",
                  height: "50px",
                  border: "2px solid #0663bd",
                  borderRadius: "10px",
                  fontSize: "20px",
                  //colorBgContainer : "#ffffff",
                  //marginLeft: "500px"
                 }}

                 onChange={handleChange}
                >
                <Option value={-1}> Ningun tema elegido </Option>
                {tiposTutoriaAlumno.map((opcion, index) => (
                  <Option key={index} value={opcion.idTipoTutoria}>
                    {opcion.nombre}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

        </div>
        {tutoresPrueba.map((tutor, index) => (

          <TutorCard
            key={index}
            id = {tutor.id}
            codigo={tutor.codigo}
            nombre={tutor.nombre}
            apellidoMaterno={tutor.apellidoMaterno}
            apellidoPaterno={tutor.apellidoPaterno}
            foto={tutor.foto}
            listaTiposTutoria={tutor.tiposDeTutoria}
          />
        ))}
      </LayoutComponent>
    </main>
  );
}