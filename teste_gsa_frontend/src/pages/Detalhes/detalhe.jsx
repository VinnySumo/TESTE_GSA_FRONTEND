import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAlunoForm } from '../../hooks/hookAlunoForm';

export default function Detalhes() {
    const { sala, id } = useParams();
    const { buscarUmAluno, loading, erro } = useAlunoForm(); 
    const [aluno, setAluno] = useState(null);

    useEffect(() => {
        async function carregar() {
            if (id && sala) {
                const dados = await buscarUmAluno(id, sala);
                if (dados) {
                    setAluno(dados);
                }
            }
        }
        carregar();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, sala]); 

    // Loading
    if (loading && !aluno) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="mt-2">Carregando informações...</div>
            </div>
        );
    }

    // Erro
    if (erro) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger">{erro}</div>
                <Link to="/" className="btn button-voltar px-4 fw-bold">Voltar</Link>
            </div>
        );
    }

    // Não encontrado
    if (!loading && !aluno) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning">
                    <h4>Aluno não encontrado!</h4>
                    <p>Verifique se ele foi excluído ou se a sala está correta.</p>
                </div>
                <Link to="/" className="btn button-voltar px-4 fw-bold">Voltar para a Lista</Link>
            </div>
        );
    }

    // Exibição dos dados
    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0">
                {/* Alterado para bg-white para igualar ao Cadastro */}
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                    <h3 className="fw-bold text-uppercase">
                        Ficha do Aluno
                    </h3>
                    <p className="text-muted">Visualização de detalhes</p>
                </div>
                
                <div className="card-body p-4">
                    
                    <div className="row mb-4">
                        <div className="col-md-3 fw-bold text-muted text-uppercase small pt-1">Nome:</div>
                        <div className="col-md-9 fs-5 fw-bold text-dark">{aluno?.nome}</div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-3 fw-bold text-muted text-uppercase small pt-1">Sala:</div>
                        <div className="col-md-9">
                            {/* Mantendo um visual simples para a sala */}
                            <span className="badge bg-light text-dark border border-secondary px-3 py-2 rounded-0 fs-6">
                                SALA {sala?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-3 fw-bold text-muted text-uppercase small pt-1">Data Nascimento:</div>
                        <div className="col-md-9 fs-5">{aluno?.data_nascimento}</div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-3 fw-bold text-muted text-uppercase small pt-1">Incluído em:</div>
                        <div className="col-md-9 text-secondary">{aluno?.data_inclusao}</div>
                    </div>

                    <div className="row mb-5">
                        <div className="col-md-3 fw-bold text-muted text-uppercase small pt-1">Endereço:</div>
                        <div className="col-md-9 fs-5">{aluno?.endereco || 'Não informado'}</div>
                    </div>

                    <hr className="text-muted" />

                    <div className="d-flex gap-2 mt-4">
                        {/* Botão Voltar com estilo novo */}
                        <Link to="/" className="btn button-voltar px-4 py-2 fw-bold text-decoration-none">
                            VOLTAR
                        </Link>
                        
                        {/* Botão Editar usando o estilo 'Add' (Azul) para destaque */}
                        <Link to={`/cadastro/${sala}/${id}`} className="btn button-add px-4 py-2 fw-bold text-decoration-none">
                            EDITAR DADOS
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}