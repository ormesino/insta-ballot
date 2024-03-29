import cookie from "@fastify/cookie";
import fastify from "fastify";
import { createPoll, deletePoll, getPoll } from "./controllers/poll.ts";
import { createVote } from "./controllers/vote.ts";
const app = fastify();

app.register(cookie, {
  secret: "my-secret",
});

app.register(createPoll);
app.register(getPoll);
app.register(deletePoll);
app.register(createVote);

app.listen({ port: 3333 }).then(() => {
  console.log("🌶️ Server listening at http://localhost:3333");
});

app.get("/", () => {
  return "Hello, world!";
});
