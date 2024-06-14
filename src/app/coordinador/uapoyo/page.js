"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input } from "antd";
import axios from '@/utils/axiosConfig';
import { coordinadorItems } from "@/utils/menuItems";
import { coordinadorBreadcrumbNames } from "@/utils/breadcrumbNames";

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
      <LayoutComponent siderItems={coordinadorItems} breadcrumbNames={coordinadorBreadcrumbNames}>
      </LayoutComponent>
    </main>
  );
}

