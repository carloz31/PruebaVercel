import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';


export default function FormatoDerivacion({
    fecha,
    hora,
    codigoAlumno,
    nombreAlumno,
    celular,
    correoAlumno,
    derivadoPor,
    cargo,
    correoTutor,
    unidadTutor,
    unidadDerivada,
    motivo,
    antecedentes,
    comentarios}){

    const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 80,
        paddingVertical: 30,
    },
    section: {
        marginTop: 20,
    },
    title: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        
    },
    field: {
        marginBottom: 5,
        fontSize: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 12,
        border: 1,
        borderColor: '#000',
        marginTop: 10,
    },
    fixedHeader: {
        position: 'fixed',
        backgroundColor: '#fff',
        textAlign: 'left',
        fontSize: 12,
        lineHeight: 1,
    },
    fixedHeaderText: {
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        paddingHorizontal: 80,
        textAlign: 'left',
        fontSize: 10,
        fontStyle: 'italic',
    },
    });

    return(
    <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.fixedHeader}>
            <Text style={styles.fixedHeaderText}>FICHA DE DERIVACION</Text>
            <Text style={styles.fixedHeaderText}>SERVICIO DAES</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.field}>
            <Text>Fecha: </Text>
            <Text>{fecha}</Text>
            </Text>
            <Text style={styles.field}>
            <Text>Hora: </Text>
            <Text>{hora}</Text>
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.title}>Ficha de Derivación</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.field}>
            <Text>Código del Alumno: </Text>
            <Text>{codigoAlumno}</Text>
            </Text>
            <Text style={styles.field}>
            <Text>Nombre de Alumno: </Text>
            <Text>{nombreAlumno}</Text>
            </Text>
            <Text style={styles.field}>
            <Text>Celular: </Text>
            <Text>{celular}</Text>
            </Text>
            <Text style={styles.field}>
            <Text>Correo electrónico del alumno: </Text>
            <Text>{correoAlumno}</Text>
            </Text>
            <Text style={styles.field}>
            <Text>Derivado por: </Text>
            <Text>{derivadoPor}</Text>
            </Text>
            <Text style={styles.field}>
            <Text>Cargo: </Text>
            <Text>{cargo}</Text>
            </Text>
            <Text style={styles.field}>
            <Text>Correo electrónico de quien deriva: </Text>
            <Text>c.acosta@pucp.edu.pe</Text>
            </Text>
            <Text style={styles.field}>
            <Text>Unidad de la persona que deriva: </Text>
            <Text>{unidadTutor}</Text>
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.label}>Unidad de apoyo a la que se deriva</Text>
            <Text style={styles.input}>{unidadDerivada}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.label}>Motivo de Derivación</Text>
            <Text style={styles.input}>{motivo}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.label}>Antecedentes de Importancia (Según la información que se tenga) [Evaluación de 
            ingreso, historia, fichas de seguimiento, asesorías, etc.]</Text>
            <Text style={styles.input}>{antecedentes}</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.label}>Comentarios o Sugerencias (Si fuera el caso)</Text>
            <Text style={styles.input}>{comentarios}</Text>
        </View>
        <View style={styles.footer}>
            <Text>
                Esta ficha debe ser completada, previa autorización del estudiante, por la/el docente, 
                tutora o tutor y enviada al psicólogo de contacto quien la remite directamente al Servicio 
                correspondiente.
            </Text>
        </View>
        </Page>
    </Document>
    );
}