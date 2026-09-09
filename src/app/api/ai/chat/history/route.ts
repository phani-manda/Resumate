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

  return NextResponse.json({
    messages: messages.map((message) => ({
      ...message,
      timestamp: message.timestamp.toISOString(),
    })),
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
