"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input } from "antd";
import axios from "@/utils/axiosConfig";
import { adminItems } from "@/utils/menuItems";
import CardRol from "@/components/cards/carTipoRol";

const { Title } = Typography;

export default function Home() {
  const [rolesSistema, setRolesSistema] = useState([]);

  const h1Style = {
    color: "#043B71",
    fontWeight: "bold",
    fontSize: "30px",
  };

  const ulStyle = {
    display: "flex",
    flexWrap: "wrap",
    padding: "0",
    listStyle: "none",
  };

  useEffect(() => {
    const listarRoles = async () => {
      debugger;
      try {
        const url = `/rolApi/listarTodosRoles`;
        const response = await axios.get(url);
        setRolesSistema(response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Error al obtener datos de la API: Listar alumnos por nombre",
          error,
        );
      }
    };

    listarRoles();
  }, []);

  const handleEditPermisos = (id) => {
    alert("Esta editando permisos");
  };
  const handleEditUsuarios = (id, nombre_rol) => {
    window.location.href = `/admin/editarusuario?id=${id}&rol=${nombre_rol}`;
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={adminItems}>
        <h1 style={h1Style}>Roles</h1>
        <ul style={ulStyle}>
          {rolesSistema.map((rol) => (
            <CardRol
              key={rol.id}
              Rol={rol}
              onEditPermisos={handleEditPermisos}
              onEditUsuarios={handleEditUsuarios}
            />
          ))}
        </ul>
      </LayoutComponent>
    </main>
  );
}
