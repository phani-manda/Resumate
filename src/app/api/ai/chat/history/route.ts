import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limitValue = Number(request.nextUrl.searchParams.get("limit") ?? "100")
  const sessionId = request.nextUrl.searchParams.get("sessionId")
  const limit = Number.isFinite(limitValue) ? Math.min(Math.max(limitValue, 1), 200) : 100

  const messages = await prisma.chatMessage.findMany({
    where: {
      clerkUserId: userId,
      ...(sessionId ? { sessionId } : {}),
    },
    orderBy: { timestamp: "asc" },
    take: limit,
    select: {
      id: true,
      role: true,
      content: true,
      timestamp: true,
      sessionId: true,
      reaction: true,
    },
  })

  const sessionsMap = new Map<
    string | null,
    { id: string | null; messageCount: number; lastActivity: string }
  >()

  for (const message of messages) {
    const key = message.sessionId ?? null
    const existing = sessionsMap.get(key)

    if (existing) {
      existing.messageCount += 1
      if (new Date(message.timestamp) > new Date(existing.lastActivity)) {
        existing.lastActivity = message.timestamp.toISOString()
      }
    } else {
      sessionsMap.set(key, {
        id: key,
        messageCount: 1,
        lastActivity: message.timestamp.toISOString(),
      })
    }
  }

  return NextResponse.json({
    messages: messages.map((message) => ({
      ...message,
      timestamp: message.timestamp.toISOString(),
    })),
    sessions: Array.from(sessionsMap.values()).sort((a, b) =>
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    ),
  })
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessionId = request.nextUrl.searchParams.get("sessionId")

  await prisma.chatMessage.deleteMany({
    where: {
      clerkUserId: userId,
      ...(sessionId ? { sessionId } : {}),
    },
  })

  return NextResponse.json({ success: true })
}
