import { makeGetUserProfileService } from '@/services/factories/make-get-user-profile';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileService();
  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  });
  return reply.status(200).send({ user });
}
