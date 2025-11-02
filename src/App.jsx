// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body"; // tu Home actual
import Productos from "./pages/Productos";
import Vision from "./pages/Vision";
import Login from "./pages/Login";
import Proyecto from "./pages/Proyecto";
import Historial from "./pages/Historial";
import Register from "./pages/Register";
import MiHistorial from "./pages/MiHistorial";

import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/Vision" element={<Vision />} />
        <Route path="/Login" element={<Login />}/>
        <Route path="/Proyecto" element={<Proyecto />}/>
        <Route path="/Historial" element={<Historial />}/>
        <Route path="/Register" element={<Register />}/>
        <Route path="/mi-historial" element={<MiHistorial />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
