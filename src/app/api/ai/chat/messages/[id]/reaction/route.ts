import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/db"

const allowedReactions = new Set(["thumbsUp", "thumbsDown"])

export async function POST(
  request: NextRequest,
  context: { params: Promise<unknown> }
) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = (await context.params) as { id: string }
  const body = await request.json().catch(() => null)
  const reaction = body?.reaction

  if (!allowedReactions.has(reaction)) {
    return NextResponse.json({ error: "Invalid reaction" }, { status: 400 })
  }

  const existing = await prisma.chatMessage.findFirst({
    where: {
      id,
      clerkUserId: userId,
      role: "assistant",
    },
    select: { id: true },
  })

  if (!existing) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 })
  }

  const updated = await prisma.chatMessage.update({
    where: { id },
    data: { reaction },
    select: {
      id: true,
      reaction: true,
    },
  })

  return NextResponse.json(updated)
}
