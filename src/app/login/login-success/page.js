"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../../../services/httpservice';
import { message, Spin } from 'antd';
import { useUser } from '@/context/UserContext';
import validaToken from '@/utils/validaToken';

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true); ///estado para pantalla de carga

  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const gotToken = await getToken(code);
      console.log('gotok: '+ gotToken);
      if (gotToken) {
        try {
          const validado = await validaToken();
          if (validado.id !== -1) {
            setUser(validado.userWithRole);
            const url = `${validado.path}?id=${validado.id}`;
            window.location.href = url;
          } else {
            message.error("El usuario no existe");
            router.push('/login');
          }
        } catch (error) {
          console.error('Error al iniciar sesión:', error);
          message.error('Error al iniciar sesión');
          router.push('/login');
        }
      } else {
        console.error('back-end no dio token');
        router.push('/login');
      }
      setLoading(false); // Terminó de cargar
    };

    handleAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spin size="large" />
        <div style={styles.loadingText}>Iniciando Eunoia...</div>
      </div>
    );
  }

  return children;
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f0f2f5'
  },
  loadingText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold'
  }
};

export default AuthWrapper;
