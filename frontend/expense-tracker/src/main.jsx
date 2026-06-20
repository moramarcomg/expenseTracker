// Importaciones: traemos funciones desde node_modules (paquetes instalados con npm)
import { StrictMode } from 'react'           // StrictMode: helper que detecta problemas en desarrollo
import { createRoot } from 'react-dom/client' // createRoot: monta React en el DOM del navegador
import './index.css'                           // Importa estilos globales (Tailwind + CSS personalizado)
import App from './App.jsx'                    // Importa el componente principal App desde otro archivo

// createRoot busca el <div id="root"> en public/index.html y renderiza React ahí
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App /> {/* <App /> es JSX, parece HTML pero es JavaScript que React convierte en HTML */}
  </StrictMode>,
)
