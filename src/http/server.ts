import fastify from "fastify";
const app = fastify();

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server listening at http://localhost:3333");
});

app.get("/", () => {
  console.log("Hello NLW!");
});
