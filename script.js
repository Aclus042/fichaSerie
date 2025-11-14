// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarEstado();
    configurarAutoSave();
});

// Adicionar jogador
function adicionarJogador() {
    const listaJogadores = document.getElementById('lista-jogadores');
    const div = document.createElement('div');
    div.className = 'jogador-item';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'jogador-input';
    input.placeholder = `Nome do jogador ${listaJogadores.children.length + 1}`;
    input.addEventListener('input', salvarEstado);
    
    const btnRemover = document.createElement('button');
    btnRemover.className = 'btn-remover-jogador';
    btnRemover.textContent = '×';
    btnRemover.onclick = function() {
        removerJogador(btnRemover);
    };
    
    div.appendChild(input);
    div.appendChild(btnRemover);
    listaJogadores.appendChild(div);
    salvarEstado();
}

// Remover jogador
function removerJogador(botao) {
    const listaJogadores = document.getElementById('lista-jogadores');
    if (listaJogadores.children.length > 1) {
        botao.parentElement.remove();
        salvarEstado();
    } else {
        alert('Deve haver pelo menos um jogador na lista.');
    }
}

// Adicionar regra da casa
function adicionarRegraCasa() {
    const lista = document.getElementById('regras-casa-lista');
    const div = document.createElement('div');
    div.className = 'regra-casa-item';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Digite a regra da casa...';
    input.addEventListener('input', salvarEstado);
    
    const btnRemover = document.createElement('button');
    btnRemover.className = 'btn-remover';
    btnRemover.textContent = 'Remover';
    btnRemover.onclick = function() {
        div.remove();
        salvarEstado();
    };
    
    div.appendChild(input);
    div.appendChild(btnRemover);
    lista.appendChild(div);
    salvarEstado();
}

// Salvar estado no localStorage
function salvarEstado() {
    const estado = {
        nomeSerie: document.getElementById('nome-serie').value,
        mestre: document.getElementById('mestre').value,
        jogadores: Array.from(document.querySelectorAll('.jogador-item .jogador-input')).map(input => input.value),
        sinopse: document.getElementById('sinopse').value,
        checkboxes: Array.from(document.querySelectorAll('input[type="checkbox"]')).map(cb => ({
            regra: cb.getAttribute('data-regra'),
            checked: cb.checked
        })),
        regrasCasa: Array.from(document.querySelectorAll('.regra-casa-item input')).map(input => input.value)
    };
    
    localStorage.setItem('fichaSerieEstado', JSON.stringify(estado));
}

// Carregar estado do localStorage
function carregarEstado() {
    const estadoSalvo = localStorage.getItem('fichaSerieEstado');
    if (!estadoSalvo) return;
    
    const estado = JSON.parse(estadoSalvo);
    
    // Carregar campos básicos
    document.getElementById('nome-serie').value = estado.nomeSerie || '';
    document.getElementById('mestre').value = estado.mestre || '';
    document.getElementById('sinopse').value = estado.sinopse || '';
    
    // Carregar jogadores
    const listaJogadores = document.getElementById('lista-jogadores');
    listaJogadores.innerHTML = '';
    if (estado.jogadores.length > 0) {
        estado.jogadores.forEach((jogador, index) => {
            const div = document.createElement('div');
            div.className = 'jogador-item';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'jogador-input';
            input.placeholder = `Nome do jogador ${index + 1}`;
            input.value = jogador;
            input.addEventListener('input', salvarEstado);
            
            const btnRemover = document.createElement('button');
            btnRemover.className = 'btn-remover-jogador';
            btnRemover.textContent = '×';
            btnRemover.onclick = function() {
                removerJogador(btnRemover);
            };
            
            div.appendChild(input);
            div.appendChild(btnRemover);
            listaJogadores.appendChild(div);
        });
    }
    
    // Carregar checkboxes
    estado.checkboxes.forEach(item => {
        const checkbox = document.querySelector(`input[data-regra="${item.regra}"]`);
        if (checkbox) {
            checkbox.checked = item.checked;
        }
    });
    
    // Carregar regras da casa
    const listaRegrasCasa = document.getElementById('regras-casa-lista');
    listaRegrasCasa.innerHTML = '';
    estado.regrasCasa.forEach(regra => {
        if (regra.trim()) {
            const div = document.createElement('div');
            div.className = 'regra-casa-item';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Digite a regra da casa...';
            input.value = regra;
            input.addEventListener('input', salvarEstado);
            
            const btnRemover = document.createElement('button');
            btnRemover.className = 'btn-remover';
            btnRemover.textContent = 'Remover';
            btnRemover.onclick = function() {
                div.remove();
                salvarEstado();
            };
            
            div.appendChild(input);
            div.appendChild(btnRemover);
            listaRegrasCasa.appendChild(div);
        }
    });
}

// Configurar auto-save em todos os campos
function configurarAutoSave() {
    // Campos de texto
    document.getElementById('nome-serie').addEventListener('input', salvarEstado);
    document.getElementById('mestre').addEventListener('input', salvarEstado);
    document.getElementById('sinopse').addEventListener('input', salvarEstado);
    
    // Jogadores
    document.getElementById('lista-jogadores').addEventListener('input', salvarEstado);
    
    // Checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', salvarEstado);
    });
}

// Nova ficha (limpar tudo)
function novaFicha() {
    if (confirm('Tem certeza que deseja criar uma nova ficha? Todos os dados atuais serão perdidos.')) {
        localStorage.removeItem('fichaSerieEstado');
        location.reload();
    }
}

// Exportar como PNG
function exportarPNG() {
    const ficha = document.getElementById('ficha-container');
    const menuOriginal = document.querySelector('.top-menu');
    
    // Esconder menu temporariamente
    if (menuOriginal) {
        menuOriginal.style.display = 'none';
    }
    
    // Criar elemento de loading
    const loading = document.createElement('div');
    loading.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px 40px; border-radius: 10px; z-index: 10000; font-size: 18px; font-weight: bold;';
    loading.textContent = 'Gerando PNG...';
    document.body.appendChild(loading);
    
    // Configurações do html2canvas
    html2canvas(ficha, {
        scale: 2,
        backgroundColor: '#f5f5f0',
        logging: false,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        // Converter para blob e fazer download
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const nomeSerie = document.getElementById('nome-serie').value || 'FichaSerie';
            const nomeArquivo = nomeSerie.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.download = `${nomeArquivo}_${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            
            // Remover loading
            document.body.removeChild(loading);
            
            // Mostrar menu novamente
            if (menuOriginal) {
                menuOriginal.style.display = 'flex';
            }
        });
    }).catch(error => {
        console.error('Erro ao gerar PNG:', error);
        alert('Erro ao gerar a imagem. Por favor, tente novamente.');
        
        // Remover loading
        document.body.removeChild(loading);
        
        // Mostrar menu novamente
        if (menuOriginal) {
            menuOriginal.style.display = 'flex';
        }
    });
}

// Abrir modal sobre
function abrirSobre() {
    document.getElementById('modal-sobre').style.display = 'block';
}

// Fechar modal sobre
function fecharSobre() {
    document.getElementById('modal-sobre').style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('modal-sobre');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S para salvar (exportar PNG)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        exportarPNG();
    }
    
    // Ctrl/Cmd + N para nova ficha
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        novaFicha();
    }
    
    // ESC para fechar modal
    if (e.key === 'Escape') {
        fecharSobre();
    }
});
