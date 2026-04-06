import migrateCities from "./cities/cities.migrations.js";

async function migrate() {
  await migrateCities();
}

export default migrate;
