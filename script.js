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
        regrasSecretas: Array.from(document.querySelectorAll('input[data-regra^="secreto"]'))
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
        // Verificar se a palavra sozinha é maior que maxWidth
        if (ctx.measureText(palavra).width > maxWidth) {
            // Palavra muito longa - adicionar linha atual se houver
            if (linhaAtual) {
                linhas.push(linhaAtual);
                linhaAtual = '';
            }
            // Quebrar a palavra em caracteres
            let palavraQuebrada = '';
            for (const char of palavra) {
                const teste = palavraQuebrada + char;
                if (ctx.measureText(teste).width > maxWidth && palavraQuebrada) {
                    linhas.push(palavraQuebrada);
                    palavraQuebrada = char;
                } else {
                    palavraQuebrada = teste;
                }
            }
            if (palavraQuebrada) {
                linhaAtual = palavraQuebrada;
            }
            continue;
        }
        
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
    const scale = 2.5;
    const width = 1400;
    const padding = 50;
    const contentWidth = width - (padding * 2);
    
    // Criar canvas temporário para calcular alturas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = '15px Segoe UI, sans-serif';
    
    // Coletar regras marcadas
    const regrasBasicoMarcadas = dados.regrasBasico || [];
    const regrasSaHMarcadas = dados.regrasSaH || [];
    const regrasSecretasMarcadas = dados.regrasSecretas || [];
    const regrasCasaMarcadas = dados.regrasCasa || [];
    
    // Combinar todas as regras em um único array
    const todasRegras = [];
    if (regrasBasicoMarcadas.length > 0) {
        todasRegras.push({ titulo: 'LIVRO BÁSICO', regras: regrasBasicoMarcadas, isSecreto: false });
    }
    if (regrasSaHMarcadas.length > 0) {
        todasRegras.push({ titulo: 'SOBREVIVENDO AO HORROR', regras: regrasSaHMarcadas, isSecreto: false });
    }
    if (regrasSecretasMarcadas.length > 0) {
        todasRegras.push({ titulo: 'ARQUIVOS SECRETOS', regras: regrasSecretasMarcadas, isSecreto: true });
    }
    if (regrasCasaMarcadas.length > 0) {
        todasRegras.push({ titulo: 'REGRAS DA CASA', regras: regrasCasaMarcadas, isSecreto: false, isCasa: true });
    }
    
    // Calcular altura do bloco de Mestre/Jogadores (lateral)
    const alturaInfoBox = 70 + (dados.jogadores.length + 1) * 38 + 30;
    const infoBoxWidth = 280; // Largura menor para lateral
    
    // Calcular altura das seções de regras
    const calcularAlturaRegra = (secao) => {
        if (secao.isCasa) {
            let altura = 70;
            for (const regra of secao.regras) {
                const linhas = quebrarTextoMultilinha(tempCtx, regra, (contentWidth - infoBoxWidth - 60) - 60);
                altura += linhas.length * 24 + 20;
            }
            return altura;
        }
        return 70 + secao.regras.length * 32 + 25;
    };
    
    const alturasRegras = todasRegras.map(calcularAlturaRegra);
    
    // Determinar número de colunas para regras baseado na quantidade e altura
    const espacoRegras = contentWidth - infoBoxWidth - 30;
    let numColunasRegras = 1;
    let larguraColRegra = espacoRegras;
    
    // Se houver muitas regras ou altura muito grande, dividir em colunas
    const alturaTotal = alturasRegras.reduce((a, b) => a + b + 20, 0);
    if (todasRegras.length >= 3 || alturaTotal > 800) {
        // Tentar 2 colunas
        if (espacoRegras >= 600) {
            numColunasRegras = 2;
            larguraColRegra = (espacoRegras - 30) / 2;
        }
    }
    if (todasRegras.length >= 5 && espacoRegras >= 900) {
        // Tentar 3 colunas se houver muitas regras
        numColunasRegras = 3;
        larguraColRegra = (espacoRegras - 60) / 3;
    }
    
    // Recalcular alturas das regras com nova largura
    const calcularAlturaRegraComLargura = (secao, largura) => {
        if (secao.isCasa) {
            let altura = 70;
            for (const regra of secao.regras) {
                const linhas = quebrarTextoMultilinha(tempCtx, regra, largura - 60);
                altura += linhas.length * 24 + 20;
            }
            return altura;
        }
        return 70 + secao.regras.length * 32 + 25;
    };
    
    const alturasRegrasAjustadas = todasRegras.map(s => calcularAlturaRegraComLargura(s, larguraColRegra));
    
    // Distribuir regras entre colunas de forma balanceada
    const colunasRegras = Array.from({ length: numColunasRegras }, () => []);
    const alturasColunasRegras = Array(numColunasRegras).fill(0);
    
    for (let i = 0; i < todasRegras.length; i++) {
        // Encontrar coluna com menor altura
        const menorIdx = alturasColunasRegras.indexOf(Math.min(...alturasColunasRegras));
        colunasRegras[menorIdx].push({ secao: todasRegras[i], altura: alturasRegrasAjustadas[i] });
        alturasColunasRegras[menorIdx] += alturasRegrasAjustadas[i] + 20;
    }
    
    const alturaMaximaRegras = Math.max(...alturasColunasRegras) - 20;
    
    // Calcular sinopse (2 colunas) - CORRIGIDO para calcular largura correta
    const espacoEntreColunas = 40; // Espaço entre as colunas
    const sinopseColWidth = (contentWidth - espacoEntreColunas) / 2;
    const sinopseTextoWidth = sinopseColWidth - 50; // Largura útil para o texto (com margens)
    
    // Quebrar texto considerando a largura de UMA coluna, não a largura total
    const todasLinhasSinopse = quebrarTextoMultilinha(tempCtx, dados.sinopse || '', sinopseTextoWidth);
    
    // Dividir as linhas em duas colunas
    const metade = Math.ceil(todasLinhasSinopse.length / 2);
    const sinopseCol1 = todasLinhasSinopse.slice(0, metade);
    const sinopseCol2 = todasLinhasSinopse.slice(metade);
    
    // Calcular altura baseada na coluna mais alta
    const alturaSinopse = Math.max(sinopseCol1.length, sinopseCol2.length) * 24 + 100;
    
    // Calcular altura total
    const headerHeight = 90; // Título externo
    const blocoPrincipalHeight = Math.max(alturaMaximaRegras, alturaInfoBox) + 50;
    const totalHeight = headerHeight + 30 + blocoPrincipalHeight + 30 + alturaSinopse + padding;
    
    // Criar canvas final
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = totalHeight * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    
    // Fundo
    ctx.fillStyle = '#f5f5f0';
    ctx.fillRect(0, 0, width, totalHeight);
    
    // Padrão de textura
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    for (let i = 0; i < totalHeight; i += 4) {
        ctx.fillRect(0, i, width, 2);
    }
    
    let y = padding;
    
    // ===== TÍTULO - NOME DA SÉRIE (Fora do bloco) =====
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 42px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dados.nomeSerie || 'FICHA DE SÉRIE', width / 2, y + 35);
    
    // Linhas decorativas
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padding, y + 50);
    ctx.lineTo(width - padding, y + 50);
    ctx.stroke();
    
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, y + 55);
    ctx.lineTo(width - padding, y + 55);
    ctx.stroke();
    
    y += 100;
    ctx.textAlign = 'left';
    
    // ===== BLOCO PRINCIPAL - Layout com mestre/jogadores na lateral esquerda =====
    const blocoY = y;
    
    // Dimensões do layout
    const infoBoxX = padding; // Lateral esquerda
    const regrasX = infoBoxX + infoBoxWidth + 30; // Regras à direita
    const regrasWidth = contentWidth - infoBoxWidth - 30;
    
    // Função para desenhar seção de regras
    function desenharSecaoRegras(secao, x, yPos, largura) {
        const altura = calcularAlturaRegra(secao);
        
        // Determinar estilo baseado no tipo de seção
        let corFundo, corBorda, corLinha, larguraBorda, usarPontilhado;
        
        if (secao.isSecreto) {
            // Arquivos Secretos - vermelho pontilhado
            corFundo = 'rgba(139, 0, 0, 0.08)';
            corBorda = '#8b0000';
            corLinha = '#8b0000';
            larguraBorda = 3;
            usarPontilhado = true;
        } else if (secao.titulo === 'SOBREVIVENDO AO HORROR') {
            // Sobrevivendo ao Horror - azul pontilhado
            corFundo = 'rgba(30, 60, 120, 0.08)';
            corBorda = '#1e3c78';
            corLinha = '#1e3c78';
            larguraBorda = 3;
            usarPontilhado = true;
        } else {
            // Livro Básico - estilo padrão
            corFundo = 'rgba(255, 255, 255, 0.6)';
            corBorda = '#666';
            corLinha = '#8b0000';
            larguraBorda = 2;
            usarPontilhado = false;
        }
        
        // Fundo
        ctx.fillStyle = corFundo;
        ctx.fillRect(x, yPos, largura, altura);
        
        // Bordas
        ctx.strokeStyle = corBorda;
        ctx.lineWidth = larguraBorda;
        if (usarPontilhado) {
            ctx.setLineDash([5, 3]); // Padrão pontilhado mais sutil
        }
        ctx.strokeRect(x, yPos, largura, altura);
        ctx.setLineDash([]); // Resetar para linha sólida
        
        // Barra lateral colorida
        ctx.fillStyle = corLinha;
        ctx.fillRect(x, yPos, 5, altura);
        
        // Título
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 14px Segoe UI, sans-serif';
        ctx.fillText(secao.titulo, x + 20, yPos + 28);
        
        // Linha do título
        ctx.strokeStyle = corLinha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 20, yPos + 35);
        ctx.lineTo(x + largura - 20, yPos + 35);
        ctx.stroke();
        
        // Regras
        let regraY = yPos + 55;
        ctx.font = '14px Segoe UI, sans-serif';
        ctx.fillStyle = '#333';
        
        if (secao.isCasa) {
            for (const regra of secao.regras) {
                const linhas = quebrarTextoMultilinha(ctx, regra, largura - 60);
                const boxHeight = linhas.length * 24 + 15;
                
                ctx.fillStyle = 'white';
                ctx.fillRect(x + 15, regraY - 8, largura - 30, boxHeight);
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x + 15, regraY - 8, largura - 30, boxHeight);
                
                ctx.fillStyle = '#333';
                ctx.font = '14px Segoe UI, sans-serif';
                for (const linha of linhas) {
                    ctx.fillText(linha, x + 25, regraY + 12);
                    regraY += 24;
                }
                regraY += 20;
            }
        } else {
            for (const regra of secao.regras) {
                ctx.fillText('• ' + regra, x + 25, regraY);
                regraY += 28;
            }
        }
        
        return altura;
    }
    
    // Desenhar box lateral esquerdo - Mestre e Jogadores
    const infoBoxY = blocoY;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(infoBoxX, infoBoxY, infoBoxWidth, alturaInfoBox);
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 3;
    ctx.strokeRect(infoBoxX, infoBoxY, infoBoxWidth, alturaInfoBox);
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(infoBoxX, infoBoxY, 5, alturaInfoBox);
    
    // Título
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 14px Segoe UI, sans-serif';
    ctx.fillText('MESTRE & JOGADORES', infoBoxX + 20, infoBoxY + 28);
    
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(infoBoxX + 20, infoBoxY + 35);
    ctx.lineTo(infoBoxX + infoBoxWidth - 20, infoBoxY + 35);
    ctx.stroke();
    
    let infoY = infoBoxY + 55;
    
    // Mestre
    ctx.fillStyle = 'white';
    ctx.fillRect(infoBoxX + 15, infoY, infoBoxWidth - 30, 35);
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(infoBoxX + 15, infoY, infoBoxWidth - 30, 35);
    
    ctx.fillStyle = '#8b0000';
    ctx.font = 'bold 12px Segoe UI, sans-serif';
    ctx.fillText('MESTRE:', infoBoxX + 25, infoY + 23);
    
    ctx.fillStyle = '#333';
    ctx.font = '13px Segoe UI, sans-serif';
    const mestreWidth = ctx.measureText('MESTRE: ').width;
    const mestreNome = dados.mestre || '';
    const mestreMaxWidth = infoBoxWidth - 60;
    const mestreLinhas = quebrarTexto(ctx, mestreNome, mestreMaxWidth);
    if (mestreLinhas.length > 0) {
        ctx.fillText(mestreLinhas[0], infoBoxX + 25 + mestreWidth, infoY + 23);
    }
    
    infoY += 43;
    
    // Jogadores
    for (let i = 0; i < dados.jogadores.length; i++) {
        ctx.fillStyle = 'white';
        ctx.fillRect(infoBoxX + 15, infoY, infoBoxWidth - 30, 35);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(infoBoxX + 15, infoY, infoBoxWidth - 30, 35);
        
        ctx.fillStyle = '#666';
        ctx.font = 'bold 12px Segoe UI, sans-serif';
        ctx.fillText(`${i + 1}.`, infoBoxX + 25, infoY + 23);
        
        ctx.fillStyle = '#333';
        ctx.font = '13px Segoe UI, sans-serif';
        const jogadorNome = dados.jogadores[i];
        const jogadorMaxWidth = infoBoxWidth - 70;
        const jogadorLinhas = quebrarTexto(ctx, jogadorNome, jogadorMaxWidth);
        if (jogadorLinhas.length > 0) {
            ctx.fillText(jogadorLinhas[0], infoBoxX + 45, infoY + 23);
        }
        
        infoY += 38;
    }
    
    // Desenhar regras em múltiplas colunas à direita
    for (let col = 0; col < numColunasRegras; col++) {
        const colX = regrasX + col * (larguraColRegra + 30);
        let colY = blocoY;
        
        for (const item of colunasRegras[col]) {
            desenharSecaoRegras(item.secao, colX, colY, larguraColRegra);
            colY += item.altura + 20;
        }
    }
    
    y = blocoY + blocoPrincipalHeight + 30;
    
    // ===== SINOPSE - 2 COLUNAS =====
    if (dados.sinopse && dados.sinopse.trim()) {
        // Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(padding, y, contentWidth, alturaSinopse);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(padding, y, contentWidth, alturaSinopse);
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(padding, y, contentWidth, 5);
        
        // Título
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 16px Segoe UI, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SINOPSE', width / 2, y + 32);
        
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding + 50, y + 40);
        ctx.lineTo(width - padding - 50, y + 40);
        ctx.stroke();
        
        ctx.textAlign = 'left';
        
        // Coluna 1 - com largura correta
        ctx.fillStyle = '#333';
        ctx.font = '15px Segoe UI, sans-serif';
        let sinY1 = y + 60;
        for (const linha of sinopseCol1) {
            ctx.fillText(linha, padding + 25, sinY1);
            sinY1 += 24;
        }
        
        // Linha divisória vertical no centro
        const divX = width / 2;
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(divX, y + 50);
        ctx.lineTo(divX, y + alturaSinopse - 20);
        ctx.stroke();
        
        // Coluna 2 - com largura correta
        let sinY2 = y + 60;
        const col2X = divX + 20; // Margem após a linha divisória
        for (const linha of sinopseCol2) {
            ctx.fillText(linha, col2X, sinY2);
            sinY2 += 24;
        }
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
