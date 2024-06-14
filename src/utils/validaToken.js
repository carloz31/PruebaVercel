import axios from '@/utils/axiosConfig';;
import { message } from 'antd';

// Función para validar el token en el backend
export default async function validaToken() {

    try {
        debugger
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('No token found');
        }

        // Enviar el token al backend
        debugger
        const response = await axios.get(`/api/auth/me`);
        console.log('usuario ' + response.data);
        // Verificar el resultado de la validación
        const { id, tipoUsuario } = response.data;

        // Determinar la ruta en función del tipo de usuario
        let path;
        let rolSeleccionado;
        debugger
        switch (tipoUsuario) {
            case 'Tutor':
                rolSeleccionado = 3;
                path = '/tutor/citas';
                break;
            case 'Alumno':
                rolSeleccionado = 4;
                path = '/alumno/citas';
                break;
            case 'Coordinador':
                rolSeleccionado = 2;
                path = '/coordinador/tipos';
                break;
            case 'Administrador':
                rolSeleccionado = 1;
                path = '/admin/institucion';
                break;
            default:
                path = '/login';
                break;
        }
        console.log("User data obtained:", response.data); 
        const userWithRole = { ...response.data, rolSeleccionado };
        // Devolver la ruta y el ID del usuario
        return { path, id, userWithRole };
    } catch (error) {
        console.error('Error al validar el token:', error);
        message.error('Error al validar el token');
        return { path: '/login-success', id: -1 }; // Devuelve la ruta de login en caso de error
    }
}
