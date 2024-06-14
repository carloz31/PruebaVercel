import axios from '@/utils/axiosConfig';
import { RESPONSE_LIMIT_DEFAULT } from 'next/dist/server/api-utils';


export default async function validaTokenPassword(email,password) {
    try {
        // Enviar el token al backend
        debugger
        const response = await axios.post("/usuarioApi/validarUsuarioPassword", {
            correo: email,
            password: password
        });
        console.log(response);
        if(response.status === 200){
            localStorage.setItem('jwtToken', response.data.token);
            const { id, resultado } = response.data.result;
            debugger
            // Verificar el resultado de la validación
            let path;
            let rolSeleccionado;
            debugger
            switch (resultado) {
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
            const userWithRole = { ...response.data, rolSeleccionado };
            // Devolver la ruta y el ID del usuario
            return { path, id, userWithRole };    
        }else{
            return false;
        }
          
    } catch (error) {
        console.log('Error al validar el token:', error);
        // Aquí puedes manejar errores de red u otros errores
        return false; // Devuelve false en caso de error
    }
}
