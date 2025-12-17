import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlunos } from '../../hooks/hookAluno'; // Importa nosso Hook

export default function Home() {
    
    const { alunos, loading, listarAlunos, buscarAlunos, removerAluno } = useAlunos();
    
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroSala, setFiltroSala] = useState(null); 
    const navigate = useNavigate();

    
    useEffect(() => {
        if (filtroSala) {
            listarAlunos(filtroSala);
        }
        //Se nao tiver nada, continua do mesmo jeito
    }, [listarAlunos, filtroSala]);

    const handleBusca = () => {
        // Se tiver busca, ele ignora o filtro criado
        if (termoBusca) {
            setFiltroSala(null);
            buscarAlunos(termoBusca);
        }
    };

       const handleDeletar = async (id, salaOrigem) => {
      
        let salaLetra = 'a'; // Padrão
        
        if (salaOrigem) {
            const origemLower = salaOrigem.toLowerCase();
            if (origemLower.includes('b')) salaLetra = 'b';
            if (origemLower.includes('c')) salaLetra = 'c';
        } else if (filtroSala && filtroSala !== 'todas') {
            salaLetra = filtroSala;
        }

        if (window.confirm(`Tem certeza que deseja remover este aluno da Sala ${salaLetra.toUpperCase()}?`)) {
            
            const sucesso = await removerAluno(id, salaLetra);
            
            if (sucesso) {
                alert('Aluno removido com sucesso!');
                if (filtroSala) listarAlunos(filtroSala);
            }
        }
    };

    const irParaEdicao = (id, salaOrigem) => {
        
        let salaLetra = 'a'; // Padrão

        if (salaOrigem) {
            const origemLower = salaOrigem.toLowerCase();
            if (origemLower.includes('b')) salaLetra = 'b';
            if (origemLower.includes('c')) salaLetra = 'c';
        } 
    
        else if (filtroSala && filtroSala !== 'todas') {
            salaLetra = filtroSala;
        }

        console.log(`Indo para edição: Sala ${salaLetra}, ID ${id}`); // Debug
        navigate(`/cadastro/${salaLetra}/${id}`);
    };

    const getBtnClass = (sala) => {
        const base = "btn fw-bold rounded-pill px-4 me-2 ";
        if (filtroSala === sala) {
            return base + "btn-primary"; // Azul (Ativo)
        }
        return base + "btn-outline-secondary"; // Cinza (Inativo)
    };

    return (
        <div className="container border p-4 shadow-sm mt-4 bg-white" style={{ minHeight: '80vh' }}>
            
            {/* Cabeçalho */}
            <div className="d-flex justify-content-between mb-4 align-items-center">
                <div className="logo-box shadow-sm rounded">VS</div>
                <Link to="/cadastro" className="btn btn-custom-add rounded-pill px-4 py-2 fw-bold shadow-sm">
                    ADICIONAR ALUNO
                </Link>
            </div>

            {/* --- FILTRO DE SALAS (Sem botão TODOS) --- */}
            <div className="mb-2">
                <span className="text-muted small fw-bold d-block mb-2">SELECIONE UMA SALA PARA VISUALIZAR:</span>
                <div className="d-flex justify-content-start pb-2 border-bottom">
                    <button onClick={() => setFiltroSala('a')} className={getBtnClass('a')}>
                        SALA A
                    </button>
                    <button onClick={() => setFiltroSala('b')} className={getBtnClass('b')}>
                        SALA B
                    </button>
                    <button onClick={() => setFiltroSala('c')} className={getBtnClass('c')}>
                        SALA C
                    </button>
                </div>
            </div>

            {/* Busca */}
            <div className="row mb-4 mt-4">
                <div className="col-md-9">
                    <input 
                        type="text" 
                        className="form-control form-control-lg rounded-0 border-secondary" 
                        placeholder="OU PESQUISE POR NOME..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button 
                        onClick={handleBusca} 
                        className="btn btn-custom-add rounded-pill w-100 fw-bold shadow-sm py-2"
                        disabled={loading}
                    >
                        {loading ? 'BUSCANDO...' : 'BUSCAR'}
                    </button>
                </div>
            </div>

            {/* Tabela Condicional */}
            <div className="table-responsive">
                
                {/* MUDANÇA 3: Mostra aviso se não tiver sala nem busca */}
                {!filtroSala && alunos.length === 0 && !loading && (
                    <div className="text-center py-5 bg-light rounded border border-dashed text-secondary">
                        <h4>👋 Bem-vindo!</h4>
                        <p>Clique em uma das salas acima ou faça uma pesquisa para ver os alunos.</p>
                    </div>
                )}

                {/* Só mostra a tabela se tiver alunos listados */}
                {alunos.length > 0 && (
                    <table className="table table-bordered align-middle table-hover">
                        <thead>
                            <tr>
                                <th className="text-center bg-light" style={{ width: '180px' }}>AÇÕES</th>
                                <th className="bg-light">NOME</th>
                                <th className="text-center bg-light" style={{ width: '120px' }}>SALA</th>
                                <th className="text-center bg-light">DATA NASCIMENTO</th>
                                <th className="text-center bg-light">DATA INCLUSÃO</th>
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
                                        <span className="mx-1 text-muted">|</span>
                                        <button 
                                            onClick={() => handleDeletar(aluno.id, aluno.origem)}
                                            className="btn btn-sm btn-link text-decoration-none fw-bold text-danger"
                                        >
                                            REMOVER
                                        </button>
                                    </td>
                                    <td className="fw-bold text-uppercase text-secondary">{aluno.nome}</td>
                                    <td className="text-center fw-bold text-primary">
                                        {aluno.origem || `Sala ${filtroSala?.toUpperCase()}`}
                                    </td>
                                    <td className="text-center">{aluno.data_nascimento}</td>
                                    <td className="text-center small text-muted">{aluno.data_inclusao}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
                {/* Mensagens de estado */}
                {loading && (
                    <div className="text-center text-primary mt-5">
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Carregando...
                    </div>
                )}
                
                {/* Se buscou/clicou e veio vazio */}
                {!loading && filtroSala && alunos.length === 0 && (
                     <div className="text-center text-muted mt-5">Nenhum aluno encontrado nesta sala.</div>
                )}
            </div>
        </div>
    );
}