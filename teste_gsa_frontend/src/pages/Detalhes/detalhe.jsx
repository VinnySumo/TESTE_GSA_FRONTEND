import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAlunoForm } from '../../hooks/hookAlunoForm';

export default function Detalhes() {
    const { sala, id } = useParams();
    const { buscarUmAluno, loading, erro } = useAlunoForm(); 
    const [aluno, setAluno] = useState(null);

    useEffect(() => {
        async function carregar() {
            // Verifica se tem ID e SALA antes de chamar
            if (id && sala) {
                const dados = await buscarUmAluno(id, sala);
                if (dados) {
                    setAluno(dados);
                }
            }
        }
        carregar();
        
    // CORREÇÃO AQUI: Removemos 'buscarUmAluno' desta lista abaixo.
    // Isso impede o loop infinito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, sala]); 

    // Se estiver carregando E ainda não tiver os dados do aluno na tela
    if (loading && !aluno) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="mt-2">Carregando informações...</div>
            </div>
        );
    }

    // Se der erro
    if (erro) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger">{erro}</div>
                <Link to="/" className="btn btn-secondary">Voltar</Link>
            </div>
        );
    }

    // Se parou de carregar e não tem aluno
    if (!loading && !aluno) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning">
                    <h4>Aluno não encontrado!</h4>
                    <p>Verifique se ele foi excluído ou se a sala está correta.</p>
                </div>
                <Link to="/" className="btn btn-primary">Voltar para a Lista</Link>
            </div>
        );
    }

    // Se tiver aluno, mostra a ficha
    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-header bg-light border-bottom pt-4 pb-3">
                    <h3 className="fw-bold text-uppercase text-secondary">
                        Ficha do Aluno
                    </h3>
                </div>
                
                <div className="card-body p-5">
                    
                    <div className="row mb-4">
                        <div className="col-md-2 fw-bold text-muted text-uppercase">Nome:</div>
                        <div className="col-md-10 fs-5 fw-bold">{aluno?.nome}</div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-2 fw-bold text-muted text-uppercase">Sala:</div>
                        <div className="col-md-10">
                            <span className="badge bg-primary fs-6">Sala {sala?.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-2 fw-bold text-muted text-uppercase">Data Nascimento:</div>
                        <div className="col-md-4 fs-5">{aluno?.data_nascimento}</div>
                        
                        <div className="col-md-2 fw-bold text-muted text-uppercase">Incluído em:</div>
                        <div className="col-md-4 text-muted">{aluno?.data_inclusao}</div>
                    </div>

                    <div className="row mb-5">
                        <div className="col-md-2 fw-bold text-muted text-uppercase">Endereço:</div>
                        <div className="col-md-10 fs-5">{aluno?.endereco || 'Não informado'}</div>
                    </div>

                    <hr />

                    <div className="d-flex gap-2 mt-4">
                        <Link to="/" className="btn btn-secondary px-4 fw-bold">
                            VOLTAR
                        </Link>
                        
                        <Link to={`/cadastro/${sala}/${id}`} className="btn btn-primary px-4 fw-bold">
                            EDITAR DADOS
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}