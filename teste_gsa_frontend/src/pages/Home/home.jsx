import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAlunos } from '../../hooks/hookAluno';

export default function Home() {
    
    const { alunos, loading, listarAlunos, buscarAlunos, removerAluno } = useAlunos();
    
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroSala, setFiltroSala] = useState(null); 
    const [buscaRealizada, setBuscaRealizada] = useState(false);

    const navigate = useNavigate();

    const alunosOrdenados = [...alunos].sort((a, b) => {
        return a.nome.localeCompare(b.nome);
    });

    useEffect(() => {
        if (filtroSala) {
            listarAlunos(filtroSala);
        }
    }, [listarAlunos, filtroSala]);

    const handleBusca = () => {
        if (termoBusca) {
            setFiltroSala(null);
            buscarAlunos(termoBusca);
            setBuscaRealizada(true); 
        }
    };
    
    const handleDigitacao = (e) => {
        setTermoBusca(e.target.value);
        if (buscaRealizada) {
            setBuscaRealizada(false); 
        }
    }

    const handleDeletar = async (id, salaOrigem) => {
        let salaLetra = 'a'; 
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
                else if (termoBusca) buscarAlunos(termoBusca);
            }
        }
    };

    const irParaEdicao = (id, salaOrigem) => {
        let salaLetra = 'a'; 
        if (salaOrigem) {
            const origemLower = salaOrigem.toLowerCase();
            if (origemLower.includes('b')) salaLetra = 'b';
            if (origemLower.includes('c')) salaLetra = 'c';
        } else if (filtroSala) {
            salaLetra = filtroSala;
        }
        navigate(`/cadastro/${salaLetra}/${id}`);
    };

    const verDetalhes = (id, salaOrigem) => {
        let salaLetra = 'a';
        if (salaOrigem) {
            const origemLower = salaOrigem.toLowerCase();
            if (origemLower.includes('b')) salaLetra = 'b';
            if (origemLower.includes('c')) salaLetra = 'c';
        } else if (filtroSala) {
            salaLetra = filtroSala;
        }
        navigate(`/detalhes/${salaLetra}/${id}`);
    };
    
    const handleSelecionarSala = (sala) => {
        setFiltroSala(sala);      
        setTermoBusca('');         
        setBuscaRealizada(false); 
    };

    const getBtnClass = (sala) => {
        const base = "btn fw-bold rounded-pill px-4 me-2 ";
        if (filtroSala === sala) {
            return base + "btn-primary"; 
        }
        return base + "btn-outline-secondary"; 
    };

    return (
        <div className="container p-4 mt-4 bg-white" style={{ minHeight: '80vh' }}>
            
            <div className="d-flex justify-content-between mb-4 align-items-center">
                <div className="logo-box">VS</div>
                <Link to="/cadastro" className="btn button-add px-4 py-2 fw-bold">
                    ADICIONAR ALUNO
                </Link>
            </div>

            <div className="mb-2">
                <span className="text-muted small fw-bold d-block mb-2">SELECIONE UMA SALA PARA VISUALIZAR:</span>
                <div className="d-flex justify-content-start pb-2 border-bottom">
                    <button onClick={() => handleSelecionarSala('a')} className={getBtnClass('a')}>
                        SALA A
                    </button>
                    <button onClick={() => handleSelecionarSala('b')} className={getBtnClass('b')}>
                        SALA B
                    </button>
                    <button onClick={() => handleSelecionarSala('c')} className={getBtnClass('c')}>
                        SALA C
                    </button>
                </div>
            </div>

            <div className="row mb-4 mt-4">
                <div className="col-md-9">
                    <input 
                        type="text" 
                        className="form-control form-control-lg input-custom" 
                        placeholder="OU PESQUISE POR NOME..."
                        value={termoBusca}
                        onChange={handleDigitacao}
                        onKeyDown={(e) => e.key === 'Enter' && handleBusca()} 
                    />
                </div>
                <div className="col-md-3">
                    <button 
                        onClick={handleBusca} 
                        className="btn button-add w-100 fw-bold py-2"
                        disabled={loading}
                    >
                        {loading ? 'BUSCANDO...' : 'BUSCAR'}
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                
                {!filtroSala && !termoBusca && alunos.length === 0 && !loading && (
                    <div className="text-center py-5 bg-light border border-dashed text-secondary">
                        <h4>👋 Bem-vindo!</h4>
                        <p>Clique em uma das salas acima ou faça uma pesquisa para ver os alunos.</p>
                    </div>
                )}

                {/* AQUI USAMOS alunosOrdenados NO LUGAR DE alunos */}
                {alunosOrdenados.length > 0 && (
                    <table className="table table-bordered align-middle table-hover">
                        <thead>
                            <tr>
                                <th className="text-center" style={{ width: '180px' }}>AÇÕES</th>
                                <th>NOME</th>
                                <th className="text-center" style={{ width: '120px' }}>SALA</th>
                                <th className="text-center">DATA NASCIMENTO</th>
                                <th className="text-center">DATA INCLUSÃO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunosOrdenados.map((aluno) => (
                                <tr key={`${aluno.id}-${aluno.origem}`}>
                                    <td className="text-center">
                                        <button 
                                            onClick={() => verDetalhes(aluno.id, aluno.origem)}
                                            className="btn btn-sm btn-link text-decoration-none fw-bold text-primary"
                                        >
                                            VER
                                        </button>
                                        <span className="mx-1 text-muted">|</span>
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
                
                {loading && (
                    <div className="text-center text-primary mt-5">
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Carregando...
                    </div>
                )}
                
                {!loading && filtroSala && alunos.length === 0 && (
                     <div className="text-center text-secondary mt-5">
                        Nenhum aluno encontrado nesta sala.
                     </div>
                )}

                {!loading && buscaRealizada && alunos.length === 0 && (
                    <div className="text-center text-secondary mt-5">
                        Nenhum aluno encontrado com o nome "{termoBusca}".
                    </div>
                )}
            </div>
        </div>
    );
}