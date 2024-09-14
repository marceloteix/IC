// Função para converter string "dd/mm/yyyy" para objeto Date
function converterParaData(dataStr) {
    // Verifica se a string está no formato "yyyy-mm-dd"
    if (dataStr.includes("-")) {
        return new Date(dataStr);  // Converte diretamente se estiver no formato ISO (yyyy-mm-dd)
    }

    // Caso contrário, assume que está no formato "dd/mm/yyyy"
    var partes = dataStr.split('/');
    var dia = parseInt(partes[0], 10);
    var mes = parseInt(partes[1], 10) - 1; // Subtrai 1 do mês
    var ano = parseInt(partes[2], 10);
    return new Date(ano, mes, dia);
}

// Função para verificar se a data atual é posterior à data de devolução
function verificarInadimplencia(dataEmprestimo) {
    var dataDevolucao = converterParaData(dataEmprestimo);
    var dataAtual = new Date();
    
    console.log("Data devolução:", dataDevolucao);
    console.log("Data atual:", dataAtual);
    
    return dataAtual > dataDevolucao;
}

// Função para renderizar itens emprestados
function renderizarItensEmprestados() {
    setTimeout(function() {
        var itensEmprestados = JSON.parse(localStorage.getItem('itensEmprestados')) || [];
        console.log("Itens emprestados:", itensEmprestados); // Verifica se está retornando os itens corretamente

        if (itensEmprestados.length > 0) {
            // Limpa a lista para garantir que não haja duplicação de itens
            $("#alugados-list").html('');

            $.each(itensEmprestados, function (index, item) {
                // Verifica se as propriedades dataInicio e dataFim existem
                if (!item.dataInicio || !item.dataFim) {
                    console.error(`Erro: O item no índice ${index} está faltando dataInicio ou dataFim.`);
                    return;
                }

                // Verifica inadimplência com base na data de fim
                var inadimplente = verificarInadimplencia(item.dataFim);
                console.log("Item:", item); // Verifica cada item sendo processado

                // Adiciona o HTML com as duas datas (início e fim)
                var itemDiv = `
                <li class="item-content">
                    <div class="item-media">
                        <img src="${item.imagem}" width="120">
                    </div>
                    <div class="item-inner">
                        <div class="item-title">${item.nome}</div>
                        <div class="item-subtitle">Emprestado por: ${item.nomeCompleto}</div>
                        <div class="item-text">De: ${item.dataInicio} Até: ${item.dataFim}</div>
                        ${inadimplente ? '<button class="inadimplente-btn">Inadimplência</button>' : ''}
                    </div>
                </li>`;

                $("#alugados-list").append(itemDiv);
            });

            // Adiciona um elemento de espaçamento no final da lista
            var spacerDiv = `<li class="item-content" style="height: 50px;"></li>`;
            $("#alugados-list").append(spacerDiv);
        } else {
            console.log("Nenhum item emprestado encontrado."); // Log quando não há itens
            $("#alugados-list").html('<li class="item-content"><div class="item-inner"><div class="item-title">Nenhum item emprestado.</div></div></li>');
        }
    }, 500);
}

$(document).ready(function() {
    renderizarItensEmprestados();
});

