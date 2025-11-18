import { OptimizerShell } from "@/components/optimizer-shell"
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function OptimizerPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  return <OptimizerShell />
}
