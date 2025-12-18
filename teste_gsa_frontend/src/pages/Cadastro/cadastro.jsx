import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAlunoForm } from '../../hooks/hookAlunoForm';

export default function Cadastro() {
    const { sala: salaParam, id } = useParams(); 
    const navigate = useNavigate();
    
    const { cadastrarAluno, editarAluno, buscarUmAluno, excluirAluno, loading, erro } = useAlunoForm();

    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [endereco, setEndereco] = useState('');
    
    const [salaSelecionada, setSalaSelecionada] = useState('a');
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        if (id && salaParam) {
            setEditando(true);
            setSalaSelecionada(salaParam); 
            carregarDados();
        }
    }, [id, salaParam]);

    async function carregarDados() {
        const aluno = await buscarUmAluno(id, salaParam);
        if (aluno) {
            setNome(aluno.nome);
            setEndereco(aluno.endereco || '');
            if (aluno.data_nascimento) {
                const [dia, mes, ano] = aluno.data_nascimento.split('/');
                setDataNascimento(`${ano}-${mes}-${dia}`);
            }
        } else {
            alert('Aluno não encontrado.');
            navigate('/');
        }
    }

    function validarIdade(dataString) {
        if (!dataString) return false;
        const hoje = new Date();
        const nascimento = new Date(dataString);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;

        if (idade < 5) {
            alert(`Idade inválida (${idade} anos). Mínimo 5 anos.`);
            return false;
        }
        if (idade > 100) {
            alert(`Ano inválido! Verifique o ano de nascimento.`);
            return false;
        }
        if (nascimento > hoje) {
            alert("Data não pode ser futura.");
            return false;
        }
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validarIdade(dataNascimento)) return;

        const dados = { nome, data_nascimento: dataNascimento, endereco, sala: salaSelecionada };
        let sucesso = false;
    
        if (editando) {
            if (salaSelecionada !== salaParam) {
                if (window.confirm(`Você alterou a sala de ${salaParam.toUpperCase()} para ${salaSelecionada.toUpperCase()}. Isso vai mover o aluno. Deseja continuar?`)) {
                    
                    const criouNovo = await cadastrarAluno(dados);
                    
                    if (criouNovo) {
                        await excluirAluno(id, salaParam);
                        alert('Aluno movido de sala com sucesso!');
                        navigate('/');
                        return;
                    } else {
                        alert('Erro ao mover aluno (falha ao criar na nova sala).');
                        return;
                    }
                } else {
                    return; 
                }
            } else {
                sucesso = await editarAluno(id, salaParam, dados);
            }
        } else {
            sucesso = await cadastrarAluno(dados);
        }

        if (sucesso) {
            alert(editando ? 'Aluno atualizado!' : 'Aluno cadastrado!');
            navigate('/');
        } else {
            alert(erro || 'Erro ao salvar.');
        }
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                    <h2 className="fw-bold text-uppercase">
                        {editando ? 'Editar Aluno' : 'Novo Aluno'}
                    </h2>
                    <p className="text-muted">Preencha as informações abaixo</p>
                </div>
                
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        
                        {/* Campo Nome */}
                        <div className="mb-3">
                            <label className="label-custom">Nome Completo</label>
                            <input 
                                type="text" 
                                className="form-control input-custom" 
                                value={nome} 
                                onChange={(e) => setNome(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        {/* Campo Data Nascimento */}
                        <div className="mb-3">
                            <label className="label-custom">Data de Nascimento</label>
                            <input 
                                type="date" 
                                className="form-control input-custom" 
                                value={dataNascimento} 
                                onChange={(e) => setDataNascimento(e.target.value)} 
                                required 
                                max={new Date().toISOString().split('T')[0]} 
                            />
                        </div>

                        {/* Campo Endereço */}
                        <div className="mb-3">
                            <label className="label-custom">Endereço</label>
                            <input 
                                type="text" 
                                className="form-control input-custom" 
                                value={endereco} 
                                onChange={(e) => setEndereco(e.target.value)} 
                            />
                        </div>

                        {/* Campo Sala */}
                        <div className="mb-4">
                            <label className="label-custom">Sala</label>
                            <select 
                                className="form-select input-custom" 
                                value={salaSelecionada} 
                                onChange={(e) => setSalaSelecionada(e.target.value)}
                            >
                                <option value="a">Sala A</option>
                                <option value="b">Sala B</option>
                                <option value="c">Sala C</option>
                            </select>
                            
                            {editando && salaSelecionada !== salaParam && (
                                <div className="alert alert-warning mt-2 p-2 small fw-bold">
                                    ⚠️ Atenção: Ao salvar, o aluno será movido da Sala {salaParam.toUpperCase()} para a Sala {salaSelecionada.toUpperCase()}.
                                </div>
                            )}
                        </div>

                        {/* Botões de Ação */}
                        <div className="d-flex gap-2 pt-2">
                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="btn button-salvar px-5 py-2 fw-bold"
                            >
                                {loading ? 'SALVANDO...' : 'SALVAR'}
                            </button>
                            
                            <Link 
                                to="/" 
                                className="btn button-voltar px-5 py-2 fw-bold text-decoration-none"
                            >
                                CANCELAR
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}