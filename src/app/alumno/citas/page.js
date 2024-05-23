"use client";
//prueba

import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input } from "antd";
import axios from "axios";
import { alumnoItems } from "@/utils/menuItems";
import { useRouter } from 'next/navigation';
const { Title } = Typography;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [idUsuario,setIdUsuario] = useState();
  const router = useRouter(); 
  /*useEffect(() => {
    // Leer los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));

    if (id !== 0) {
      setIdUsuario(id);
    }
    else{
      console.log("habia 0 no guarde");
    }


  }, []);

  useEffect(() => {
    const id = localStorage.getItem("userID")
    if(id != null && id !==undefined){
      const numero = parseInt(id, 10);
      setIdUsuario(numero);
      //console.log("sacando del logal storage");
      //console.log(numero);
    }
    else{
      console.log("No hay nada");
    }

  }, []);*/

  useEffect(() => {
    debugger
    const id = localStorage.getItem("userID")
    if(id !== null && id !== undefined){
      setIdUsuario(id);
    }
    else{
      console.log("No hay nada");
      router.push('/login');
    }    
  }, [router]);



  const get = async() =>{
    setIsLoading(true);
  };




  useEffect(() => {
    if (idUsuario !== null && idUsuario !== undefined) {

      localStorage.setItem('userID', idUsuario.toString());
    }
  }, [idUsuario]);



  useEffect(() => {
    get();
  }, []);



  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={alumnoItems}>
      </LayoutComponent>
    </main>
  );
}