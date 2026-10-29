const TAMANHO = 10;
const PALAVRAS = [
  "PLANETA",
  "FLORESTA",
  "GOLFINHO",
  "FUTEBOL",
  "ESTRELA",
  "ESCOLA",
  "MUSICA",
  "NATUREZA"
];

const gradeEl = document.querySelector("#grade");
const listaEl = document.querySelector("#lista-palavras");
const mensagemEl = document.querySelector("#mensagem");
const pontuacaoEl = document.querySelector("#pontuacao");
const tempoEl = document.querySelector("#tempo");
const progressoEl = document.querySelector("#progresso");
const contadorEl = document.querySelector("#contador");
const reiniciarBtn = document.querySelector("#reiniciar");

let grade = [];
let posicoes = new Map();
let encontradas = new Set();
let inicio = null;
let tempoInicial = null;
let intervalo = null;
let finalizado = false;

const DIRECOES = [
  [0, 1], [1, 0], [1, 1], [1, -1],
  [0, -1], [-1, 0], [-1, -1], [-1, 1]
];

function chave(linha, coluna) {
  return `${linha},${coluna}`;
}

function embaralhar(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

function dentro(linha, coluna) {
  return linha >= 0 && linha < TAMANHO &&
         coluna >= 0 && coluna < TAMANHO;
}

function gerarGrade() {
  grade = Array.from(
    { length: TAMANHO },
    () => Array(TAMANHO).fill("")
  );

  posicoes = new Map();

  for (const palavra of embaralhar(PALAVRAS)) {
    let colocada = false;

    for (let tentativa = 0; tentativa < 1000 && !colocada; tentativa++) {
      const [dl, dc] =
        DIRECOES[Math.floor(Math.random() * DIRECOES.length)];

      const linha = Math.floor(Math.random() * TAMANHO);
      const coluna = Math.floor(Math.random() * TAMANHO);

      const caminho = Array.from(
        { length: palavra.length },
        (_, i) => [linha + dl * i, coluna + dc * i]
      );

      const cabe = caminho.every(([l, c]) =>
        dentro(l, c) &&
        (!grade[l][c] || grade[l][c] === palavra[
          caminho.findIndex(([pl, pc]) => pl === l && pc === c)
        ])
      );

      if (!cabe) continue;

      // Confere sobreposições sem modificar a grade.
      const compativel = caminho.every(([l, c], i) =>
        !grade[l][c] || grade[l][c] === palavra[i]
      );

      if (!compativel) continue;

      const celulas = [];

      caminho.forEach(([l, c], i) => {
        grade[l][c] = palavra[i];
        celulas.push(chave(l, c));
      });

      posicoes.set(palavra, celulas);
      colocada = true;
    }

    if (!colocada) {
      throw new Error(`Não foi possível posicionar ${palavra}.`);
    }
  }

  // Preenche as casas vazias com letras aleatórias.
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  grade = grade.map(linha => linha.map(letra =>
    letra || letras[Math.floor(Math.random() * letras.length)]
  ));
}

function iniciarCronometro() {
  if (tempoInicial !== null) return;

  tempoInicial = Date.now();

  intervalo = setInterval(() => {
    const segundos = Math.floor((Date.now() - tempoInicial) / 1000);
    const minutos = String(Math.floor(segundos / 60)).padStart(2, "0");
    const resto = String(segundos % 60).padStart(2, "0");

    tempoEl.textContent = `${minutos}:${resto}`;
  }, 250);
}

function desenharGrade() {
  gradeEl.replaceChildren();

  grade.forEach((linha, l) => {
    linha.forEach((letra, c) => {
      const botao = document.createElement("button");

      botao.type = "button";
      botao.className = "letra";
      botao.textContent = letra;
      botao.dataset.linha = l;
      botao.dataset.coluna = c;
      botao.setAttribute("aria-label", `Linha ${l + 1}, coluna ${c + 1}, letra ${letra}`);
      botao.addEventListener("click", () => selecionar(l, c));

      gradeEl.appendChild(botao);
    });
  });
}

function desenharLista() {
  listaEl.replaceChildren();

  PALAVRAS.forEach(palavra => {
    const item = document.createElement("li");
    item.textContent = palavra;
    item.id = `palavra-${palavra}`;
    listaEl.appendChild(item);
  });
}

function selecionar(linha, coluna) {
  if (finalizado) return;

  iniciarCronometro();

  if (!inicio) {
    inicio = [linha, coluna];
    atualizarSelecao();
    mensagemEl.textContent = "Agora selecione a última letra da palavra.";
    return;
  }

  const fim = [linha, coluna];
  const [l1, c1] = inicio;
  const [l2, c2] = fim;

  const dl = Math.sign(l2 - l1);
  const dc = Math.sign(c2 - c1);

  const alinhado =
    l1 === l2 || c1 === c2 ||
    Math.abs(l2 - l1) === Math.abs(c2 - c1);

  if (!alinhado) {
    inicio = fim;
    atualizarSelecao();
    mensagemEl.textContent = "Escolha uma linha reta, diagonal ou vertical.";
    return;
  }

  const caminho = [];
  let l = l1;
  let c = c1;

  while (true) {
    caminho.push(chave(l, c));

    if (l === l2 && c === c2) break;

    l += dl;
    c += dc;
  }

  const tentativa = caminho.map(pos => {
    const [pl, pc] = pos.split(",").map(Number);
    return grade[pl][pc];
  }).join("");

  const palavra = PALAVRAS.find(p =>
    p === tentativa || p === [...tentativa].reverse().join("")
  );

  if (palavra && !encontradas.has(palavra)) {
    encontradas.add(palavra);

    document.querySelector(`#palavra-${palavra}`)
      .classList.add("concluida");

    caminho.forEach(pos => {
      const [pl, pc] = pos.split(",").map(Number);
      const celula = gradeEl.querySelector(
        `[data-linha="${pl}"][data-coluna="${pc}"]`
      );
      celula.classList.add("encontrada");
    });

    pontuacaoEl.textContent = encontradas.size * 10;
    progressoEl.textContent = `${encontradas.size}/${PALAVRAS.length}`;
    contadorEl.textContent = `${encontradas.size} de ${PALAVRAS.length}`;

    mensagemEl.textContent = `🎉 Muito bem! Você encontrou ${palavra}!`;
  } else if (encontradas.has(palavra)) {
    mensagemEl.textContent = "Você já encontrou essa palavra!";
  } else {
    mensagemEl.textContent = "Ainda não! Tente outra combinação.";
  }

  inicio = null;
  atualizarSelecao();

  if (encontradas.size === PALAVRAS.length) {
    finalizarJogo();
  }
}

function atualizarSelecao() {
  gradeEl.querySelectorAll(".letra.selecionada").forEach(el => {
    el.classList.remove("selecionada");
  });

  if (!inicio) return;

  const [l, c] = inicio;
  const celula = gradeEl.querySelector(
    `[data-linha="${l}"][data-coluna="${c}"]`
  );

  if (celula && !celula.classList.contains("encontrada")) {
    celula.classList.add("selecionada");
  }
}

function finalizarJogo() {
  finalizado = true;
  clearInterval(intervalo);
  mensagemEl.textContent =
    `🏆 Parabéns! Você encontrou todas as palavras em ${tempoEl.textContent}!`;
  reiniciarBtn.textContent = "🔄 Jogar novamente";
}

function reiniciar() {
  clearInterval(intervalo);

  encontradas = new Set();
  inicio = null;
  tempoInicial = null;
  intervalo = null;
  finalizado = false;

  pontuacaoEl.textContent = "0";
  tempoEl.textContent = "00:00";
  progressoEl.textContent = `0/${PALAVRAS.length}`;
  contadorEl.textContent = `0 de ${PALAVRAS.length}`;
  mensagemEl.textContent = "Encontre sua primeira palavra!";
  reiniciarBtn.textContent = "🔄 Nova partida";

  gerarGrade();
  desenharGrade();
  desenharLista();
}

reiniciarBtn.addEventListener("click", reiniciar);

reiniciar();