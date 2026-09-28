const express = require("express");
const animeController = require("../controllers/animeController");

const router = express.Router();

router.get("/", animeController.listarAnimes);
router.get("/:id", animeController.buscarAnime);
router.post("/", animeController.criarAnime);
router.put("/:id", animeController.atualizarAnime);
router.delete("/:id", animeController.excluirAnime);

module.exports = router;