import {StyleSheet, Document, Page, View, Text, Image} from '@react-pdf/renderer';

export default function PDF({planAccion}){

    const styles = StyleSheet.create({
        page: {
          flexDirection: 'column',
          backgroundColor: '#f8f9fa',
          padding: 30,
        },
        section: {
          margin: 10,
          padding: 10,
          backgroundColor: '#ffffff',  // Fondo blanco para las secciones
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',  // Sombra suave
          borderRadius: 8,  // Bordes redondeados
          flexGrow: 1
        },
        title: {
          fontSize: 24,
          textAlign: 'center',
          marginBottom: 20,
          color: '#333',
        },
        subtitle: {
          fontSize: 18,
          margin: 10,
          fontWeight: 'bold',
          color: '#0056b3',
        },
        text: {
          margin: 10,
          fontSize: 14,
          textAlign: 'justify'
        },
        header: {
          fontSize: 12,
          marginBottom: 20,
          textAlign: 'center',
          color: 'grey',
        },
        imageView: {
          marginVertical: 15,
          alignItems: 'center',
        },
        image: {
          width: 150,
          height: 150,
        }
    });

    return (
        <Document>
          <Page style={styles.page}>
            <View>
                <Text style={styles.header}>Plan de Acción</Text>
                <Text style={styles.title}>{planAccion.titulo}</Text>
                <View style={styles.section}>
                <Text style={styles.subtitle}>Descripción</Text>
                <Text style={styles.text}>{planAccion.descripcion}</Text>
                <Text style={styles.text}>Fecha de creación: {planAccion.fecha_creacion ? planAccion.fecha_creacion.split('T')[0] : 'No especificada'}</Text>
                <Text style={styles.text}>Fecha de finalización: {planAccion.fechaFinalizacion}</Text>
                <Text style={styles.text}>Estado: {planAccion.estado}</Text>
                <Text style={styles.text}>Progreso: {planAccion.progreso}%</Text>
                </View>
                <View style={styles.section}>
                <Text style={styles.subtitle}>Grupos de Compromisos</Text>
                {planAccion.grupoCompromiso?.map((grupo, index) => (
                    <View key={index} style={styles.section}>
                    <Text style={styles.subtitle}>{grupo.titulo}</Text>
                    {grupo.compromisos?.map((compromiso, index) => (
                        <Text key={index} style={styles.text}>{compromiso.descripcion} - Estado: {compromiso.estado}</Text>
                    ))}
                    </View>
                ))}
                </View>
            </View>
          </Page>
        </Document>
    );

};