const db = require("./database");
const squel = require("squel");

module.exports = {
  Query: {
    allCards: async (
      _,
      { search, types, races, attributes, page, pageSize }
    ) => {
      let sql = squel
        .select()
        .from("datas")
        .join("texts", "texts", "datas.id = texts.id")
        .left_join(
          "definitions.types",
          "types",
          "datas.type = definitions.types.id"
        )
        .left_join(
          "definitions.races",
          "races",
          "datas.race = definitions.races.id"
        )
        .left_join(
          "definitions.attributes",
          "attributes",
          "datas.attribute = definitions.attributes.id"
        )
        .group("texts.name") // remove duplicate cards from different sets;
        .order("texts.name");

      if (search) {
        sql.where(
          squel
            .expr()
            .or(`LOWER(texts.name) LIKE LOWER(?)`, `%${search}%`)
            .or(`LOWER(texts.desc) LIKE LOWER(?)`, `%${search}%`)
        );
      }

      if (types && types.length > 0) {
        sql
          .from(
            squel
              .select()
              .from("definitions.types")
              .field("SUM(id)", "sum")
              .where(
                "LOWER(type) IN ?",
                squel.str(
                  types
                    .map(function() {
                      return "LOWER(?)";
                    })
                    .join(","),
                  ...types
                )
              ),
            "type_filter"
          )
          .where("type_filter.sum & datas.type > 0");
      }

      if (races && races.length > 0) {
        sql
          .from(
            squel
              .select()
              .from("definitions.races")
              .field("SUM(id)", "sum")
              .where(
                "LOWER(race) IN ?",
                squel.str(
                  races
                    .map(function() {
                      return "LOWER(?)";
                    })
                    .join(","),
                  ...races
                )
              ),
            "race_filter"
          )
          .where("race_filter.sum & datas.race > 0");
      }

      if (attributes && attributes.length > 0) {
        sql
          .from(
            squel
              .select()
              .from("definitions.attributes")
              .field("SUM(id)", "sum")
              .where(
                "UPPER(attribute) IN ?",
                squel.str(
                  attributes
                    .map(function() {
                      return "UPPER(?)";
                    })
                    .join(","),
                  ...attributes
                )
              ),
            "attribute_filter"
          )
          .where("attribute_filter.sum & datas.attribute > 0");
      }

      // START PAGE LOGIC
      const total = {
        ...(await db.cardsDb.get(
          squel
            .select()
            .from(sql)
            .field("COUNT()", "count")
            .toString()
        ))
      }.count;

      let perPage = -1;
      let lastPage = 1;
      let currentPage = 1;
      let from = 1;
      let to = total;
      if (page) {
        perPage = pageSize || 10;
        lastPage = Math.ceil(total / perPage);
        currentPage = Math.min(page, lastPage);
        from = (currentPage - 1) * perPage + 1;
        to = Math.min(from + perPage - 1, total);
        sql.offset((currentPage - 1) * perPage).limit(perPage);
      }

      const pageInfo = {
        total,
        pageSize: perPage,
        currentPage,
        lastPage,
        from,
        to
      };
      // END PAGE LOGIC

      // console.log(sql.toString());
      // return db.cardsDb.all(sql.toString());
      return {
        cards: db.cardsDb.all(sql.toString()),
        pageInfo
      };
    },
    types: () => {
      let sql = squel
        .select()
        .from("types")
        // .field("type", "name");
      // console.log(sql.toString());
      return db.defDb.all(sql.toString());
    },
    races: () => {
      let sql = squel
        .select()
        .from("races")
        // .field("race", "name");
      // console.log(sql.toString());
      return db.defDb.all(sql.toString());
    },
    attributes: () => {
      let sql = squel
        .select()
        .from("attributes")
        // .field("attribute", "name");
      // console.log(sql.toString());
      return db.defDb.all(sql.toString());
    }
  }
};
