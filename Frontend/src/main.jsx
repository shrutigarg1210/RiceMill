// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import RiceMillWebsite from './RiceMillWebsite'
// import AdminDashboard from './AdminDashboard'

// function App() {
//   const isAdmin = window.location.pathname === '/admin'
//   return isAdmin ? <AdminDashboard /> : <RiceMillWebsite />
// }


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// FILE: src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './Context/AuthContext'
import RiceMillWebsite from './RiceMillWebsite'
import AdminDashboard from './AdminDashboard'

function App() {
  const path = window.location.pathname;
  return (
    <AuthProvider>
      {path === '/admin' ? <AdminDashboard /> : <RiceMillWebsite />}
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)