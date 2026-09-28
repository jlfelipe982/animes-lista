const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
    titulo: {
      type: String,
      required: true
    },
    genero: {
      type: String,
      required: true
    },
    episodios: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Anime", animeSchema);