import { useState } from 'react';
import api from '../services/api';

export function useAlunoForm() {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    // Buscar dados de um aluno
    const buscarUmAluno = async (id, sala) => {
        setLoading(true);
        setErro(null);
        try {
            const response = await api.get(`/sala/${sala}/${id}`);
            return response.data.dados;
        } catch (error) {
            setErro('Erro ao buscar dados do aluno.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Cadastrar Aluno
    const cadastrarAluno = async (dados) => {
        setLoading(true);
        setErro(null);
        try {
            await api.post('/sala/cadastrar', dados);
            return true; // Sucesso
        } catch (error) {
            setErro(error.response?.data?.mensagem || 'Erro ao cadastrar.');
            return false; // Falha
        } finally {
            setLoading(false);
        }
    };

    // Editar Aluno
    const editarAluno = async (id, sala, dados) => {
        setLoading(true);
        setErro(null);
        try {
            await api.put(`/sala/${sala}/${id}`, dados);
            return true;
        } catch (error) {
            setErro('Erro ao salvar alterações.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const excluirAluno = async (id, sala) => {
        try {
            await api.delete(`/sala/${sala}/${id}`);
            return true;
        } catch (error) {
            console.error('Erro ao excluir antigo:', error);
            return false;
        }
    };

    return {
        loading,
        erro,
        buscarUmAluno,
        cadastrarAluno,
        editarAluno,
        excluirAluno
    };
}