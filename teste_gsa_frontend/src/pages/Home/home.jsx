import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlunos } from '../../hooks/hookAluno'; // Importa nosso Hook

export default function Home() {
    // AQUI ESTÁ A MÁGICA: Em vez de 50 linhas de axios, usamos 1 linha:
    const { alunos, loading, listarAlunos, buscarAlunos, removerAluno } = useAlunos();
    
    const [termoBusca, setTermoBusca] = useState('');
    const navigate = useNavigate();

    // Carrega a lista assim que a tela abre
    useEffect(() => {
        listarAlunos();
    }, [listarAlunos]);

    // Handler para o botão de busca
    const handleBusca = () => {
        buscarAlunos(termoBusca);
    };

    // Handler para deletar
    const handleDeletar = async (id, salaOrigem) => {
        if (window.confirm('Tem certeza que deseja remover este aluno?')) {
            const sucesso = await removerAluno(id, salaOrigem);
            if (sucesso) alert('Aluno removido com sucesso!');
        }
    };

    // Handler para navegação
    const irParaEdicao = (id, salaOrigem) => {
        let salaLetra = 'a';
        if (salaOrigem?.toLowerCase().includes('b')) salaLetra = 'b';
        if (salaOrigem?.toLowerCase().includes('c')) salaLetra = 'c';
        navigate(`/cadastro/${salaLetra}/${id}`);
    };

    return (
        <div className="container border p-4 shadow-sm mt-4 bg-white" style={{ minHeight: '80vh' }}>
            
            {/* Cabeçalho */}
            <div className="d-flex justify-content-between mb-5 align-items-center">
                <div className="logo-box shadow-sm rounded">LOGOTIPO</div>
                <Link to="/cadastro" className="btn btn-custom-add rounded-pill px-4 py-2 fw-bold shadow-sm">
                    ADICIONAR ALUNO
                </Link>
            </div>

            {/* Busca */}
            <div className="row mb-4">
                <div className="col-md-9">
                    <input 
                        type="text" 
                        className="form-control form-control-lg rounded-0 border-secondary" 
                        placeholder="PESQUISA"
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button 
                        onClick={handleBusca} 
                        className="btn btn-custom-add rounded-pill w-100 fw-bold shadow-sm py-2"
                        disabled={loading} // Desabilita se estiver carregando
                    >
                        {loading ? 'BUSCANDO...' : 'BUSCAR'}
                    </button>
                </div>
            </div>

            {/* Tabela */}
            <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '200px' }}>AÇÕES</th>
                            <th>NOME</th>
                            <th>DT DE NASCIMENTO</th>
                            <th>DT INCLUSÃO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map((aluno) => (
                            <tr key={`${aluno.id}-${aluno.origem}`}>
                                <td className="text-center">
                                    <button 
                                        onClick={() => irParaEdicao(aluno.id, aluno.origem)}
                                        className="btn btn-sm btn-link text-decoration-none fw-bold text-dark"
                                    >
                                        EDITAR
                                    </button>
                                    <span className="mx-1">|</span>
                                    <button 
                                        onClick={() => handleDeletar(aluno.id, aluno.origem)}
                                        className="btn btn-sm btn-link text-decoration-none fw-bold text-danger"
                                    >
                                        REMOVER
                                    </button>
                                </td>
                                <td className="fw-bold text-uppercase text-secondary">{aluno.nome}</td>
                                <td>{aluno.data_nascimento}</td>
                                <td>{aluno.data_inclusao}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Mensagens de estado vazio ou carregando */}
                {!loading && alunos.length === 0 && (
                    <div className="text-center text-muted mt-3">Nenhum aluno encontrado.</div>
                )}
                {loading && (
                    <div className="text-center text-primary mt-3">Carregando dados...</div>
                )}
            </div>
        </div>
    );
}