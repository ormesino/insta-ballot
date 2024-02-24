import fastify from 'fastify';
import { createPoll, getPoll } from './controllers/poll.ts';
const app = fastify();

app.register(createPoll);
app.register(getPoll);

app.listen({ port: 3333 }).then(() => {
  console.log('🌶️ Server listening at http://localhost:3333');
});

app.get('/', () => {
  return 'Hello, world!';
});
