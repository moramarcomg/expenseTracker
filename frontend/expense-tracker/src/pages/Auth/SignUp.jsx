import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/Inputs/Input'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import { validateEmail } from '../../utils/helper'

const SignUp = () => {
  // Cada useState crea una pieza de estado independiente
  // null = no hay imagen seleccionada, "" = string vacío
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);  // null = sin error (distinto de "")
  
  const navigate = useNavigate();

  // async: permite usar await dentro (esperar respuestas del servidor)
  const handleSignUp = async (e) => {
    e.preventDefault();  // Previene recarga de página al enviar el form

    let profilePicUrl = "";  // let: variable que puede cambiar de valor

    // Validaciones del lado del cliente (antes de enviar al servidor)
    if(!fullName){  // !fullName es true si fullName está vacío
      setError("Please enter your full name");
      return;        // return detiene la ejecución de la función
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }
    if(!password){
      setError("Please enter your password");
      return;
    }

    setError(null);  // Limpia el error si todas las validaciones pasaron

    // Aquí iría la llamada a la API de registro:
    // const response = await axios.post("/api/v1/auth/register", { fullName, email, password });
    // if(response.data.success) navigate("/dashboard");
  }

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-1.25 mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>

          <div className="flex justify-center">
            {/*
              ProfilePhotoSelector recibe dos props (propiedades):
              - image: el valor actual de la imagen
              - onImageSelect: función que se ejecuta cuando el usuario selecciona una imagen
              setProfilePic actualiza el estado profilePic con la imagen seleccionada
            */}
            <ProfilePhotoSelector image={profilePic} onImageSelect={setProfilePic} />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={fullName}
                onChange={({target}) => setFullName(target.value)}
                label="Full Name"
                placeholder="Marco Mora"
                type="text"
              />
            </div>
            <div className="flex-1">
              <Input
                value={email}
                onChange={({target}) => setEmail(target.value)}
                label="Email Address"
                placeholder="marco@example.com"
                type="text"
              />
            </div>
          </div>
          <Input
            value={password}
            onChange={({target}) => setPassword(target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          {/* Si error no es null, muestra el mensaje de error */}
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold cursor-pointer mt-8"
          >
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            {/* {" "} es un espacio en JSX (los espacios normales se ignoran) */}
            <Link className="font-medium text-primary underline" to="/login">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
