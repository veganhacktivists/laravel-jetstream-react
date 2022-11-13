import { DeleteTeamForm } from '@/pages/teams/partials/DeleteTeamForm'
import { TeamMemberManager } from '@/pages/teams/partials/TeamMemberManager'
import { UpdateTeamNameForm } from '@/pages/teams/partials/UpdateTeamNameForm'
import { SectionBorder } from '@/components/SectionBorder'
import { AppLayout } from '@/layouts/AppLayout'
import {
  JetstreamTeamPermissions,
  Role,
  Team,
  TeamInvitation,
  User,
} from '@/types'
import React from 'react'

interface UserMembership extends User {
  membership: {
    role: string
  }
}

interface Props {
  team: Team & {
    owner: User
    team_invitations: TeamInvitation[]
    users: UserMembership[]
  }
  availableRoles: Role[]
  permissions: JetstreamTeamPermissions
}

const Show: React.FC<Props> = ({ team, availableRoles, permissions }) => {
  return (
    <AppLayout
      title="Team Settings"
      renderHeader={() => (
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Team Settings
        </h2>
      )}
    >
      <div>
        <div className="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
          <UpdateTeamNameForm team={team} permissions={permissions} />

          <div className="mt-10 sm:mt-0">
            <TeamMemberManager
              team={team}
              availableRoles={availableRoles}
              userPermissions={permissions}
            />
          </div>

          {permissions.canDeleteTeam && !team.personal_team ? (
            <>
              <SectionBorder />

              <div className="mt-10 sm:mt-0">
                <DeleteTeamForm team={team} />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </AppLayout>
  )
}

export default Show
