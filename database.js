const sqlite = require("sqlite");
const cardsDbPath = "./cards.cdb";
const defDbPath = "./definitions.db";

let cardsDb, defDb;
module.exports = {
  async open() {
    [this.cardsDb, this.defDb] = await Promise.all([
      sqlite.open(cardsDbPath, { Promise }),
      sqlite.open(defDbPath, { Promise })
    ]);
    await this.cardsDb.run(`ATTACH '${defDbPath}' AS definitions`);
  },
  cardsDb,
  defDb
};
