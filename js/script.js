// js/script.js

/* 
  PLANEJAMENTO DO SCRIPT (Aula 09)
  - Tema: Portal de Notícias Esportivas - "Arena Diária" (Com mais dados e acessibilidade)
  - Entrada: Array expandido com 8 notícias, termo de busca, filtro ao vivo e alteração de tema de cores.
  - Processamento: Uso de filter, map, reduce, if/else, switch, for...of com acumulador e while.
  - Saída: Renderização via createElement, atualização acessível com aria-live e controle de foco/temas.
*/

// Array expandido com 8 itens (superando o requisito de 5+) e 6 propriedades cada
const noticiasEsporte = [
  {
    id: 1,
    titulo: "Final do campeonato estadual define hoje o grande campeão no estádio lotado",
    modalidade: "Futebol",
    tempoLeitura: 4, 
    visualizacoes: 3420,
    aoVivo: true
  },
  {
    id: 2,
    titulo: "Seleção feminina de vôlei inicia preparação intensa para a liga mundial",
    modalidade: "Vôlei",
    tempoLeitura: 3,
    visualizacoes: 1850,
    aoVivo: false
  },
  {
    id: 3,
    titulo: "Armador brasileiro bate recorde de assistências na rodada da noite da liga",
    modalidade: "Basquete",
    tempoLeitura: 5,
    visualizacoes: 2190,
    aoVivo: true
  },
  {
    id: 4,
    titulo: "Inscrições para a meia-maratona da cidade entram na última semana com vagas limitadas",
    modalidade: "Corrida",
    tempoLeitura: 2,
    visualizacoes: 940,
    aoVivo: false
  },
  {
    id: 5,
    titulo: "Jovem promessa do tênis nacional avança às quartas de final no saibro europeu",
    modalidade: "Tênis",
    tempoLeitura: 4,
    visualizacoes: 1280,
    aoVivo: false
  },
  {
    id: 6,
    titulo: "Clube anuncia pacote de reforços peso-pesado e novo treinador para a temporada",
    modalidade: "Futebol",
    tempoLeitura: 6,
    visualizacoes: 4100,
    aoVivo: true
  },
  {
    id: 7,
    titulo: "Etapa de abertura do circuito de skate street reúne grandes nomes na capital",
    modalidade: "Skate",
    tempoLeitura: 3,
    visualizacoes: 1560,
    aoVivo: true
  },
  {
    id: 8,
    titulo: "Equipe de natação conquista 5 medalhas de ouro em torneio internacional preparatório",
    modalidade: "Natação",
    tempoLeitura: 3,
    visualizacoes: 920,
    aoVivo: false
  }
];

// Seletores do DOM
const gridNoticias = document.getElementById("gridNoticias");
const inputBusca = document.getElementById("inputBusca");
const btnFiltroVivo = document.getElementById("btnFiltroVivo");
const resumoEdicao = document.getElementById("resumoEdicao");
const btnAlternarTema = document.getElementById("btnAlternarTema");

// Estado da aplicação
let apenasAoVivo = false;
let termoBusca = "";

// ----------------------------------------------------
// FUNÇÕES E ESCOPO (Aula 10)
// ----------------------------------------------------

function classificarTempoLeitura(minutos) {
  const tempoNum = Number(minutos); // Coerção explícita
  let classificacao = "";
  
  if (tempoNum <= 2) {
    classificacao = "⚡ Leitura Flash";
  } else if (tempoNum <= 4) {
    classificacao = "⏱️ Matéria Padrão";
  } else {
    classificacao = "📖 Análise Aprofundada";
  }
  return classificacao;
}

function formatarCategoria(modalidade) {
  switch (modalidade.toLowerCase()) {
    case "futebol":
      return "⚽ Futebol";
    case "vôlei":
    case "volei":
      return "🏐 Vôlei";
    case "basquete":
      return "🏀 Basquete";
    case "corrida":
      return "🏃 Corrida";
    case "tênis":
    case "tenis":
      return "🎾 Tênis";
    case "skate":
      return "🛹 Skate";
    case "natação":
    case "natacao":
      return "🏊 Natação";
    default:
      return "🏆 Esporte Geral";
  }
}

function processarEstatisticas(lista) {
  let acumuladorTempo = 0;
  
  // for...of com acumulador
  for (const noticia of lista) {
    acumuladorTempo += Number(noticia.tempoLeitura);
  }

  // while para contagem
  let contadorAoVivo = 0;
  let i = 0;
  while (i < lista.length) {
    if (lista[i].aoVivo) {
      contadorAoVivo++;
    }
    i++;
  }

  return {
    tempoTotal: acumuladorTempo,
    totalAoVivo: contadorAoVivo
  };
}

