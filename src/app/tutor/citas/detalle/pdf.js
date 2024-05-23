import {Document, Page, View, Text} from '@react-pdf/renderer';
import {Typography} from "antd";

const {Title} = Typography;

export default function PDF({planAccion}){
  return (
    <Document>
      <Page>
        <View>
          <Text>{planAccion.titulo}</Text>
          <Text>{planAccion.descripcion}</Text>
          <Text>Fecha de creación: {planAccion.fechaCreacion}</Text>
          <Text>Fecha de finalización: {planAccion.fechaFinalizacion}</Text>
          <Text>Estado: {planAccion.estado}</Text>
          <Text>Progreso: {planAccion.progreso}</Text>
          <Text>Grupos de compromisos:</Text>
          <View>
            {planAccion.gruposCompromisos?.map((grupo, index) => (
              <View key={index}>
                <Text>{grupo.titulo}</Text>
                <Text>Fecha de creación: {grupo.fechaCreacion}</Text>
                <Text>Compromisos:</Text>
                <View>
                  {grupo.compromisos?.map((compromiso, index) => (
                    <View key={index}>
                      <Text>{compromiso.descripcion}</Text>
                      <Text>Estado actual: {compromiso.estado}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
};