import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAlunoForm } from '../../hooks/hookAlunoForm'; // <--- Importa o Hook Novo

export default function Cadastro() {
    const { sala: salaParam, id } = useParams();
    const navigate = useNavigate();

    // Usa o hook específico de formulário
    const { cadastrarAluno, editarAluno, buscarUmAluno, loading, erro } = useAlunoForm();

    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [endereco, setEndereco] = useState('');
    const [sala, setSala] = useState('a');
    
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        if (id && salaParam) {
            setEditando(true);
            setSala(salaParam);
            carregarDados();
        }
    }, [id, salaParam]);

    async function carregarDados() {
        // Usa a função do novo hook
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

    //Validação de idade do aluno
    function validarIdade(dataString) {
        if (!dataString) return false;

        const hoje = new Date();
        const nascimento = new Date(dataString);
        
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        // Mínimo (5 anos)
        if (idade < 5) {
            alert(`O aluno tem apenas ${idade} anos. A idade mínima é 5 anos.`);
            return false;
        }

        //  Máximo (18 anos) para cadastro
        if (idade > 18) {
            alert(`Data inválida! O ano digitado resultaria em ${idade} anos de idade. Verifique o ano.`);
            return false;
        }
        
        if (nascimento > hoje) {
            alert("A data de nascimento não pode ser no futuro.");
            return false;
        }

        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validarIdade(dataNascimento)) {
            return; // Para tudo se a idade for inválida
        }

        const dados = { nome, data_nascimento: dataNascimento, endereco, sala };
        let sucesso = false;

        if (editando) {
            // Usa função do novo hook
            sucesso = await editarAluno(id, salaParam, dados);
        } else {
            // Usa função do novo hook
            sucesso = await cadastrarAluno(dados);
        }

        if (sucesso) {
            alert(editando ? 'Aluno atualizado!' : 'Aluno cadastrado!');
            navigate('/');
        } else {
            alert(erro || 'Ocorreu um erro ao salvar.');
        }
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                    <h2 className="fw-bold text-uppercase">
                        {editando ? 'Editar Aluno' : 'Novo Aluno'}
                    </h2>
                    <p className="text-muted">Preencha as informações abaixo</p>
                </div>
                
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="label-custom">Nome Completo</label>
                            <input type="text" className="form-control input-custom p-3 bg-light" placeholder="Ex: João da Silva" value={nome} onChange={(e) => setNome(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="label-custom">Data de Nascimento</label>
                            <input type="date" className="form-control input-custom p-3 bg-light" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="label-custom">Endereço</label>
                            <input type="text" className="form-control input-custom p-3 bg-light" placeholder="Rua, Número, Bairro" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="label-custom">Sala</label>
                            <select className="form-select input-custom p-3 bg-light" value={sala} onChange={(e) => setSala(e.target.value)} disabled={editando}>
                                <option value="a">Sala A</option>
                                <option value="b">Sala B</option>
                                <option value="c">Sala C</option>
                            </select>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" disabled={loading} className="btn btn-custom-save px-5 py-2 fw-bold shadow-sm">
                                {loading ? 'SALVANDO...' : (editando ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR')}
                            </button>
                            <Link to="/" className="btn btn-custom-back px-5 py-2 fw-bold shadow-sm text-decoration-none">CANCELAR</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}