//import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
// import App from './App.tsx'
import InitPage from "./pages/InitPage.tsx";
import LogintPage from "./pages/LoginPage.tsx";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogintPage/>} />
        <Route path="/home/:usuarioId" element={<InitPage/>} />
      </Routes>
    </BrowserRouter>
  );
} else {
  console.error("El elemento con id 'root' no se encontró en el DOM");
}
