"use client";
import React from "react";
import { Layout, Menu, Button, Typography, ConfigProvider, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./landing.css";
import { landingThemeConfig } from "@/utils/themeConfigs";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const pathname = usePathname();

  return (
    <ConfigProvider theme={landingThemeConfig}>
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            className="logo-header"
            src="/logoInv.svg"
            alt="Eunoia Logo"
            style={{ height: 64 }}
          />
          <Menu theme="dark" mode="horizontal" selectedKeys={[pathname]}>
            <Menu.Item key="/">Inicio</Menu.Item>
            <Menu.Item key="/beneficios">Beneficios</Menu.Item>
            <Menu.Item key="/tutoria">Tutoría</Menu.Item>
            <Menu.Item key="/ayuda">Ayuda</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 40px", marginTop: 64, display: "flex" }}>
          <div style={{ padding: 24, minHeight: 380, flex: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Title>Aprende. Crece. Triunfa.</Title>
            <Paragraph>
              Con tutores comprometidos y herramientas de aprendizaje
              innovadoras, nuestro sistema de tutorías está aquí para ayudarte a
              convertir tus metas académicas universitarias en realidad.
            </Paragraph>
            <Button type="primary" size="large" style={{marginTop: "16px"}}>
              <Link href="/login">Ingresar a Eunoia</Link>
            </Button>
          </div>
          <div style={{ flex: 4}}>
            <Image
              src="/homeImage.png"
              alt="Home Image"
              layout="responsive"
              width={600}
              height={600}
            />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default LandingPage;