// ----------------------------------------------------
// RENDERIZAÇÃO E DOM (Aula 11)
// ----------------------------------------------------

function renderizarNoticias() {
  gridNoticias.textContent = "";

  const noticiasFiltradas = noticiasEsporte.filter(noticia => {
    const atendeBusca = noticia.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
                        noticia.modalidade.toLowerCase().includes(termoBusca.toLowerCase());
    const atendeFiltroVivo = apenasAoVivo ? noticia.aoVivo : true;
    return atendeBusca && atendeFiltroVivo;
  });

  if (noticiasFiltradas.length === 0) {
    const aviso = document.createElement("p");
    aviso.textContent = "Nenhuma notícia encontrada com os critérios informados.";
    aviso.style.gridColumn = "1 / -1";
    aviso.style.textAlign = "center";
    aviso.style.padding = "20px";
    gridNoticias.appendChild(aviso);
    
    atualizarResumo(0, 0, 0);
    return;
  }

  noticiasFiltradas.forEach(noticia => {
    const card = document.createElement("article");
    card.classList.add("card-noticia");
    card.setAttribute("tabindex", "0"); // Acessibilidade: card focável por teclado

    const tag = document.createElement("span");
    tag.classList.add("tag-modalidade");
    tag.textContent = formatarCategoria(noticia.modalidade);

    const titulo = document.createElement("h3");
    titulo.textContent = noticia.titulo;

    const detalhes = document.createElement("div");
    detalhes.classList.add("detalhes-noticia");
    
    const spanTempo = document.createElement("span");
    spanTempo.textContent = `${noticia.tempoLeitura} min de leitura (${classificarTempoLeitura(noticia.tempoLeitura)})`;
    
    const spanViews = document.createElement("span");
    spanViews.textContent = `👁️ ${Number(noticia.visualizacoes).toLocaleString('pt-BR')} visualizações`;
    
    detalhes.appendChild(spanTempo);
    detalhes.appendChild(spanViews);

    const btnLido = document.createElement("button");
    btnLido.classList.add("btn-lido");
    btnLido.textContent = "Marcar como Lido";
    btnLido.setAttribute("aria-label", `Marcar notícia '${noticia.titulo}' como lida`);

    card.appendChild(tag);
    card.appendChild(titulo);
    card.appendChild(detalhes);
    card.appendChild(btnLido);

    gridNoticias.appendChild(card);
  });

  const estatisticas = processarEstatisticas(noticiasFiltradas);
  const totalVisualizacoes = noticiasFiltradas.reduce((acc, curr) => acc + Number(curr.visualizacoes), 0);

  atualizarResumo(noticiasFiltradas.length, estatisticas.tempoTotal, totalVisualizacoes);
}

function atualizarResumo(quantidade, tempoTotal, totalViews) {
  resumoEdicao.textContent = `Exibindo ${quantidade} matéria(s) | Tempo total estimado: ${tempoTotal} minutos | Total de visualizações: ${totalViews.toLocaleString('pt-BR')} | ${apenasAoVivo ? 'Filtro Ao Vivo ativo' : 'Todas as edições'}`;
}

// ----------------------------------------------------
// EVENTOS E ACESSIBILIDADE (Aula 12)
// ----------------------------------------------------

// Delegação de eventos na lista
gridNoticias.addEventListener("click", (evento) => {
  const botaoLido = evento.target.closest(".btn-lido");
  if (botaoLido) {
    const card = botaoLido.closest(".card-noticia");
    if (card) {
      card.classList.toggle("lido");
      if (card.classList.contains("lido")) {
        botaoLido.textContent = "Lido ✓";
      } else {
        botaoLido.textContent = "Marcar como Lido";
      }
    }
  }
});

// Busca interativa
inputBusca.addEventListener("input", (evento) => {
  termoBusca = evento.target.value;
  renderizarNoticias();
});

// Botão com aria-pressed
btnFiltroVivo.addEventListener("click", () => {
  apenasAoVivo = !apenasAoVivo;
  btnFiltroVivo.setAttribute("aria-pressed", apenasAoVivo);
  
  if (apenasAoVivo) {
    btnFiltroVivo.textContent = "🔥 Mostrando Apenas Ao Vivo";
  } else {
    btnFiltroVivo.textContent = "🔥 Apenas Ao Vivo";
  }

  renderizarNoticias();
});

// Funcionalidade extra: Alternar tema de cores (acessibilidade visual)
btnAlternarTema.addEventListener("click", () => {
  document.body.classList.toggle("tema-contraste");
  const isContraste = document.body.classList.contains("tema-contraste");
  btnAlternarTema.setAttribute("aria-label", isContraste ? "Alternar para tema padrão" : "Alternar para tema de alto contraste");
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  renderizarNoticias();
});