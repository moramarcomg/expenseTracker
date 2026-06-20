import React, { useState } from 'react'      // useState: hook para crear estado (datos que cambian)
import { useNavigate, Link } from 'react-router-dom'  // useNavigate: redirige, Link: navega sin recargar
import AuthLayout from '../../components/layouts/AuthLayout'  // Layout reutilizable para auth
import Input from '../../components/Inputs/Input'           // Componente input personalizado
import { validateEmail } from '../../utils/helper'           // Función para validar email

// Componente Login: arrow function que devuelve JSX
const Login = () => {
  // useState devuelve un array de 2 elementos: [valorActual, funciónParaActualizarlo]
  const [email, setEmail] = useState("");        // "" es el valor inicial (string vacío)
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");        // Para mostrar mensajes de error

  // useNavigate devuelve una función que redirige a otra ruta
  const navigate = useNavigate();

  // handleLogin: función async (asíncrona) porque hará peticiones a un servidor
  // e: evento del formulario, lo recibe cuando se dispara onSubmit
  const handleLogin = async (e) => {
    e.preventDefault();  // Evita que el formulario recargue la página (comportamiento default)

    // Validaciones antes de enviar al servidor
    if(!validateEmail(email)){          // Si el email no es válido
      setError("Please enter a valid email address");  // Actualiza el estado error
      return;                            // Detiene la ejecución
    }
    if(!password){
      setError("Please enter your password");
      return;
    }

    setError("");  // Limpia el error si todo está bien

    // Aquí iría la llamada a la API de login:
    // const response = await axios.post("/api/v1/auth/login", { email, password });
    // if(response.data.success) navigate("/dashboard");
  };

  return (
    // AuthLayout recibe children: todo lo que está dentro de <AuthLayout>...</AuthLayout>
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-1.25 mb-6">
          Please enter your details to log in
          </p>

        {/* onSubmit: evento del formulario, llama a handleLogin cuando se presiona el botón */}
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            // onChange: evento que se dispara cuando el usuario escribe
            // ({target}) destructuring: extrae target del evento (target = el input)
            // target.value contiene lo que el usuario escribió
            onChange={({target}) => setEmail(target.value)}
            label="Email Address"
            placeholder="marco@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({target}) => setPassword(target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
          />
          
          {/* && es short-circuit: si error tiene valor, renderiza el <p>; si no, no muestra nada */}
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"  // type="submit" activa el onSubmit del form
            className="btn-primary mt-3"
          >
            LOG IN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            {/* Link de react-router-dom: navega a /signUp sin recargar la página */}
            <Link className="font-medium text-primary underline" to="/signUp">
            Sign Up
            </Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
