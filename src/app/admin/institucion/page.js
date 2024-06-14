"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input } from "antd";
import axios from '@/utils/axiosConfig';
import { adminItems } from "@/utils/menuItems";

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
      <LayoutComponent siderItems={adminItems}>
      <Title style={{ color: "#043B71" }}>Institución</Title>
      </LayoutComponent>
    </main>
  );
}

