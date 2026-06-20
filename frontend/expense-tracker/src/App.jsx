import React from 'react'

// Importaciones desde react-router-dom: librería para navegar entre páginas sin recargar
import{
  BrowserRouter as Router,  // Router: envuelve toda la app y maneja las rutas
  Routes,                   // Routes: contiene todas las rutas, solo renderiza una a la vez
  Route,                    // Route: define una ruta (path + componente a mostrar)
  Navigate,                 // Navigate: redirige a otra ruta programáticamente
} from 'react-router-dom'

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";

// Componente principal App (arrow function = () => {})
// Un componente React siempre devuelve JSX (HTML dentro de JavaScript)
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* path="/" es la raíz, element={<Root />} renderiza el componente Root */}
          <Route path="/" element={<Root />} />
          {/* Cada Route asocia una URL con un componente */}
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />  
          <Route path="/expense" element={<Expense />} />
        </Routes>
      </Router>
    </div>
  )
}

// export default: hace que este archivo exporte App para que otros lo importen
export default App

// Componente Root: decide a dónde redirigir cuando entras a "/"
const Root = () => {
  // localStorage.getItem("token") busca un token guardado en el navegador
  // !! convierte cualquier valor en booleano: si existe → true, si es null → false
  const isAuthenticated = !!localStorage.getItem("token");

  // Operador ternario: condición ? (si true) : (si false)
  // Si está autenticado va al dashboard, si no al login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
}
