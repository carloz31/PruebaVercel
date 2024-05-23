"use client";
import decodeJwt from '@/utils/decodeJwt';
import { GoogleLogin, GoogleOAuthProvider,CredentialResponse } from '@react-oauth/google';
import validaToken from './validarToken';
import { useState } from 'react';
import Link from 'next/link';

const Login = () => {

    const [redirectRoute, setRedirectRoute] = useState(null);

    function handleError(){
        console.log("inicio incorrecto");
    }

    async function handleSuccess(CredentialResponse){
        console.log("inicio Exitoso",CredentialResponse);
        if(CredentialResponse.credential){
            const { payload } = decodeJwt(CredentialResponse.credential);
            console.log(payload);
            const validado = await validaToken(payload.email);
            if (validado) {
                const url = `${validado.path}?id=${validado.id}`;
                window.location.href = url;
            }
        }
    }

    return <div>
         <div>
            <GoogleLogin onError={handleError} onSuccess={handleSuccess} width={250} />
        </div>
    </div>


};
export default Login;