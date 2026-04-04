/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from "mongoose";

import app from "./app.js";
import migrate from "./database/migrations/migrations.js";

const port = process.env.PORT ?? 3000;

const connectionString = process.env.DB_STRING?.replace(
  "<<USERNAME>>",
  process.env.DB_USERNAME!
).replace("<<PASSWORD>>", process.env.DB_PASSWORD!);
mongoose
  .connect(connectionString ?? "")
  .then(() => {
    console.log("Connected to database");
    migrate();
  })
  .catch((err: unknown) => {
    console.error("Failed to connect to database", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port.toString()}`);
});
