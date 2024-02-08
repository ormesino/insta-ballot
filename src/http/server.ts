import fastify from 'fastify';
import { createPoll } from './controllers/poll.js';
const app = fastify();

app.register(createPoll);

app.listen({ port: 3333 }).then(() => {
  console.log('🌶️ Server listening at http://localhost:3333');
});

app.get('/', () => {
  console.log('Hello, World!!');
});
