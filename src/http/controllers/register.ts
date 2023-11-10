import { registerService } from '@/services/register';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, 'password must a ben have 6 digits')
  });

  try {
    registerService(registerBodySchema.parse(request.body));
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}