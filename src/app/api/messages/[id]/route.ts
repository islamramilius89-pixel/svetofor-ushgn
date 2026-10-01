import { messageRepository } from '@/layers/infrastructure/messages/message-repository'

export async function DELETE(_request: Request, ctx: RouteContext<'/api/messages/[id]'>) {
  const { id } = await ctx.params

  if (!messageRepository.remove(id)) {
    return Response.json({ error: 'Сообщение не найдено' }, { status: 404 })
  }

  return new Response(null, { status: 204 })
}
