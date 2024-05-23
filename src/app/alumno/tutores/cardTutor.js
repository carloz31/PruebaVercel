"use client";

import React from "react"
import { Link } from "react-router-dom";
import {  cardTutor } from './cardTutor.css'
import { IconWindsock } from "@tabler/icons-react";
 
export function TutorCard({ id, nombre, apellidoMaterno,apellidoPaterno,codigo,foto,listaTiposTutoria}){
    /*const {id, nombre, apellidoPaterno, apellidoMaterno } = persona;
    */
    const verDisponibilidad = (id) => {
        
        window.location.href = "horario/?id="+ id ;
    }

   
    return(
        <article className="card">
            <header className="card-header" >
              
                <div className="info">
                    <h3 className="nombre">{nombre} {apellidoPaterno} {apellidoMaterno}</h3>
                    <p className="codigo">Código: {codigo}</p>
                    <div className="div-temas">
                        <p className="tema">Tema(s): </p>    
                        <div className="listaTutorias">
                            {listaTiposTutoria.map((tipoTutoria, index) => (
                            <p key={index}>{tipoTutoria.nombre}</p>
                            ))}
                        </div>  
                    </div>                          
                </div>
                <aside className="aside">
                    
                    <button onClick={() => verDisponibilidad(id)}  className="boton">Ver disponibilidad</button>
                   
                </aside>
            </header>

        </article>
    )
}
