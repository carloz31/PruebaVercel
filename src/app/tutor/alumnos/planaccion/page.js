"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import {Button, Flex, Typography, Modal, Input, Divider} from "antd";
import axios from '@/utils/axiosConfig';
import { tutorItems } from "@/utils/menuItems";
import { tutorBreadcrumbNames } from "@/utils/breadcrumbNames";

const { Title } = Typography;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const get = async () => {
    setIsLoading(true);
  };

  useEffect(() => {
    get();
  }, []);

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Title style={{ color: "#043B71" }}>Plan de Acción</Title>
        <Flex vertical>
          <Divider />
          <Title level={2} style={{ color: "#043B71" }}>Compromisos</Title>
          <Flex justify="flex-end" gap="middle">
            <Button>Regresar</Button>
            <Button type="primary">Guardar cambios</Button>
          </Flex>

        </Flex>
      </LayoutComponent>
    </main>
  );
}