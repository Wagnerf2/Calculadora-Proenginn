// Função para gerar a tabela de vazões e preencher automaticamente os valores de eficiência fornecidos
function gerarTabela() {
    const vazaoNominal = parseFloat(document.getElementById('vazaoNominal').value);
    const corpoTabela = document.getElementById('tabela-corpo');

    if (isNaN(vazaoNominal)) {
        alert("Por favor, insira um valor válido para a vazão nominal.");
        return;
    }

    const dados = [
        { porcentagem: 110, eficiencia: 90.37 },
        { porcentagem: 100, eficiencia: 92.7 },
        { porcentagem: 90, eficiencia: 92.3 },
        { porcentagem: 80, eficiencia: 90.2 },
        { porcentagem: 70, eficiencia: 87.33 },
        { porcentagem: 60, eficiencia: 84.8 },
        { porcentagem: 50, eficiencia: 90.45 },
        { porcentagem: 40, eficiencia: 71.88 },
        { porcentagem: 30, eficiencia: 57.67 },
        { porcentagem: 20, eficiencia: 18.92 }
    ];

    corpoTabela.innerHTML = ''; // Limpa a tabela

    dados.forEach((dado) => {
        const vazao = (vazaoNominal * dado.porcentagem) / 100;
        const novaLinha = `
            <tr>
                <td>${dado.porcentagem}%</td>
                <td>${vazao.toFixed(2)}</td>
                <td><input type="number" value="${dado.eficiencia}"></td>
            </tr>
        `;
        corpoTabela.innerHTML += novaLinha;
    });
}

// Função para obter a equação polinomial e exibir os gráficos
function obterFormula() {
    const corpoTabela = document.getElementById('tabela-corpo').getElementsByTagName('tr');
    const vazoes = [];
    const eficiencias = [];

    for (let i = 0; i < corpoTabela.length; i++) {
        const vazao = parseFloat(corpoTabela[i].cells[1].innerText);
        const eficiencia = parseFloat(corpoTabela[i].cells[2].querySelector('input').value);

        if (!isNaN(vazao) && !isNaN(eficiencia)) {
            vazoes.push(vazao);
            eficiencias.push(eficiencia);
        }
    }

    if (vazoes.length === 0 || eficiencias.length === 0) {
        alert("Por favor, preencha todos os valores de eficiência.");
        return;
    }

    gerarGraficos(vazoes, eficiencias);
    verificarFormulaMaisProxima(vazoes, eficiencias);
}

// Função para gerar gráficos de ajustes polinomiais
function gerarGraficos(vazoes, eficiencias) {
    const ctxPolinomio = document.getElementById('graficoPolinomio').getContext('2d');
    const graus = [2, 3, 4, 5, 6]; 
    const datasetsPolinomio = [];
    let resultado = '';

    // Para cada grau, calcular o polinômio e exibir os gráficos
    graus.forEach(grau => {
        const coeffs = regressaoPolinomial(vazoes, eficiencias, grau);
        const r2 = calcularR2(vazoes, eficiencias, coeffs);
        const valoresAjustados = vazoes.map(v => calcularValorPolinomio(v, coeffs));

        // Formatar a equação com o valor de R² ao lado
        const equacaoFormatada = formatarEquacao(coeffs, r2);

        // Exibir a equação no gráfico polinomial
        datasetsPolinomio.push({
            label: `${grau} (R² = ${r2.toFixed(4)})`,
            data: valoresAjustados,
            borderColor: `rgba(${grau * 30}, ${200 - grau * 20}, ${150 + grau * 10}, 1)`,
            borderWidth: 2,
            fill: false,
            hidden: grau !== 4 // Mostra inicialmente apenas o polinômio grau 4
        });

        // Exibir a equação e o R² nos resultados
        resultado += `<p><strong>Grau ${grau}</strong>: ${equacaoFormatada}</p>`;
    });

    // Renderiza o gráfico polinomial com as legendas otimizadas
    new Chart(ctxPolinomio, {
        type: 'line',
        data: {
            labels: vazoes,
            datasets: datasetsPolinomio
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right', // Move a legenda para a direita
                    labels: {
                        boxWidth: 15, // Reduz o tamanho do ícone da legenda
                        padding: 10,  // Espaçamento interno da legenda
                        usePointStyle: true, // Usa círculos ao invés de quadrados nas legendas
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: { title: { display: true, text: 'Vazão (m³/s)' }},
                y: { title: { display: true, text: 'Eficiência (%)' }}
            }
        }
    });

    // Exibe as equações no div de resultados
    document.getElementById('resultado').innerHTML = resultado;
}

