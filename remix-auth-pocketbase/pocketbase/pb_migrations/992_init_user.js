migrate(
  (db) => {
    const dao = new Dao(db);

    const collection = dao.findCollectionByNameOrId("users");

    const record = new Record(collection);
    record.set("name", "John Doe");
    record.set("email", "pocketbase@remix.example");
    record.set("verified", true);
    record.set(
      "username",
      "u_" + $security.randomStringWithAlphabet(5, "123456789"),
    );
    record.setPassword("Passw0rd");

    dao.saveRecord(record);
  },
  (db) => {
    const dao = new Dao(db);

    try {
      const record = dao.findAuthRecordByEmail(
        "users",
        "pocketbase@remix.example",
      );

      dao.deleteRecord(record);
    } catch (_) {}
  },
);
