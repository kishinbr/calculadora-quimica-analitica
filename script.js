// Função para converter números em notação científica formatada com sobrescritos
function formatNotacao(num) {
    if (num === 0 || isNaN(num)) return "0";
    let exp = Math.floor(Math.log10(Math.abs(num)));
    let mantissa = num / Math.pow(10, exp);

    // Mapeamento de caracteres para expoente sobrescrito
    const mapSup = {
        '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³',
        '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };

    let expStr = exp.toString().split('').map(c => mapSup[c] || c).join('');

    return `${mantissa.toFixed(3).replace('.', ',')} × 10${expStr}`;
}

// Função para formatar números com vírgula e casas decimais definidas
function formatNum(num, dec = 4) {
    if (isNaN(num)) return "0";
    return num.toFixed(dec).replace('.', ',');
}

// Função principal de cálculo
function calcular() {
    // 1. Leitura dos dados de entrada
    const amostra = document.getElementById('amostra').value || 'Água sanitária';
    
    // Como você removeu a entrada da massa do recipiente vazio,
    // consideramos 0 para calcular a massa da amostra a partir do total informado.
    const mRecipiente = 0; 
    const mRecipienteAmostra = parseFloat(document.getElementById('massaRecipienteAmostra').value) || 0;
    const vAmostra = parseFloat(document.getElementById('volumeAmostra').value) || 0;
    const cNa = parseFloat(document.getElementById('concentracaoNa').value) || 0;

    // Valores padrão mantidos para alíquota (10 mL) e balão (100 mL)
    const aliquota = 10;
    const vBalao = 100;

    const vEq1 = parseFloat(document.getElementById('equivalencia1').value) || 0;
    const vEq2 = parseFloat(document.getElementById('equivalencia2').value) || 0;
    const vEq3 = parseFloat(document.getElementById('equivalencia3').value) || 0;

    // 2. Preenchimento da seção "Dados Obtidos"
    document.getElementById('outAmostra').innerText = amostra;
    document.getElementById('outMassaRecipienteAmostra').innerText = formatNum(mRecipienteAmostra, 2);
    document.getElementById('outVolumeAmostra').innerText = formatNum(vAmostra, 1);

    // Atualiza os spans de Vequivalência em todas as ocorrências
    document.querySelectorAll('#outV1').forEach(el => el.innerText = formatNum(vEq1, 1));
    document.querySelectorAll('#outV2').forEach(el => el.innerText = formatNum(vEq2, 1));
    document.querySelectorAll('#outV3').forEach(el => el.innerText = formatNum(vEq3, 1));

    document.querySelectorAll('.outAliquota').forEach(el => el.innerText = formatNum(aliquota, 0));
    document.querySelectorAll('.outBalao').forEach(el => el.innerText = formatNum(vBalao, 0));

    // 3. Cálculo da Densidade
    const mAmostra = mRecipienteAmostra - mRecipiente;
    const densidade = vAmostra > 0 ? mAmostra / vAmostra : 0;

    document.getElementById('calcDensidade1').innerText = `d = ${formatNum(mAmostra, 2)} g / ${formatNum(vAmostra, 1)} mL`;
    document.getElementById('calcDensidade2').innerText = `d = ${formatNum(mAmostra, 2)} / ${formatNum(vAmostra, 1)}`;
    document.getElementById('outDensidade').innerText = `d = ${formatNum(densidade, 3)} g/mL`;

    // Função interna para os cálculos de cada determinação
    const calcularDet = (vEq, index) => {
        const vL = vEq / 1000;
        const nNa = cNa * vL;
        const nClAliquota = nNa / 2;
        const fatorBalao = vBalao / aliquota;
        const nClTotal = nClAliquota * fatorBalao;
        const mCl = nClTotal * 70.90;

        // Atualizando os textos das etapas de cálculo no HTML
        document.getElementById(`det${index}_n_formula`).innerText = `n${index} = ${formatNum(cNa, 3)} mol/L × ${vL.toFixed(4).replace('.', ',')} L`;
        document.getElementById(`det${index}_n_res`).innerText = `n${index} = ${formatNotacao(nNa)} mol`;

        document.getElementById(`det${index}_ncl_formula`).innerText = `nCl₂ = (${formatNotacao(nNa)}) / 2`;
        document.getElementById(`det${index}_ncl_res`).innerText = `nCl₂ = ${formatNotacao(nClAliquota)} mol`;

        document.getElementById(`det${index}_ncltot_formula`).innerText = `nCl₂ = ${formatNotacao(nClAliquota)} × (${formatNum(vBalao, 0)} / ${formatNum(aliquota, 0)})`;
        document.getElementById(`det${index}_ncltot_res`).innerText = `nCl₂ = ${formatNotacao(nClTotal)} mol`;

        document.getElementById(`det${index}_mcl_formula`).innerText = `MCl₂ = ${formatNotacao(nClTotal)} × 70,90`;
        document.getElementById(`det${index}_mcl_res`).innerText = `MCl₂ = ${formatNum(mCl, 5)} g`;

        return mCl;
    };

    // Executando para as 3 determinações
    const mCl1 = calcularDet(vEq1, 1);
    const mCl2 = calcularDet(vEq2, 2);
    const mCl3 = calcularDet(vEq3, 3);

    // 4. Média das Massas
    const mediaMassas = (mCl1 + mCl2 + mCl3) / 3;
    document.getElementById('calcMediaMassasFormula').innerText = `M = (${formatNum(mCl1, 5)} + ${formatNum(mCl2, 5)} + ${formatNum(mCl3, 5)}) / 3`;
    document.getElementById('calcMediaMassasRes').innerText = `M = ${formatNum(mediaMassas, 4)} g`;

    // 5. Porcentagem %(m/m)
    const mm1 = mAmostra > 0 ? (mCl1 / mAmostra) * 100 : 0;
    const mm2 = mAmostra > 0 ? (mCl2 / mAmostra) * 100 : 0;
    const mm3 = mAmostra > 0 ? (mCl3 / mAmostra) * 100 : 0;
    const mediaMM = (mm1 + mm2 + mm3) / 3;

    document.getElementById('mm1_formula').innerText = `%(m/m)₁ = (${formatNum(mCl1, 5)} / ${formatNum(mAmostra, 2)}) × 100`;
    document.getElementById('mm1_res').innerText = `%(m/m)₁ = ${formatNum(mm1, 3)}%`;

    document.getElementById('mm2_formula').innerText = `%(m/m)₂ = (${formatNum(mCl2, 5)} / ${formatNum(mAmostra, 2)}) × 100`;
    document.getElementById('mm2_res').innerText = `%(m/m)₂ = ${formatNum(mm2, 3)}%`;

    document.getElementById('mm3_formula').innerText = `%(m/m)₃ = (${formatNum(mCl3, 5)} / ${formatNum(mAmostra, 2)}) × 100`;
    document.getElementById('mm3_res').innerText = `%(m/m)₃ = ${formatNum(mm3, 3)}%`;

    document.getElementById('mm_med_formula').innerText = `%(m/m) = (${formatNum(mm1, 3)} + ${formatNum(mm2, 3)} + ${formatNum(mm3, 3)}) / 3`;
    document.getElementById('mm_med_res').innerText = `%(m/m) = ${formatNum(mediaMM, 2)}%`;

    // 6. Porcentagem %(m/V)
    const mv1 = vAmostra > 0 ? (mCl1 / vAmostra) * 100 : 0;
    const mv2 = vAmostra > 0 ? (mCl2 / vAmostra) * 100 : 0;
    const mv3 = vAmostra > 0 ? (mCl3 / vAmostra) * 100 : 0;
    const mediaMV = (mv1 + mv2 + mv3) / 3;

    document.getElementById('mv1_formula').innerText = `%(m/V)₁ = (${formatNum(mCl1, 5)} / ${formatNum(vAmostra, 1)}) × 100`;
    document.getElementById('mv1_res').innerText = `%(m/V)₁ = ${formatNum(mv1, 3)}%`;

    document.getElementById('mv2_formula').innerText = `%(m/V)₂ = (${formatNum(mCl2, 5)} / ${formatNum(vAmostra, 1)}) × 100`;
    document.getElementById('mv2_res').innerText = `%(m/V)₂ = ${formatNum(mv2, 3)}%`;

    document.getElementById('mv3_formula').innerText = `%(m/V)₃ = (${formatNum(mCl3, 5)} / ${formatNum(vAmostra, 1)}) × 100`;
    document.getElementById('mv3_res').innerText = `%(m/V)₃ = ${formatNum(mv3, 3)}%`;

    document.getElementById('mv_med_formula').innerText = `%(m/V) = (${formatNum(mv1, 3)} + ${formatNum(mv2, 3)} + ${formatNum(mv3, 3)}) / 3`;
    document.getElementById('mv_med_res').innerText = `%(m/V) = ${formatNum(mediaMV, 3)}%`;

    // 7. Resultados Finais
    document.getElementById('finalMediaMassas').innerText = `${formatNum(mediaMassas, 4)} g`;
    document.getElementById('finalMM').innerText = `${formatNum(mediaMM, 2)}%`;
    document.getElementById('finalMV').innerText = `${formatNum(mediaMV, 3)}%`;
}

// Função para limpar todas as entradas
function limpar() {
    document.getElementById('amostra').value = '';
    document.getElementById('massaRecipienteAmostra').value = '';
    document.getElementById('volumeAmostra').value = '';
    document.getElementById('concentracaoNa').value = '';
    document.getElementById('equivalencia1').value = '';
    document.getElementById('equivalencia2').value = '';
    document.getElementById('equivalencia3').value = '';
}