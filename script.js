// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarEstado();
    configurarAutoSave();
    configurarAutoResize();
});

// Configurar auto-resize para textareas
function configurarAutoResize() {
    const sinopse = document.getElementById('sinopse');
    if (sinopse) {
        autoResizeTextarea(sinopse);
        sinopse.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
    }
}

// Função para auto-resize de textarea
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Variável global para armazenar o blob da imagem
let imagemBlob = null;
let imagemNome = null;

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
    
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Digite a regra da casa...';
    textarea.rows = 1;
    textarea.addEventListener('input', function() {
        salvarEstado();
        autoResizeTextarea(this);
    });
    
    const btnRemover = document.createElement('button');
    btnRemover.className = 'btn-remover';
    btnRemover.textContent = 'Remover';
    btnRemover.onclick = function() {
        div.remove();
        salvarEstado();
    };
    
    div.appendChild(textarea);
    div.appendChild(btnRemover);
    lista.appendChild(div);
    
    // Auto-resize inicial
    autoResizeTextarea(textarea);
    textarea.focus();
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
        regrasCasa: Array.from(document.querySelectorAll('.regra-casa-item textarea')).map(textarea => textarea.value)
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
            
            const textarea = document.createElement('textarea');
            textarea.placeholder = 'Digite a regra da casa...';
            textarea.rows = 1;
            textarea.value = regra;
            textarea.addEventListener('input', function() {
                salvarEstado();
                autoResizeTextarea(this);
            });
            
            const btnRemover = document.createElement('button');
            btnRemover.className = 'btn-remover';
            btnRemover.textContent = 'Remover';
            btnRemover.onclick = function() {
                div.remove();
                salvarEstado();
            };
            
            div.appendChild(textarea);
            div.appendChild(btnRemover);
            listaRegrasCasa.appendChild(div);
            
            // Auto-resize após adicionar ao DOM
            setTimeout(() => autoResizeTextarea(textarea), 0);
        }
    });
    
    // Auto-resize da sinopse após carregar
    const sinopse = document.getElementById('sinopse');
    if (sinopse && sinopse.value) {
        setTimeout(() => autoResizeTextarea(sinopse), 0);
    }
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

// Exportar como PNG - Desenho programático no Canvas
function exportarPNG() {
    // Criar elemento de loading
    const loading = document.createElement('div');
    loading.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 20px 40px; border-radius: 10px; z-index: 10000; font-size: 18px; font-weight: bold;';
    loading.textContent = 'Gerando PNG...';
    document.body.appendChild(loading);
    
    // Coletar dados da ficha
    const dados = coletarDadosFicha();
    
    // Definir nome do arquivo
    const nomeSerie = dados.nomeSerie || 'FichaSerie';
    imagemNome = nomeSerie.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_' + Date.now() + '.png';
    
    // Criar canvas e desenhar
    setTimeout(() => {
        try {
            const canvas = desenharFichaCanvas(dados);
            
            // Converter para blob
            canvas.toBlob(function(blob) {
                imagemBlob = blob;
                
                // Criar URL da imagem
                const url = URL.createObjectURL(blob);
                
                // Mostrar no modal
                const imgElement = document.getElementById('imagem-exportada');
                imgElement.src = url;
                
                // Abrir modal
                document.getElementById('modal-imagem').style.display = 'block';
                
                // Remover loading
                document.body.removeChild(loading);
            });
        } catch (error) {
            console.error('Erro ao gerar PNG:', error);
            alert('Erro ao gerar a imagem. Por favor, tente novamente.');
            document.body.removeChild(loading);
        }
    }, 100);
}

