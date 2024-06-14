"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input ,Select ,Result, Spin} from "antd";
import axios from '@/utils/axiosConfig';
import { alumnoItems } from "@/utils/menuItems";
import { TutorCard } from "./cardTutor";

import { cardTutor } from "./cardTutor.css";
import { Divider } from "antd";
import "./app.css";
import { userAgent } from "next/server";
import { Option } from "antd/es/mentions";
import { useRouter } from "next/navigation";
const { Title, Text } = Typography;
import { useUser } from "@/context/UserContext";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [tutores, setTutores] = useState([]);
  const [tiposTutoria, setTiposTutoria] = useState([]);
  const [tutoresPrueba, setTutoresPrueba] = useState([]);
  const [texto, setTexto] = useState("");
  const [tiposTutoriaAlumno, setTiposTutoriaAlumno] = useState([]);
  const [idTutoria, setIdTutoria] = useState(-1);
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState();
  //const [idUsuario,setIdUsuario] = useState();
  const [esSolicitado, setEsSolicitado] = useState(false);
  const [esFijo, setEsFijo] = useState(false);
  const router = useRouter();
  const [tutoresSolicitados, setTutoresSolicitados] = useState([]);
  const [usuarioAlumno, setUsuarioAlumno] = useState([]);
  const [yaSolicito, setYaSolicito] = useState(false);
  // correo : juanito@example.com
  // pasword : your_password

  /*useEffect(() => {

    const id = localStorage.getItem("userID")
    if(id !== null && id !== undefined){
      setIdUsuario(Number(id));
    }
    else{
      console.log("No hay nada");
      //router.push('/login');
    }
  }, [router]);*/

  const { user } = useUser();
  const get = async() =>{
    //setIsLoading(true);
    if(user?.rolSeleccionado !== 4){
      router.back();
      return;
    }
  };

  useEffect(() => {
    get();
  }, []);
 

  //LISTAR TUTORIAS POR ALUMNO
  const handlerListarTutoriasPorAlumno = async (idUsuario) => {
    //setIsLoading(true);
    try{
      const response = await axios.get(
        `/tipoTutoriaApi/listarTiposTutoriaXAlumno/${idUsuario}`,
      );
      setTiposTutoriaAlumno(response.data);
      return response.data;

    } catch(error){
      console.error("Error al obtener datos de la API: Tipos tutoria por alumno", error);
    } finally{
      //setIsLoading(false);
    }
  };

  const handlerBuscarAlumno = async (idUsuarioAlumno) => {
    try {
      const response = await axios.get(
        `/alumnoApi/listarAlumnoPorIdUsuario/${idUsuarioAlumno}`,
      );
      setUsuarioAlumno(response.data);
    } catch (error) {
      console.error("Error al obtener datos de la API: Alumno", error);
    } finally {
    }
  };

  useEffect(() => {
    if (user !== null && user?.id !== undefined) handlerBuscarAlumno(user?.id);
  }, [user]);

  //lISTAR TUTORES
  const handlerListarTutores = async (id, nombre, idTipo) => {
    setIsLoading(true);
    if (tutoriaSeleccionada) {
      try {
        if (tutoriaSeleccionada.tipoTutor === "Fijo") {
          const response = await axios.get(
            `/tutorApi/listarTutorFijo/${id}/${idTipo}`,
          );
          setEsSolicitado(false);
          if (response.data.length <= 0) {
            if (tutoriaSeleccionada.tipoTutorFijo === "Solicitado") {
              setEsSolicitado(true);
              const response = await axios.get(
                `/asignacionApi/verificarSolicitudExistente/${usuarioAlumno[0]?.persona.id}/${idTipo}`,
              );
              await setTutoresSolicitados(response.data);
              if (response.data?.length >= 1) {
                setYaSolicito(true);
                setTutores([]);
              } else {
                const response = await axios.get(
                  `/tutorApi/listarTutorSolicitadoDisponible/${idTipo}`,
                );
                setTutores(response.data);
              }
            } else {
              setTutores(response.data);
              setEsSolicitado(false);
            }
          } else {
            setTutores(response.data);
            setEsSolicitado(false);
          }
        } else {
          const response = await axios.get(
            `/tutorApi/listarTutorPorAlumno/${id}/${nombre}/${idTipo}`,
          );
          setTutores(response.data);
          setEsSolicitado(false);
        }
        
       
  
      } catch(error){
        console.error("Error al obtener datos de la API: listar tutores", error);
      } finally{
        
      }
    }
  };

  //LISTAR TEMAS POR TUTOR
  const handlerListarTemasPorTutor = async (idUsuario,idTutor) => {
   
    try{
      const response = await axios.get(
        `/tipoTutoriaApi/listarTiposTutoriaCompatiblesXTutor/${idUsuario}/${idTutor}`,
      );
      setTiposTutoria(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener datos de la API: Tipos tutoria", error);
    } finally{
      
    }
  };

  //USE EFFECT

  useEffect(() => {
    //const idUsuario = 6; // Debes proporcionar el id del alumno aquí
    if (user !== null && user?.id !== undefined)
      handlerListarTutoriasPorAlumno(user?.id);
  }, [user]);

  useEffect(() => {
    setTutores([]);
    setTutoresPrueba([]);
    if(user?.id!== undefined && user!== null && idTutoria !== -1 && idTutoria!== undefined){
      if ( texto === null || texto === ''){
        handlerListarTutores(user?.id, '%20' ,idTutoria );
      }
      else{
        handlerListarTutores(user?.id, texto ,idTutoria );
      }// Debes proporcionar el id del alumno aquí
    }
  }, [user, texto, idTutoria]);

  useEffect(() => {
    if (idTutoria !== -1) llenarTiposTutoria(tutores);
  }, [tutores, idTutoria]);

  //FUNCIONES NECESARIAS

  //LLENADO DE TIPOS DE TUTORIA
    const llenarTiposTutoria = async (tutoresParametro) => {    
      setTutoresPrueba([]);
      const nuevosTutores = await Promise.all(
        tutoresParametro.map(async (elemento) => {
  
          const tiposTutoriaA = await handlerListarTemasPorTutor(user?.id, elemento.persona.id);
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
      setIsLoading(false);
    };

  function handleChangeTutoria(value,txt) {
    setIsLoading(true);
    setTutoresPrueba([]);
    setTutores([]);
    const tutoria = tiposTutoriaAlumno.find(tutoria => tutoria.idTipoTutoria === value);
      if (tutoria) {
        setTutoriaSeleccionada(tutoria);
        if(tutoria.tipoTutor === "Fijo")
          setEsFijo(true);
        else
          setEsFijo(false);
      }
    setIdTutoria(value);
  }
  function handleTutorRequest()  {
    setIsLoading(true);
    setTutores([]);
    setTutoresPrueba([]);
    if(user?.id!== undefined && user!== null){
      if ( texto === null || texto === ''){
        handlerListarTutores(user?.id, '%20' ,idTutoria );
      }
      else{
        handlerListarTutores(user?.id, texto ,idTutoria );
      }// Debes proporcionar el id del alumno aquí
    }
  };

  console.log(isLoading);
  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={alumnoItems}>
        <div className="class-cabecera">
          <div className="titulo-principal">
            <h1>Lista de tutores</h1>
          </div>
        </div>
        <div className="buscadores">
          <div className="dropdownContainerStyle">
            <Text strong className="titleText">
              Tipo tutoría:
            </Text>
            <Select
              placeholder="Seleccione el tema"
              className="dropdownStyle"
              onChange={handleChangeTutoria}
            >
              {tiposTutoriaAlumno.map((opcion, index) => (
                <Option key={index} value={opcion.idTipoTutoria}>
                  {opcion.nombre}
                </Option>
            ))}
          </Select>          
        </div>
        <div className="dropdownContainerStyle">
          <Text strong className="titleText">Tutor:</Text>      
          <Input
            placeholder="Ingrese el nombre del tutor"
            value=  {texto}
            onChange={(e) => {
            const valor = e.target.value;
              setTexto(valor === null ? '%20' : valor);
              //setTexto(e.target.value);
            }}
            disabled={idTutoria<0 || esFijo === true}
           
            
          />
        </div>
      </div>
        { (isLoading  === true) ? (<Spin />) : ((tutores.length>= 0) ? 

        <div className="tutores">
          {
          tutoresPrueba.map((tutor, index) => (
          <TutorCard
            key={index}
            idAlumno = {usuarioAlumno[0]?.persona?.id}
            id = {tutor.id}
            codigo={tutor.codigo}
            nombre={tutor.nombre}
            apellidoMaterno={tutor.apellidoMaterno}
            apellidoPaterno={tutor.apellidoPaterno}
            foto={tutor.foto}
            listaTiposTutoria={tutor.tiposDeTutoria}
            idTipoTutoria={idTutoria}
            esSolicitado={esSolicitado}
            handleTutorRequest  = {handleTutorRequest}
          />
          ))}
        </div>:hola)
        }

        { (isLoading ===false &&  tutores.length<=0 && esSolicitado===false && idTutoria >0) && 
        <div className="falla" >
         <Result 
            title="Aún no se te han asignado tutores para este tipo de tutoría."            
          />
        </div>}
        {(isLoading ===false && tutores.length<=0 && esSolicitado===true && idTutoria >0 ) &&
        <div className="falla">
         <Result 
            title="Tu solicitud sigue en proceo."   
            subTitle={`Tutor solicitado: ${tutoresSolicitados[0]?.tutor?.nombre} ${tutoresSolicitados[0]?.tutor?.apellidoPaterno} ${tutoresSolicitados[0]?.tutor?.apellidoMaterno}`}
          />
        </div>}

    </LayoutComponent>
    </main>
  );
}
