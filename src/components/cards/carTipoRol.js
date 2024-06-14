import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Tooltip,
  Dropdown
} from "antd";
import { MinusCircleOutlined, EditOutlined } from "@ant-design/icons";
const { Meta } = Card;



const items = [
    {
      key: '2',
      label: "Editar usuarios"
    },  
  ];

export default function CardRol({ Rol,onEditUsuarios,onEditPermisos, disabled=false }) {

    const onClick = ({ key }) => {
      debugger
        if (key === '2') {
            onEditUsuarios(Rol.id,Rol.nombre_rol); // Llama a la función onEditUser si la key es '1'
        } else if (key === '1') {
            onEditPermisos(Rol.id); // Llama a la función onEditRoles si la key es '2'
        }
    };

  return (
    <Card style={{ width: 500, margin: '10px', position: 'relative', opacity: disabled ? 0.5 : 1 }}>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <Tooltip >
                <Dropdown menu={{
                    items,
                    onClick,
                }} shape="rectangle" >
                    <Button
                    shape="rectangle"
                    icon={<EditOutlined style={{ color: '#0884FC' }} />}
                    />
                </Dropdown>
                
        </Tooltip>


      </div>
      <Meta
        avatar={<Avatar size={48}>{Rol.nombre_rol.slice(0, 2)}</Avatar>}
        title={
          <>
            {Rol.nombre_rol}
            <div style={{ fontSize: 'small', color: 'gray' }}>Rol Asignado</div>
          </>
        }
        description={Rol.descripcion}
      />
    </Card>
  );
}