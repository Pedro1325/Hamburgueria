document.addEventListener('DOMContentLoaded', function() {
    console.log("Script de cadastro carregado!");

    // Formatação do CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', formatarCPF);
    }

    function formatarCPF(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 3 && value.length <= 6) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
        } else if (value.length > 6 && value.length <= 9) {
            value = value.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
        } else if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d)/, '$1.$2.$3-$4');
        }
        
        e.target.value = value;
    }

    // Formatação do Telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', formatarTelefone);
    }

    function formatarTelefone(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        }
        if (value.length > 10) {
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        } else if (value.length > 6) {
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }
        
        e.target.value = value.substring(0, 15);
    }

    // Formatação do CEP e busca de endereço
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', formatarCEP);
        cepInput.addEventListener('blur', buscarEnderecoPorCEP);
    }

    function formatarCEP(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        
        e.target.value = value.substring(0, 9);
    }

    function buscarEnderecoPorCEP() {
        const cep = cepInput.value.replace(/\D/g, '');
        console.log("CEP digitado:", cep);
        
        if (cep.length !== 8) {
            console.log("CEP incompleto");
            return;
        }

        // Mostra loading enquanto busca
        cepInput.disabled = true;
        cepInput.style.backgroundColor = '#f5f5f5';

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
                console.log("Resposta da API:", data);
                
                if (data.erro) {
                    alert('CEP não encontrado. Por favor, verifique o CEP digitado.');
                } else {
                    preencherEndereco(data);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                alert('Erro ao buscar CEP. Tente novamente mais tarde.');
            })
            .finally(() => {
                cepInput.disabled = false;
                cepInput.style.backgroundColor = '';
            });
    }

    function preencherEndereco(data) {
        const enderecoInput = document.getElementById('endereco');
        if (!enderecoInput) {
            console.error("Campo de endereço não encontrado!");
            return;
        }

        const endereco = [
            data.logradouro || '',
            data.bairro || '',
            data.localidade || '',
            data.uf || ''
        ].filter(Boolean).join(', ');

        console.log("Endereço preenchido:", endereco);
        enderecoInput.value = endereco;
    }

    // Validação de senha
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmar_senha');

    if (senhaInput && confirmarSenhaInput) {
        confirmarSenhaInput.addEventListener('input', validarSenha);
    }

    function validarSenha() {
        if (senhaInput.value !== confirmarSenhaInput.value) {
            confirmarSenhaInput.setCustomValidity("As senhas não coincidem!");
        } else {
            confirmarSenhaInput.setCustomValidity("");
        }
    }
});