"use client";

import { useEffect, useState } from "react";
import { Modal ,message,Typography} from "antd";
import axios from '@/utils/axiosConfig';
const { Title, Text } = Typography;
import { useRouter } from 'next/navigation';

import { useUser } from '@/context/UserContext';
export function TutorCard({ id,idAlumno, nombre, apellidoMaterno,apellidoPaterno,codigo,foto,listaTiposTutoria,idTipoTutoria,esSolicitado,handleTutorRequest}){
    /*const {id, nombre, apellidoPaterno, apellidoMaterno } = persona;
    */
    const router = useRouter();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const get = async() =>{
      setIsLoading(true);
      if(user?.rolSeleccionado !== 4){
        router.back();
        return;
      }
    };

    useEffect(() => {
      get();
    }, []);
   
    
   
    
    const verDisponibilidad = (id1,id2) => {
        if(esSolicitado){
            Modal.confirm({
                title: '¿Está seguro de solicitar al tutor ' +  `${nombre} ${apellidoPaterno} ${apellidoMaterno}` + ' para tutoria fija?' ,
                okText: 'Sí, solicitar',
                okType: 'confirm',
                cancelText: 'Cancelar',
                centered: true, 
                onOk: async () => {                  
                  try {
                    const registroSolicitudResponse = await axios.post(
                        `${process.env.backend}/asignacionApi/registrarSolicitudAsignacion/${idAlumno}/${id1}/${id2}`,
                        {},
                        {
                          headers: {
                            "Content-Type": "application/json",
                          },
                        }
                      );
                      if (registroSolicitudResponse.status === 200) {
                        console.log("hola");
                        get();
                        handleTutorRequest();
                        message.success('Registro de solicitud satisfactorio');
                       } else {
                        console.log("chau");
                        message.error('Error al registrar la solicitud de asignación');
                      }
                    
                  } catch (error) {
                    console.error("Error al registrar la solicitud:", error);
                  }
                }

                
              });
        }else{
            window.location.href = `horario/?id1=${id1}&id2=${id2}` ;
        }
        
    }

   
    return (
      <article className="card">
          <header className="card-header">
              <div className="info">
                  <h3 className="nombre">{nombre} {apellidoPaterno} {apellidoMaterno}</h3>
                  <p className="codigo">Código: {codigo}</p>
                  <div className="div-temas">
                      <Text className="tema">Tema(s): </Text>    
                      <div className="listaTutorias">
                          {listaTiposTutoria.map((tipoTutoria, index) => (
                              <Text className="text-tutorias" key={index}>{tipoTutoria.nombre}</Text>
                          ))}
                      </div>  
                  </div>                          
              </div>
              <aside className="aside">
                  <button onClick={() => verDisponibilidad(id, idTipoTutoria)} className="boton">
                      {esSolicitado ? "Solicitar tutoría" : "Ver disponibilidad"}
                  </button>
              </aside>
          </header>
      </article>
  );
  
}
