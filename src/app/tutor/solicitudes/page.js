"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input } from "antd";
import axios from "@/utils/axiosConfig";
import { tutorItems } from "@/utils/menuItems";
import { tutorBreadcrumbNames } from "@/utils/breadcrumbNames";
import { useUser } from "@/context/UserContext";

const { Title } = Typography;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const get = async () => {
    setIsLoading(true);
  };

  useEffect(() => {
    get();
  }, []);

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent
        siderItems={tutorItems}
        breadcrumbNames={tutorBreadcrumbNames}
      ></LayoutComponent>
    </main>
  );
}
