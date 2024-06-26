import { PageContainer } from '@/components/Containers'
import { getDefaultSettings } from '@ui/helpers'
import { z } from 'zod'
import { Setting } from '@prisma/client'
import { CopilotAPI } from '@/utils/CopilotAPI'
import { DefaultSetting } from '@/types/settings'
import { fetchSettings, getInternalUsersOptions, getUserPayload } from '@/actions/settings'
import { SyncForm } from '@ui/SyncForm'
import { SyncedWorkspacesService } from '../api/synced-workspaces/synced-workspaces.service'
import User from '../api/core/models/User.model'

export default async function Home({ searchParams }: { searchParams: { token: string } }) {
  const tokenParsed = z.string().safeParse(searchParams.token)
  if (!tokenParsed.success) {
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
    return <div>Failed to validate internal user</div>
  }
  const syncedWorkspacesService = new SyncedWorkspacesService(await User.authenticateToken(token))
  const isSlackbotInstalled = await syncedWorkspacesService.checkSynced()

  const settings: Setting | DefaultSetting = settingsData || getDefaultSettings(currentUser.internalUserId)

  return (
    <PageContainer>
      <SyncForm
        isSlackbotInstalled={isSlackbotInstalled}
        token={token}
        initialSettings={settings}
        internalUsers={internalUsers}
      />
    </PageContainer>
  )
}
