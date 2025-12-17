import { useState, useCallback } from 'react';
import api from '../services/api';

export function useAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(false); // Bônus: Estado de carregamento
    const [erro, setErro] = useState(null);

    // Função para listar (usamos useCallback para não recriar a função a toda hora)
    const listarAlunos = useCallback(async (sala = 'todas') => {
        setLoading(true);
        setErro(null);
        try {
            let url = '';

            // CORREÇÃO 2: Decide qual URL usar baseado no parâmetro
            if (sala === 'todas') {
                url = '/sala/nascimento/todas';
            } else {
                // Se for 'a', 'b' ou 'c', usa a rota específica
                url = `/sala/${sala}`;
            }
            
            console.log("Buscando na URL:", url); // Para você conferir no F12

            const response = await api.get(url);
            setAlunos(response.data.dados);
        } catch (error) {
            setErro('Erro ao carregar alunos.');
            console.error(error);
            setAlunos([]); // Limpa a lista se der erro
        } finally {
            setLoading(false);
        }
    }, []);

    // Função de Busca
    const buscarAlunos = async (termo) => {
        if (!termo) {
            listarAlunos();
            return;
        }
        setLoading(true);
        try {
            const response = await api.get(`/sala/busca/todas/${termo}`);
            setAlunos(response.data.dados);
        } catch {
            setErro('Erro na busca.');
            setAlunos([]); // Limpa lista se não achar
        } finally {
            setLoading(false);
        }
    };

    // Função de Remover
    const removerAluno = async (id, salaOrigem) => {
        // Lógica para descobrir a letra da sala
        let salaLetra = 'a';
        if (salaOrigem) {
            if (salaOrigem.toLowerCase().includes('b')) salaLetra = 'b';
            if (salaOrigem.toLowerCase().includes('c')) salaLetra = 'c';
        }

        try {
            await api.delete(`/sala/${salaLetra}/${id}`);
            // Após deletar, recarrega a lista automaticamente
            await listarAlunos();
            return true; // Retorna true se deu certo
        } catch {
            setErro('Erro ao deletar aluno.');
            return false;
        }
    };

    // Retorna tudo que a tela precisa
    return {
        alunos,
        loading,
        erro,
        listarAlunos,
        buscarAlunos,
        removerAluno
    };
}