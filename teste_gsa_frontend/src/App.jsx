import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home';
import Cadastro from './pages/Cadastro/cadastro';
import Detalhes from './pages/Detalhes/detalhe';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro/:sala/:id" element={<Cadastro />} /> {/* Rota Editar */}
        <Route path="/detalhes/:sala/:id" element={<Detalhes />} /> {/* Rota para ver as informações do aluno */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;