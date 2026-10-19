## 📝 Histórico de Versões

## [1.1.6]
- **Novo:** Transformação do projeto em Progressive Web App (PWA) com suporte offline e cache
- **Novo:** Adição de favicon personalizado para o laboratório
- **Novo:** Suporte a ângulos maiores que 360° na aba "Funções trigonométricas"
- **Novo:** Suporte a base $e$ e logaritmo natural ($\ln$) na aba "Logaritmos"
- **Melhoria:** Refatoração estrutural massiva: separação do código monolítico em múltiplos arquivos modulares (arquivos JS, HTML e JSON organizados)

## [1.1.5]
- **Novo:** Malha quadriculada de fundo nos gráficos para suporte à análise visual
- **Novo:** Rastreador de cursor e efeito mira interativo sobre as curvas dos gráficos
- **Novo:** Modo Foco (*Focus Mode*) para visualização imersiva dos gráficos
- **Novo:** Suporte a zoom interativo nos gráficos
- **Novo:** Funcionalidade para baixar o gráfico gerado diretamente em formato PNG
- **Melhoria:** Otimização profunda na rotina de geração e traçado dos gráficos
- **Melhoria:** Animações fluidas na plotagem dos gráficos
- **Correção:** Correção de bugs no traçado e estabilização de assíntotas para evitar falhas visuais
- **Correção:** Ajustes na exibição dos resultados decimais e fracionários das aproximações
- **Correção:** Adição do botão de reset rápido para o estado inicial dos gráficos

## [1.1.4]
* **Melhoria:** Suporte a variáveis diferentes de x
* **Melhoria:** Gráfico do modo de análise faz tracejado para valores complexos
* **Correção:** Integrais elementares não quebram mais o algoritmo

## [1.1.3]
* **Novo:** Suporte a texto sobrescrito na aba "Solucionador de polinômios"
* **Novo:** Gráfico interativo no modo de Análise na aba "Solucionador de polinômios"
* **Novo:** Circulo trigonométrico na aba "Funções trigonométricas"
* **Novo:** Suporte a secante, cossecante e cotangente na aba "Funções trigonométricas"
* **Novo:** Suporte a ângulos negativos na aba "Funções Trigonométricas"
* **Novo:** Suporte a raízes n-ésimas na aba "Frações contínuas"
* **Novo:** Suporte a input de símbolos na aba "Frações contínuas"
* **Correção:** Bug crítico que não identificava quociente de polinômios na aba "Solucionador de polinômios"
* **Correção:** Mensagem "ângulo ∉ Q" que não estava aparecendo em alguns ângulos da aba "Funções trigonométricas"

## [1.1.2]
* **Novo:** Aba dedicada aos logaritimos
* **Novo:** Suporte a valores em radianos para ângulos na aba "Funções Trigonométricas"
* **Novo:** Retorno de valores algébricos exatos para determinados ângulos
* **Correção:** Bug crítico que travava a aba "Solucionador de polinômios"

## [1.1.1]
* **Novo:** Suporte a funções logarítmicas na aba "Solucionador de polinômios"
* **Novo:** A aba "Solucionador de polinômios" recebeu suporte a funções trigonométricas
* **Novo:** As expressões geradas no bloco "Aproximações fracionárias de constantes" podem ser enviadas para a aba "Solucionador de polinômios"
* **Correção:** Correção de bug de interface no construtor de polinômios na aba "Solucionador de polinômios" em dispositivos móveis

## [1.1.0]
* **Novo:** Construtor de polinômios na aba "Solucionador de polinômios"
* **Novo:** Seletor de tema claro e escuro
* **Novo:** Teclado para facilitar digitação na caixa Aproximações Fracionárias de Constantes na aba "Frações contínuas"
* **Novo:** Aproximações fracionárias de operações com números irracionais na aba "Frações contínuas"
* **Melhoria:** Tradução das abas "Solucionador de polinômios" e "Frações contínuas"
* **Correção:** Bug de interface na aba "Frações contínuas", onde alguns elementos vazavam da tela

## [1.0.9]
* **Novo:** Suporte a igualdade de polinômios na aba "Solucionador de polinômios"
* **Novo:** Suporte a o produto de polinômios na aba "Solucionador de polinômios"
* **Novo:** Suporte ao Quociente de polinômios na aba "Solucionador de polinômios"
* **Novo:** Resolução da derivada de polinômios na aba "Solucionador de polinômios"
* **Novo:** Resolução da integral de polinômios na aba "Solucionador de polinômios"
* **Novo:** Aproximações Fracionárias de Constantes na aba "Frações contínuas"
* **Melhoria:** Adição de marcação no gráfico e plano para evidenciar raízes da aba "Solucionador de polinômios"

## [1.0.8]
* **Novo:** Plano complexo adicionado na aba "Solucionador de polinômios"
* **Melhoria:** Revisão completa da tradução da aba "Solucionador de polinômios"
* **Correção:** Resolução de bug crítico na aba "Solucionador de polinômios", onde o motor matemático não conseguia descobrir algumas raízes

## [1.0.7]
* **Melhoria:** Aprimoramento do recurso de tradução
* **Correção:** Resolução de pequenos bugs de interface

## [1.0.6]
* **Novo:** Valores algébricos adicionados as raízes na aba "Solucionador de polinômios"
* **Novo:** Valores da soma de raízes vêm em decimal e na forma algébrica na aba "Solucionador de polinômios"
* **Novo:** Valores do produto de raízes vêm em decimal e na forma algébrica na aba "Solucionador de polinômios"
* **Melhoria:** Exibição de candidatos ao TRR quando há muitos elementos na aba "Solucionador de polinômios"

## [1.0.5]
* **Novo:** Adição de suporte as raízes complexas na aba "Solucionador de polinômios"
* **Novo:** Adição do recurso de somar raízes na aba "Solucionador de polinômios"
* **Novo:** Adição do recurso de multiplicar raízes na aba "Solucionador de polinômios"
* **Novo:** Análise geométrica de parábolas na aba "Solucionador de polinômios"
* **Melhoria:** Aprimoramento do recurso de geração de gráficos na aba "Solucionador de polinômios"
* **Correção:** Resolução de erro na resolução de monômios x^n = 0 

### [1.0.4]
* **Novo:** Adição de recurso experimental de geração de gráficos na aba "Solucionador de polinômios".

### [1.0.3]
* **Melhoria:** Revisão geral e aprimoramento das traduções nos quatro idiomas suportados.
* **Correção:** Resolução de pequenos bugs de interface e funcionamento.

### [1.0.2]
* **Novo:** Implementação de suporte completo a quatro idiomas (Português, Inglês, Espanhol e Francês).

### [1.0.1]
* **Novo:** Aba de Funções Trigonométricas (cálculo de ângulos e verificação de irracionalidade).
* **Novo:** Aba do Critério de Irredutibilidade de Eisenstein (decomposição + TRR).
* **Novo:** Aba de Reconhecimento Construtivo via Frações Contínuas Simples (aproximações racionais e decimais).
* **Novo:** [Insira aqui a descrição da quarta aba mencionada no texto original].

### [1.0.0] - Lançamento Inicial
* Abas fundamentais implementadas (Teorema Fundamental da Aritmética, TRR, Tabela de Notáveis e História).
