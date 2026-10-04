migrate(
  (db) => {
    const dao = new Dao(db);

    const admin = new Admin();
    admin.email = "pocketbase@remix.example";
    admin.setPassword("Passw0rd");

    dao.saveAdmin(admin);
  },
  (db) => {
    const dao = new Dao(db);

    try {
      const admin = dao.findAdminByEmail("pocketbase@remix.example");

      dao.deleteAdmin(admin);
    } catch (_) {}
  },
);
