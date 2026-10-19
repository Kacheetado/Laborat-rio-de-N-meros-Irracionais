// 1. DICIONÁRIO DE INTEGRAIS PRÉ-CALCULADAS E CASOS ESPECIAIS
    const BANCO_INTEGRAIS = {
      // Composições Logarítmicas e Trigonométricas Solúveis
      "cos(log(x))": {
        suportada: true,
        tex: "\\frac{x}{2} \\left(\\cos(\\ln(x)) + \\sin(\\ln(x))\\right) + C",
        nota: "Integrada por partes"
      },
      "sin(log(x))": {
        suportada: true,
        tex: "\\frac{x}{2} \\left(\\sin(\\ln(x)) - \\cos(\\ln(x))\\right) + C",
        nota: "Integrada por partes"
      },

      // Logaritmos de Trigonométricas (Funções Especiais)
      "log(cos(x))": {
        suportada: false,
        tex: "-x \\ln(2) - \\frac{1}{2} \\text{Cl}_2(2x + \\pi) + C",
        nota: "Primitiva não-elementar (Função de Clausen)"
      },
      "log(sin(x))": {
        suportada: false,
        tex: "-x \\ln(2) - \\frac{1}{2} \\text{Cl}_2(2x) + C",
        nota: "Primitiva não-elementar (Função de Clausen)"
      },
      "log(tan(x))": {
        suportada: false,
        tex: "\\frac{i}{2} \\text{Li}_2(-e^{2ix}) - \\frac{i}{2} \\text{Li}_2(e^{2ix}) + C",
        nota: "Primitiva não-elementar (Dilogaritmo Li₂)"
      },

      // Trigonométricas Aninhadas (Séries de Bessel)
      "cos(cos(x))": {
        suportada: false,
        tex: "J_0(1) x + 2 \\sum_{k=1}^{\\infty} (-1)^k \\frac{J_{2k}(1)}{2k} \\sin(2kx) + C",
        nota: "Primitiva não-elementar (Série de Bessel)"
      },
      "sin(cos(x))": {
        suportada: false,
        tex: "2 \\sum_{k=0}^{\\infty} (-1)^k \\frac{J_{2k+1}(1)}{2k+1} \\sin((2k+1)x) + C",
        nota: "Primitiva não-elementar (Série de Bessel)"
      },
      "cos(sin(x))": {
        suportada: false,
        tex: "J_0(1) x + 2 \\sum_{k=1}^{\\infty} \\frac{J_{2k}(1)}{2k} \\sin(2kx) + C",
        nota: "Primitiva não-elementar (Série de Bessel)"
      },
      "sin(sin(x))": {
        suportada: false,
        tex: "2 \\sum_{k=0}^{\\infty} \\frac{J_{2k+1}(1)}{2k+1} \\sin((2k+1)x) + C",
        nota: "Primitiva não-elementar (Série de Bessel)"
      },
      "cot(sec(x))": {
        suportada: false,
        tex: "\\text{Sem forma fechada elementar}",
        nota: "Primitiva não-elementar"
      },

      // Logaritmos Aninhados
      "log(log(x))": {
        suportada: false,
        tex: "x \\ln(\\ln(x)) - \\text{li}(x) + C",
        nota: "Primitiva não-elementar (Integral Logarítmica li)"
      },
      "log(log(-x))": {
        suportada: false,
        tex: "x \\ln(\\ln(-x)) - \\text{li}(-x) + C",
        nota: "Primitiva não-elementar (Integral Logarítmica li)"
      },

      // Razões e Exponenciais Clássicas
      "sin(x)/x": {
        suportada: false,
        tex: "\\text{Si}(x) + C",
        nota: "Integral do Seno Si(x)"
      },
      "cos(x)/x": {
        suportada: false,
        tex: "\\text{Ci}(x) + C",
        nota: "Integral do Cosseno Ci(x)"
      },
      "exp(cos(x))": {
        suportada: false,
        tex: "I_0(1)x + 2 \\sum_{k=1}^{\\infty} \\frac{I_k(1)}{k} \\sin(kx) + C",
        nota: "Expressa por Funções Modificadas de Bessel"
      },
      // Função Erro (Clássica estatística)
      "exp(-x^2)": {
        suportada: false,
        tex: "\\frac{\\sqrt{\\pi}}{2} \\text{erf}(x) + C",
        nota: "Primitiva não-elementar (Função Erro Gaussiana)"
      },
      // Integral Exponencial
      "exp(x)/x": {
        suportada: false,
        tex: "\\text{Ei}(x) + C",
        nota: "Primitiva não-elementar (Integral Exponencial)"
      },
      // Arco Tangente
      "1/(1+x^2)": {
        suportada: true,
        tex: "\\arctan(x) + C",
        nota: "Integral imediata"
      },
      // Função de Fresnel
      "sin(x^2)": {
        suportada: false,
        tex: "\\sqrt{\\frac{\\pi}{2}} \\text{S}\\left(\\sqrt{\\frac{2}{\\pi}} x\\right) + C",
        nota: "Primitiva não-elementar (Integral de Fresnel S)"
      }
    };

    // 2. NORMALIZADOR DE SINTAXE (Garante match mesmo com 'sen', 'tg', 'ln' ou espaços)
    function normalizarExpressao(expr) {
      if (!expr || typeof expr !== 'string') return '';
      
      let s = expr.toLowerCase().replace(/\s+/g, '');
      
      s = s.replace(/sen/g, 'sin');
      s = s.replace(/tg/g, 'tan');
      s = s.replace(/ctg|cotg/g, 'cot');
      s = s.replace(/ln/g, 'log');
      s = s.replace(/e\^\((.*?)\)/g, 'exp($1)');
      s = s.replace(/e\^([a-z0-9]+)/g, 'exp($1)');
      
      return s;
    }

    // 3. CONSULTA AO BANCO (Padrão Cache-First) COM SUPORTE A QUALQUER VARIÁVEL
    function resolverIntegralComCache(exprBruta, mainVar = 'x') {
      // 1. Substitui a variável do utilizador por 'x' temporariamente para a busca
      let exprBusca = exprBruta;
      if (mainVar !== 'x') {
        const regexVar = new RegExp(`\\b${mainVar}\\b`, 'g');
        exprBusca = exprBusca.replace(regexVar, 'x');
      }
      
      const exprNorm = normalizarExpressao(exprBusca);
      
      if (BANCO_INTEGRAIS[exprNorm]) {
        const item = BANCO_INTEGRAIS[exprNorm];
        let texResultado = item.tex;
        
        // 2. Se a variável não for 'x', devolvemos a variável original ao LaTeX gerado
        if (mainVar !== 'x') {
          // Prevenção de colisão matemática: se o utilizador usar a variável 'k' ou 'i', 
          // mudamos o 'k' das séries de Bessel para 'm' para não misturar as letras!
          if (mainVar === 'k' || mainVar === 'i') {
            texResultado = texResultado.replace(/k=/g, 'm=').replace(/\{k\}/g, '{m}').replace(/_\{2k\}/g, '_{2m}').replace(/_\{2k\+1\}/g, '_{2m+1}').replace(/2k/g, '2m');
          }
          
          // Regex cirúrgica: substitui o 'x' matemático, mas ignora o 'x' da palavra \text{}
          texResultado = texResultado
            .replace(/\bx\b/g, mainVar)             // Ex: x/2 -> k/2
            .replace(/([0-9i])x\b/g, `$1${mainVar}`) // Ex: 2x -> 2k, 2ix -> 2ik
            .replace(/mx\b/g, `m${mainVar}`)         // Ex: 2mx -> 2mk (após mudar k para m)
            .replace(/kx\b/g, `k${mainVar}`);        // Ex: 2kx -> 2kk
        }
        
        return {
          sucesso: true,
          suportada: item.suportada,
          latex: texResultado,
          nota: item.nota,
          origem: 'dicionario'
        };
      }
      
      return { sucesso: false };
    }

    function switchTab(tabId) {
      const tabs = ['tfa', 'solver', 'trig', 'log', 'eisenstein', 'fraccont', 'tabela', 'historia'];
      tabs.forEach(t => {
        document.getElementById('pane-' + t).classList.add('hidden');
        document.getElementById('tab-' + t).classList.remove('active');
      });
      document.getElementById('pane-' + tabId).classList.remove('hidden');
      document.getElementById('tab-' + tabId).classList.add('active');

      if (window.renderMathInElement) {
        renderMathInElement(document.getElementById('pane-' + tabId));
      }
    }

    function gcd(a, b) {
      a = Math.round(Math.abs(a));
      b = Math.round(Math.abs(b));
      while (b) { let t = b; b = a % b; a = t; }
      return a;
    }

    function getDivisors(n) {
      n = Math.abs(n);
      if (n === 0) return [1];
      const divs = [];
      for (let i = 1; i * i <= n; i++) {
        if (n % i === 0) {
          divs.push(i);
          if (i * i !== n) divs.push(n / i);
        }
      }
      return divs.sort((a, b) => a - b);
    }

    function primeFactorization(n) {
      const factors = {};
      let d = 2;
      while (d * d <= n) {
        while (n % d === 0) {
          factors[d] = (factors[d] || 0) + 1;
          n = Math.floor(n / d);
        }
        d++;
      }
      if (n > 1) factors[n] = (factors[n] || 0) + 1;
      return factors;
    }

    // MOTOR 1: TFA
    function executarTFA() {
      const n = parseInt(document.getElementById('tfa-index').value);
      const k = parseInt(document.getElementById('tfa-input').value);
      const outDiv = document.getElementById('tfa-output');
      outDiv.classList.remove('hidden');

      if (isNaN(n) || n < 2 || isNaN(k) || k < 2) {
        outDiv.innerHTML = `<div class="text-red-600 font-medium text-sm">n &ge; 2, K &ge; 2.</div>`;
        return;
      }

      const factors = primeFactorization(k);
      let factorStrArray = [];
      let temExpoenteNaoMultiplo = false;
      let primoInvalido = null;
      let expInvalido = 0;

      for (const [p, exp] of Object.entries(factors)) {
        factorStrArray.push(`${p}^{${exp}}`);
        if (exp % n !== 0 && !temExpoenteNaoMultiplo) {
          temExpoenteNaoMultiplo = true;
          primoInvalido = p;
          expInvalido = exp;
        }
      }

      const fatoracaoFormatada = factorStrArray.join(' \\cdot ');
      let html = '';

      if (!temExpoenteNaoMultiplo) {
        const raizExata = Math.round(Math.pow(k, 1 / n));
        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('res_rational_int')}</h3>
            <span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold px-3 py-1 rounded text-xs">\\(\\sqrt[${n}]{${k}} = ${raizExata} \\in \\mathbb{Q}\\)</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p><strong>${t('tfa_step1')}</strong></p>
            <div class="math-step notranslate">\\(${k} = ${fatoracaoFormatada}\\)</div>
            <p>${t('tfa_perf_power', { n, k })}</p>
            <div class="math-step notranslate">\\(\\sqrt[${n}]{${k}} = ${raizExata}\\)</div>
          </div>
        `;
      } else {
        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('res_irrational_proven')}</h3>
            <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold px-3 py-1 rounded text-xs">\\(\\sqrt[${n}]{${k}} \\notin \\mathbb{Q}\\)</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p><strong>${t('tfa_step1')}</strong></p>
            <div class="math-step notranslate">\\(${k} = ${fatoracaoFormatada}\\)</div>
            <p>${t('tfa_odd_obs', { p: primoInvalido, exp: expInvalido, n })}</p>

            <p><strong>${t('tfa_step2')}</strong></p>
            <p>${t('tfa_suppose', { n, k })}</p>
            <div class="math-step notranslate">\\(\\left(\\frac{p}{q}\\right)^{${n}} = ${k} \\implies p^{${n}} = ${k} \\cdot q^{${n}} = (${fatoracaoFormatada}) \\cdot q^{${n}}\\)</div>

            <p><strong>${t('tfa_step3')}</strong></p>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li>${t('tfa_left_exp', { n })}</li>
              <li>${t('tfa_right_exp', { k, p: primoInvalido, n, exp: expInvalido })}</li>
            </ul>

            <div class="p-3 bg-red-50 border-l-4 border-red-500 dark:bg-red-900/20 dark:border-red-800 rounded text-red-900 dark:text-red-300 text-xs mt-3">
              <strong>${t('tfa_contradiction_title')}</strong> ${t('tfa_contradiction_desc', { n, k })}
            </div>
            <p class="font-semibold text-slate-900 dark:text-slate-100 pt-1">${t('tfa_conclusion', { n, k })}</p>
          </div>
        `;
      }

      outDiv.innerHTML = html;
      if (window.renderMathInElement) renderMathInElement(outDiv);
    }

    // MOTOR 2: RESOLVER POLINÔMIOS
    function carregarExemplo(polyStr) {
      document.getElementById('poly-input').value = polyStr;
      resolverPolinomio();
    }

    function parseExpression(str) {
      if (!str || str.trim() === '') return {};
      // Normaliza expoentes sobrescritos (x², x³, etc.)
      str = str.replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4').replace(/⁵/g, '^5')
               .replace(/⁶/g, '^6').replace(/⁷/g, '^7').replace(/⁸/g, '^8').replace(/⁹/g, '^9').replace(/⁰/g, '^0');
      
      str = str.replace(/\s+/g, '').replace(/-/g, '+-');
      const terms = str.split('+').filter(t => t.length > 0);
      const polyMap = {};
      
      for (let term of terms) {
        let coef = 1, deg = 0;
        if (term.includes('x')) {
          const parts = term.split('x');
          if (parts[0] === '' || parts[0] === '+') coef = 1;
          else if (parts[0] === '-') coef = -1;
          else coef = parseFloat(parts[0]);

          if (parts[1] && parts[1].startsWith('^')) deg = parseInt(parts[1].substring(1));
          else deg = 1;
        } else {
          coef = parseFloat(term);
          deg = 0;
        }
        if (!isNaN(coef) && !isNaN(deg)) {
          polyMap[deg] = (polyMap[deg] || 0) + coef;
        }
      }
      return polyMap;
    }

    function parsePolynomial(str) {
      try {
        let expr = str.toLowerCase();

        //Traduz a linguagem natural antes do interpretador se confundir com as variáveis
        expr = sanitizarSintaxeMatematica(expr);
        
        // normaliza expoentes sobrescritos
        expr = expr.replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4').replace(/⁵/g, '^5')
                   .replace(/⁶/g, '^6').replace(/⁷/g, '^7').replace(/⁸/g, '^8').replace(/⁹/g, '^9').replace(/⁰/g, '^0');

        // força a multiplicação explícita onde o usuário costuma omitir
        expr = expr.replace(/\)\(/g, ')*(');         
        expr = expr.replace(/(\d)([a-z\(])/g, '$1*$2'); 

        // transforma igualdade em subtração (tudo pruum lado só)
        if (expr.includes('=')) {
          const sides = expr.split('=');
          expr = `(${sides[0]}) - (${sides[1]})`;
        }

        let originalVar = 'x'; // salva a variável padrão
        try {
            let exprVars = nerdamer(expr).variables();
            if (exprVars.length > 0 && exprVars[0] !== 'x') {
                originalVar = exprVars[0]; // Guarda a letra original (ex: 'y')
                expr = nerdamer(expr).sub(originalVar, 'x').text(); // Ebgana o motor algébrico
            }
        } catch(e) {}

        // MMC de denominadores
        let simplificado = nerdamer(`simplify(${expr})`).text();

        // se o nerdamer devolver expoente negativo em vez de divisão converte de volta
        simplificado = simplificado.replace(/\*\s*\((.*?)\)\^\(-1\)/g, '/($1)');
        simplificado = simplificado.replace(/\*([a-z0-9]+)\^\(-1\)/g, '/$1');

        // Isola o numerador
        let numStr = simplificado;
        let depth = 0;
        let mainSlashIndex = -1;

        for (let i = 0; i < simplificado.length; i++) {
            if (simplificado[i] === '(') depth++;
            else if (simplificado[i] === ')') depth--;
            else if (simplificado[i] === '/' && depth === 0) {
                mainSlashIndex = i; // Achou a barra de divisão global (fora de qualquer parêntese)
                break;
            }
        }

        if (mainSlashIndex !== -1) {
            numStr = simplificado.substring(0, mainSlashIndex);
        }

        // expande apenas o polinômio do numerador resultante
        let expanded = nerdamer(`expand(${numStr})`).text();

        // novo filtro de segurança atualizado que permite parenteses
        if (expanded.match(/[^x0-9\+\-\*\^\s\.\(\)]/i)) {
          return null; 
        }

        // simpeza final para o extrator de coeficientes
        let cleanStr = expanded.replace(/\s+/g, '').replace(/\*/g, '');
        
        // remove os parênteses ao redor de números para o parseFloat não falhar
        cleanStr = cleanStr.replace(/\(([0-9\.\-]+)\)/g, '$1');
        
        // se ainda sobrar algum parêntese irresolvível, significa que não é um polinômio puro
        if (cleanStr.includes('(') || cleanStr.includes(')')) {
            return null;
        }

        const polyMap = parseExpression(cleanStr);
        
        const finalMap = {};
        let maxDeg = 0;

        for (let degStr in polyMap) {
          const deg = parseInt(degStr);
          const val = polyMap[degStr];
          if (Math.abs(val) > 1e-7) { 
            finalMap[deg] = val;
            if (deg > maxDeg) maxDeg = deg;
          }
        }

        if (Object.keys(finalMap).length === 0) return { coeffs: [0], degree: 0 };

        const coeffs = [];
        for (let i = maxDeg; i >= 0; i--) coeffs.push(finalMap[i] || 0);
        
        return { coeffs, degree: maxDeg, varName: originalVar };
      } catch (e) {
        return null; 
      }
    }

    function evalPoly(coeffs, x) {
      let res = 0;
      for (let c of coeffs) res = res * x + c;
      return res;
    }

    function ruffini(coeffs, r) {
      const result = [coeffs[0]];
      for (let i = 1; i < coeffs.length - 1; i++) {
        result.push(coeffs[i] + result[i - 1] * r);
      }
      return result;
    }

    // função global para alternar a exibição das linhas no gráfico SVG
    // função global para alternar a exibição das linhas no gráfico SVG
    window.toggleGraphLine = function(k) {
      const pathRe = document.getElementById(`graph-path-re-${k}`);
      const pathIm = document.getElementById(`graph-path-im-${k}`);
      const legend = document.getElementById(`graph-legend-${k}`);
      if (!legend) return;

      let isActive = pathRe && pathRe.getAttribute('data-active') === 'true';
      
      if (isActive) {
        if (pathRe) { pathRe.setAttribute('data-active', 'false'); pathRe.style.opacity = '0'; }
        if (pathIm) { pathIm.setAttribute('data-active', 'false'); pathIm.style.opacity = '0'; }
        legend.style.opacity = '0.4';
        
        document.querySelectorAll(`.graph-root-${k}`).forEach(el => el.style.opacity = '0');
        
        if (k === 0) {
            const fxCont = pathRe.closest('.relative').querySelector('.coord-fx-container');
            if (fxCont) fxCont.style.display = 'none';
        }
      } else {
        if (pathRe) { pathRe.setAttribute('data-active', 'true'); pathRe.style.opacity = '1'; }
        if (pathIm) { pathIm.setAttribute('data-active', 'true'); pathIm.style.opacity = '0.8'; } 
        legend.style.opacity = '1';
        
        document.querySelectorAll(`.graph-root-${k}`).forEach(el => el.style.opacity = '1');
        
        if (k === 0) {
            const fxCont = pathRe.closest('.relative').querySelector('.coord-fx-container');
            if (fxCont) fxCont.style.display = 'block';
        }
      }
    };

    window.focusGraphLine = function(k, container) {
      const rel = container.closest('.relative');
      const total = parseInt(rel.getAttribute('data-total-funcs') || 0);
      for(let i = 0; i < total; i++) {
        const pRe = rel.querySelector(`#graph-path-re-${i}`);
        const pIm = rel.querySelector(`#graph-path-im-${i}`);
        const leg = rel.querySelector(`#graph-legend-${i}`);
        const pts = rel.querySelectorAll(`.graph-root-${i}`);

        if (i !== k) {
          if(pRe && pRe.getAttribute('data-active') === 'true') pRe.style.opacity = '0.15';
          if(pIm && pIm.getAttribute('data-active') === 'true') pIm.style.opacity = '0.1';
          if(leg) leg.style.opacity = '0.3';
          pts.forEach(pt => { if (pt.style.opacity !== '0') pt.style.opacity = '0.15'; });
        } else {
          if(pRe && pRe.getAttribute('data-active') === 'true') pRe.style.opacity = '1';
          if(pIm && pIm.getAttribute('data-active') === 'true') pIm.style.opacity = '0.8';
          if(leg) leg.style.opacity = '1';
          pts.forEach(pt => { if (pt.style.opacity !== '0') pt.style.opacity = '1'; });
        }
      }
    };

    window.unfocusGraphLine = function(container) {
      const rel = container.closest('.relative');
      const total = parseInt(rel.getAttribute('data-total-funcs') || 0);
      for(let i = 0; i < total; i++) {
        const pRe = rel.querySelector(`#graph-path-re-${i}`);
        const pIm = rel.querySelector(`#graph-path-im-${i}`);
        const leg = rel.querySelector(`#graph-legend-${i}`);
        const pts = rel.querySelectorAll(`.graph-root-${i}`);

        let isActive = pRe && pRe.getAttribute('data-active') === 'true';
        if (isActive) {
          if(pRe) pRe.style.opacity = '1';
          if(pIm) pIm.style.opacity = '0.8';
          if(leg) leg.style.opacity = '1';
          pts.forEach(pt => pt.style.opacity = '1');
        } else {
          if(pRe) pRe.style.opacity = '0';
          if(pIm) pIm.style.opacity = '0';
          if(leg) leg.style.opacity = '0.4';
          pts.forEach(pt => pt.style.opacity = '0');
        }
      }
    };

    window.hideCrosshairs = function(svgEl) {
      const cx = svgEl.querySelector('#crosshair-x');
      const cy = svgEl.querySelector('#crosshair-y');
      if(cx) cx.style.opacity = '0';
      if(cy) cy.style.opacity = '0';
    };

    // Formatador Elegante de Radianos em PI
    function formatRadian(x) {
      if (Math.abs(x) < 1e-5) return "0";
      let ratio = x / Math.PI;
      let bestA = Math.round(ratio), bestB = 1, minErr = Math.abs(ratio - bestA);
      
      for (let b = 2; b <= 12; b++) {
        let a = Math.round(ratio * b);
        let err = Math.abs(ratio - a / b);
        if (err < minErr - 1e-6) {
          minErr = err;
          bestA = a;
          bestB = b;
        }
      }
      
      if (minErr > 0.05) return parseFloat(x.toFixed(2)).toString(); 
      
      let sign = bestA < 0 ? "-" : "";
      let absA = Math.abs(bestA);
      let numStr = absA === 1 ? "π" : `${absA}π`;
      if (absA === 0) return "0";
      if (bestB === 1) return `${sign}${numStr}`;
      return `${sign}${numStr}/${bestB}`;
    }

    // Atualização Dinâmica da Malha (Utilizada em Funções Não-Trigonométricas)
    window.updateDynamicGrid = function(svgEl) {
      const gridGroup = svgEl.querySelector('.dynamic-grid-group');
      if (!gridGroup) return;

      let vb = svgEl.getAttribute('viewBox').split(' ').map(Number);
      let vx = vb[0], vy = vb[1], vw = vb[2], vh = vb[3];

      const xMin = parseFloat(svgEl.getAttribute('data-xmin'));
      const xRange = parseFloat(svgEl.getAttribute('data-xrange'));
      const yMin = parseFloat(svgEl.getAttribute('data-ymin'));
      const yRange = parseFloat(svgEl.getAttribute('data-yrange'));

      const toScreenX = (x) => ((x - xMin) / xRange) * 600;
      const toScreenY = (y) => 300 - ((y - yMin) / yRange) * 300;
      const xAxisY = toScreenY(0);
      const yAxisX = toScreenX(0);

      const mathXMin = xMin + (vx / 600) * xRange;
      const mathXMax = xMin + ((vx + vw) / 600) * xRange;
      const mathYMax = yMin + ((300 - vy) / 300) * yRange;
      const mathYMin = yMin + ((300 - (vy + vh)) / 300) * yRange;

      let rawStepX = (mathXMax - mathXMin) / 8;
      let magX = Math.pow(10, Math.floor(Math.log10(rawStepX)));
      let xStep = (rawStepX / magX > 5) ? 10 * magX : (rawStepX / magX > 2 ? 5 * magX : magX);

      let rawStepY = (mathYMax - mathYMin) / 6;
      let magY = Math.pow(10, Math.floor(Math.log10(rawStepY)));
      let yStep = (rawStepY / magY > 5) ? 10 * magY : (rawStepY / magY > 2 ? 5 * magY : magY);

      let html = '';
      let currentScale = vw / 600;
      let fontSize = 10 * currentScale; 

      let startX = Math.ceil(mathXMin / xStep) * xStep;
      for (let i = startX; i <= mathXMax; i += xStep) {
        if (Math.abs(i) < 1e-7) continue;
        let tx = toScreenX(i);
        let label = parseFloat(i.toFixed(4)); 
        html += `<line x1="${tx}" y1="-50000" x2="${tx}" y2="50000" stroke="#475569" stroke-width="1" stroke-dasharray="3,3" opacity="0.6" vector-effect="non-scaling-stroke" />`;
        html += `<line x1="${tx}" y1="${xAxisY - 4*currentScale}" x2="${tx}" y2="${xAxisY + 4*currentScale}" stroke="#64748b" stroke-width="1.5" vector-effect="non-scaling-stroke" />`;
        html += `<text x="${tx}" y="${xAxisY + 16*currentScale}" fill="#94a3b8" font-size="${fontSize}" text-anchor="middle">${label}</text>`;
      }

      let startY = Math.ceil(mathYMin / yStep) * yStep;
      for (let j = startY; j <= mathYMax; j += yStep) {
        if (Math.abs(j) < 1e-7) continue;
        let ty = toScreenY(j);
        let label = parseFloat(j.toFixed(4));
        html += `<line x1="-50000" y1="${ty}" x2="50000" y2="${ty}" stroke="#475569" stroke-width="1" stroke-dasharray="3,3" opacity="0.6" vector-effect="non-scaling-stroke" />`;
        html += `<line x1="${yAxisX - 4*currentScale}" y1="${ty}" x2="${yAxisX + 4*currentScale}" y2="${ty}" stroke="#64748b" stroke-width="1.5" vector-effect="non-scaling-stroke" />`;
        html += `<text x="${yAxisX - 8*currentScale}" y="${ty + 4*currentScale}" fill="#94a3b8" font-size="${fontSize}" text-anchor="end">${label}</text>`;
      }
      
      html += `<text x="${yAxisX - 6*currentScale}" y="${xAxisY + 12*currentScale}" fill="#94a3b8" font-size="${fontSize}" text-anchor="end">0</text>`;
      
      gridGroup.innerHTML = html;

      const labelX = svgEl.querySelector('.axis-label-x');
      const labelY = svgEl.querySelector('.axis-label-y');
      if (labelX) {
          labelX.setAttribute('x', vx + vw - 15 * currentScale);
          labelX.setAttribute('y', xAxisY - 10 * currentScale);
          labelX.setAttribute('font-size', 12 * currentScale);
      }
      if (labelY) {
          labelY.setAttribute('x', yAxisX + 10 * currentScale);
          labelY.setAttribute('y', vy + 15 * currentScale);
          labelY.setAttribute('font-size', 12 * currentScale);
      }
    };

    let rafGridTimer = null;
    window.scheduleGridUpdate = function(svgEl) {
      if (rafGridTimer) return;
      rafGridTimer = requestAnimationFrame(() => {
        window.updateDynamicGrid(svgEl);
        rafGridTimer = null;
      });
    };

    let isPanning = false;
    let startPanX = 0, startPanY = 0;
    let startVb = [];

    window.handleGraphZoom = function(evt, svgEl) {
      if (svgEl.getAttribute('data-istrig') === 'true') return; // Desativa Zoom para Trigonometria
      evt.preventDefault(); 
      let vb = svgEl.getAttribute('viewBox').split(' ').map(Number);
      let zoom = evt.deltaY > 0 ? 1.05 : 0.95; 
      let newW = vb[2] * zoom;
      let newH = vb[3] * zoom;
      if (newW < 20 || newW > 10000) return; 
      
      let rect = svgEl.getBoundingClientRect();
      let mouseX = evt.clientX - rect.left;
      let mouseY = evt.clientY - rect.top;
      
      let svgMouseX = vb[0] + (mouseX / rect.width) * vb[2];
      let svgMouseY = vb[1] + (mouseY / rect.height) * vb[3];
      
      let newX = svgMouseX - (mouseX / rect.width) * newW;
      let newY = svgMouseY - (mouseY / rect.height) * newH;
      
      svgEl.setAttribute('viewBox', `${newX} ${newY} ${newW} ${newH}`);
      window.scheduleGridUpdate(svgEl);
    };

    window.startGraphPan = function(evt, svgEl) {
      if (svgEl.getAttribute('data-istrig') === 'true') return; // Desativa Pan para Trigonometria
      if(evt.button !== 0) return; 
      isPanning = true;
      startPanX = evt.clientX;
      startPanY = evt.clientY;
      startVb = svgEl.getAttribute('viewBox').split(' ').map(Number);
      svgEl.style.cursor = 'grabbing'; 
    };

    window.doGraphPan = function(evt, svgEl) {
      if (!isPanning) return;
      let rect = svgEl.getBoundingClientRect();
      let dx = evt.clientX - startPanX;
      let dy = evt.clientY - startPanY;
      
      let vbDx = (dx / rect.width) * startVb[2];
      let vbDy = (dy / rect.height) * startVb[3];
      
      svgEl.setAttribute('viewBox', `${startVb[0] - vbDx} ${startVb[1] - vbDy} ${startVb[2]} ${startVb[3]}`);
      window.scheduleGridUpdate(svgEl); 
    };

    window.endGraphPan = function(evt, svgEl) {
      if (isPanning) {
        isPanning = false;
        svgEl.style.cursor = 'default';
        window.scheduleGridUpdate(svgEl); 
      }
    };

    window.resetGraphZoom = function(btnOrSvg) {
      let svgEl = btnOrSvg.tagName === 'SVG' ? btnOrSvg : btnOrSvg.closest('.relative').querySelector('.math-graph-svg');
      if (!svgEl) return;
      
      svgEl.setAttribute('viewBox', '0 0 600 300');
      
      svgEl.querySelectorAll('.graph-root-point').forEach(c => {
          let baseR = c.getAttribute('data-base-r') || 4.5;
          c.setAttribute('r', baseR);
      });
      
      window.scheduleGridUpdate(svgEl);
    };

    // RASTREADOR O(1)
    let rafTrackTimer = null;
    window.trackCoordinates = function(evt, svgEl) {
      if (isPanning) return; 

      if (rafTrackTimer) cancelAnimationFrame(rafTrackTimer);

      rafTrackTimer = requestAnimationFrame(() => {
        const tracker = svgEl.closest('.relative').querySelector('.coord-tracker');
        if (!tracker) return;

        let pt = svgEl.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        let cursorPt = pt.matrixTransform(svgEl.getScreenCTM().inverse());
        
        const svgX = cursorPt.x;
        const svgY = cursorPt.y;

        const cx = svgEl.querySelector('#crosshair-x');
        const cy = svgEl.querySelector('#crosshair-y');
        if (cx && cy) { 
           cx.setAttribute('y1', svgY);
           cx.setAttribute('y2', svgY);
           cy.setAttribute('x1', svgX);
           cy.setAttribute('x2', svgX);
           cx.style.opacity = '0.7';
           cy.style.opacity = '0.7';
        }

        const xMin = parseFloat(svgEl.getAttribute('data-xmin'));
        const xRange = parseFloat(svgEl.getAttribute('data-xrange'));
        const yMin = parseFloat(svgEl.getAttribute('data-ymin'));
        const yRange = parseFloat(svgEl.getAttribute('data-yrange'));

        const mathX = xMin + (svgX / 600) * xRange;
        const mathY = yMin + ((300 - svgY) / 300) * yRange;

        let closestY = null;
        if (svgEl._mainEval) {
           try { closestY = svgEl._mainEval(mathX); } catch(e){}
        }

        const mouseSpan = tracker.querySelector('.coord-mouse');
        const fxContainer = tracker.querySelector('.coord-fx-container');
        const fxSpan = tracker.querySelector('.coord-fx');
        
        mouseSpan.innerHTML = `(${mathX.toFixed(2)}, ${mathY.toFixed(2)})`;

        const mainGraph = svgEl.querySelector('#graph-path-re-0');
        const isMainActive = mainGraph && mainGraph.getAttribute('data-active') !== 'false';

        if (isMainActive) {
            fxContainer.style.display = 'block';
            fxSpan.innerHTML = (closestY !== null && !isNaN(closestY) && isFinite(closestY)) ? closestY.toFixed(2) : '-';
        } else {
            fxContainer.style.display = 'none';
        }
      });
    };

    window.downloadGraph = function(btn) {
      const container = btn.closest('.relative');
      const originalSvg = container.querySelector('svg.math-graph-svg');
      if (!originalSvg) return;
      
      const svg = originalSvg.cloneNode(true);
      svg.setAttribute('width', '1200');
      svg.setAttribute('height', '600');
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const imgSrc = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = function() {
        canvas.width = 1200;
        canvas.height = 600;
        ctx.fillStyle = '#020617'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 1200, 600);
        
        const a = document.createElement('a');
        a.download = 'grafico_polinomio.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
      
      img.src = imgSrc;
    };

    function extrairComplexoNerdamer(valText) {
      let s = valText.replace(/[\(\)\s]/g, ''); 
      if (s === 'i') return { re: 0, im: 1 };
      if (s === '-i') return { re: 0, im: -1 };
      if (!s.includes('i')) return { re: parseFloat(s), im: 0 };
      
      if (s.match(/^[+-]?[\d\.]+\*?i$/)) {
         let numStr = s.replace(/\*?i/, '');
         if (numStr === '' || numStr === '+') return { re: 0, im: 1 };
         if (numStr === '-') return { re: 0, im: -1 };
         return { re: 0, im: parseFloat(numStr) };
      }
      
      let firstChar = s[0];
      let rest = s.substring(1);
      let signIndex = rest.search(/[+-]/);
      
      if (signIndex !== -1) {
          let reStr = firstChar + rest.substring(0, signIndex);
          let imStr = rest.substring(signIndex);
          imStr = imStr.replace(/\*?i/, '');
          if (imStr === '+' || imStr === '') imStr = '1';
          if (imStr === '-') imStr = '-1';
          return { re: parseFloat(reStr), im: parseFloat(imStr) };
      }
      return { re: NaN, im: 0 };
    }

    window.toggleHybridGraph = window.toggleGraphLine;

    // MOTOR GRÁFICO UNIVERSAL 21.0 (Trig Estática Radianos + Filtro de Integral Não Suportada)
    function gerarSvgFuncaoGeral(input, axisVar = 'x', roots = []) {
      let funcs;
      if (typeof input === 'function') {
        funcs = [{ eval: input, color: '#10b981', label: `f(${axisVar})` }];
      } else {
        funcs = input; 
      }

      // FILTRO: Remove integrais não suportadas para não desenhar curvas quebradas nem poluir a legenda
      funcs = funcs.filter(f => {
        if (f.isIntegral) {
          if (f.unsupported || f.isUnsupported || !f.eval || typeof f.eval !== 'function') {
            return false;
          }
          try {
            let testVal = f.eval(1);
            if (testVal === null || typeof testVal === 'undefined') return false;
          } catch(e) {
            return false;
          }
        }
        return true;
      });

      if (typeof Math.sec === 'undefined') Math.sec = (x) => 1 / Math.cos(x);
      if (typeof Math.csc === 'undefined') Math.csc = (x) => 1 / Math.sin(x);
      if (typeof Math.cot === 'undefined') Math.cot = (x) => 1 / Math.tan(x);

      // DETECÇÃO DE TRIGONOMETRIA PARA MODO ESTÁTICO EM RADIANOS
      const isTrig = (function() {
        if (!funcs || funcs.length === 0) return false;
        let exprText = (typeof input === 'string' ? input : '');
        if (funcs[0]) {
          if (funcs[0].raw) exprText += ' ' + funcs[0].raw;
          if (funcs[0].expr) exprText += ' ' + funcs[0].expr;
          if (funcs[0].label) exprText += ' ' + funcs[0].label;
        }

        const nonTrigRegex = /\b(log|ln|exp|sqrt|abs)\b/i;
        if (nonTrigRegex.test(exprText)) return false;

        const trigRegex = /\b(sin|sen|cos|tan|tg|sec|csc|cot|ctg)\b/i;
        return trigRegex.test(exprText);
      })();

      const width = 600, height = 300;
      
      let xMin = -6, xMax = 6;
      if (isTrig) {
        xMin = -2 * Math.PI;
        xMax = 2 * Math.PI;
      } else if (roots && roots.length > 0) {
        let minR = Math.min(...roots);
        let maxR = Math.max(...roots);
        let span = maxR - minR;
        if (span < 2) span = 2; 
        let margin = span * 0.5; 
        xMin = minR - margin;
        xMax = maxR + margin;
      }

      const xRange = xMax - xMin;

      const renderXMin = xMin - xRange * 10;
      const renderXMax = xMax + xRange * 10;
      const renderSteps = 2000; 
      const dx = (renderXMax - renderXMin) / renderSteps;

      let allPoints = [];
      let globalYs = []; 

      for (let k = 0; k < funcs.length; k++) {
        let fObj = funcs[k];
        let pts = [];
        for (let i = 0; i <= renderSteps; i++) {
          let x = renderXMin + i * dx;
          let yRe = NaN, yIm = 0, isReal = true;

          if (fObj.isIntegral) {
            const originalLog = Math.log;
            try {
              Math.log = (v) => originalLog(Math.abs(v));
              yRe = fObj.eval(x);
            } catch (e) {} finally {
              Math.log = originalLog; 
            }
          } else {
            try { yRe = fObj.eval(x); } catch(e) {}
          }

          if (isNaN(yRe) || !isFinite(yRe)) {
            if (fObj.nerdObj) {
              try {
                let valText = fObj.nerdObj.evaluate({ [axisVar]: x }).text('decimals');
                let complexData = extrairComplexoNerdamer(valText);
                yRe = complexData.re;
                yIm = complexData.im;
                isReal = Math.abs(yIm) < 1e-7; 
              } catch(e) { yRe = NaN; }
            }
          }

          if (!isNaN(yRe) && isFinite(yRe)) {
            pts.push({ x, re: yRe, im: yIm, isReal });
            
            if (k === 0 && x >= xMin && x <= xMax) {
              globalYs.push(yRe);
              if (!isReal) globalYs.push(yIm);
            }
          }
        }
        allPoints.push(pts);
      }

      if (globalYs.length === 0) {
        return `
          <div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-inner overflow-hidden h-full flex flex-col items-center justify-center min-h-[200px]">
             <svg class="w-10 h-10 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             <p class="text-sm text-slate-400 font-medium text-center">Gráfico Indisponível</p>
          </div>
        `;
      }

      let allCrosses = [];
      let mainCrosses = (roots && roots.length > 0) ? [...roots].sort((a,b)=>a-b) : [];
      allCrosses[0] = mainCrosses;

      for (let k = 1; k < funcs.length; k++) {
        if (isTrig) {
          allCrosses[k] = [];
          continue;
        }

        let pts = allPoints[k];
        let crosses = [];
        for(let i = 1; i < pts.length; i++) {
           let p1 = pts[i-1];
           let p2 = pts[i];
           if (p1.isReal && p2.isReal && !isNaN(p1.re) && !isNaN(p2.re)) {
               if (Math.abs(p1.re) < 1e-7) { 
                   crosses.push(p1.x); 
               } else if (p1.re * p2.re < 0) {
                   if (Math.abs(p1.re - p2.re) < 50) {
                       let crossX = p1.x + Math.abs(p1.re) / (Math.abs(p1.re) + Math.abs(p2.re)) * (p2.x - p1.x);
                       crosses.push(crossX);
                   }
               }
           }
        }

        let uniqueCrosses = [];
        if (crosses.length <= 25) {
            crosses.forEach(c => {
               if (c >= xMin - xRange * 2 && c <= xMax + xRange * 2) {
                   if (!uniqueCrosses.some(uc => Math.abs(uc - c) < dx * 1.5)) { uniqueCrosses.push(c); }
               }
            });
        }
        allCrosses[k] = uniqueCrosses.sort((a,b)=>a-b);
      }

      function toFractionText(num) {
          if (isTrig) return formatRadian(num);
          if (Number.isInteger(num)) return num.toString();
          for(let den = 2; den <= 100; den++) {
              let numr = num * den;
              if (Math.abs(numr - Math.round(numr)) < 1e-5) {
                  return Math.round(numr) + '/' + den;
              }
          }
          return parseFloat(num.toFixed(3)).toString().replace('.', ',');
      }

      const getTooltipText = (k) => {
          let arr = allCrosses[k];
          if (!arr || arr.length === 0) return "Não corta o eixo x de forma isolada.";
          let fmt = arr.map(n => toFractionText(n));
          if (fmt.length === 1) return `O gráfico corta o eixo x no ponto ${fmt[0]}.`;
          let last = fmt.pop();
          return `O gráfico corta o eixo x nos pontos ${fmt.join(', ')} e ${last}.`;
      };

      let validYs = globalYs.sort((a, b) => a - b);
      let p5 = validYs[Math.floor(validYs.length * 0.05)];
      let p95 = validYs[Math.floor(validYs.length * 0.95)];

      let calcYMin = p5;
      let calcYMax = p95;

      if (calcYMax <= 1 && calcYMin > -5) {
        calcYMin = -5;
      }

      if (calcYMax - calcYMin < 0.5) {
        let centro = (calcYMax + calcYMin) / 2;
        calcYMax = centro + 1;
        calcYMin = centro - 1;
      }

      let yRange = calcYMax - calcYMin;
      if (yRange < 0.1) yRange = 10;

      let yMin = calcYMin - yRange * 0.15;
      let yMax = calcYMax + yRange * 0.15;
      if (yMin > 0 && yMin < yRange) yMin = -yRange * 0.15;
      if (yMax < 0 && Math.abs(yMax) < yRange) yMax = yRange * 0.15;
      yRange = yMax - yMin;

      const toScreenX = (x) => ((x - xMin) / xRange) * width;
      const toScreenY = (y) => height - ((y - yMin) / yRange) * height;
      const xAxisY = toScreenY(0);
      const yAxisX = toScreenX(0);

      let pathsSvg = "";
      for (let k = 0; k < funcs.length; k++) {
        let pts = allPoints[k];
        let color = funcs[k].color;
        let pathD_Re = "";
        let pathD_Im = "";
        let firstRe = true;
        let firstIm = true;
        
        for (let i = 0; i < pts.length; i++) {
          let p = pts[i];
          if (i > 0) {
            let prevP = pts[i - 1];
            
            // NOVO DETETOR DE ASSÍNTOTAS: 
            // Só quebra a linha se o salto atravessar a tela de ponta a ponta (ex: tan(x)).
            // Curvas íngremes como 1/x^2 agora vão desenhar além da borda sem quebrar.
            let jumpRe = Math.abs(p.re - prevP.re);
            if (jumpRe > yRange * 1.5) {
                let maxRe = Math.max(p.re, prevP.re);
                let minRe = Math.min(p.re, prevP.re);
                if (maxRe > yMax && minRe < yMin) firstRe = true;
            }
            
            let jumpIm = Math.abs(p.im - prevP.im);
            if (jumpIm > yRange * 1.5) {
                let maxIm = Math.max(p.im, prevP.im);
                let minIm = Math.min(p.im, prevP.im);
                if (maxIm > yMax && minIm < yMin) firstIm = true;
            }
          }
          let sx = toScreenX(p.x);
          let syRe = toScreenY(p.re);
          let syIm = toScreenY(p.im);
          
          if (syRe >= -100000 && syRe <= 100000) {
            if (firstRe) { pathD_Re += `M ${sx} ${syRe}`; firstRe = false; }
            else { pathD_Re += ` L ${sx} ${syRe}`; }
          } else { firstRe = true; }

          if (!p.isReal) {
            if (syIm >= -100000 && syIm <= 100000) {
              if (firstIm) { pathD_Im += `M ${sx} ${syIm}`; firstIm = false; }
              else { pathD_Im += ` L ${sx} ${syIm}`; }
            } else { firstIm = true; }
          } else { firstIm = true; }
        }
        
        const isActive = (k === 0);
        const opacidadeBase = isActive ? 1 : 0;
        const animClass = isActive ? "anim-draw" : ""; 
        
        if (pathD_Re !== "") {
          let titleStr = getTooltipText(k);
          pathsSvg += `<path id="graph-path-re-${k}" data-active="${isActive}" d="${pathD_Re}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: ${opacidadeBase}; transition: opacity 0.3s ease;" class="${animClass}"><title>${titleStr}</title></path>`;
        }
        if (pathD_Im !== "") {
          pathsSvg += `<path id="graph-path-im-${k}" data-active="${isActive}" d="${pathD_Im}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6,6" style="opacity: ${isActive ? 0.8 : 0}; transition: opacity 0.3s ease;" class="${animClass}" />`;
        }
      }

      let gridEixos = "";
      let ticksEixos = "";

      let xStep = 1;
      if (isTrig) {
        let piSteps = [1/12, 1/6, 1/4, 1/3, 1/2, 1, 2, 4, 8, 10, 20];
        let targetPiStep = xRange / (8 * Math.PI);
        xStep = Math.PI;
        for (let s of piSteps) {
          if (s >= targetPiStep) { xStep = s * Math.PI; break; }
        }
      } else {
        let rawStepX = xRange / 8;
        let magX = Math.pow(10, Math.floor(Math.log10(rawStepX)));
        xStep = (rawStepX / magX > 5) ? 10 * magX : (rawStepX / magX > 2 ? 5 * magX : magX);
      }

      let rawStepY = yRange / 6;
      let magY = Math.pow(10, Math.floor(Math.log10(rawStepY)));
      let yStep = (rawStepY / magY > 5) ? 10 * magY : (rawStepY / magY > 2 ? 5 * magY : magY);

      let startX = Math.ceil(xMin / xStep) * xStep;
      for (let i = startX; i <= xMax; i += xStep) {
        if (Math.abs(i) < 1e-7) continue;
        let tx = toScreenX(i);
        let labelX = isTrig ? formatRadian(i) : parseFloat(i.toFixed(3));
        gridEixos += `<line x1="${tx}" y1="-50000" x2="${tx}" y2="50000" stroke="#475569" stroke-width="1" stroke-dasharray="3,3" opacity="0.6" vector-effect="non-scaling-stroke" />`;
        ticksEixos += `<line x1="${tx}" y1="${xAxisY - 4}" x2="${tx}" y2="${xAxisY + 4}" stroke="#64748b" stroke-width="1.5" vector-effect="non-scaling-stroke" />`;
        ticksEixos += `<text x="${tx}" y="${xAxisY + 16}" fill="#94a3b8" font-size="10" text-anchor="middle">${labelX}</text>`;
      }

      let startY = Math.ceil(yMin / yStep) * yStep;
      for (let j = startY; j <= yMax; j += yStep) {
        if (Math.abs(j) < 1e-7) continue;
        let ty = toScreenY(j);
        let labelY = parseFloat(j.toFixed(3));
        gridEixos += `<line x1="-50000" y1="${ty}" x2="50000" y2="50000" stroke="#475569" stroke-width="1" stroke-dasharray="3,3" opacity="0.6" vector-effect="non-scaling-stroke" />`;
        ticksEixos += `<line x1="${yAxisX - 4}" y1="${ty}" x2="${yAxisX + 4}" y2="${ty}" stroke="#64748b" stroke-width="1.5" vector-effect="non-scaling-stroke" />`;
        ticksEixos += `<text x="${yAxisX - 8}" y="${ty + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${labelY}</text>`;
      }
      ticksEixos += `<text x="${yAxisX - 6}" y="${xAxisY + 12}" fill="#94a3b8" font-size="10" text-anchor="end">0</text>`;

      let legendSvg = funcs.map((f, k) => {
        const isActive = (k === 0);
        return `
          <div id="graph-legend-${k}" onclick="toggleGraphLine(${k})" onmouseenter="focusGraphLine(${k}, this)" onmouseleave="unfocusGraphLine(this)" class="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 p-1.5 rounded transition-all select-none" style="opacity: ${isActive ? 1 : 0.4};" title="Clique para mostrar/ocultar">
            <span class="w-3 h-3 rounded-full shadow-sm" style="background-color: ${f.color};"></span>
            <span class="text-xs font-semibold text-slate-300 notranslate">\\(${f.label}\\)</span>
          </div>
        `;
      }).join('');

      let pontosRaizesSvg = "";
      if (allCrosses[0].length > 0) {
        let fraseBase = getTooltipText(0);
        allCrosses[0].forEach(r => {
          let rx = toScreenX(r);
          let ry = toScreenY(0);
          if (rx >= -5000 && rx <= width + 5000) {
            let tooltip = `Raiz em: x = ${toFractionText(r)}\n\n${fraseBase}`;
            pontosRaizesSvg += `<circle class="graph-root-point graph-root-0 cursor-pointer anim-draw" cx="${rx}" cy="${ry}" r="4.5" data-base-r="4.5" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5" vector-effect="non-scaling-stroke"><title>${tooltip}</title></circle>`;
          }
        });
      }

      for (let k = 1; k < funcs.length; k++) {
        let color = funcs[k].color;
        let strokeColor = "#1e293b"; 
        if (color === '#3b82f6') strokeColor = "#1e3a8a"; 
        if (color === '#a855f7') strokeColor = "#581c87"; 

        let fraseBase = getTooltipText(k);
        allCrosses[k].forEach(r => {
           let rx = toScreenX(r);
           let ry = toScreenY(0);
           if (rx >= -5000 && rx <= width + 5000) {
             let tooltip = `Ponto em: x = ${toFractionText(r)}\n\n${fraseBase}`;
             pontosRaizesSvg += `<circle class="graph-root-point graph-root-${k} cursor-pointer" cx="${rx}" cy="${ry}" r="4" data-base-r="4" fill="${color}" stroke="${strokeColor}" stroke-width="1.5" vector-effect="non-scaling-stroke" style="opacity: 0;"><title>${tooltip}</title></circle>`;
           }
        });
      }

      let yInterceptSvg = "";
      if (0 >= renderXMin && 0 <= renderXMax) {
          let yIntRe = NaN;
          try { yIntRe = funcs[0].eval(0); } catch(e){}
          if (!isNaN(yIntRe) && isFinite(yIntRe)) {
              let sx = toScreenX(0);
              let sy = toScreenY(yIntRe);
              if (sy >= -100000 && sy <= 100000) {
                  let tooltip = `Corte no Eixo Y\n\nx = 0\ny = ${toFractionText(yIntRe)}`;
                  yInterceptSvg = `<circle class="graph-root-point graph-root-0 cursor-pointer" cx="${sx}" cy="${sy}" r="12" data-base-r="12" fill="transparent" stroke="transparent" pointer-events="all"><title>${tooltip}</title></circle>`;
              }
          }
      }

      // Desativa o Botão Home para Trigonometria (pois o gráfico é estático)
      const homeBtnSvg = isTrig ? '' : `
        <button onclick="resetGraphZoom(this)" class="absolute bottom-6 left-6 bg-slate-950/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded shadow-lg z-10 backdrop-blur-sm transition-all flex items-center justify-center opacity-0 group-hover:opacity-100" title="Centralizar Gráfico (0,0)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        </button>
      `;

      const subTitleText = isTrig 
        ? t('chart_subtitle_trig', { default: 'Linha contínua: Parte Real / Tracejada: Parte Im. (Gráfico Estático em Radianos)' })
        : t('chart_subtitle_poly', { default: 'Linha contínua: Parte Real / Tracejada: Parte Im. (Scroll para Zoom)' });

      const svgHtml = `
        <style>
          @keyframes drawGraphAnim {
            from { clip-path: inset(0 100% 0 0); }
            to { clip-path: inset(0 0 0 0); }
          }
          .anim-draw { animation: drawGraphAnim 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          
          svg.math-graph-svg path, 
          svg.math-graph-svg line,
          svg.math-graph-svg circle {
            vector-effect: non-scaling-stroke;
          }
          
          .graph-root-point {
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-origin: center;
            transform-box: fill-box;
          }
          
          .graph-root-point:hover {
            transform: scale(1.6);
          }
        </style>

        <div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-inner overflow-hidden h-full relative group" data-total-funcs="${funcs.length}">
          <div class="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
            <div class="flex flex-col">
              <p class="text-xs text-slate-400 font-medium">Plano Cartesiano com Suporte a <strong>R &rarr; C</strong></p>
              <p class="text-[10px] text-slate-500">${subTitleText}</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              ${legendSvg}
              
              <!-- Botão de Download -->
              <button onclick="downloadGraph(this)" class="flex items-center gap-1.5 hover:bg-slate-800 p-1.5 rounded transition-all text-slate-500 hover:text-white ml-2 border border-transparent hover:border-slate-700" title="Baixar Imagem do Gráfico (PNG)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </button>
            </div>
          </div>
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" 
               data-xmin="${xMin}" data-xrange="${xRange}" data-ymin="${yMin}" data-yrange="${yRange}"
               data-istrig="${isTrig}"
               onwheel="handleGraphZoom(event, this)"
               onmousedown="startGraphPan(event, this)"
               onmousemove="trackCoordinates(event, this); doGraphPan(event, this)"
               onmouseup="endGraphPan(event, this)"
               onmouseleave="hideCrosshairs(this); endGraphPan(event, this)"
               ondblclick="resetGraphZoom(this)"
               class="math-graph-svg w-full h-auto max-h-72 mx-auto bg-slate-950 rounded border border-slate-800 shadow-sm cursor-default">
            
            <!-- Grupo da Malha -->
            <g class="dynamic-grid-group">
                ${gridEixos}
                ${ticksEixos}
            </g>
            
            <!-- Eixos Principais Fixos -->
            <line x1="-50000" y1="${xAxisY}" x2="50000" y2="${xAxisY}" stroke="#334155" stroke-width="1.5" vector-effect="non-scaling-stroke" />
            <line x1="${yAxisX}" y1="-50000" x2="${yAxisX}" y2="50000" stroke="#334155" stroke-width="1.5" vector-effect="non-scaling-stroke" />
            
            <!-- Linhas Sniper -->
            <line id="crosshair-x" x1="-50000" y1="0" x2="50000" y2="0" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="3,3" style="opacity: 0; pointer-events: none;" vector-effect="non-scaling-stroke" />
            <line id="crosshair-y" x1="0" y1="-50000" x2="0" y2="50000" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="3,3" style="opacity: 0; pointer-events: none;" vector-effect="non-scaling-stroke" />
            
            ${pathsSvg}
            ${pontosRaizesSvg}
            ${yInterceptSvg}
            
            <!-- Letras flutuantes do eixo -->
            <text class="axis-label-x" x="${width - 15}" y="${xAxisY - 10}" fill="#cbd5e1" font-size="12" font-style="italic">${axisVar}</text>
            <text class="axis-label-y" x="${yAxisX + 10}" y="15" fill="#cbd5e1" font-size="12" font-style="italic">y</text>
          </svg>

          ${homeBtnSvg}

          <!-- Tracker de Coordenadas -->
          <div class="coord-tracker absolute bottom-6 right-6 bg-slate-950/90 border border-slate-800 text-[10px] px-2.5 py-1.5 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono z-10 backdrop-blur-sm leading-tight text-right">
            <div class="text-slate-500 mb-0.5">Mouse: <span class="coord-mouse text-slate-300">0.00, 0.00</span></div>
            <div class="coord-fx-container font-semibold text-emerald-400 border-t border-slate-700/50 pt-0.5 mt-0.5" style="transition: opacity 0.2s;">f(x) = <span class="coord-fx text-emerald-300">0.00</span></div>
          </div>
        </div>
      `;

      setTimeout(() => {
        const svgEls = document.querySelectorAll('svg.math-graph-svg');
        if (svgEls.length > 0) {
          svgEls[svgEls.length - 1]._mainEval = funcs[0].eval;
        }
      }, 0);

      return svgHtml;
    }

    // função global de clique para ativar os gráficos
    window.toggleHybridGraph = function(k) {
      const path = document.getElementById(`hybrid-path-${k}`);
      const legend = document.getElementById(`hybrid-legend-${k}`);
      if (!path || !legend) return;

      if (path.getAttribute('data-active') === 'true') {
        path.setAttribute('data-active', 'false');
        path.style.opacity = '0';
        legend.style.opacity = '0.4';
      } else {
        path.setAttribute('data-active', 'true');
        path.style.opacity = '1';
        legend.style.opacity = '1';
      }
    };

    function gerarSvgAnaliseHibrida(funcs) {
      if (typeof Math.sec === 'undefined') Math.sec = (x) => 1 / Math.cos(x);
      if (typeof Math.csc === 'undefined') Math.csc = (x) => 1 / Math.sin(x);
      if (typeof Math.cot === 'undefined') Math.cot = (x) => 1 / Math.tan(x);

      const width = 600, height = 300;
      const boundX = 6;
      const xMin = -boundX, xMax = boundX;
      const xRange = xMax - xMin;
      const steps = 400;
      const dx = xRange / steps;

      let allPoints = [];
      let globalYs = [];

      // Avalia todas as funções simultaneamente para unificar a escala de forma proporcional
      for (let fObj of funcs) {
        let pts = [];
        for (let i = 0; i <= steps; i++) {
          let x = xMin + i * dx;
          try {
            let y = fObj.eval(x);
            if (!isNaN(y) && isFinite(y)) {
              pts.push({ x, y });
              globalYs.push(y);
            }
          } catch (e) { }
        }
        allPoints.push(pts);
      }

      if (globalYs.length === 0) return '';

      // Calculos de dispersão para estabilizar o eixo Y contra assíntotas
      let validYs = globalYs.sort((a, b) => a - b);
      let q1 = validYs[Math.floor(validYs.length * 0.25)];
      let q3 = validYs[Math.floor(validYs.length * 0.75)];
      let iqr = q3 - q1;

      if (iqr === 0) iqr = 2;

      let lowerBound = q1 - 3 * iqr;
      let upperBound = q3 + 3 * iqr;

      let p5 = validYs[Math.floor(validYs.length * 0.05)];
      let p95 = validYs[Math.floor(validYs.length * 0.95)];

      let calcYMin = Math.max(p5, lowerBound);
      let calcYMax = Math.min(p95, upperBound);

      if (calcYMax - calcYMin < 0.5) {
        let centro = (calcYMax + calcYMin) / 2;
        calcYMax = centro + 1;
        calcYMin = centro - 1;
      }

      let yRange = calcYMax - calcYMin;
      if (yRange < 0.1) yRange = 10;

      let yMin = calcYMin - yRange * 0.15;
      let yMax = calcYMax + yRange * 0.15;

      if (yMin > 0 && yMin < yRange) yMin = -yRange * 0.15;
      if (yMax < 0 && Math.abs(yMax) < yRange) yMax = yRange * 0.15;
      yRange = yMax - yMin;

      const toScreenX = (x) => ((x - xMin) / xRange) * width;
      const toScreenY = (y) => height - ((y - yMin) / yRange) * height;

      // Desenha as curvas com os IDs para alternância
      let pathsSvg = "";
      for (let k = 0; k < funcs.length; k++) {
        let pts = allPoints[k];
        let color = funcs[k].color;
        let pathD = "";
        let first = true;
        
        for (let i = 0; i < pts.length; i++) {
          let p = pts[i];
          if (i > 0) {
            let prevP = pts[i - 1];
            let diffY = Math.abs(p.y - prevP.y);
            if (diffY > yRange * 0.8) first = true; // Quebra a linha em assíntotas
          }
          let sx = toScreenX(p.x);
          let sy = toScreenY(p.y);
          if (sy < -height || sy > height * 2) {
            first = true;
            continue;
          }
          if (first) {
            pathD += `M ${sx} ${sy}`;
            first = false;
          } else {
            pathD += ` L ${sx} ${sy}`;
          }
        }
        
        if (pathD !== "") {
          // Apenas a função original vem ativa e a derivada e integral vêm opacas
          const isActive = (k === 0);
          pathsSvg += `<path id="hybrid-path-${k}" data-active="${isActive}" d="${pathD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: ${isActive ? 1 : 0}; transition: opacity 0.3s ease;" />`;
        }
      }

      const xAxisY = toScreenY(0);
      const yAxisX = toScreenX(0);
      let ticksEixos = "";

      let rawStepX = xRange / 8;
      let magX = Math.pow(10, Math.floor(Math.log10(rawStepX)));
      let xStep = (rawStepX / magX > 5) ? 10 * magX : (rawStepX / magX > 2 ? 5 * magX : magX);
      let rawStepY = yRange / 6;
      let magY = Math.pow(10, Math.floor(Math.log10(rawStepY)));
      let yStep = (rawStepY / magY > 5) ? 10 * magY : (rawStepY / magY > 2 ? 5 * magY : magY);

      let startX = Math.ceil(xMin / xStep) * xStep;
      for (let i = startX; i <= xMax; i += xStep) {
        if (Math.abs(i) < 1e-7) continue;
        let tx = toScreenX(i);
        let labelX = parseFloat(i.toFixed(2));
        ticksEixos += `<line x1="${tx}" y1="${xAxisY - 4}" x2="${tx}" y2="${xAxisY + 4}" stroke="#64748b" stroke-width="1.5" /><text x="${tx}" y="${xAxisY + 16}" fill="#94a3b8" font-size="10" text-anchor="middle">${labelX}</text>`;
      }

      let startY = Math.ceil(yMin / yStep) * yStep;
      for (let j = startY; j <= yMax; j += yStep) {
        if (Math.abs(j) < 1e-7) continue;
        let ty = toScreenY(j);
        let labelY = parseFloat(j.toFixed(2));
        ticksEixos += `<line x1="${yAxisX - 4}" y1="${ty}" x2="${yAxisX + 4}" y2="${ty}" stroke="#64748b" stroke-width="1.5" /><text x="${yAxisX - 8}" y="${ty + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${labelY}</text>`;
      }
      ticksEixos += `<text x="${yAxisX - 6}" y="${xAxisY + 12}" fill="#94a3b8" font-size="10" text-anchor="end">0</text>`;

      // a legenda agora é um botãoque responde a cliques e escurece
      let legendSvg = funcs.map((f, k) => {
        const isActive = (k === 0);
        return `
          <div id="hybrid-legend-${k}" onclick="toggleHybridGraph(${k})" class="flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 p-1.5 rounded transition-all select-none" style="opacity: ${isActive ? 1 : 0.4};" title="Clique para mostrar/ocultar">
            <span class="w-3 h-3 rounded-full shadow-sm" style="background-color: ${f.color};"></span>
            <span class="text-xs font-semibold text-slate-300 notranslate">\\(${f.label}\\)</span>
          </div>
        `;
      }).join('');

      return `
        <div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-inner overflow-hidden h-full">
          <div class="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
            <p class="text-xs text-slate-400 font-medium">Análise Gráfica: Função, Derivada e Integral</p>
            <div class="flex flex-wrap items-center gap-4">
              ${legendSvg}
            </div>
          </div>
          <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto max-h-72 mx-auto bg-slate-950 rounded border border-slate-800 shadow-sm">
            <line x1="0" y1="${xAxisY}" x2="${width}" y2="${xAxisY}" stroke="#334155" stroke-width="1.5" />
            <line x1="${yAxisX}" y1="0" x2="${yAxisX}" y2="${height}" stroke="#334155" stroke-width="1.5" />
            ${ticksEixos}
            ${pathsSvg}
            <text x="${width - 15}" y="${xAxisY - 10}" fill="#cbd5e1" font-size="12" font-style="italic">${axisVar}</text>
            <text x="${yAxisX + 10}" y="15" fill="#cbd5e1" font-size="12" font-style="italic">y</text>
          </svg>
        </div>
      `;
    }

    const gerarSvgGraficoPolinomio = (coeffs, roots, v = 'x') => {
      let f_eval = (x) => evalPoly(coeffs, x);
      
      let deg = coeffs.length - 1;
      let diffCoeffs = [];
      for (let i = 0; i < coeffs.length - 1; i++) {
        diffCoeffs.push(coeffs[i] * (deg - i));
      }
      let df_eval = (x) => diffCoeffs.length > 0 ? evalPoly(diffCoeffs, x) : 0;

      let intCoeffs = [];
      for (let i = 0; i < coeffs.length; i++) {
        let d = deg - i;
        intCoeffs.push(coeffs[i] / (d + 1));
      }
      intCoeffs.push(0);
      let int_eval = (x) => evalPoly(intCoeffs, x);

      // Agora o Array de roots é repassado corretamente no final
      return gerarSvgFuncaoGeral([
        { eval: f_eval, color: '#10b981', label: `P(${v})` },
        { eval: df_eval, color: '#3b82f6', label: `P'(${v})` },
        { eval: int_eval, color: '#a855f7', label: `\\int P(${v}) d${v}`, isIntegral: true }
      ], v, roots);
    };

    function gerarSvgPlanoComplexo(allRoots) {
      const width = 300, height = 300;
      let maxAbs = 1;
      for (let r of allRoots) {
        maxAbs = Math.max(maxAbs, Math.abs(r.re), Math.abs(r.im));
      }
      let limit = Math.ceil(maxAbs * 1.3);
      if (limit < 2) limit = 2;

      const toScreenX = (x) => ((x + limit) / (2 * limit)) * width;
      const toScreenY = (y) => height - ((y + limit) / (2 * limit)) * height;

      let gridLines = "";
      for (let i = -limit; i <= limit; i++) {
        if (i === 0) continue;
        let sx = toScreenX(i);
        let sy = toScreenY(i);
        gridLines += `<line x1="${sx}" y1="0" x2="${sx}" y2="${height}" stroke="#334155" stroke-width="0.5" stroke-dasharray="2,2"/>`;
        gridLines += `<line x1="0" y1="${sy}" x2="${width}" y2="${sy}" stroke="#334155" stroke-width="0.5" stroke-dasharray="2,2"/>`;

        gridLines += `<text x="${sx}" y="${toScreenY(0) + 12}" fill="#94a3b8" font-size="10" text-anchor="middle">${i}</text>`;
        gridLines += `<text x="${toScreenX(0) - 6}" y="${sy + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${i}i</text>`;
      }

      let pointsSvg = "";
      for (let r of allRoots) {
        pointsSvg += `<circle cx="${toScreenX(r.re)}" cy="${toScreenY(r.im)}" r="5" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5" />`;
      }

      return `
        <div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-inner overflow-hidden text-center h-full">
          <p class="text-xs text-slate-400 mb-2 font-medium" data-i18n="solver_complex_title">${t('solver_complex_title')}</p>
          <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto max-h-64 mx-auto bg-slate-950 rounded border border-slate-800">
            ${gridLines}
            <line x1="0" y1="${toScreenY(0)}" x2="${width}" y2="${toScreenY(0)}" stroke="#94a3b8" stroke-width="1.5" />
            <line x1="${toScreenX(0)}" y1="0" x2="${toScreenX(0)}" y2="${height}" stroke="#94a3b8" stroke-width="1.5" />
            <text x="${width - 15}" y="${toScreenY(0) - 10}" fill="#cbd5e1" font-size="12" font-style="italic">Re</text>
            <text x="${toScreenX(0) + 10}" y="15" fill="#cbd5e1" font-size="12" font-style="italic">Im</text>
            ${pointsSvg}
          </svg>
        </div>
      `;
    }

    class Complexo {
      constructor(re, im = 0) {
        this.re = re;
        this.im = im;
      }
      add(c) { return new Complexo(this.re + c.re, this.im + c.im); }
      sub(c) { return new Complexo(this.re - c.re, this.im - c.im); }
      mul(c) { return new Complexo(this.re * c.re - this.im * c.im, this.re * c.im + this.im * c.re); }
      div(c) {
        const den = c.re * c.re + c.im * c.im;
        return new Complexo((this.re * c.re + this.im * c.im) / den, (this.im * c.re - this.re * c.im) / den);
      }
      toTeX() {
        if (Math.abs(this.im) < 1e-7) return `${this.re.toFixed(5)}`;
        const absIm = Math.abs(this.im).toFixed(5);
        let reStr = Math.abs(this.re) < 1e-7 ? "0" : this.re.toFixed(5);
        if (Math.abs(this.re) < 1e-7) return `${this.im < 0 ? '-' : ''}${absIm}i`;
        return `${reStr} ${this.im > 0 ? '+' : '-'} ${absIm}i`;
      }
    }

    function evalPolyComplex(coeffs, z) {
      let res = new Complexo(coeffs[0], 0);
      for (let i = 1; i < coeffs.length; i++) {
        res = res.mul(z).add(new Complexo(coeffs[i], 0));
      }
      return res;
    }

    function durandKerner(coeffs) {
      const degree = coeffs.length - 1;
      let roots = [];

      for (let i = 0; i < degree; i++) {
        roots.push(new Complexo(Math.cos(i * 2.5) * 1.5, Math.sin(i * 2.5) * 1.5));
      }

      for (let iter = 0; iter < 100; iter++) {
        let maxDiff = 0;
        let newRoots = [];
        for (let i = 0; i < degree; i++) {
          let p = evalPolyComplex(coeffs, roots[i]);

          let den = new Complexo(coeffs[0], 0);

          for (let j = 0; j < degree; j++) {
            if (i !== j) den = den.mul(roots[i].sub(roots[j]));
          }
          let change = p.div(den);
          let nextRoot = roots[i].sub(change);
          newRoots.push(nextRoot);
          maxDiff = Math.max(maxDiff, Math.abs(change.re) + Math.abs(change.im));
        }
        roots = newRoots;
        if (maxDiff < 1e-10) break;
      }
      return roots;
    }

    function simplificarRaiz(n) {
      let out = 1, inside = Math.abs(n);
      for (let i = 2; i * i <= inside; i++) {
        while (inside % (i * i) === 0) {
          out *= i;
          inside /= (i * i);
        }
      }
      return { out, inside };
    }

    function formatarRaizQuadratica(A, B, delta, isMinus) {
      A = Math.round(A);
      B = Math.round(B);
      delta = Math.round(delta);

      const isComplex = delta < 0;
      const absDelta = Math.abs(delta);
      const { out, inside } = simplificarRaiz(absDelta);

      let den = 2 * A;
      let re = -B;
      let im = out;

      let g = gcd(gcd(Math.abs(re), im), Math.abs(den));
      re /= g; im /= g; den /= g;

      if (den < 0) { re = -re; den = -den; }

      let imStr = "";
      if (inside === 1) {
        imStr = (im === 1 ? "" : im) + (isComplex ? "i" : "");
      } else {
        imStr = (im === 1 ? "" : im) + "\\sqrt{" + inside + "}" + (isComplex ? "i" : "");
      }
      if (imStr === "") imStr = "1";
      if (imStr === "i") imStr = "i";

      let sign = isMinus ? "-" : "+";

      if (den === 1) {
        if (re === 0) return isMinus ? `-${imStr}` : imStr;
        return `${re} ${sign} ${imStr}`;
      } else {
        if (re === 0) return `${isMinus ? '-' : ''}\\frac{${imStr}}{${den}}`;
        return `\\frac{${re} ${sign} ${imStr}}{${den}}`;
      }
    }

    function gerarEEnviarPolinomio() {
      let A = parseFloat(document.getElementById('gen-a').value);
      if (isNaN(A)) A = 1;

      let N = parseInt(document.getElementById('gen-n').value);
      if (isNaN(N) || N < 2) N = 2;

      let K = parseFloat(document.getElementById('gen-k').value);
      let B = parseFloat(document.getElementById('gen-b').value);
      if (isNaN(B)) B = 0;

      let C = parseFloat(document.getElementById('gen-c').value);
      const stepsDiv = document.getElementById('gen-steps');

      if (isNaN(K) || K < 0 || isNaN(C) || C === 0) {
        stepsDiv.innerHTML = `<span class="text-red-600 dark:text-red-400 font-medium">${t('gen_error') || 'Erro: K deve ser ≥ 0 e C não pode ser 0.'}</span>`;
        stepsDiv.classList.remove('hidden');
        return;
      }

      const aPowK = Math.pow(A, N) * K;
      const exprStr = `expand((${C}*x - (${B}))^${N} - ${aPowK})`;

      let polyStr = "";
      try {
        polyStr = nerdamer(exprStr).text();
      } catch (e) {
        stepsDiv.innerHTML = `<span class="text-red-600 dark:text-red-400 font-medium">Erro ao expandir polinômio. Verifique os valores inseridos.</span>`;
        stepsDiv.classList.remove('hidden');
        return;
      }

      const A_str = A !== 1 ? (A === -1 ? '-' : A) : '';
      const raiz_str = N === 2 ? `\\sqrt{${K}}` : `\\sqrt[${N}]{${K}}`;
      const B_str = B !== 0 ? (B > 0 ? `+${B}` : `${B}`) : '';

      const step1 = `x = \\frac{${A_str}${raiz_str} ${B_str}}{${C}}`;
      const cx_term = `${C}x`;
      const b_inv_term = B !== 0 ? (B > 0 ? `-${B}` : `+${Math.abs(B)}`) : '';
      const step2 = `${cx_term} ${b_inv_term} = ${A_str}${raiz_str}`;
      const step3 = `(${cx_term} ${b_inv_term})^{${N}} = (${A_str}${raiz_str})^{${N}}`;

      const cleanPolyForTex = polyStr.replace(/\*/g, '');

      stepsDiv.innerHTML = `
        <div class="p-3 bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-600 rounded mt-2">
          <p class="font-semibold text-blue-800 dark:text-blue-300 mb-1" data-i18n="gen_deduction">${t('gen_deduction') || 'Dedução Algébrica (Isolamento):'}</p>
          <div class="math-step notranslate overflow-x-auto pb-2 text-sm whitespace-nowrap">
            \\( ${step1} \\implies ${step2} \\implies ${step3} \\implies \\) <strong>\\( ${cleanPolyForTex} = 0 \\)</strong>
          </div>
        </div>
      `;
      stepsDiv.classList.remove('hidden');

      if (window.renderMathInElement) renderMathInElement(stepsDiv);

      document.getElementById('poly-input').value = polyStr;
      resolverPolinomio();
    }

    function formatPolynomial(coeffs, v = 'x') {
      const degree = coeffs.length - 1;
      let terms = [];

      for (let i = 0; i <= degree; i++) {
        let c = coeffs[i];
        if (c === 0) continue; 

        let deg = degree - i;
        let term = "";

        if (c < 0) {
          term += terms.length === 0 ? "-" : " - ";
        } else if (terms.length > 0) {
          term += " + ";
        }

        let absC = Math.abs(c);

        if (deg === 0) {
          term += absC;
        } else if (deg === 1) {
          term += (absC === 1 ? "" : absC) + v;
        } else {
          term += (absC === 1 ? "" : absC) + v + "^" + deg;
        }

        terms.push(term);
      }

      return terms.length > 0 ? terms.join("") : "0";
    }

    function resolverPolinomio() {
      const inputStr = document.getElementById('poly-input').value;
      const outDiv = document.getElementById('solver-output');
      outDiv.classList.remove('hidden');

      const parsed = parsePolynomial(inputStr);

      if (!parsed || parsed.degree < 1) {
        return analisarExpressaoSimbolica(inputStr, outDiv);
      }

      const originalCoeffs = parsed.coeffs;
      const degree = parsed.degree;
      const v = parsed.varName || 'x';

      let steps = [];
      steps.push(`<strong>${t('solver_poly_lbl')}</strong> \\(P(${v}) = ${formatPolynomial(originalCoeffs, v)} = 0\\) (${t('solver_deg_lbl')} ${degree})`);

      let currentCoeffs = [...originalCoeffs];
      let raizesRacionais = [];
      let multiplicidadeZero = 0;

      while (currentCoeffs.length > 1 && currentCoeffs[currentCoeffs.length - 1] === 0) {
        multiplicidadeZero++;
        currentCoeffs.pop();
      }

      if (multiplicidadeZero > 0) {
        raizesRacionais.push({ val: 0, tex: '0' });
        if (currentCoeffs.length === 1) {
          steps.push(`O polinómio é um monómio. Logo, a única raiz é \\(x = 0\\) (com multiplicidade ${multiplicidadeZero}).`);
        } else {
          steps.push(`O termo independente original é 0. Logo, \\(x = 0\\) é raiz racional evidente (multiplicidade ${multiplicidadeZero}).`);
          steps.push(`Polinómio reduzido para análise do TRR: <div class="math-step notranslate">\\(Q(${v}) = ${formatPolynomial(currentCoeffs, v)} = 0\\)</div>`);
        }
      }

      if (currentCoeffs.length > 1) {
        const an = currentCoeffs[0];
        const a0 = currentCoeffs[currentCoeffs.length - 1];

        const pDivs = getDivisors(Math.round(a0));
        const qDivs = getDivisors(Math.round(an));
        const candidatosMap = new Map();

        for (let p of pDivs) {
          for (let q of qDivs) {
            const g = gcd(p, q);
            const sp = p / g, sq = q / g;
            candidatosMap.set(`${sp}/${sq}`, { val: sp / sq, p: sp, q: sq });
            candidatosMap.set(`-${sp}/${sq}`, { val: -sp / sq, p: -sp, q: sq });
          }
        }

        const candList = Array.from(candidatosMap.values()).sort((a, b) => a.val - b.val);
        const candTeX = candList.map(c => c.q === 1 ? `${c.p}` : `\\frac{${c.p}}{${c.q}}`).join(', ');

        steps.push(`${t('solver_cand_intro', { a0, an })}<br>
                    <div class="math-step notranslate overflow-x-auto pb-2">\\(\\mathcal{C} = \\left\\{ ${candTeX} \\right\\}\\) <span class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-2">(${candList.length} ${t('solver_cand_tested')})</span></div>`);

        for (let cand of candList) {
          while (currentCoeffs.length > 1) {
            const val = evalPoly(currentCoeffs, cand.val);
            if (Math.abs(val) < 1e-7) {
              const fracStr = cand.q === 1 ? `${cand.p}` : `\\frac{${cand.p}}{${cand.q}}`;
              raizesRacionais.push({ val: cand.val, tex: fracStr });

              currentCoeffs = ruffini(currentCoeffs, cand.val);
              currentCoeffs = currentCoeffs.map(c => Math.abs(c - Math.round(c)) < 1e-5 ? Math.round(c) : c);
            } else break;
          }
        }
      }

      let raizesIrracionais = [];
      let polySobrouStr = formatPolynomial(currentCoeffs, v);

      let isBinomial = false;
      let biquadraticExata = false;
      const degRem = currentCoeffs.length - 1;

      if (degRem >= 3) {
        isBinomial = true;
        for (let i = 1; i < degRem; i++) {
          if (Math.abs(currentCoeffs[i]) > 1e-7) { isBinomial = false; break; }
        }
      }

      if (degRem === 4 && Math.abs(currentCoeffs[1]) < 1e-7 && Math.abs(currentCoeffs[3]) < 1e-7) {
        const A_bq = currentCoeffs[0], B_bq = currentCoeffs[2], C_bq = currentCoeffs[4];
        const delta_bq = B_bq * B_bq - 4 * A_bq * C_bq;
        if (delta_bq >= 0 && Number.isInteger(Math.sqrt(delta_bq))) {
          biquadraticExata = true;
        }
      }

      if (degRem === 2) {
        const A = currentCoeffs[0], B = currentCoeffs[1], C = currentCoeffs[2];
        const delta = B * B - 4 * A * C;
        const isIntPoly = Number.isInteger(A) && Number.isInteger(B) && Number.isInteger(C);

        steps.push(`${t('solver_quadratic_rem')}<br>
                    <div class="math-step notranslate">\\(Q(${v}) = ${polySobrouStr} = 0\\)</div>
                    ${t('solver_disc')} \\(\\Delta = (${B})^2 - 4(${A})(${C}) = ${delta}\\)`);

        if (delta > 0) {
          const sqrtDelta = Math.sqrt(delta);
          const r1 = (-B + sqrtDelta) / (2 * A);
          const r2 = (-B - sqrtDelta) / (2 * A);
          if (!isIntPoly || Number.isInteger(sqrtDelta)) {
            raizesIrracionais.push({ tex: `${parseFloat(r1.toFixed(5))}`, val: r1, isComplex: false, isApproxOnly: true, reNum: r1, imNum: 0 });
            raizesIrracionais.push({ tex: `${parseFloat(r2.toFixed(5))}`, val: r2, isComplex: false, isApproxOnly: true, reNum: r2, imNum: 0 });
            if (!Number.isInteger(sqrtDelta)) steps.push(t('solver_irrat_delta', { delta }));
          } else {
            const r1Tex = formatarRaizQuadratica(A, B, delta, false);
            const r2Tex = formatarRaizQuadratica(A, B, delta, true);
            raizesIrracionais.push({ tex: r1Tex, val: r1, isComplex: false, reNum: r1, imNum: 0 });
            raizesIrracionais.push({ tex: r2Tex, val: r2, isComplex: false, reNum: r2, imNum: 0 });
            steps.push(t('solver_irrat_delta', { delta }));
          }
        } else if (delta < 0) {
          steps.push(t('solver_complex_roots'));
          const absDelta = Math.abs(delta);
          const re = -B / (2 * A);
          const im = Math.sqrt(absDelta) / (2 * A);
          const reStr = Math.abs(re) < 1e-7 ? "" : re.toFixed(4);
          const sign1 = reStr === "" ? "" : " + ";
          const sign2 = reStr === "" ? "-" : " - ";
          const valStr1 = `${reStr}${sign1}${Math.abs(im).toFixed(4)}i`;
          const valStr2 = `${reStr}${sign2}${Math.abs(im).toFixed(4)}i`;

          if (!isIntPoly) {
            raizesIrracionais.push({ tex: '', valStr: valStr1, isComplex: true, isApproxOnly: true, reNum: re, imNum: im });
            raizesIrracionais.push({ tex: '', valStr: valStr2, isComplex: true, isApproxOnly: true, reNum: re, imNum: -im });
          } else {
            const r1Tex = formatarRaizQuadratica(A, B, delta, false);
            const r2Tex = formatarRaizQuadratica(A, B, delta, true);
            raizesIrracionais.push({ tex: r1Tex, valStr: valStr1, isComplex: true, reNum: re, imNum: im });
            raizesIrracionais.push({ tex: r2Tex, valStr: valStr2, isComplex: true, reNum: re, imNum: -im });
          }
        } else if (delta === 0) {
          const r = -B / (2 * A);
          raizesIrracionais.push({ tex: `${parseFloat(r.toFixed(5))}`, val: r, isComplex: false, isApproxOnly: true, reNum: r, imNum: 0 });
          raizesIrracionais.push({ tex: `${parseFloat(r.toFixed(5))}`, val: r, isComplex: false, isApproxOnly: true, reNum: r, imNum: 0 });
        }
      }
      else if (biquadraticExata) {
        const A = currentCoeffs[0], B = currentCoeffs[2], C = currentCoeffs[4];
        const delta = B * B - 4 * A * C;
        const sqrtDelta = Math.round(Math.sqrt(delta));

        steps.push(`O polinómio reduzido é uma equação biquadrada da forma \\(${A}x^4 ${B >= 0 ? '+' : ''} ${B}x^2 ${C >= 0 ? '+' : ''} ${C} = 0\\).<br>Substituindo \\(y = x^2\\), obtemos uma equação do 2º grau cujas raízes racionais nos permitem extrair \\(x = \\pm\\sqrt{y}\\).`);

        const processY = (num, den) => {
          let g = gcd(num, den);
          let n = num / g;
          let d = den / g;
          if (d < 0) { n = -n; d = -d; }

          let valY = n / d;

          if (valY === 0) {
            raizesIrracionais.push({ tex: '0', val: 0, isComplex: false, reNum: 0, imNum: 0 });
          } else if (valY > 0) {
            let texStr = "";
            if (d === 1) {
              let { out, inside } = simplificarRaiz(n);
              if (inside === 1) texStr = `${out}`;
              else texStr = (out === 1 ? "" : out) + `\\sqrt{${inside}}`;
            } else {
              let { out, inside } = simplificarRaiz(n * d);
              let finalNum = out;
              let finalDen = d;
              let g2 = gcd(finalNum, finalDen);
              finalNum /= g2; finalDen /= g2;
              let numTex = (inside === 1) ? `${finalNum}` : ((finalNum === 1 ? "" : finalNum) + `\\sqrt{${inside}}`);
              if (finalDen === 1) texStr = numTex;
              else texStr = `\\frac{${numTex}}{${finalDen}}`;
            }

            let rv = Math.sqrt(valY);
            raizesIrracionais.push({ tex: texStr, val: rv, isComplex: false, reNum: rv, imNum: 0 });
            raizesIrracionais.push({ tex: `-${texStr}`, val: -rv, isComplex: false, reNum: -rv, imNum: 0 });
          } else {
            let absN = Math.abs(n);
            let texStr = "";
            if (d === 1) {
              let { out, inside } = simplificarRaiz(absN);
              if (inside === 1) texStr = `${out}i`;
              else texStr = (out === 1 ? "" : out) + `\\sqrt{${inside}}i`;
            } else {
              let { out, inside } = simplificarRaiz(absN * d);
              let finalNum = out;
              let finalDen = d;
              let g2 = gcd(finalNum, finalDen);
              finalNum /= g2; finalDen /= g2;
              let numTex = (inside === 1) ? `${finalNum}i` : ((finalNum === 1 ? "" : finalNum) + `\\sqrt{${inside}}i`);
              if (finalDen === 1) texStr = numTex;
              else texStr = `\\frac{${numTex}}{${finalDen}}`;
            }

            let imVal = Math.sqrt(Math.abs(valY));
            let valStrApp = imVal.toFixed(5);
            raizesIrracionais.push({ tex: texStr, valStr: `${valStrApp}i`, isComplex: true, reNum: 0, imNum: imVal });
            raizesIrracionais.push({ tex: `-${texStr}`, valStr: `-${valStrApp}i`, isComplex: true, reNum: 0, imNum: -imVal });
          }
        };

        processY(-B + sqrtDelta, 2 * A);
        processY(-B - sqrtDelta, 2 * A);
      }
      else if (isBinomial) {
        const A = currentCoeffs[0];
        const C = currentCoeffs[degRem];
        const valK = -C / A;
        const absK = Math.abs(valK);

        let sinalA = A === 1 ? '' : (A === -1 ? '-' : A);
        let sinalC = C > 0 ? '+' : '';
        steps.push(`O polinómio reduzido é um binómio puro da forma \\(${sinalA}x^{${degRem}} ${sinalC} ${C} = 0\\). Extraindo raízes algébricas exatas (Radiciação e Notação de Euler)...`);

        const rDec = Math.pow(absK, 1 / degRem);
        const isNegative = valK < 0;

        let fracTex = Math.abs(A) === 1 ? `${Math.abs(C)}` : `\\frac{${Math.abs(C)}}{${Math.abs(A)}}`;
        let radBaseTex = `\\sqrt[${degRem}]{${fracTex}}`;

        for (let k = 0; k < degRem; k++) {
          let theta = isNegative ? Math.PI : 0;
          let angle = (theta + 2 * Math.PI * k) / degRem;

          let re = rDec * Math.cos(angle);
          let im = rDec * Math.sin(angle);

          if (Math.abs(im) < 1e-6) {
            let signReal = re < 0 ? "-" : "";
            raizesIrracionais.push({ tex: `${signReal}${radBaseTex}`, val: re, isComplex: false, reNum: re, imNum: 0 });
          } else {
            let angleFactor = isNegative ? (1 + 2 * k) : (2 * k);

            let g = gcd(angleFactor, degRem);
            let num = angleFactor / g;
            let den = degRem / g;

            let angleTex = "";
            if (num === 1 && den === 1) angleTex = "\\pi";
            else if (den === 1) angleTex = `${num}\\pi`;
            else if (num === 1) angleTex = `\\frac{\\pi}{${den}}`;
            else angleTex = `\\frac{${num}\\pi}{${den}}`;

            let eulerTex = `e^{i ${angleTex}}`;

            let reStr = Math.abs(re) < 1e-7 ? "" : re.toFixed(4);
            let imAbs = Math.abs(im).toFixed(4);
            let sign1 = reStr === "" ? "" : (im > 0 ? " + " : " - ");
            let sign2 = reStr === "" ? (im > 0 ? "" : "-") : "";

            raizesIrracionais.push({ tex: `${radBaseTex} \\cdot ${eulerTex}`, valStr: `${reStr}${sign1}${sign2}${imAbs}i`, isComplex: true, reNum: re, imNum: im });
          }
        }
      }
      else if (degRem > 2) {
        steps.push(`O polinómio reduzido tem grau ${degRem}. Extraindo raízes irracionais/complexas restantes via método numérico (Durand-Kerner)`);

        const numRoots = durandKerner(currentCoeffs);
        numRoots.forEach(z => {
          if (Math.abs(z.im) < 1e-6) {
            raizesIrracionais.push({ tex: '', val: z.re, isComplex: false, isApproxOnly: true, reNum: z.re, imNum: 0 });
          } else {
            raizesIrracionais.push({ tex: '', valStr: z.toTeX(), isComplex: true, isApproxOnly: true, reNum: z.re, imNum: z.im });
          }
        });
      }

      let realRoots = [];
      let allRoots = [];

      raizesRacionais.forEach(r => {
        realRoots.push(r.val);
        allRoots.push({ re: r.val, im: 0 });
      });

      raizesIrracionais.forEach(r => {
        if (!r.isComplex) {
          realRoots.push(r.val);
          allRoots.push({ re: r.val, im: 0 });
        } else {
          allRoots.push({ re: r.reNum, im: r.imNum });
        }
      });

      const hasComplex = raizesIrracionais.some(r => r.isComplex);
      const hasIrrat = raizesIrracionais.length > 0 && !hasComplex;

      const svgGrafico = gerarSvgGraficoPolinomio(originalCoeffs, realRoots, v);
      let svgPlanoComplexo = '';
      if (hasComplex) {
        svgPlanoComplexo = gerarSvgPlanoComplexo(allRoots);
      }

      let visualizacoesHtml = '';
      if (hasComplex) {
        visualizacoesHtml = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${svgGrafico}
            ${svgPlanoComplexo}
          </div>
        `;
      } else {
        visualizacoesHtml = svgGrafico;
      }

      let badgeHtml = `<span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold px-3 py-1 rounded text-xs">${t('solver_badge_only_rat')}</span>`;
      if (hasComplex) {
        badgeHtml = `<span class="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-semibold px-3 py-1 rounded text-xs">Contém Raízes Complexas</span>`;
      } else if (hasIrrat) {
        badgeHtml = `<span class="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold px-3 py-1 rounded text-xs">${t('solver_badge_has_irrat')}</span>`;
      }

      let resumoRaizes = '';
      if (raizesRacionais.length > 0) {
        resumoRaizes += `<p><strong>${t('solver_rat_roots_found')}</strong></p>
          <ul class="list-disc list-inside text-slate-800 dark:text-slate-200 space-y-1 mt-1 pl-1">` +
          raizesRacionais.map(r => {
            if (r.tex.includes('\\frac')) {
              return `<li>\\(${v} = ${r.tex} \\approx ${r.val.toFixed(5)}\\)</li>`;
            }
            return `<li>\\(${v} = ${r.tex}\\)</li>`;
          }).join('') + `</ul>`;
      }

      if (raizesIrracionais.length > 0) {
        const labelText = hasComplex ? t('solver_rem_complex_roots') : t('solver_irrat_roots_found');
        const labelKey = hasComplex ? 'solver_rem_complex_roots' : 'solver_irrat_roots_found';
        const label = `<strong><span data-i18n="${labelKey}">${labelText}</span></strong>`;

        resumoRaizes += `<div class="mt-4 text-blue-900 dark:text-blue-300 font-medium">${label}</div>
          <ul class="list-disc list-inside text-blue-900 dark:text-blue-300 font-medium space-y-1 mt-1 pl-1"> ` +
          raizesIrracionais.map(r => {
            if (r.isApproxOnly) {
              return `<li>\\(${v} \\approx ${r.valStr ? r.valStr : r.val.toFixed(5)}\\)</li>`;
            } else {
              return `<li>\\(${v} = ${r.tex} \\approx ${r.valStr ? r.valStr : r.val.toFixed(5)}\\)</li>`;
            }
          }).join('') + `</ul>`;
      }

      let verticeHtml = '';
      if (degree === 2) {
        const a = originalCoeffs[0], b = originalCoeffs[1], c = originalCoeffs[2];
        const delta = b * b - 4 * a * c;
        const xv = -b / (2 * a);
        const yv = -delta / (4 * a);

        const tipoKey = a > 0 ? 'solver_geom_min' : 'solver_geom_max';
        const tipoText = a > 0 ? t('solver_geom_min') : t('solver_geom_max');
        const concavKey = a > 0 ? 'solver_geom_up' : 'solver_geom_down';
        const concavText = a > 0 ? t('solver_geom_up') : t('solver_geom_down');

        verticeHtml = `
          <div class="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded">
            <h4 class="font-bold text-amber-900 dark:text-amber-300 mb-1" data-i18n="solver_geom_title">${t('solver_geom_title')}</h4>
            <ul class="list-disc list-inside text-amber-800 dark:text-amber-400 text-sm space-y-1">
              <li><strong><span data-i18n="solver_geom_concav">${t('solver_geom_concav')}</span></strong> <span data-i18n="${concavKey}">${concavText}</span></li>
              <li><strong><span data-i18n="solver_geom_vertex">${t('solver_geom_vertex')}</span> (<span data-i18n="${tipoKey}">${tipoText}</span>):</strong> \\(V = (${xv.toFixed(4)}, ${yv.toFixed(4)})\\)</li>
            </ul>
          </div>
        `;
      }

      const coefN = originalCoeffs[0];
      const coefN_1 = originalCoeffs.length > 1 ? originalCoeffs[1] : 0;
      const coef0 = originalCoeffs[originalCoeffs.length - 1];

      const somaNum = -coefN_1;
      const somaDen = coefN;
      const somaGcd = gcd(somaNum, somaDen);
      const sNum = somaNum / somaGcd;
      const sDen = somaDen / somaGcd;
      const sSign = (sNum * sDen < 0) ? '-' : '';
      const sTex = Math.abs(sDen) === 1 ? `${sSign}${Math.abs(sNum)}` : `${sSign}\\frac{${Math.abs(sNum)}}{${Math.abs(sDen)}}`;
      const sDec = somaNum / somaDen;
      const sDisp = Math.abs(sDen) === 1 ? `\\(${sTex}\\)` : `\\(${sTex} \\approx ${sDec.toFixed(4)}\\)`;

      const pSignBase = (degree % 2 === 0 ? 1 : -1);
      const prodNum = pSignBase * coef0;
      const prodDen = coefN;
      const prodGcd = gcd(prodNum, prodDen);
      const pNum = prodNum / prodGcd;
      const pDen = prodDen / prodGcd;
      const pSign = (pNum * pDen < 0) ? '-' : '';
      const pTex = Math.abs(pDen) === 1 ? `${pSign}${Math.abs(pNum)}` : `${pSign}\\frac{${Math.abs(pNum)}}{${Math.abs(pDen)}}`;
      const pDec = prodNum / prodDen;
      const pDisp = Math.abs(pDen) === 1 ? `\\(${pTex}\\)` : `\\(${pTex} \\approx ${pDec.toFixed(4)}\\)`;

      const vietaHtml = `
        <div class="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 rounded">
          <h4 class="font-bold text-indigo-900 dark:text-indigo-300 mb-1" data-i18n="solver_girard_title">${t('solver_girard_title')}</h4>
          <ul class="list-disc list-inside text-indigo-800 dark:text-indigo-400 text-sm space-y-1">
            <li><strong><span data-i18n="solver_girard_sum">${t('solver_girard_sum')}</span></strong> ${sDisp}</li>
            <li><strong><span data-i18n="solver_girard_prod">${t('solver_girard_prod')}</span></strong> ${pDisp}</li>
          </ul>
        </div>
      `;

      let calcHtml = '';
      try {
        let nerdStr = originalCoeffs.map((c, i) => {
          let deg = originalCoeffs.length - 1 - i;
          if (c === 0) return '';
          return `${c > 0 ? '+' : ''}${c}*x^${deg}`;
        }).join('');
        if (!nerdStr) nerdStr = '0';

        const resultDiff = nerdamer(`diff(${nerdStr}, x)`).toTeX();
        const resultInt = nerdamer(`integrate(${nerdStr}, x)`).toTeX();

        calcHtml = `
          <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-800/80 border-l-4 border-slate-500 rounded">
            <h4 class="font-bold text-slate-800 dark:text-slate-200 mb-2" data-i18n="solver_calc_title">${t('solver_calc_title')}</h4>
            <div class="space-y-2 text-slate-700 dark:text-slate-300">
              <div class="math-step notranslate text-sm">\\( \\frac{d}{d${v}}[P(${v})] = ${resultDiff} \\)</div>
              <div class="math-step notranslate text-sm">\\( \\int P(${v}) \\, d${v} = ${resultInt} + C \\)</div>
            </div>
          </div>
        `;
      } catch (e) {
        console.error("Erro ao gerar cálculo diferencial e integral.", e);
      }

      let html = `
        <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
          <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('solver_res_title')}</h3>
          ${badgeHtml}
        </div>
        <div class="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          ${visualizacoesHtml}
          ${steps.map(s => `<div class="step-box">${s}</div>`).join('')}
          <div class="p-4 bg-slate-100 dark:bg-slate-700/50 border-l-4 border-blue-600 rounded">
            ${resumoRaizes || `<p>${t('solver_no_real_roots')}</p>`}
          </div>
          ${verticeHtml}
          ${vietaHtml}
          ${calcHtml}
        </div>
      `;

      outDiv.innerHTML = html;
      if (window.renderMathInElement) renderMathInElement(outDiv);
    }

    // MOTOR 3: TRIGONOMETRIA
    function setTrig(fn, angle) {
      document.getElementById('trig-func').value = fn;
      document.getElementById('trig-angle').value = angle;
      analisarTrig();
    }
    function getExactTrig(func, originalAngle) {
      let ang = ((originalAngle % 360) + 360) % 360;

      // trata as assíntotas
      if ((func === 'tan' || func === 'sec') && (ang === 90 || ang === 270)) return { isUndefined: true };
      if ((func === 'cot' || func === 'csc') && (ang === 0 || ang === 180)) return { isUndefined: true };

      // redução ao primeiro quadrante e definição do sinal
      let q = 1;
      let ref = ang;
      if (ang > 90 && ang <= 180) { ref = 180 - ang; q = 2; }
      else if (ang > 180 && ang <= 270) { ref = ang - 180; q = 3; }
      else if (ang > 270 && ang < 360) { ref = 360 - ang; q = 4; }

      let sign = 1;
      if (func === 'sin' || func === 'csc') { if (q === 3 || q === 4) sign = -1; }
      else if (func === 'cos' || func === 'sec') { if (q === 2 || q === 3) sign = -1; }
      else if (func === 'tan' || func === 'cot') { if (q === 2 || q === 4) sign = -1; }

      const applySign = (tex) => {
        if (tex === "0") return "0";
        if (sign === 1) return tex;
        if (tex.startsWith("-")) return tex.substring(1);
        return "-" + tex;
      };

      // banco de dados
      const db = {
        0: { sin: "0", cos: "1", tan: "0", sec: "1" },
        15: {
          sin: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", cos: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", tan: "2 - \\sqrt{3}",
          sec: "\\sqrt{6} - \\sqrt{2}", csc: "\\sqrt{6} + \\sqrt{2}", cot: "2 + \\sqrt{3}"
        },
        18: {
          sin: "\\frac{\\sqrt{5} - 1}{4}", cos: "\\frac{\\sqrt{10 + 2\\sqrt{5}}}{4}", tan: "\\frac{\\sqrt{25 - 10\\sqrt{5}}}{5}",
          sec: "\\frac{\\sqrt{50 - 10\\sqrt{5}}}{5}", csc: "\\sqrt{5} + 1", cot: "\\sqrt{5 + 2\\sqrt{5}}"
        },
        30: {
          sin: "\\frac{1}{2}", cos: "\\frac{\\sqrt{3}}{2}", tan: "\\frac{\\sqrt{3}}{3}",
          sec: "\\frac{2\\sqrt{3}}{3}", csc: "2", cot: "\\sqrt{3}"
        },
        36: {
          sin: "\\frac{\\sqrt{10 - 2\\sqrt{5}}}{4}", cos: "\\frac{\\sqrt{5} + 1}{4}", tan: "\\sqrt{5 - 2\\sqrt{5}}",
          sec: "\\sqrt{5} - 1", csc: "\\frac{\\sqrt{50 + 10\\sqrt{5}}}{5}", cot: "\\frac{\\sqrt{25 + 10\\sqrt{5}}}{5}"
        },
        45: {
          sin: "\\frac{\\sqrt{2}}{2}", cos: "\\frac{\\sqrt{2}}{2}", tan: "1",
          sec: "\\sqrt{2}", csc: "\\sqrt{2}", cot: "1"
        },
        60: {
          sin: "\\frac{\\sqrt{3}}{2}", cos: "\\frac{1}{2}", tan: "\\sqrt{3}",
          sec: "2", csc: "\\frac{2\\sqrt{3}}{3}", cot: "\\frac{\\sqrt{3}}{3}"
        },
        75: {
          sin: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", cos: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", tan: "2 + \\sqrt{3}",
          sec: "\\sqrt{6} + \\sqrt{2}", csc: "\\sqrt{6} - \\sqrt{2}", cot: "2 - \\sqrt{3}"
        },
        90: { sin: "1", cos: "0", csc: "1", cot: "0" }
      };

      if (db[ref] && db[ref][func]) {
        return { hasExact: true, tex: applySign(db[ref][func]) };
      }
      return { hasExact: false };
    }

        function getAlternativasHTML(func, originalAngle) {
      // Reduz o ângulo para a primeira volta positiva (0 a 360)
      const angle = ((originalAngle % 360) + 360) % 360;

      // define a cofunção
      const cofunc = {
        'sin': 'cos', 'cos': 'sin',
        'tan': 'cot', 'cot': 'tan',
        'sec': 'csc', 'csc': 'sec'
      }[func];
      
      const formatVal = (v) => {
        // Garante que o valor final gerado também fique entre 0 e 360
        let val = ((v % 360) + 360) % 360;
        return val + '^\\circ';
      };
      
      const alts = [];

      // Identidade da Cofunção
      alts.push(`\\${cofunc}(${formatVal(90 - angle)})`);

      //Identidades de Paridade e Deslocamento de Período
      if (func === 'sin' || func === 'csc') {
        alts.push(`\\${func}(${formatVal(180 - angle)})`);
        alts.push(`-\\${func}(${formatVal(-angle)})`);
      } else if (func === 'cos' || func === 'sec') {
        alts.push(`\\${func}(${formatVal(-angle)})`);
        alts.push(`-\\${func}(${formatVal(180 - angle)})`);
      } else if (func === 'tan' || func === 'cot') {
        alts.push(`-\\${func}(${formatVal(-angle)})`);
        alts.push(`\\${func}(${formatVal(angle > 0 ? angle - 180 : angle + 180)})`);
      }

      // remove eventuais duplicatas caso o ângulo seja 0
      const uniqueAlts = [...new Set(alts)];

      let listHtml = uniqueAlts.map(a => `
        <div class="py-3 border-b border-slate-200 dark:border-slate-700/60 last:border-0">
          <div class="math-step notranslate text-sm">\\(\\\\%s(${originalAngle}^\\circ) = ${a}\\)</div>
        </div>
      `.replace('%s', func)).join('');

      return `
        <div class="mt-6 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-sm">
          <div class="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700 dark:text-cyan-400">Representações Alternativas:</span>
          </div>
          <div class="px-4">
            ${listHtml}
          </div>
        </div>
      `;
    }

    function analisarTrig() {
      const func = document.getElementById('trig-func').value;
      let angle = parseFloat(document.getElementById('trig-angle').value);
      const outDiv = document.getElementById('trig-output');
      outDiv.classList.remove('hidden');

      if (isNaN(angle)) return;

      const normAngle = ((angle % 360) + 360) % 360;
      const rad = (normAngle * Math.PI) / 180;
      
      let valCalc = 0;
      if (func === 'sin') valCalc = Math.sin(rad);
      else if (func === 'cos') valCalc = Math.cos(rad);
      else if (func === 'tan') valCalc = Math.tan(rad);
      else if (func === 'sec') valCalc = 1 / Math.cos(rad);
      else if (func === 'csc') valCalc = 1 / Math.sin(rad);
      else if (func === 'cot') valCalc = 1 / Math.tan(rad);

      let funcName = '\\' + func;
      
      const formatRad = (deg) => {
        if (deg === 0) return "0";
        let sign = deg < 0 ? "-" : "";
        let g = (a, b) => b ? g(b, a % b) : a;
        let divisor = g(Math.abs(deg), 180);
        let n = Math.abs(deg) / divisor;
        let d = 180 / divisor;
        // AQUI ESTAVA O ERRO! Corrigido para ${n}\\pi
        let nStr = n === 1 ? "\\pi" : `${n}\\pi`;
        if (d === 1) return `${sign}${nStr}`;
        return `${sign}\\frac{${nStr}}{${d}}`;
      };
      
      const radTex = formatRad(angle);
      const exactData = getExactTrig(func, normAngle); 

      let refQ1 = normAngle;
      if (normAngle > 90 && normAngle <= 180) refQ1 = 180 - normAngle;
      else if (normAngle > 180 && normAngle <= 270) refQ1 = normAngle - 180;
      else if (normAngle > 270) refQ1 = 360 - normAngle;

      const isCosSecTriplo = (func === 'cos' || func === 'sec') && (refQ1 === 20 || refQ1 === 40 || refQ1 === 80);
      const isSinCscTriplo = (func === 'sin' || func === 'csc') && (refQ1 === 10 || refQ1 === 50 || refQ1 === 70);

      let html = '';

      if (isCosSecTriplo || isSinCscTriplo) {
        let formula = isCosSecTriplo ? "\\cos(3\\theta) = 4\\cos^3(\\theta) - 3\\cos(\\theta)" : "\\sin(3\\theta) = 3\\sin(\\theta) - 4\\sin^3(\\theta)";
        let sinal = "- 1";
        let resTriplo = "\\frac{1}{2}";
        
        if (isCosSecTriplo) {
            if (refQ1 === 40 || refQ1 === 80) { resTriplo = "-\\frac{1}{2}"; sinal = "+ 1"; }
        } else {
            if (refQ1 === 70) { resTriplo = "-\\frac{1}{2}"; sinal = "- 1"; }
            else { resTriplo = "\\frac{1}{2}"; sinal = "+ 1"; }
        }
        let subFormula = isCosSecTriplo ? `4x^3 - 3x = ${resTriplo}` : `${resTriplo} = 3x - 4x^3`;

        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('trig_res_irrat')}</h3>
            <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold px-3 py-1 rounded text-xs">\\(${funcName}(${angle}^\\circ) \\notin \\mathbb{Q}\\)</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p><strong>${t('trig_triple_arc')}</strong></p>
            <div class="math-step notranslate">\\(${formula}\\)</div>
            <p>${t('trig_chebyshev_sub', { angle })}</p>
            <div class="math-step notranslate">\\(${subFormula} \\iff 8x^3 - 6x ${sinal} = 0\\)</div>
            <p><strong>${t('trig_trr_filter')}</strong></p>
            <p>${t('trig_trr_cand_lbl')}</p>
            <div class="math-step notranslate">\\(\\mathcal{C} \\in \\left\\{ \\pm 1, \\pm \\frac{1}{2}, \\pm \\frac{1}{4}, \\pm \\frac{1}{8} \\right\\}\\)</div>
            <p>${t('trig_trr_none')}</p>
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded text-blue-950 dark:text-blue-200 text-xs">
              ${t('trig_chebyshev_concl', { angle })}
            </div>
          </div>
        `;
      } else if (exactData.isUndefined) {
        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">Valor Indefinido</h3>
            <span class="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 font-semibold px-3 py-1 rounded text-xs">Assíntota Vertical</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p>A função não está definida para o ângulo de ${angle}°.</p>
            <div class="math-step notranslate">\\( \\theta = ${angle}^\\circ = ${radTex} \\text{ rad} \\)</div>
            <div class="math-step notranslate">\\( \\lim_{\\theta \\to ${angle}^\\circ} ${funcName}(\\theta) = \\pm \\infty \\)</div>
          </div>
        `;
      } else if (exactData.hasExact) {
        const isRational = !exactData.tex.includes('\\sqrt');
        const badgeText = isRational ? `\\(${funcName}(${angle}^\\circ) \\in \\mathbb{Q}\\)` : `\\(${funcName}(${angle}^\\circ) \\notin \\mathbb{Q}\\)`;
        const badgeClass = isRational 
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";

        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">Valor Algébrico Exato</h3>
            <span class="${badgeClass} font-semibold px-3 py-1 rounded text-xs">${badgeText}</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div class="math-step notranslate pb-2 text-xl">\\(${funcName}(${angle}^\\circ) = ${exactData.tex}\\)</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded">
                <span class="font-bold text-slate-700 dark:text-slate-300">Valor Decimal:</span>
                <div class="math-step notranslate mt-2 text-lg">\\(\\approx ${valCalc.toFixed(8)}\\)</div>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded">
                <span class="font-bold text-slate-700 dark:text-slate-300">Ângulo em Radianos:</span>
                <div class="math-step notranslate mt-2 text-lg">\\(${radTex} \\text{ rad}\\)</div>
              </div>
            </div>
          </div>
        `;
      } else {
        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">Valor Numérico</h3>
            <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold px-3 py-1 rounded text-xs">\\(${funcName}(${angle}^\\circ) \\notin \\mathbb{Q}\\)</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded">
                <span class="font-bold text-slate-700 dark:text-slate-300">Valor Decimal:</span>
                <div class="math-step notranslate mt-2 text-lg">\\(${funcName}(${angle}^\\circ) \\approx ${valCalc.toFixed(8)}\\)</div>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded">
                <span class="font-bold text-slate-700 dark:text-slate-300">Ângulo em Radianos:</span>
                <div class="math-step notranslate mt-2 text-lg">\\(${radTex} \\text{ rad}\\)</div>
              </div>
            </div>
          </div>
        `;
      }

      if (!exactData.isUndefined) {
        html += getAlternativasHTML(func, angle);
      }

      if (!exactData.isUndefined || (func !== 'tan' && func !== 'cot' && func !== 'sec' && func !== 'csc')) {
        html += gerarSvgCirculoTrigonometrico(func, angle);
      }

      if (!exactData.hasExact && !exactData.isUndefined && !isCosSecTriplo && !isSinCscTriplo) {
        html += `
          <div class="mt-4 p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-inner overflow-hidden text-center w-full mx-auto">
            <p class="text-sm font-medium text-slate-300">
              Como o ângulo <strong>${angle}°</strong> é racional em graus, mas o resultado <strong>${valCalc.toFixed(4)}</strong> não pertence a \\(\\{0, \\pm 1/2, \\pm 1\\}\\), o Teorema de Niven garante que o valor é estritamente irracional.
            </p>
          </div>
        `;
      }

      outDiv.innerHTML = html;
      if (window.renderMathInElement) renderMathInElement(outDiv);
    }
    //circulo trigonométrico
    function gerarSvgCirculoTrigonometrico(func, angleDeg) {
      const width = 700, height = 300;
      const cx = width / 2, cy = height / 2;
      const R = 100;
      
      const normAngle = ((angleDeg % 360) + 360) % 360;
      const rad = (normAngle * Math.PI) / 180;
      
      const px = cx + R * Math.cos(rad);
      const py = cy - R * Math.sin(rad);

      let svgContent = `
        <!-- Eixos Cartesianos e Círculo -->
        <line x1="0" y1="${cy}" x2="${width}" y2="${cy}" stroke="#64748b" stroke-width="1.5" />
        <line x1="${cx}" y1="0" x2="${cx}" y2="${height}" stroke="#64748b" stroke-width="1.5" />
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,4" />
        <text x="${width - 15}" y="${cy - 10}" fill="#94a3b8" font-size="12" font-style="italic">x</text>
        <text x="${cx + 10}" y="15" fill="#94a3b8" font-size="12" font-style="italic">y</text>
      `;

      // Arco indicador de ângulo
      if (angleDeg % 360 !== 0) {
        const drawAngle = angleDeg % 360; 
        const radDraw = (drawAngle * Math.PI) / 180;
        const arcPx = cx + 25 * Math.cos(radDraw);
        const arcPy = cy - 25 * Math.sin(radDraw);
        const arcLarge = Math.abs(drawAngle) > 180 ? 1 : 0;
        const sweepFlag = drawAngle < 0 ? 1 : 0; 
        
        svgContent += `
          <path d="M ${cx + 25} ${cy} A 25 25 0 ${arcLarge} ${sweepFlag} ${arcPx} ${arcPy}" fill="none" stroke="#f59e0b" stroke-width="2" />
          <text x="${cx + 38 * Math.cos(radDraw/2)}" y="${cy - 38 * Math.sin(radDraw/2) + 4}" fill="#f59e0b" font-size="10" text-anchor="middle">${angleDeg}°</text>
        `;
      }

      // Raiop rincipal
      svgContent += `<line x1="${cx}" y1="${cy}" x2="${px}" y2="${py}" stroke="#94a3b8" stroke-width="2" />`;

      // Geometria das funções
      if (func === 'sin') {
        svgContent += `<line x1="${px}" y1="${cy}" x2="${px}" y2="${py}" stroke="#ef4444" stroke-width="3" />`; 
        svgContent += `<line x1="${cx}" y1="${cy}" x2="${px}" y2="${cy}" stroke="#3b82f6" stroke-width="1" stroke-dasharray="2,2" />`; 
      } else if (func === 'cos') {
        svgContent += `<line x1="${cx}" y1="${cy}" x2="${px}" y2="${cy}" stroke="#3b82f6" stroke-width="3" />`; 
        svgContent += `<line x1="${px}" y1="${cy}" x2="${px}" y2="${py}" stroke="#ef4444" stroke-width="1" stroke-dasharray="2,2" />`; 
      } else if (func === 'tan' && normAngle !== 90 && normAngle !== 270) {
        const tanY = cy - R * Math.tan(rad);
        svgContent += `<line x1="${cx + R}" y1="0" x2="${cx + R}" y2="${height}" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,4" />`; 
        // Projeção tracejada conectando a origem à reta tangente exterior
        svgContent += `<line x1="${cx}" y1="${cy}" x2="${cx + R}" y2="${tanY}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />`; 
        svgContent += `<line x1="${cx + R}" y1="${cy}" x2="${cx + R}" y2="${tanY}" stroke="#8b5cf6" stroke-width="3" />`; 
        svgContent += `<circle cx="${cx + R}" cy="${tanY}" r="4" fill="#8b5cf6" />`;
      } else if (func === 'cot' && normAngle !== 0 && normAngle !== 180) {
        const cotX = cx + R / Math.tan(rad);
        svgContent += `<line x1="0" y1="${cy - R}" x2="${width}" y2="${cy - R}" stroke="#334155" stroke-width="1.5" stroke-dasharray="4,4" />`; 
        // Projeção tracejada conectando a origem à reta cotangente exterior
        svgContent += `<line x1="${cx}" y1="${cy}" x2="${cotX}" y2="${cy - R}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />`; 
        svgContent += `<line x1="${cx}" y1="${cy - R}" x2="${cotX}" y2="${cy - R}" stroke="#f97316" stroke-width="3" />`; 
        svgContent += `<circle cx="${cotX}" cy="${cy - R}" r="4" fill="#f97316" />`;
      } else if (func === 'sec' && normAngle !== 90 && normAngle !== 270) {
        const secX = cx + R / Math.cos(rad);
        svgContent += `<line x1="${cx}" y1="${cy}" x2="${secX}" y2="${cy}" stroke="#ec4899" stroke-width="3" />`; 
        svgContent += `<line x1="${px}" y1="${py}" x2="${secX}" y2="${cy}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />`;
        svgContent += `<circle cx="${secX}" cy="${cy}" r="4" fill="#ec4899" />`;
      } else if (func === 'csc' && normAngle !== 0 && normAngle !== 180) {
        const cscY = cy - R / Math.sin(rad);
        svgContent += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cscY}" stroke="#14b8a6" stroke-width="3" />`;
        svgContent += `<line x1="${px}" y1="${py}" x2="${cx}" y2="${cscY}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4" />`;
        svgContent += `<circle cx="${cx}" cy="${cscY}" r="4" fill="#14b8a6" />`;
      }

      // Ponto da extremidade do raio no círculo unitário 
      svgContent += `<circle cx="${px}" cy="${py}" r="4" fill="#10b981" />`;

      return `
        <div class="mt-6">
          <div class="my-4 p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-inner overflow-hidden text-center w-full mx-auto">
            <p class="text-xs text-slate-400 mb-2 font-medium">Visualização Geométrica: ${func}(${angleDeg}°)</p>
            <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto max-h-64 mx-auto bg-slate-950 rounded border border-slate-800">
              ${svgContent}
            </svg>
          </div>
        </div>
      `;
    }
     // MOTOR 4: LOGARITMOS
    function analisarLogaritmo() {
      const baseInput = document.getElementById('log-base').value.trim().toLowerCase();
      const a = parseInt(document.getElementById('log-arg').value);
      const outDiv = document.getElementById('log-output');
      outDiv.classList.remove('hidden');

      // Verifica se o usuário digitou "e"
      const isBaseE = (baseInput === 'e');
      const b = isBaseE ? Math.E : parseInt(baseInput);

      if ((!isBaseE && (isNaN(b) || b < 2)) || isNaN(a) || a < 1) {
        outDiv.innerHTML = `<div class="text-red-600 dark:text-red-400 font-medium text-sm">A base deve ser &ge; 2 (ou 'e') e o logaritmando &ge; 1.</div>`;
        return;
      }

      // Cálculo do valor numérico (Goal 2)
      const valCalc = isBaseE ? Math.log(a) : Math.log(a) / Math.log(b);
      const valBadge = `
        <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded">
          <span class="font-bold text-slate-700 dark:text-slate-300">Valor Numérico Aproximado:</span>
          <div class="math-step notranslate mt-2 text-lg text-blue-600 dark:text-blue-400">\\(\\approx ${valCalc.toFixed(8)}\\)</div>
        </div>
      `;

      let baseTex = isBaseE ? 'e' : b;
      let logNot = isBaseE ? `\\ln(${a})` : `\\log_{${b}}(${a})`;

      // Tratamento do Logaritmando = 1
      if (a === 1) {
        outDiv.innerHTML = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('res_rational_int')}</h3>
              <span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold px-3 py-1 rounded text-xs">\\(${logNot} = 0 \\in \\mathbb{Q}\\)</span>
            </div>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p>O logaritmo de 1 em qualquer base é sempre 0, pois \\(${baseTex}^0 = 1\\).</p>
            ${valBadge}
          </div>
        `;
        if (window.renderMathInElement) renderMathInElement(outDiv);
        return;
      }

      // Tratamento Exclusivo para Base "e" (Goal 1)
      if (isBaseE) {
        outDiv.innerHTML = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('res_irrational_proven')}</h3>
              <span class="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-semibold px-3 py-1 rounded text-xs">\\(${logNot} \\notin \\mathbb{Q}\\) (Transcendente)</span>
            </div>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p><strong>1. Suposição de Racionalidade:</strong></p>
            <p>Suponha por absurdo que o logaritmo natural de ${a} seja um número racional \\(\\frac{p}{q}\\).</p>
            <div class="math-step notranslate">\\(\\ln(${a}) = \\frac{p}{q} \\implies e^{\\frac{p}{q}} = ${a} \\implies e^p = ${a}^q\\)</div>
            
            <p><strong>2. Contradição por Transcendência:</strong></p>
            <p>Como \\(${a}\\) é um inteiro maior que 1 e \\(q \\neq 0\\), a potência \\(${a}^q\\) também é um número inteiro. Pelo <em>Teorema de Hermite-Lindemann</em>, sabemos que \\(e\\) é um número <strong>transcendente</strong>. Sendo assim, qualquer potência inteira não-nula de \\(e\\) (como \\(e^p\\)) resulta em um valor estritamente transcendente, e jamais em um número algébrico ou inteiro.</p>
            
            <div class="p-3 bg-red-50 border-l-4 border-red-500 dark:bg-red-900/20 dark:border-red-800 rounded text-red-900 dark:text-red-300 text-xs mt-3">
              <strong>Conclusão:</strong> A igualdade \\(e^p = ${a}^q\\) é estruturalmente impossível. Logo, \\(\\ln(${a})\\) é irracional.
            </div>
            ${valBadge}
          </div>
        `;
        if (window.renderMathInElement) renderMathInElement(outDiv);
        return;
      }

      // Lógica existente para bases numéricas inteiras
      const factB = primeFactorization(b);
      const factA = primeFactorization(a);
      const primesB = Object.keys(factB).sort((x, y) => x - y);
      const primesA = Object.keys(factA).sort((x, y) => x - y);

      const formatFact = (fact) => Object.entries(fact).map(([p, e]) => e === 1 ? p : `${p}^{${e}}`).join(' \\cdot ');
      const factB_str = formatFact(factB);
      const factA_str = formatFact(factA);

      let isRational = true;
      let p_val = 0, q_val = 1;
      let absurdoPrimos = false;
      let absurdoExpoentes = false;
      let eqSistema = [];

      if (primesA.length !== primesB.length || !primesA.every((v, i) => v === primesB[i])) {
        isRational = false;
        absurdoPrimos = true;
      } else {
        const p1 = primesA[0];
        p_val = factA[p1];
        q_val = factB[p1];
        const divis = gcd(p_val, q_val);
        p_val /= divis;
        q_val /= divis;

        for (let p of primesA) {
          eqSistema.push(`\\text{Para } ${p}: & ${factB[p]}p = ${factA[p]}q \\implies \\frac{p}{q} = \\frac{${factA[p]}}{${factB[p]}}`);
          if (factA[p] * q_val !== factB[p] * p_val) {
            isRational = false;
            absurdoExpoentes = true;
          }
        }
      }

      let html = '';
      if (isRational) {
        let fracStr = q_val === 1 ? `${p_val}` : `\\frac{${p_val}}{${q_val}}`;
        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('res_rational_int')}</h3>
              <span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold px-3 py-1 rounded text-xs">\\(\\log_{${b}}(${a}) = ${fracStr} \\in \\mathbb{Q}\\)</span>
            </div>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p>${t('log_step4_rat')}</p>
            <div class="math-step notranslate">\\(${b} = ${factB_str}\\)</div>
            <div class="math-step notranslate">\\(${a} = ${factA_str}\\)</div>
            <p>Portanto, \\(${b}^{${fracStr}} = ${a}\\).</p>
            ${valBadge}
          </div>
        `;
      } else {
        let explicacaoAbsurdo = '';
        if (absurdoPrimos) {
          explicacaoAbsurdo = t('log_step4_irrat', { diff: 'bases divergentes' });
        } else if (absurdoExpoentes) {
          explicacaoAbsurdo = `${t('log_step4_irrat', { diff: 'proporções incongruentes' })}<br> <div class="math-step notranslate overflow-x-auto">\\(\\begin{cases} ${eqSistema.join(' \\\\[4pt] ')} \\end{cases}\\)</div>`;
        }

        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('res_irrational_proven')}</h3>
              <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold px-3 py-1 rounded text-xs">\\(\\log_{${b}}(${a}) \\notin \\mathbb{Q}\\)</span>
            </div>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p><strong>${t('log_step1')}</strong></p>
            <p>${t('log_step1_desc')}</p>
            <div class="math-step notranslate">\\(\\log_{${b}}(${a}) = \\frac{p}{q} \\implies ${b}^{\\frac{p}{q}} = ${a} \\implies ${b}^p = ${a}^q\\)</div>
            
            <p><strong>${t('log_step3_desc')}</strong></p>
            <div class="math-step notranslate overflow-x-auto">\\( (${factB_str})^p = (${factA_str})^q \\)</div>
            
            <div class="p-3 bg-red-50 border-l-4 border-red-500 dark:bg-red-900/20 dark:border-red-800 rounded text-red-900 dark:text-red-300 text-xs mt-3">
              <strong>Contradição:</strong> ${explicacaoAbsurdo}
            </div>
            ${valBadge}
          </div>
        `;
      }

      outDiv.innerHTML = html;
      if (window.renderMathInElement) renderMathInElement(outDiv);
    }

    // MOTOR 5: EISENSTEIN
    function executarEisenstein() {
      const inputStr = document.getElementById('eisen-input').value;
      const outDiv = document.getElementById('eisen-output');
      outDiv.classList.remove('hidden');

      const parsed = parsePolynomial(inputStr);
      if (!parsed || parsed.degree < 2) return;

      const coeffs = parsed.coeffs, n = parsed.degree;
      const an = coeffs[0], a0 = coeffs[coeffs.length - 1];
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
      let primoEisenstein = null;

      for (let p of primes) {
        if (p > Math.abs(a0) && p > 50) break;
        let cond1 = true;
        for (let i = 1; i <= n; i++) {
          if (coeffs[i] % p !== 0) { cond1 = false; break; }
        }
        let cond2 = (an % p !== 0), cond3 = (a0 % (p * p) !== 0);
        if (cond1 && cond2 && cond3 && primoEisenstein === null) primoEisenstein = p;
      }

      let html = '';
      if (primoEisenstein !== null) {
        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('eisen_sat_title')}</h3>
            <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold px-3 py-1 rounded text-xs">p = ${primoEisenstein}</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p>${t('eisen_sat_desc', { p: primoEisenstein })}</p>
            <ul class="list-disc list-inside space-y-1 pl-2">
              <li>${t('eisen_c1', { p: primoEisenstein, n })}</li>
              <li>${t('eisen_c2', { p: primoEisenstein, n, an })}</li>
              <li>${t('eisen_c3', { p: primoEisenstein, p2: primoEisenstein * primoEisenstein, a0 })}</li>
            </ul>
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded text-blue-950 dark:text-blue-200 text-xs">
              ${t('eisen_concl', { n })}
            </div>
          </div>
        `;
      } else {
        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('eisen_inconc_title')}</h3>
            <span class="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-semibold px-3 py-1 rounded text-xs">Inconclusive</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <p>${t('eisen_inconc_desc')}</p>
          </div>
        `;
      }

      outDiv.innerHTML = html;
      if (window.renderMathInElement) renderMathInElement(outDiv);
    }

    // MOTOR: FRAÇÕES CONTÍNUAS
    function executarFracaoContinua() {
      // Caso o input cf-index não exista na tela assume n=2
      const elIndex = document.getElementById('cf-index');
      const n = elIndex ? parseInt(elIndex.value) : 2;
      const k = parseInt(document.getElementById('cf-radicand').value);
      const outDiv = document.getElementById('cf-output');
      outDiv.classList.remove('hidden');

      if (isNaN(n) || n < 2 || isNaN(k) || k < 2) {
        outDiv.innerHTML = `<div class="text-red-600 dark:text-red-400 font-medium text-sm">n &ge; 2 e K &ge; 2.</div>`;
        return;
      }

      // verifica se a raiz é exata
      const exactRoot = Math.round(Math.pow(k, 1 / n));
      if (Math.pow(exactRoot, n) === k) {
        let raizTex = n === 2 ? `\\sqrt{${k}}` : `\\sqrt[${n}]{${k}}`;
        outDiv.innerHTML = `<div class="text-emerald-700 dark:text-emerald-400 font-medium text-sm">\\(${raizTex} = ${exactRoot}\\) &in; \\(\\mathbb{Z}\\) &rarr; Fração Contínua: [${exactRoot}].</div>`;
        if (window.renderMathInElement) renderMathInElement(outDiv);
        return;
      }

      let html = '';

      // CASO N = 2: Irracionais quadráticos
      if (n === 2) {
        let m0 = Math.floor(Math.sqrt(k));
        let m = 0, d = 1, a = m0;
        const a0 = m0, periodo = [];
        
        let stepCount = 0;
        while (stepCount < 100) {
          m = d * a - m;
          d = Math.floor((k - m * m) / d);
          a = Math.floor((m0 + m) / d);
          periodo.push(a);
          stepCount++;
          if (a === 2 * a0) break; // Encontrou o ciclo
        }

        let p_ant = 1, p_cur = a0, q_ant = 0, q_cur = 1;
        const convergentes = [`\\frac{${p_cur}}{${q_cur}} = ${p_cur}`];

        for (let i = 0; i < Math.min(periodo.length, 6); i++) {
          const coef = periodo[i];
          let p_next = coef * p_cur + p_ant, q_next = coef * q_cur + q_ant;
          p_ant = p_cur; p_cur = p_next;
          q_ant = q_cur; q_cur = q_next;
          convergentes.push(`\\frac{${p_cur}}{${q_cur}} \\approx ${(p_cur / q_cur).toFixed(6)}`);
        }

        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('cf_res_title') || 'Expansão em Fração Contínua Periódica'}</h3>
            <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold px-3 py-1 rounded text-xs">${t('cf_badge') || 'Irracional Quadrático'}</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div class="math-step notranslate overflow-x-auto pb-2">\\(\\sqrt{${k}} = [${a0}; \\overline{${periodo.join(', ')}}]\\)</div>
            <p>${t('cf_lagrange')}</p>
            <p><strong>${t('cf_convergents_lbl') || '2. Melhores Aproximações Racionais (Convergentes):'}</strong></p>
            <div class="p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded font-mono text-xs overflow-x-auto whitespace-nowrap">
              ${convergentes.map((c, idx) => `<div><strong>C_${idx}:</strong> \\(${c}\\)</div>`).join('')}
            </div>
          </div>
        `;
      } 
      // caso N > 2: irracionais de grau maior
      else {
        let val = Math.pow(k, 1/n);
        let a_n = Math.floor(val);
        let x_n = val - a_n;
        const terms = [a_n];
        
        let stepCount = 0;
        // limita a 15 termos
        while (x_n > 1e-10 && stepCount < 15) {
          let inverted = 1 / x_n;
          a_n = Math.floor(inverted);
          terms.push(a_n);
          x_n = inverted - a_n;
          stepCount++;
        }

        let p_ant = 1, p_cur = terms[0], q_ant = 0, q_cur = 1;
        const convergentes = [`\\frac{${p_cur}}{${q_cur}} = ${p_cur}`];
        for (let i = 1; i < Math.min(terms.length, 7); i++) {
          const coef = terms[i];
          let p_next = coef * p_cur + p_ant, q_next = coef * q_cur + q_ant;
          p_ant = p_cur; p_cur = p_next;
          q_ant = q_cur; q_cur = q_next;
          convergentes.push(`\\frac{${p_cur}}{${q_cur}} \\approx ${(p_cur / q_cur).toFixed(6)}`);
        }

        html = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">Expansão em Fração Contínua (Aperiódica)</h3>
            <span class="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-semibold px-3 py-1 rounded text-xs">Irracional de Grau ${n}</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div class="math-step notranslate overflow-x-auto pb-2">\\(\\sqrt[${n}]{${k}} \\approx [${terms.join('; ')}...]\\)</div>
            <p><strong>Diferença Fundamental (Teorema de Lagrange):</strong> Ao contrário das raízes quadradas (que geram ciclos periódicos perfeitos e repetitivos), os irracionais algébricos de grau maior que 2 não possuem repetição. Suas frações contínuas são estritamente <strong>aperiódicas e infinitas</strong>, e os padrões de distribuição desses números ainda são objeto de intenso estudo na Matemática moderna.</p>
            <p><strong>${t('cf_convergents_lbl') || '2. Melhores Aproximações Racionais (Convergentes):'}</strong></p>
            <div class="p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded font-mono text-xs overflow-x-auto whitespace-nowrap">
              ${convergentes.map((c, idx) => `<div><strong>C_${idx}:</strong> \\(${c}\\)</div>`).join('')}
            </div>
          </div>
        `;
      }

      outDiv.innerHTML = html;
      if (window.renderMathInElement) renderMathInElement(outDiv);
    }

    // MOTOR: FRAÇÕES CONTÍNUAS 
    function inserirNoExpr(texto) {
      const input = document.getElementById('cf-expr-input');
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const currentVal = input.value;

      input.value = currentVal.substring(0, start) + texto + currentVal.substring(end);

      input.focus();
      input.selectionStart = input.selectionEnd = start + texto.length;
    }

    function executarFracaoExpressao() {
      let expr = document.getElementById('cf-expr-input').value;
      const outDiv = document.getElementById('cf-expr-output');
      outDiv.classList.remove('hidden');

      try {
        if (!expr.trim()) throw new Error();

        // aciona o tradutor antes de repassar ao motor
        expr = sanitizarSintaxeMatematica(expr);

        const valText = nerdamer(expr).evaluate().text('decimals');
        const val = parseFloat(valText);

        if (isNaN(val) || !isFinite(val)) throw new Error();

        let a_n = Math.floor(val);
        let x_n = val - a_n;
        const periodo = [a_n];

        let stepCount = 0;
        while (x_n > 1e-10 && stepCount < 20) {
          let inverted = 1 / x_n;
          a_n = Math.floor(inverted);
          periodo.push(a_n);
          x_n = inverted - a_n;
          stepCount++;
        }

        let p_ant = 1, p_cur = periodo[0], q_ant = 0, q_cur = 1;
        const convergentes = [`\\frac{${p_cur}}{${q_cur}} = ${p_cur}`];

        for (let i = 1; i < periodo.length; i++) {
          const coef = periodo[i];
          let p_next = coef * p_cur + p_ant;
          let q_next = coef * q_cur + q_ant;
          p_ant = p_cur; p_cur = p_next;
          q_ant = q_cur; q_cur = q_next;
          convergentes.push(`\\frac{${p_cur}}{${q_cur}} \\approx ${(p_cur / q_cur).toFixed(8)}`);
        }

        const exprTex = formatarRaizesLaTeX(nerdamer(expr).toTeX());
        outDiv.innerHTML = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex flex-wrap gap-2 items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">Aproximações Racionais para \\(${exprTex}\\)</h3>
            <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold px-3 py-1 rounded text-xs">Valor: ${val.toFixed(8)}...</span>
          </div>
          <div class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <div class="math-step notranslate overflow-x-auto pb-2">\\(${exprTex} \\approx [${periodo.join('; ')}]\\)</div>
            <div class="p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded font-mono text-xs overflow-x-auto whitespace-nowrap">
              ${convergentes.map((c, idx) => `<div class="mb-1"><strong>C_${idx}:</strong> \\(${c}\\)</div>`).join('')}
            </div>
          </div>
        `;
        renderMathInElement(outDiv);
      } catch (e) {
        outDiv.innerHTML = `<div class="text-red-600 dark:text-red-400 font-medium text-sm">${t('err_invalid_expr')}</div>`;
      }
    }

    function enviarParaAba2() {
      let expr = document.getElementById('cf-expr-input').value.trim();

      if (!expr) {
        alert("Digite uma expressão primeiro!");
        return;
      }

      // depura a expressão usando a mesma tradução
      expr = sanitizarSintaxeMatematica(expr);

      try {
        nerdamer(expr);

        document.getElementById('poly-input').value = expr;
        switchTab('solver');

        setTimeout(() => {
          const polyInputDiv = document.getElementById('poly-input').closest('.flex-grow');
          polyInputDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

          polyInputDiv.classList.add('ring-4', 'ring-emerald-400', 'transition-all', 'rounded');
          setTimeout(() => polyInputDiv.classList.remove('ring-4', 'ring-emerald-400', 'rounded'), 1000);

          resolverPolinomio();
        }, 300);

      } catch (e) {
        alert("Erro algébrico. Certifique-se de que a expressão matemática está escrita corretamente.");
      }
    }

    // TRADUTOR DE SINTAXE E SÍMBOLOS (PT -> EN)
    function sanitizarSintaxeMatematica(expr) {
      let limpa = expr.toLowerCase();

      // força multiplicação explícita
      limpa = limpa.replace(/\)\(/g, ')*(');
      limpa = limpa.replace(/(\d)([a-z\(])/g, '$1*$2');

      // Normaliza expoentes sobrescritos (x², x³)
      limpa = limpa.replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4').replace(/⁵/g, '^5')
                   .replace(/⁶/g, '^6').replace(/⁷/g, '^7').replace(/⁸/g, '^8').replace(/⁹/g, '^9').replace(/⁰/g, '^0');
      
      // Tradutor de Constantes
      limpa = limpa.replace(/π/g, 'pi');
      limpa = limpa.replace(/φ/g, '((1+sqrt(5))/2)');
      
      // Tradutor de Raízes
      limpa = limpa.replace(/√\(([^)]+)\)/g, 'sqrt($1)');
      limpa = limpa.replace(/√([0-9a-z.]+)/g, 'sqrt($1)');
      
      limpa = limpa.replace(/∛\(([^)]+)\)/g, '($1)^(1/3)');
      limpa = limpa.replace(/∛([0-9a-z.]+)/g, '($1)^(1/3)');
      
      limpa = limpa.replace(/∜\(([^)]+)\)/g, '($1)^(1/4)');
      limpa = limpa.replace(/∜([0-9a-z.]+)/g, '($1)^(1/4)');

      // Funções Trigonométricas (PT -> EN)
      limpa = limpa.replace(/\bseno\b/g, 'sin');
      limpa = limpa.replace(/\bcoseno\b/g, 'cos');
      limpa = limpa.replace(/\bcosseno\b/g, 'cos');
      limpa = limpa.replace(/\btangente\b/g, 'tan');
      limpa = limpa.replace(/\bsecante\b/g, 'sec');
      limpa = limpa.replace(/\bcosecante\b/g, 'csc');
      limpa = limpa.replace(/\bcossecante\b/g, 'csc');
      limpa = limpa.replace(/\bcotangente\b/g, 'cot');

      // Funções inversas (PT -> EN)
      limpa = limpa.replace(/\barcsen\b/g, 'asin');
      limpa = limpa.replace(/\barcseno\b/g, 'asin');
      limpa = limpa.replace(/\barccos\b/g, 'acos');
      limpa = limpa.replace(/\barctg\b/g, 'atan');
      limpa = limpa.replace(/\barctan\b/g, 'atan');
      
      // recíprocas e normais (PT -> EN)
      limpa = limpa.replace(/\bcossec\b/g, 'csc');
      limpa = limpa.replace(/\bcosec\b/g, 'csc');
      limpa = limpa.replace(/\bcotg\b/g, 'cot');
      limpa = limpa.replace(/\btg\b/g, 'tan');
      limpa = limpa.replace(/\bsen\b/g, 'sin');
      limpa = limpa.replace(/\bseno\b/g, 'sin');

      // funções logarítmicas (PT -> EN)
      limpa = limpa.replace(/\bln\b/g, 'log');
      limpa = limpa.replace(/\blogaritmo\b/g, 'log');

      // conversor de graus para radianos
      limpa = limpa.replace(/\b(sin|cos|tan|cot|sec|csc|asin|acos|atan)\(([^a-zA-Z]+)\)/g, '$1(($2)*pi/180)');
      
      return limpa;
    }

    // o analisador potente mwahaahha
    function analisarExpressaoSimbolica(exprStr, outDiv) {
      try {
        let funcStr = sanitizarSintaxeMatematica(exprStr);

        if (funcStr.includes('=')) {
          const parts = funcStr.split('=');
          funcStr = `(${parts[0]}) - (${parts[1]})`;
        }

        // constrói o objeto primário via nerdamer e extrai a variável principal
        const f = nerdamer(funcStr);
        const vars = f.variables();
        const mainVar = vars.length > 0 ? vars[0] : 'x'; 

        const texExpr = formatarRaizesLaTeX(f.toTeX());
        
        // cria a função de avaliação PRIMEIRO pois o integrador numérico precisará dela
        const f_eval = f.buildFunction([mainVar]);

        // Calcula derivada mecanicamente (seguro, rápido e pratico)
        const diffObj = nerdamer(`diff(${funcStr}, ${mainVar})`);
        const derivadaTex = formatarRaizesLaTeX(diffObj.toTeX());

        let intObj = null;
        let integralTex = '';
        let integralAltHtml = '';

        // CAS FREEZE PROTECTOR + INTEGRADOR NUMÉRICO (muito importante, nao mexer)
        const isDangerousCAS = /(log|ln|sin|cos|tan|csc|sec|cot|asin|acos|atan)\s*\([^)]*(log|ln|sin|cos|tan|csc|sec|cot|asin|acos|atan)/i.test(funcStr);

        // função de integração numérica
        const integradorNumericoFallback = () => {
            return (x) => {
                const steps = 150; 
                let start = 1e-5; // evita o zero absoluto (útil para desviar de assíntotas de logs)
                if (Math.abs(x) < 1e-5) return 0;
                
                let dx = (x - start) / steps;
                let sum = 0;
                for (let i = 0; i < steps; i++) {
                    let t = start + (i + 0.5) * dx;
                    let y = f_eval(t);
                    if (!isNaN(y) && isFinite(y)) {
                        sum += y * dx;
                    }
                }
                return sum;
            };
        };

        // 1. CONSULTA AO DICIONÁRIO / CACHE
        const resultadoCache = resolverIntegralComCache(funcStr, mainVar);

        if (resultadoCache.sucesso) {
            integralTex = resultadoCache.latex;
            
            if (!resultadoCache.suportada) {
                // Se não tiver primitiva elementar, mostra o TeX teórico, mas usa o fallback numérico para traçar o gráfico
                intObj = { 
                    buildFunction: () => integradorNumericoFallback(), 
                    text: () => '', 
                    variables: () => [] 
                };
            } else {
                // Se é suportada (ex: cos(log(x))), tenta extrair a função avaliável do motor
                try {
                    intObj = nerdamer(`integrate(${funcStr}, ${mainVar})`);
                } catch(e) {
                    intObj = { buildFunction: () => integradorNumericoFallback(), text: () => '', variables: () => [] };
                }
            }
        } 

        // 2. FALLBACK PARA O FLUXO ORIGINAL (Nerdamer)
        else {
            if (isDangerousCAS) {
                integralTex = '\\text{Integral elementar não suportada}';
                intObj = { 
                    buildFunction: () => integradorNumericoFallback(), 
                    text: () => '', 
                    variables: () => [] 
                };
            } else {
                try {
                    intObj = nerdamer(`integrate(${funcStr}, ${mainVar})`);
                    integralTex = formatarRaizesLaTeX(intObj.toTeX());
                } catch(e) {
                    integralTex = '\\text{Integral elementar não suportada}';
                    intObj = { 
                        buildFunction: () => integradorNumericoFallback(), 
                        text: () => '', 
                        variables: () => [] 
                    };
                }
            }
        }

        // GERADOR DE FORMAS ALTERNATIVAS 3.0 (dessa vez vaiKKKKKK)
        const gerarFormasAlternativas = (baseTex, nerdObj, colorName, sufixo = '') => {
            if (nerdObj.text() === '') return '';
            
            let altForms = new Set();
            let rawText = nerdObj.text();
            
            const testarAcao = (acao) => {
                try {
                    let texAlt = formatarRaizesLaTeX(nerdamer(`${acao}(${rawText})`).toTeX());
                    if (texAlt !== baseTex && texAlt !== '' && texAlt !== '0^1' && !/\\d{6,}/.test(texAlt)) {
                        altForms.add(texAlt);
                    }
                } catch(e) {}
            };

            testarAcao('expand');
            testarAcao('factor');
            
            // Só simplifica expressões seguras com variáveis
            if (nerdObj.variables().length > 0 && !isDangerousCAS) {
                testarAcao('simplify');
            }
            
            if (altForms.size === 0) return '';
            
            let lis = Array.from(altForms).map(tex => 
                `<li class="math-step notranslate text-sm py-1 border-b border-${colorName}-100 dark:border-${colorName}-800/30 last:border-0">\\(${tex}${sufixo}\\)</li>`
            ).join('');
            
            return `
              <div class="mt-4 pt-3 border-t border-${colorName}-200 dark:border-${colorName}-800/50">
                <span class="text-[10px] font-bold text-${colorName}-500 dark:text-${colorName}-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                  Formas Alternativas:
                </span>
                <ul class="space-y-1">
                  ${lis}
                </ul>
              </div>
            `;
        };

        const derivadaAltHtml = gerarFormasAlternativas(derivadaTex, diffObj, 'blue');
        if (!isDangerousCAS) {
            integralAltHtml = gerarFormasAlternativas(integralTex, intObj, 'purple', ' + C');
        }

        // Avisa ao Javascript quem é a variável da função
        const df_eval = diffObj.buildFunction([mainVar]);
        const int_eval = intObj.buildFunction([mainVar]);

        // Utiliza o motor universal enviando as legendas dinâmicas e a variável do eixo
        const svgGrafico = gerarSvgFuncaoGeral([
          { nerdObj: f, eval: f_eval, color: '#10b981', label: `f(${mainVar})` },
          { nerdObj: diffObj, eval: df_eval, color: '#3b82f6', label: `f'(${mainVar})` },
          { nerdObj: intObj, eval: int_eval, color: '#a855f7', label: `\\int f(${mainVar}) d${mainVar}`, isIntegral: true }
        ], mainVar);

        outDiv.innerHTML = `
          <div class="border-b border-slate-200 dark:border-slate-700 pb-3 mb-4 flex flex-wrap gap-2 items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg">${t('hybrid_title')}</h3>
            <span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold px-3 py-1 rounded text-xs">${t('hybrid_badge')}</span>
          </div>
          <div class="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <p>${t('hybrid_desc')}</p>
            <div class="p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded">
              <span class="font-semibold text-slate-700 dark:text-slate-300">${t('hybrid_func_lbl')}</span>
              <div class="math-step notranslate mb-4">\\(f(${mainVar}) = ${texExpr}\\)</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div class="p-4 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/40 rounded shadow-sm">
                  <span class="font-semibold text-blue-600 dark:text-blue-400">
                    ${t('hybrid_deriv_lbl')} \\(\\frac{d}{d${mainVar}}f(${mainVar})\\):
                  </span>
                  <div class="math-step notranslate mt-2 overflow-x-auto text-blue-900 dark:text-blue-200">\\(${derivadaTex}\\)</div>
                  ${derivadaAltHtml}
                </div>
                <div class="p-4 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900/40 rounded shadow-sm">
                  <span class="font-semibold text-purple-600 dark:text-purple-400">
                    ${t('hybrid_int_lbl')} \\(\\int f(${mainVar})\\,d${mainVar}\\):
                  </span>
                  <div class="math-step notranslate mt-2 overflow-x-auto text-purple-900 dark:text-purple-200">\\(${integralTex}\\)</div>
                  ${integralAltHtml}
                </div>
              </div>
            </div>
            ${svgGrafico}
          </div>
        `;
        
        if (window.renderMathInElement) {
          setTimeout(() => renderMathInElement(outDiv), 10);
        }
      } catch (e) {
        outDiv.innerHTML = `<div class="text-red-600 dark:text-red-400 font-medium text-sm">${t('hybrid_error')}</div>`;
      }
    }
    // Converte expoente fracionario em raiz n-ésima para LaTeX
    function formatarRaizesLaTeX(texStr) {
      if (!texStr) return texStr;
      
      let prevTex;
      do {
        prevTex = texStr;
        
        // Padrão 1: Parênteses dimensionados
        texStr = texStr.replace(/\\left\((.*?)\\right\)\^\{\\frac\{1\}\{([0-9]+)\}\}/g, '\\sqrt[$2]{$1}');
        texStr = texStr.replace(/\\left\((.*?)\\right\)\^{\\frac\{1\}\{([0-9]+)\}}/g, '\\sqrt[$2]{$1}');
        texStr = texStr.replace(/\\left\((.*?)\\right\)\^\{1\/([0-9]+)\}/g, '\\sqrt[$2]{$1}');
        
        // Padrão 2: Parênteses simples
        texStr = texStr.replace(/\((.*?)\)\^\{\\frac\{1\}\{([0-9]+)\}\}/g, '\\sqrt[$2]{$1}');
        texStr = texStr.replace(/\((.*?)\)\^{\\frac\{1\}\{([0-9]+)\}}/g, '\\sqrt[$2]{$1}');
        texStr = texStr.replace(/\((.*?)\)\^\{1\/([0-9]+)\}/g, '\\sqrt[$2]{$1}');
        
        // Padrão 3: Base com chaves
        texStr = texStr.replace(/\{([^{}]+)\}\^\{\\frac\{1\}\{([0-9]+)\}\}/g, '\\sqrt[$2]{$1}');
        texStr = texStr.replace(/\{([^{}]+)\}\^{\\frac\{1\}\{([0-9]+)\}}/g, '\\sqrt[$2]{$1}');
        texStr = texStr.replace(/\{([^{}]+)\}\^\{1\/([0-9]+)\}/g, '\\sqrt[$2]{$1}');
        
        // Padrão 4: Base simples
        texStr = texStr.replace(/([a-zA-Z0-9_]+)\^\{\\frac\{1\}\{([0-9]+)\}\}/g, '\\sqrt[$2]{$1}');
        texStr = texStr.replace(/([a-zA-Z0-9_]+)\^{\\frac\{1\}\{([0-9]+)\}}/g, '\\sqrt[$2]{$1}');
        texStr = texStr.replace(/([a-zA-Z0-9_]+)\^\{1\/([0-9]+)\}/g, '\\sqrt[$2]{$1}');
        
      } while (texStr !== prevTex); // Repete o ciclo para processar raízes aninhadas tipo raiz de raiz, log de log etc
      
      // Se uma raiz quadrada vier marcada com [2], oculta o índice para ficar bonitão
      texStr = texStr.replace(/\\sqrt\[2\]\{(.*?)\}/g, '\\sqrt{$1}');
      
      return texStr;
    }

    // Inicialização ao carregar e blablabla
    window.addEventListener('DOMContentLoaded', () => {
      executarTFA();
      resolverPolinomio();
      analisarTrig();
    });