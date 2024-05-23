"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input } from "antd";
import axios from "axios";
import { tutorItems } from "@/utils/menuItems";

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
      <Title style={{ color: "#043B71" }}>Plan de acción</Title>
      </LayoutComponent>
    </main>
  );
}

