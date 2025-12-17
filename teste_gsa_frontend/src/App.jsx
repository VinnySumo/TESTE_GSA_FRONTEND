import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home';
import Cadastro from './pages/Cadastro/cadastro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        {/* Rota para Edição (recebe ID e Sala) */}
        <Route path="/cadastro/:sala/:id" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;