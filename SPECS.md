SPECS.md
# SPECS — Especificação Técnica

## 1. Tecnologias
- HTML5: estrutura e conteúdo.
- CSS3: layout, cores, animações e responsividade.
- JavaScript: geração da grade, seleção, pontuação
  e controle do tempo.

## 2. Arquitetura
O projeto utiliza arquivos separados e funciona localmente,
sem servidor, banco de dados ou dependências externas.

## 3. Componentes
- Cabeçalho com título e instruções.
- Painel com pontuação, tempo e progresso.
- Grade interativa de letras.
- Lista de palavras-alvo.
- Área de mensagens e botão de reinício.

## 4. Lógica do jogo
1. Selecionar palavras de um tema.
2. Posicionar as palavras em uma grade 10 × 10.
3. Preencher espaços vazios com letras aleatórias.
4. Permitir selecionar duas letras como início e fim.
5. Verificar se a seleção forma uma palavra válida.
6. Marcar palavras encontradas e atualizar a pontuação.
7. Encerrar a partida quando todas forem encontradas.

## 5. Regras
- As palavras podem estar na horizontal, vertical
  ou diagonal, em ambos os sentidos.
- Cada palavra encontrada vale 10 pontos.
- Uma palavra já encontrada não gera pontos novamente.
- O cronômetro começa na primeira seleção.
- A partida termina quando todas as palavras forem encontradas.

## 6. Acessibilidade e compatibilidade
Usar contraste adequado, foco visível, botões com
nomes acessíveis e layout adaptável. A seleção é feita
clicando ou tocando na letra inicial e depois na final.

## 7. Testes
Verificar geração da grade, seleção válida e inválida,
pontuação, cronômetro, vitória, reinício e uso em celular.