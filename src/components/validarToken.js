import axios from 'axios';

// Función para validar el token en el backend
export default async function validaToken(email) {
    try {
        // Enviar el token al backend
        const response = await axios.post(process.env.backend + "/usuarioApi/validarUsuario", {
            correo: email,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
        );

        debugger
        // Verificar el resultado de la validación
        if (response.data.id !== -1){
            localStorage.setItem('userID', response.data.id);
        }
        if (response.data.resultado === 'Tutor') {
            console.log('Usuario Tutor');
            return {path:'/tutor/citas',id:response.data.id}; // Devuelve true si el token es válido
        } 
        else if(response.data.resultado == 'Alumno'){
                return {path:'/alumno/citas',id:response.data.id}; // Devuelve false si el token no es válido
        }
        else if(response.data.resultado == 'Coordinador'){
             return {path:'/coordinador/tipos',id:response.data.id}; // Devuelve false si el token no es válido
        }
        else if(response.data.resultado == 'Administrador'){
            return {path:'/admin/institucion',id:response.data.id}; // Devuelve false si el token no es válido
        }
        else{
            return {path:'/login',id:response.data.id}; // Devuelve false si el token no es válido
        }
    } catch (error) {
        console.error('Error al validar el token:', error);
        // Aquí puedes manejar errores de red u otros errores
        return false; // Devuelve false en caso de error
    }
}