// Função para verificar e exibir a fórmula mais próxima no segundo gráfico
function verificarFormulaMaisProxima(vazoes, eficiencias) {
    const graus = [2, 3, 4, 5, 6]; 
    let melhorGrau = 2;
    let melhorR2 = -Infinity;
    let melhorCoeffs = [];

    // Encontrar o polinômio com o maior R²
    graus.forEach(grau => {
        const coeffs = regressaoPolinomial(vazoes, eficiencias, grau);
        const r2 = calcularR2(vazoes, eficiencias, coeffs);

        if (r2 > melhorR2) {
            melhorR2 = r2;
            melhorGrau = grau;
            melhorCoeffs = coeffs;
        }
    });

    // Calcular os valores ajustados pela melhor equação polinomial
    const valoresCalculados = vazoes.map(v => calcularValorPolinomio(v, melhorCoeffs));

    // Exibir o gráfico comparando os dados reais com os calculados
    exibirGraficoComparacao(vazoes, eficiencias, valoresCalculados, melhorGrau);
}

// Função para exibir o gráfico de comparação com a linha de referência e a equação mais próxima
function exibirGraficoComparacao(vazoes, valoresReais, valoresCalculados, melhorGrau) {
    const ctxComparacao = document.getElementById('graficoComparacao').getContext('2d');

    // Gráfico de comparação: Dados reais vs Dados calculados pela equação mais precisa
    new Chart(ctxComparacao, {
        type: 'line',
        data: {
            labels: vazoes,
            datasets: [
                {
                    label: 'Referência',
                    data: valoresReais,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)', // Cor da linha dos dados reais
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: `E.G. ${melhorGrau} (Calculada)`,
                    data: valoresCalculados,
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)', // Cor da linha da equação ajustada
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right', // Mover a legenda para a direita
                    labels: {
                        boxWidth: 15,  // Reduz o tamanho do ícone da legenda
                        padding: 10,   // Espaçamento interno da legenda
                        usePointStyle: true // Usa círculos ao invés de quadrados
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Vazão (m³/s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Eficiência (%)'
                    }
                }
            }
        }
    });
}

// Função para calcular a regressão polinomial
function regressaoPolinomial(x, y, grau) {
    const X = [];
    const Y = y.slice();

    for (let i = 0; i < x.length; i++) {
        const linha = [];
        for (let j = 0; j <= grau; j++) {
            linha.push(Math.pow(x[i], j));
        }
        X.push(linha);
    }

    const XT = math.transpose(X);
    const XTX = math.multiply(XT, X);
    const XTY = math.multiply(XT, Y);
    const coeffs = math.lusolve(XTX, XTY).flat();

    return coeffs;
}

// Função para calcular o valor ajustado de um polinômio
function calcularValorPolinomio(x, coeffs) {
    return coeffs.reduce((total, coeff, i) => total + coeff * Math.pow(x, i), 0);
}

// Função para calcular o R² (coeficiente de determinação)
function calcularR2(x, y, coeffs) {
    const yPred = x.map(v => calcularValorPolinomio(v, coeffs));
    const mediaY = y.reduce((total, valor) => total + valor, 0) / y.length;
    const ssTotal = y.reduce((total, valor) => total + Math.pow(valor - mediaY, 2), 0);
    const ssRes = y.reduce((total, valor, i) => total + Math.pow(valor - yPred[i], 2), 0);
    return 1 - (ssRes / ssTotal);
}

// Função para formatar as equações e exibir o R²
function formatarEquacao(coeffs, r2) {
    let equacao = 'y = ';
    coeffs.forEach((coeff, i) => {
        if (i === 0) {
            equacao += `${coeff.toFixed(4)}`;
        } else {
            equacao += ` + ${coeff.toFixed(4)}x^${i}`;
        }
    });
    // Adicionar o valor de R² ao lado da equação
    equacao += ` (R² = ${r2.toFixed(4)})`;
    return equacao;
}
