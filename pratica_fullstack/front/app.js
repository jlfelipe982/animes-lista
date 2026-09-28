const API_URL = "http://localhost:3000/animes";

const formulario = document.querySelector("#form-anime");
const campoId = document.querySelector("#anime-id");
const campoTitulo = document.querySelector("#titulo");
const campoGenero = document.querySelector("#genero");
const campoEpisodios = document.querySelector("#episodios");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");
const listaAnimes = document.querySelector("#lista-animes");
const mensagem = document.querySelector("#mensagem");
const formularioBusca = document.querySelector("#form-busca");
const campoBuscaId = document.querySelector("#busca-id");

async function fazerRequisicao(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.mensagem || "Não foi possível concluir a operação");
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}

function criarCartaoAnime(anime) {
  const cartao = document.createElement("article");
  cartao.className = "anime";

  const titulo = document.createElement("h3");
  titulo.textContent = anime.titulo;

  const genero = document.createElement("p");
  genero.textContent = `Gênero: ${anime.genero}`;

  const episodios = document.createElement("p");
  episodios.textContent = `Episódios: ${anime.episodios ?? "Não informado"}`;

  const id = document.createElement("p");
  id.textContent = `ID: ${anime._id}`;

  const acoes = document.createElement("div");
  acoes.className = "acoes-anime";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => carregarAnimeParaEdicao(anime._id));

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "perigo";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", () => excluirAnime(anime._id));

  acoes.append(botaoEditar, botaoExcluir);
  cartao.append(titulo, genero, episodios, id, acoes);

  return cartao;
}

function exibirAnimes(animes) {
  listaAnimes.innerHTML = "";

  if (animes.length === 0) {
    mostrarMensagem("Nenhum anime cadastrado");
    return;
  }

  animes.forEach((anime) => {
    listaAnimes.appendChild(criarCartaoAnime(anime));
  });

  mostrarMensagem(`${animes.length} anime(s) encontrado(s)`);
}

async function listarAnimes() {
  try {
    mostrarMensagem("Carregando animes...");
    const animes = await fazerRequisicao(API_URL);
    exibirAnimes(animes);
  } catch (erro) {
    listaAnimes.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
}

async function buscarAnimePorId(id) {
  const anime = await fazerRequisicao(`${API_URL}/${id}`);
  exibirAnimes([anime]);
  return anime;
}

async function salvarAnime(evento) {
  evento.preventDefault();

  const anime = {
    titulo: campoTitulo.value.trim(),
    genero: campoGenero.value.trim()
  };

  if (campoEpisodios.value !== "") {
    anime.episodios = Number(campoEpisodios.value);
  }

  const id = campoId.value;
  const estaEditando = Boolean(id);
  const url = estaEditando ? `${API_URL}/${id}` : API_URL;
  const metodo = estaEditando ? "PUT" : "POST";

  try {
    await fazerRequisicao(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(anime)
    });

    limparFormulario();
    mostrarMensagem(estaEditando ? "Anime atualizado" : "Anime cadastrado");
    await listarAnimes();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function carregarAnimeParaEdicao(id) {
  try {
    const anime = await fazerRequisicao(`${API_URL}/${id}`);

    campoId.value = anime._id;
    campoTitulo.value = anime.titulo;
    campoGenero.value = anime.genero;
    campoEpisodios.value = anime.episodios ?? "";
    tituloFormulario.textContent = "Editar anime";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.classList.remove("oculto");
    campoTitulo.focus();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function excluirAnime(id) {
  const confirmou = window.confirm("Deseja excluir este anime?");

  if (!confirmou) {
    return;
  }

  try {
    await fazerRequisicao(`${API_URL}/${id}`, { method: "DELETE" });
    limparFormulario();
    mostrarMensagem("Anime excluído");
    await listarAnimes();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

function limparFormulario() {
  formulario.reset();
  campoId.value = "";
  tituloFormulario.textContent = "Novo anime";
  botaoSalvar.textContent = "Cadastrar";
  botaoCancelar.classList.add("oculto");
}

formulario.addEventListener("submit", salvarAnime);
botaoCancelar.addEventListener("click", limparFormulario);
document.querySelector("#botao-atualizar").addEventListener("click", listarAnimes);
document.querySelector("#botao-limpar-busca").addEventListener("click", () => {
  campoBuscaId.value = "";
  listarAnimes();
});

formularioBusca.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = campoBuscaId.value.trim();

  if (!id) {
    mostrarMensagem("Informe um ID para realizar a busca", true);
    return;
  }

  try {
    await buscarAnimePorId(id);
  } catch (erro) {
    listaAnimes.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
});

listarAnimes();