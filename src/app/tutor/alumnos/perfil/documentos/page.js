"use client"

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import PDF from '@/components/pdf'; // Asegúrate de que el nombre del archivo y el export coincidan
import axios from 'axios';
import { Spin} from 'antd';
import { useSearchParams } from "next/navigation"

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(pkg => pkg.PDFViewer), {
    ssr: false
  });

export default function Documentos() {
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [planAccion, setPlanAccion] = useState({}); // Usa null como valor inicial

    useEffect(() => {
        const fetchPlan = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.backend}/planDeAccionApi/listarPlanesAccionPorID/${id}`);
                setPlanAccion(response.data);
                console.log(planAccion);
            } catch (error) {
                console.error('Error fetching plan de accion details:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlan();
    }, [id]);

    return (
        <main>
        {!isLoading ? (
            <div style={{ height: '100vh', width: '100vw' }}>
                <PDFViewer width="100%" height="100%">
                    <PDF planAccion={ planAccion } />
                </PDFViewer>
            </div>
          ) : (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Spin size="large" />
          </div>
          )}
        </main>
        
    );
}