import { CoachShell } from "@/components/CoachShell"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function CoachPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  return <CoachShell />
}
