import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../utils/prisma.ts";

export async function createVote(app: FastifyInstance) {
  app.post("/polls/:pollId/vote", async (request, reply) => {
    const createVoteBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    const createVoteParam = z.object({
      pollId: z.string().uuid(),
    });

    const { pollOptionId } = createVoteBody.parse(request.body);
    const { pollId } = createVoteParam.parse(request.params);

    let { sessionId } = request.cookies;

    if (sessionId) {
      const userAlreadyVoted = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      });

      if (userAlreadyVoted && userAlreadyVoted.pollOptionId !== pollOptionId) {
        await prisma.vote.delete({
          where: {
            id: userAlreadyVoted.id,
          },
        });
      } else if (userAlreadyVoted) {
        return reply
          .status(400)
          .send({ message: "You already voted on this poll!" });
      }
    }

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 2_592_000,
        signed: true,
        httpOnly: true,
      });
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    });

    return reply.status(201).send({});
  });
}
