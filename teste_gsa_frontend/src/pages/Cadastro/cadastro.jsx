import React from 'react';
import { Link } from 'react-router-dom';

export default function Cadastro() {
  return (
    <div className="container mt-5">
      <h1>Tela de Cadastro</h1>
      <Link to="/" className="btn btn-secondary">Voltar</Link>
    </div>
  );
}