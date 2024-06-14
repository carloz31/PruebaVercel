"use client";

import React, { useState } from "react";
import { Menu } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const { SubMenu } = Menu;

const SiderList = ({ items }) => {
  const [openKeys, setOpenKeys] = useState([]);
  const pathname = usePathname();
  const router = useRouter();

  const onClick = ({ key }) => {
    router.push(key);
  };

  const onTitleClick = (link, e) => {
    e.stopPropagation();
    router.push(link);
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const getSelectedKeys = () => {
    return [
      `/${pathname
        .split("/")
        .filter((item) => item)
        .slice(0, 2)
        .join("/")}`,
    ];
  };

  const renderMenuItems = (items) => {
    return items.map(item => {
      if (item.children) {
        return (
          <SubMenu
            key={item.key}
            icon={item.icon}
            title={
              <div onClick={(e) => onTitleClick(item.link, e)} style={{ transition: 'all 0.3s ease' }}>
                {item.label}
              </div>
            }
            style={{ transition: 'all 0.3s ease' }}
          >
            {renderMenuItems(item.children)}
          </SubMenu>
        );
      }
      return (
        item.visible && (
          <Menu.Item key={item.link} icon={item.icon} style={{ transition: 'all 0.3s ease' }}>
            {item.label}
          </Menu.Item>
        )
      );
    });
  };

  return (
    <div style={{ padding: "10px" }}>
      <Image
        src="/logo.svg"
        width={200}
        height={200}
        alt="Logo"
      />
      <Menu
        onClick={onClick}
        style={{
          width: "100%",
          textAlign: "left",
          border: "none",
          transition: 'all 0.3s ease'
        }}
        selectedKeys={getSelectedKeys()}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        mode="inline"
      >
        {renderMenuItems(items)}
      </Menu>
    </div>
  );
};

export default SiderList;
