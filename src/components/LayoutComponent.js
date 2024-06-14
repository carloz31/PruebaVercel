"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useUser } from '@/context/UserContext';
import {
  Flex,
  Button,
  Dropdown,
  Layout,
  Space,
  Avatar,
  ConfigProvider,
} from "antd";
import esEs from "antd/locale/es_ES";
import SiderList from "./SiderList";
import { IconBell, IconPower, IconUser, IconSwitchHorizontal } from "@tabler/icons-react";
import { defaultThemeConfig } from "@/utils/themeConfigs";
import AuthWrapper from '@/components/AuthWrapper';
import ModalCambiarRol from '@/components/ModalCambiarRol';

const { Header, Footer, Sider, Content } = Layout;

const headerStyle = {
  color: "#fff",
  height: 72,
  backgroundColor: "#4096ff",
};

const contentStyle = {
  minHeight: 120,

  color: "#000",
  backgroundColor: "#F2F8FD",
  padding: "20px",
};

const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#fff",
};

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

const layoutStyle = {
  overflow: "hidden",
  width: "100%",
  maxWidth: "100%",
  minHeight: "100vh",
};

const LayoutComponent = ({ siderItems, children, showFooter = false }) => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user?.rolSeleccionado);

  const handleLogout = () => {
    // Eliminar el token JWT del localStorage
    localStorage.removeItem('jwtToken');
    // Actualizar el estado del usuario
    setUser(null);
    // Redirigir al usuario a la página de inicio de sesión
    router.push('/login');
  };

  const openRoleModal = () => {
    debugger
    console.log('Opening role modal');
    setIsModalOpen(true);
  };

  const closeRoleModal = () => {
    console.log('Closing role modal');
    setIsModalOpen(false);
  };

  const handleChangeRole = (role) => {
    console.log('Role changed to:', role);
    let path;
    if(user.rolSeleccionados !== role){
      switch (role) {
        case 1:
            path = '/admin/institucion';
            break;
        case 2:
            path = '/coordinador/tipos';
            break;
        case 3:
            path = '/tutor/citas';
            break;
        case 4:
            path = '/alumno/citas';
            break;
        case 5:
            path = '/coordinador/tipos';
            break;
        case 6:
            path = '/tutor/citas';
            break;
        }
        const updatedUser = { ...user, rolSeleccionado: role };
        setUser(updatedUser);
        router.push(path); //te dirige a esa vista
    }
  };

  //solo se muestra el item para cambiar de rol si tiene más de un rol
  const items = [
    {
      key: "1",
      label: <a>Perfil</a>,
      icon: <IconUser size={20} />,
    },
    user?.roles?.length > 1 &&  
    {
      key: "2",
      label: <a>Cambiar de rol</a>,
      icon: <IconSwitchHorizontal size={20} />,
      onClick: openRoleModal,
    },
    {
      key: "3",
      label: <a>Cerrar sesión</a>,
      icon: <IconPower size={20} />,
      onClick: handleLogout,
    },
  ];

  return (
    <ConfigProvider theme={defaultThemeConfig} locale={esEs}>
      <AuthWrapper>
        <Layout style={layoutStyle}>
          <Sider
            width="250px"
            style={siderStyle}
            breakpoint="xs"
            collapsedWidth="0"
          >
            <SiderList items={siderItems} />
          </Sider>
          <Layout>
            <Header style={headerStyle} theme="light">
              <Flex
                gap="middle"
                align="center"
                justify="flex-end"
                style={{ height: "100%" }}
              >
                <Dropdown
                  menu={{ items }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Avatar
                    size="large"
                    style={{
                      cursor: "pointer",
                      color: "#111",
                    }}
                    src={user?.foto} 
                  >
                  </Avatar>
                </Dropdown>
                <Button size="large" shape="circle" icon={<IconBell />} />
              </Flex>
            </Header>
            <Content style={contentStyle}>{children}</Content>
            {showFooter && <Footer style={footerStyle}>Footer</Footer>}
          </Layout>
        </Layout>
        <ModalCambiarRol 
          isOpen={isModalOpen} 
          onRequestClose={closeRoleModal} 
          onChangeRole={handleChangeRole} 
          selectedRoleOut={selectedRole}
          roles={user?.roles || []}  // Pasar roles como prop
        />
       </AuthWrapper> 
    </ConfigProvider>
  );
};
export default LayoutComponent;
