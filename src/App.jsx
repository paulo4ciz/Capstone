// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Body from "./components/Body"; // tu Home actual
import Productos from "./pages/Productos";
import Vision from "./pages/vision";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/Vision" element={<Vision />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
