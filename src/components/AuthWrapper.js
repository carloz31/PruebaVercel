"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axiosConfig';;
import { useUser } from '@/context/UserContext';
import { Spin } from 'antd';

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAndRedirect = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/login'); // Redirige al login si no hay token
        return;
      }
      try {
        const response = await axios.get(`/api/auth/me`);
        console.log("User data obtained:", response.data); // Log para verificar los datos del usuario
        const { roles } = response.data; //Recibe los roles de la bd
        const rolSeleccionado = user?.rolSeleccionado || (roles && roles[0].id); //Mantiene el rol si ya esta seleccionado
        setUser({ ...response.data, rolSeleccionado });
    }catch (error) {
        console.error('Error:', error);
        //router.push('/login'); // Redirige al login si hay un error en la solicitud
      } finally {
        setLoading(false); // Termina la carga una vez que se obtienen los datos o se produce un error
      }
    };

    validateAndRedirect();
  }, [router, setUser]);

  // Mientras se valida el usuario, puedes mostrar un spinner o algún tipo de loading
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
