import { BuilderShell } from "@/components/BuilderShell"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function BuilderPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  return <BuilderShell />
}
