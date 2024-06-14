"use client";

import { Table } from "antd";

const TableComponentDocumentos = ({ idAlumno }) => {
    
    
    return (
        <Table
          dataSource={idAlumno} //poner la lista de id planes de accion
          pagination={{ position: ["none", "bottomCenter"], pageSize: 20 }}
        >
          <Table.Column
            title="Nº"
            //dataIndex="index"
            //key="index"
            align="center"
            //render={(text, record, index) => index + 1}
          />
          <Table.Column
            title="Nombre"
            //dataIndex="nombres"
            //key="nombres"
            align="center"
            //render={(text, record) =>
            //  `${record.firstName} ${record.lastName} ${record.lastName2}`
            //}
          />
          <Table.Column
            title="Tipo de Archivo"
            //dataIndex="requerimiento"
            //key="requerimiento"
            align="center"
            //render={renderRequerimiento}
          />
          <Table.Column
            title="Acción"
            //dataIndex="accion"
            //key="accion"
            align="center"
            // render={(text, record) => (
            //   <Space size="middle">
            //     <Link
            //       href={{
            //         pathname: `/tutor/citas/detalle`,
            //         query: {
            //           cita: JSON.stringify(record),
            //         },
            //       }}
            //     >
            //       <IconEdit
            //         size={20}
            //         style={{
            //           cursor: "pointer",
            //           color: "#0884FC",
            //         }}
            //       />
            //     </Link>
            //     <Popconfirm
            //       title="¿Estás seguro de eliminar esta cita?"
            //       onConfirm={() => handleDelete(record.id)}
            //     >
            //       <IconTrashX
            //         size={20}
            //         style={{ cursor: "pointer", color: "#f5222d" }}
            //       />
            //     </Popconfirm>
            //   </Space>
            // )}
          ></Table.Column>
        </Table>
    );
}

export default TableComponentDocumentos;