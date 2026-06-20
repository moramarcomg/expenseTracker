import React from 'react'
import CARD_2 from '../../assets/images/card_2.png'  // Importa imagen (Vite la procesa como URL)
import { LuTrendingUpDown } from 'react-icons/lu'

// AuthLayout: layout que envuelve las páginas de Login y SignUp
// {children} es una prop especial: todo lo que esté dentro de <AuthLayout>...</AuthLayout>
const AuthLayout = ({children}) => {
  return <div className="flex" >
        {/* Columna izquierda: formulario (ocupa 60% en desktop, 100% en mobile) */}
        <div className="w-screen h-screen md:w-[60vw] px-12 pt-8">
            <h2 className="text-lg font-medium text-black">Expense Tracker </h2>
                {children}  {/* Aquí se renderiza el contenido de Login o SignUp */}
            </div>

    {/* Columna derecha: decorativa, solo visible en md (pantallas medianas/grandes) */}
    <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        {/* Divs decorativos con posiciones absolutas */}
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5" />
        <div className="w-48 h-56 rounded-[40px] border-20 border-fuchsia-600 absolute top-[30%] -right-10" />
        <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5" />

        {/* Grid con la tarjeta de estadísticas */}
        <div className="grid grid-cols-1 z-20">
            <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income and Expenses"
            value="430,000"
            color="bg-primary"
            />
        </div>

        {/* Imagen de tarjeta decorativa al fondo */}
        <img
        src={CARD_2}
        className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15"
        />
    </div>

    </div>;
};

export default AuthLayout

// StatsInfoCard: subcomponente para mostrar una tarjeta con estadística
// Recibe icon, label, value, color como props (propiedades)
const StatsInfoCard = ({ icon, label, value, color }) => {
    return <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
      {/*
        className dinámico con template string: `${color}` se reemplaza por el valor de la prop
        Template strings usan backticks (`) y ${} para insertar variables
      */}
      <div 
        className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
      >
        {icon}
      </div>
        <div>
            <h6 className="text-xs text-gray-500 mb-1">{label}</h6>
            <span className="text-[20px]">${value}</span>
        </div>
    </div>;
  };
