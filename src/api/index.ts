import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";

const app = new Hono();

app.get("/hello", (c) => {
  return c.text("Hello, world!");
});
app.use("/graphql", graphql({ db, schema }));
app.use("/sql/*", client({ db, schema }));

export default app;
