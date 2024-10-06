cronAdd("realtime_example", "*/1 * * * *", function () {
  let records = null;

  try {
    records = $app
      .dao()
      .findRecordsByFilter("realtime_example", "1=1", "-created", 1, 0);
  } catch (_) {}

  const record = records?.[0] || null;

  let count = record?.get("count") || 1;

  if (!record) {
    const collection = $app.dao().findCollectionByNameOrId("realtime_example");

    const record = new Record(collection, {
      count,
    });

    $app.dao().saveRecord(record);
  } else {
    count++;

    const form = new RecordUpsertForm($app, record);
    form.loadData({
      count,
    });
    form.submit();
  }

  console.log("realtime_example", count);
});
