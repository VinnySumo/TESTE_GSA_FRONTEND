import { useState, useCallback } from 'react';
import api from '../services/api';

export function useAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    // Função para listar 
    const listarAlunos = useCallback(async (sala = 'todas') => {
        setLoading(true);
        setErro(null);
        try {
            let url = '';

           
            if (sala === 'todas') {
                url = '/sala/nascimento/todas';
            } else {
                
                url = `/sala/${sala}`;
            }
        
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
        
        let salaLetra = 'a';
        if (salaOrigem) {
            if (salaOrigem.toLowerCase().includes('b')) salaLetra = 'b';
            if (salaOrigem.toLowerCase().includes('c')) salaLetra = 'c';
        }

        try {
            await api.delete(`/sala/${salaLetra}/${id}`);
            // Após deletar, recarrega a lista automaticamente
            await listarAlunos();
            return true; 
        } catch {
            setErro('Erro ao deletar aluno.');
            return false;
        }
    };

    
    return {
        alunos,
        loading,
        erro,
        listarAlunos,
        buscarAlunos,
        removerAluno
    };
}