// Coletar dados da ficha
function coletarDadosFicha() {
    return {
        nomeSerie: document.getElementById('nome-serie').value,
        mestre: document.getElementById('mestre').value,
        jogadores: Array.from(document.querySelectorAll('.jogador-item .jogador-input'))
            .map(input => input.value)
            .filter(v => v.trim() !== ''),
        sinopse: document.getElementById('sinopse').value,
        regrasBasico: Array.from(document.querySelectorAll('input[data-regra^="basico"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.nextElementSibling.textContent),
        regrasSaH: Array.from(document.querySelectorAll('input[data-regra^="sah"]'))
            .filter(cb => cb.checked)
            .map(cb => cb.nextElementSibling.textContent),
        regrasCasa: Array.from(document.querySelectorAll('.regra-casa-item textarea'))
            .map(textarea => textarea.value)
            .filter(v => v.trim() !== '')
    };
}

// Função auxiliar para quebrar texto em linhas
function quebrarTexto(ctx, texto, maxWidth) {
    const palavras = texto.split(' ');
    const linhas = [];
    let linhaAtual = '';
    
    for (const palavra of palavras) {
        const testeLinhaAtual = linhaAtual + (linhaAtual ? ' ' : '') + palavra;
        const metrics = ctx.measureText(testeLinhaAtual);
        
        if (metrics.width > maxWidth && linhaAtual) {
            linhas.push(linhaAtual);
            linhaAtual = palavra;
        } else {
            linhaAtual = testeLinhaAtual;
        }
    }
    
    if (linhaAtual) {
        linhas.push(linhaAtual);
    }
    
    return linhas;
}

// Função para quebrar texto com múltiplas linhas (preserva quebras de linha)
function quebrarTextoMultilinha(ctx, texto, maxWidth) {
    const paragrafos = texto.split('\n');
    const todasLinhas = [];
    
    for (const paragrafo of paragrafos) {
        if (paragrafo.trim() === '') {
            todasLinhas.push('');
        } else {
            const linhas = quebrarTexto(ctx, paragrafo, maxWidth);
            todasLinhas.push(...linhas);
        }
    }
    
    return todasLinhas;
}

// Desenhar ficha no canvas
function desenharFichaCanvas(dados) {
    const scale = 2; // Alta resolução
    const width = 1200;
    const padding = 40;
    const contentWidth = width - (padding * 2);
    const columnWidth = (contentWidth - 30) / 2;
    
    // Criar canvas temporário para calcular altura
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = '14px Segoe UI, sans-serif';
    
    // Calcular altura necessária para sinopse
    const sinopseLinhas = quebrarTextoMultilinha(tempCtx, dados.sinopse || '', contentWidth - 24);
    const sinopseHeight = Math.max(100, sinopseLinhas.length * 22 + 40);
    
    // Regras do Livro Básico (coluna esquerda)
    const regrasBasicoTexto = [
        'Personagens de NEX 0% (OPRPG, p. 171)',
        'Personagens de Idade Variada (OPRPG, p. 172)',
        'Contagem de Munição (OPRPG, p. 174)',
        'Lesões (OPRPG, p. 174)',
        'Inspiração Resoluta (OPRPG, p. 174)',
        'Loucura Não Letal (OPRPG, p. 175)'
    ];
    
    // Regras SaH (coluna direita)
    const regrasSaHTexto = [
        'NEX & Experiência (SaH, p. 98)',
        'Jogando sem Sanidade (SaH, p. 104)',
        'Ferimentos Debilitantes (SaH, p. 105)',
        'Jogando sem Mapa (SaH, p. 106)',
        'Evolução por Patentes (SaH, p. 108)',
        'Os Limites da Compreensão Humana (SaH, p. 113)',
        'Conjuração Complexa (SaH, p. 114)',
        'Conjurando Rituais Desconhecidos (SaH, p. 117)',
        'Combate Narrativo (SaH, p. 119)'
    ];
    
    // Calcular alturas das colunas de regras
    const alturaRegrasBasico = 60 + regrasBasicoTexto.length * 28 + 20;
    const alturaRegrasSaH = 60 + regrasSaHTexto.length * 28 + 20;
    const alturaColunasRegras = Math.max(alturaRegrasBasico, alturaRegrasSaH);
    
    // Calcular altura das regras da casa (largura total)
    let regrasCasaHeight = 60;
    tempCtx.font = '14px Segoe UI, sans-serif';
    for (const regra of dados.regrasCasa) {
        const linhas = quebrarTextoMultilinha(tempCtx, regra, contentWidth - 60);
        regrasCasaHeight += linhas.length * 20 + 15;
    }
    regrasCasaHeight = Math.max(100, regrasCasaHeight);
    
    // Altura total
    const jogadoresRows = Math.ceil(dados.jogadores.length / 2);
    const headerHeight = 100;
    const basicInfoHeight = 80 + 80 + (jogadoresRows * 50 + 40) + sinopseHeight + 60;
    const totalHeight = headerHeight + basicInfoHeight + alturaColunasRegras + 20 + regrasCasaHeight + padding;
    
    // Criar canvas final
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = totalHeight * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    
    // Fundo
    ctx.fillStyle = '#f5f5f0';
    ctx.fillRect(0, 0, width, totalHeight);
    
    // Padrão de textura sutil
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    for (let i = 0; i < totalHeight; i += 4) {
        ctx.fillRect(0, i, width, 2);
    }
    
    let y = 0;
    
    // Header
    const headerGrad = ctx.createLinearGradient(0, 0, width, headerHeight);
    headerGrad.addColorStop(0, '#1a1a1a');
    headerGrad.addColorStop(1, '#2c2c2c');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, width, headerHeight - 5);
    
    // Linha vermelha do header
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(0, headerHeight - 5, width, 5);
    
    // Título
    ctx.fillStyle = '#f5f5f0';
    ctx.font = 'bold 36px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FICHA DE SÉRIE', width / 2, 60);
    
    y = headerHeight + padding;
    ctx.textAlign = 'left';
    
    // Função auxiliar para desenhar campo
    function desenharCampo(label, valor, x, yPos, largura) {
        ctx.fillStyle = '#2c2c2c';
        ctx.font = 'bold 14px Segoe UI, sans-serif';
        ctx.fillText(label.toUpperCase(), x, yPos);
        
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, yPos + 5);
        ctx.lineTo(x + largura, yPos + 5);
        ctx.stroke();
        
        // Caixa do valor
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.fillRect(x, yPos + 12, largura, 40);
        ctx.strokeRect(x, yPos + 12, largura, 40);
        
        ctx.fillStyle = '#333';
        ctx.font = '14px Segoe UI, sans-serif';
        ctx.fillText(valor || '', x + 12, yPos + 38);
        
        return yPos + 70;
    }
    
    // Nome da Série
    y = desenharCampo('Nome da Série', dados.nomeSerie, padding, y, contentWidth);
    
    // Mestre
    y = desenharCampo('Mestre', dados.mestre, padding, y, contentWidth);
    
    // Jogadores
    ctx.fillStyle = '#2c2c2c';
    ctx.font = 'bold 14px Segoe UI, sans-serif';
    ctx.fillText('JOGADORES', padding, y);
    
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, y + 5);
    ctx.lineTo(padding + contentWidth, y + 5);
    ctx.stroke();
    
    y += 15;
    
    const jogadorWidth = (contentWidth - 10) / 2;
    for (let i = 0; i < dados.jogadores.length; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const jx = padding + col * (jogadorWidth + 10);
        const jy = y + row * 50;
        
        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.fillRect(jx, jy, jogadorWidth, 40);
        ctx.strokeRect(jx, jy, jogadorWidth, 40);
        
        ctx.fillStyle = '#333';
        ctx.font = '14px Segoe UI, sans-serif';
        ctx.fillText(dados.jogadores[i], jx + 12, jy + 26);
    }
    
    y += jogadoresRows * 50 + 20;
    
    // Sinopse
    ctx.fillStyle = '#2c2c2c';
    ctx.font = 'bold 14px Segoe UI, sans-serif';
    ctx.fillText('SINOPSE', padding, y);
    
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, y + 5);
    ctx.lineTo(padding + contentWidth, y + 5);
    ctx.stroke();
    
    y += 15;
    
    // Caixa da sinopse
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.fillRect(padding, y, contentWidth, sinopseHeight - 30);
    ctx.strokeRect(padding, y, contentWidth, sinopseHeight - 30);
    
    // Texto da sinopse
    ctx.fillStyle = '#333';
    ctx.font = '14px Segoe UI, sans-serif';
    let sinopseY = y + 22;
    for (const linha of sinopseLinhas) {
        ctx.fillText(linha, padding + 12, sinopseY);
        sinopseY += 22;
    }
    
    y += sinopseHeight;
    
    // COLUNAS
    const colY = y;
    const colEsqX = padding;
    const colDirX = padding + columnWidth + 30;
    
    // Função para desenhar seção de regras
    function desenharSecaoRegras(titulo, regras, regrasAtivas, x, yPos, largura, isCheckbox = true) {
        // Fundo da seção
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        const alturaSecao = 50 + regras.length * 28 + 20;
        ctx.fillRect(x, yPos, largura, alturaSecao);
        
        // Bordas
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, yPos, largura, alturaSecao);
        
        // Borda esquerda vermelha
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(x, yPos, 5, alturaSecao);
        
        // Título
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 14px Segoe UI, sans-serif';
        ctx.fillText(titulo, x + 20, yPos + 28);
        
        // Linha do título
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 20, yPos + 35);
        ctx.lineTo(x + largura - 20, yPos + 35);
        ctx.stroke();
        
        // Regras
        let regraY = yPos + 58;
        ctx.font = '13px Segoe UI, sans-serif';
        
        for (const regra of regras) {
            if (isCheckbox) {
                // Checkbox
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 20, regraY - 12, 16, 16);
                
                // Verificar se está ativo
                const ativo = regrasAtivas.some(r => r.includes(regra.split(' (')[0]) || regra.includes(r.split(' (')[0]));
                if (ativo) {
                    ctx.fillStyle = '#8b0000';
                    ctx.fillRect(x + 23, regraY - 9, 10, 10);
                }
                
                ctx.fillStyle = '#333';
                ctx.fillText(regra, x + 45, regraY);
            } else {
                ctx.fillStyle = '#333';
                ctx.fillText('• ' + regra, x + 25, regraY);
            }
            regraY += 28;
        }
        
        return yPos + alturaSecao + 20;
    }
    
    // Coluna Esquerda - Regras do Livro Básico
    let colEsqY = colY;
    colEsqY = desenharSecaoRegras('REGRAS OPCIONAIS DO LIVRO BÁSICO', regrasBasicoTexto, dados.regrasBasico, colEsqX, colEsqY, columnWidth);
    
    // Coluna Direita - Regras de Sobrevivendo ao Horror
    let colDirY = colY;
    colDirY = desenharSecaoRegras('REGRAS OPCIONAIS DE SOBREVIVENDO AO HORROR', regrasSaHTexto, dados.regrasSaH, colDirX, colDirY, columnWidth);
    
    // Regras da Casa - Abaixo das duas colunas, ocupando largura total
    const regrasCasaY = Math.max(colEsqY, colDirY);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(padding, regrasCasaY, contentWidth, regrasCasaHeight);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, regrasCasaY, contentWidth, regrasCasaHeight);
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(padding, regrasCasaY, 5, regrasCasaHeight);
    
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 14px Segoe UI, sans-serif';
    ctx.fillText('REGRAS DA CASA', padding + 20, regrasCasaY + 28);
    
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padding + 20, regrasCasaY + 35);
    ctx.lineTo(padding + contentWidth - 20, regrasCasaY + 35);
    ctx.stroke();
    
    let casaY = regrasCasaY + 55;
    ctx.font = '13px Segoe UI, sans-serif';
    ctx.fillStyle = '#333';
    
    for (const regra of dados.regrasCasa) {
        const linhas = quebrarTextoMultilinha(ctx, regra, contentWidth - 60);
        
        // Caixa da regra
        const boxHeight = linhas.length * 20 + 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(padding + 15, casaY - 5, contentWidth - 30, boxHeight);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.strokeRect(padding + 15, casaY - 5, contentWidth - 30, boxHeight);
        
        ctx.fillStyle = '#333';
        for (const linha of linhas) {
            ctx.fillText(linha, padding + 25, casaY + 12);
            casaY += 20;
        }
        casaY += 10;
    }
    
    return canvas;
}

// Baixar imagem
function baixarImagem() {
    if (imagemBlob && imagemNome) {
        const url = URL.createObjectURL(imagemBlob);
        const link = document.createElement('a');
        link.download = imagemNome;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Fechar modal de imagem
function fecharModalImagem() {
    const modal = document.getElementById('modal-imagem');
    modal.style.display = 'none';
    
    // Limpar a imagem
    const imgElement = document.getElementById('imagem-exportada');
    if (imgElement.src) {
        URL.revokeObjectURL(imgElement.src);
        imgElement.src = '';
    }
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
    const modalSobre = document.getElementById('modal-sobre');
    const modalImagem = document.getElementById('modal-imagem');
    
    if (event.target === modalSobre) {
        modalSobre.style.display = 'none';
    }
    
    if (event.target === modalImagem) {
        fecharModalImagem();
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
    
    // ESC para fechar modais
    if (e.key === 'Escape') {
        fecharSobre();
        fecharModalImagem();
    }
});
