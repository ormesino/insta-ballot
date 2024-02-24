import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../utils/prisma.ts";

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    });

    const { title, options } = createPollBody.parse(request.body);
    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => {
              return { title: option };
            }),
          },
        },
      },
    });

    return reply.status(201).send({ pollId: poll.id });
  });
}

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:id", async (request, reply) => {
    const getPollParams = z.object({
      id: z.string(),
    });

    const { id } = getPollParams.parse(request.params);
    const poll = await prisma.poll.findUnique({
      where: {
        id,
      },
      include: {
        options: true,
      },
    });

    if (!poll) {
      return reply.status(404).send({ error: "Poll not found" });
    }

    return reply.status(200).send(poll);
  });
}
