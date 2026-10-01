import { messageRepository } from '@/layers/infrastructure/messages/message-repository'
import { acceptContactMessage } from '@/layers/use-cases/messages/accept-contact-message'

export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json(messageRepository.list())
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const result = acceptContactMessage(body)

  if (!result.ok) {
    return Response.json(
      { error: 'Форма заполнена с ошибками', fieldErrors: result.fieldErrors },
      { status: 400 },
    )
  }

  return Response.json(result.message, { status: 201 })
}

export function DELETE() {
  messageRepository.clear()
  return new Response(null, { status: 204 })
}
