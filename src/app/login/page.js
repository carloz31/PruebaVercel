"use client";
import { IconKey, IconUser } from "@tabler/icons-react";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  ConfigProvider,
  message,
  Flex,
} from "antd";
import styles from "./styles.module.css";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import axios from "@/utils/axiosConfig";
import React, { useContext, useEffect, useState } from "react";
import validaTokenPassword from "@/components/validarTokenPassword";
import { defaultThemeConfig } from "@/utils/themeConfigs";
import { useUser } from "@/context/UserContext";
import GoogleButton from "@/components/bttnGoogle";

const Login = () => {
  const [url, setUrl] = useState("");
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchAuthUrl = async () => {
      try {
        debugger;
        const response = await axios.get("/api/auth/url");
        setUrl(response.data.authURL);
      } catch (error) {
        console.error("Error fetching the auth URL", error);
      }
    };

    fetchAuthUrl();
  }, []);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    const { username, password } = values;
    try {
      // Llamar a la función handleSuccess con el usuario y la contraseña
      debugger;
      handleSuccess(username, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Manejar caso de error al iniciar sesión
      message.error("Error al iniciar sesión");
    }
  };

  async function handleSuccess(username, password) {
    try {
      debugger;
      const validado = await validaTokenPassword(username, password);
      if (validado && validado.id !== -1) {
        setUser(validado.userWithRole);
        const url = `${validado.path}?id=${validado.id}`;
        window.location.href = url;
      } else {
        message.error("El usuario no existe");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      message.error("Error al iniciar sesión");
    }
  }

  const handleLoginGoogle = () => {
    if (url) {
      window.location.href = url; // Redirect to Google OAuth2 login
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <ConfigProvider theme={defaultThemeConfig}>
      <div className={styles["containerPrincipal"]}>
        <div className={styles["containerSecundario"]}>
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Row justify="center">
              <Col>
                <Image
                  src={logo}
                  alt="Logo"
                  style={{ width: "200px", height: "60px" }}
                />
              </Col>
            </Row>
            <Form.Item name="ingreso">
              <h1 className={styles.labelIngreso}>Ingrese a su cuenta</h1>
            </Form.Item>
            <Form.Item
              label={<strong>Usuario</strong>}
              name="username"
              rules={[{ required: true, message: "Se necesita un usuario" }]}
              className="labelIngreso"
            >
              <Input
                prefix={<IconUser size={20} className="site-form-item-icon" />}
                placeholder="usuario@ejemplo.com"
              />
            </Form.Item>
            <Form.Item
              label={<strong>Contraseña</strong>}
              name="password"
              rules={[
                { required: true, message: "Se necesita una contraseña" },
              ]}
              className="labelIngreso"
            >
              <Input
                prefix={<IconKey size={20} className="site-form-item-icon" />}
                type="password"
                placeholder="contraseña"
              />
            </Form.Item>
            <Form.Item
              name="olvidoContrasenha"
              className={styles.forgotPassword}
            >
              <a href="https://eros.pucp.edu.pe/pucp/usuarios/uswolvid/uswolvid?accion=IngresarOlvidoContrasena&identificacion=&msg=">
                ¿Olvidó su contraseña?
              </a>
            </Form.Item>
            <Form.Item name="ingreso" className={styles["ingreso"]}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles["bttn"]}
              >
                Ingrese a su cuenta
              </Button>
            </Form.Item>
            <GoogleButton
              handleClickGoogle={handleLoginGoogle}
              className={styles["bttnLoginGoogle"]}
            />
          </Form>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default function LoginPage() {
  return <Login />;
}
