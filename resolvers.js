const db = require("./database");

module.exports = {
  cards: ({ search }) => {
    let sql = `SELECT texts.name, texts.desc, datas.*, 
      definitions.types.type, definitions.races.race, definitions.attributes.attribute
      FROM datas 
      JOIN texts ON datas.id = texts.id 
      LEFT JOIN definitions.types ON datas.type = definitions.types.id 
      LEFT JOIN definitions.races ON datas.race = definitions.races.id 
      LEFT JOIN definitions.attributes ON datas.attribute = definitions.attributes.id`;

    let params = {};
    if (search) {
      params["$search"] = `${search}%`;
      sql += ` WHERE LOWER(texts.name) LIKE LOWER($search) OR LOWER(texts.desc) LIKE LOWER($search)`;
    }

    sql += `GROUP BY texts.name`;

    return db.cardsDb.all(sql, params);
  }
};
