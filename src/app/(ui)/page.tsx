import { PageContainer } from '@/components/Containers'
import { getDefaultSettings } from '@ui/helpers'
import { z } from 'zod'
import { Setting } from '@prisma/client'
import { CopilotAPI } from '@/utils/CopilotAPI'
import { DefaultSetting } from '@/types/settings'
import { fetchSettings, getInternalUsersOptions, getUserPayload } from '@/actions/settings'
import { SyncForm } from '@ui/SyncForm'
import { runSync as runSyncAction } from '@/actions/settings'

export default async function Home({ searchParams }: { searchParams: { token: string } }) {
  const tokenParsed = z.string().safeParse(searchParams.token)
  if (!tokenParsed.success) {
    // TODO: fix in dedicated PR
    return <div>Please provide a valid token</div>
  }

  const token = tokenParsed.data
  const copilot = new CopilotAPI(token)
  const [currentUser, internalUsers, settingsData] = await Promise.all([
    getUserPayload(copilot),
    getInternalUsersOptions(copilot),
    fetchSettings(token),
  ])
  if (!currentUser) {
    // TODO: fix in dedicated PR
    return <div>Failed to validate internal user</div>
  }

  const settings: Setting | DefaultSetting = settingsData || getDefaultSettings(currentUser.internalUserId)

  const runSync = async (_prevState: unknown, formData: FormData) => {
    'use server'
    return await runSyncAction(formData, token)
  }

  return (
    <PageContainer>
      <SyncForm token={token} settings={settings} internalUsers={internalUsers} runSync={runSync} />
    </PageContainer>
  )
}
