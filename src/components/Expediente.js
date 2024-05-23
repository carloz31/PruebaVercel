import React from 'react';
import { Table, Button, Input, Space, Tag } from 'antd';
import Link from 'next/link';
import { EyeOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';

const Documentos = ({docs}) => {

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'titulo',
      key: 'titulo'
    },
    {
      title: 'Tipo de Archivo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: tipo => {
        /*let color = 'geekblue';
        if (tipo === 'Constancia') {
          color = 'volcano';
        } else if (tipo === 'Ficha de Derivación') {
          color = 'green';
        }
        return <Tag color={color} key={tipo}>{tipo.toUpperCase()}</Tag>;
        */
        const TipoStyle = {
          padding: '4px 8px',
          borderRadius: '999px',
          color: '#fff',
          textAlign: 'center', // Centro de texto
          display: 'inline-block', // Para que el span no ocupe el ancho completo
        };
        console.log(tipo);
      
        if (tipo === 'Constancia') {
          TipoStyle.backgroundColor = '#52c41a'; // verde para estado activo
        } else if (tipo === 'Plan de Acción') {
          TipoStyle.backgroundColor = '#f5222d'; // rojo para estado inactivo
        }

        return <span style={TipoStyle} key={tipo}>{tipo.toUpperCase()}</span>;
      }
    },
    {
      title: 'Acción',
      key: 'acciones',
      dataIndex: 'acciones',
      render: (acciones,record) => (
        <Space size="middle">
          {acciones.includes('visualizar') && 
          <Link href={{
            pathname: `/tutor/alumnos/perfil/documentos`,
            query: {
              id: record.id,
            },
          }}>
            <Button icon={<EyeOutlined />}/>
          </Link>}
          {acciones.includes('descargar') && <Button icon={<DownloadOutlined />} />}
        </Space>
      ),
    }
  ];

return (
    <div style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', marginBottom: 16 }}>
            <Button type="primary" style={{ marginRight: 8 }}>Buscar</Button>
            <Input placeholder="Buscar documento..." style={{ width: "50%", fontFamily: 'Nunito, sans-serif' }} />
        </div>
        <Table columns={columns} dataSource={docs} pagination={false} />
    </div>
);
};

export default Documentos;