const Anime = require("../models/anime");

async function listarAnimes(req, res) {
  try {
    const filtro = {};
    if (req.query.titulo) {
      filtro.titulo = { $regex: req.query.titulo, $options: "i" };
    }
    const animes = await Anime.find(filtro);
    res.json(animes);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
}

async function buscarAnime(req, res) {
  try {
    const anime = await Anime.findById(req.params.id);

    if (!anime) {
      return res.status(404).json({ mensagem: "Anime não encontrado" });
    }

    res.json(anime);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ mensagem: "ID informado é inválido" });
    }
    res.status(400).json({ mensagem: error.message });
  }
}

async function criarAnime(req, res) {
  try {
    const anime = await Anime.create(req.body);
    res.status(201).json(anime);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
}

async function atualizarAnime(req, res) {
  try {
    const anime = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!anime) {
      return res.status(404).json({ mensagem: "Anime não encontrado" });
    }
    
    res.json(anime);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ mensagem: "ID informado é inválido" });
    }
    res.status(400).json({ mensagem: error.message });
  }
}

async function excluirAnime(req, res) {
  try {
    const anime = await Anime.findByIdAndDelete(req.params.id);
    
    if (!anime) {
      return res.status(404).json({ mensagem: "Anime não encontrado" });
    }
    
    res.status(204).send();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ mensagem: "ID informado é inválido" });
    }
    res.status(400).json({ mensagem: error.message });
  }
}

module.exports = {
  listarAnimes,
  buscarAnime,
  criarAnime,
  atualizarAnime,
  excluirAnime
};