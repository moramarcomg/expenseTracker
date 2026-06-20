import React from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useState } from 'react'

// Input: componente reutilizable para cualquier tipo de input
// Props: value, onChange, label, placeholder, type
// Las props vienen desde el componente padre como atributos (<Input label="..." />)
const Input = ({ value, onChange, label, placeholder, type }) => {
    // showPassword: estado que controla si la contraseña se ve o no
    const [showPassword, setShowPassword] = useState(false);

    // toggleShowPassword: cambia showPassword al valor contrario
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);  // ! invierte el valor booleano
    };
  return (
    <div>
        {/* <label> asociado al input */}
        <label className="text-[13px] text-slate-800">{label}</label>

        <div className="flex items-center w-full rounded-lg border border-gray-200 bg-white px-3 py-2 mt-2">
            <input
            // type dinámico: si es password y showPassword es true, se muestra como text
            type={type === "password" ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none"
            value={value}
            // onChange recibe el evento del input, lo pasa al onChange del padre
            onChange={(e) =>onChange(e)}
        />

        {/* Renderizado condicional: solo se muestra si type === "password" */}
        {type === "password" && (
            <>
                {/* if showPassword muestra un ojo, si no muestra otro */}
                {showPassword ? (
                    <FaRegEye
                    className="text-primary cursor-pointer"
                    onClick={toggleShowPassword}
                    />
                ) : (
                    <FaRegEyeSlash
                        size={22}
                        className="text-slate-400 cursor-pointer"
                        onClick={() => toggleShowPassword()}
                    />
                )}
            </>
        
        )}
        </div>
    </div>
  )
}

export default Input
