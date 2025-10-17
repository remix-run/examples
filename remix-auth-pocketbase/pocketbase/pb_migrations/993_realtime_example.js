/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const collection = new Collection({
      id: "3fgzix6mozksgdo",
      created: "2024-01-10 13:26:07.505Z",
      updated: "2024-01-10 13:26:07.505Z",
      name: "realtime_example",
      type: "base",
      system: false,
      schema: [
        {
          system: false,
          id: "naymwtuv",
          name: "count",
          type: "number",
          required: false,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            noDecimal: false,
          },
        },
      ],
      indexes: [
        "CREATE UNIQUE INDEX `idx_mIunNVu` ON `realtime_example` (`count`)",
        "CREATE INDEX `idx_BcMwMuN` ON `realtime_example` (`created`)",
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      options: {},
    });

    return Dao(db).saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("3fgzix6mozksgdo");

    return dao.deleteCollection(collection);
  },
);
