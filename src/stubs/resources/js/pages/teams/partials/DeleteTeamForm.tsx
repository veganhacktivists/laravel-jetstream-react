import { useRoute } from '@/hooks/useRoute'
import { ActionSection } from '@/components/ActionSection'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { DangerButton } from '@/components/DangerButton'
import { SecondaryButton } from '@/components/SecondaryButton'
import { Team } from '@/types'
import { useForm } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useToggleState } from '@/hooks/useToggleState'

interface Props {
  team: Team
}

export const DeleteTeamForm: React.FC<Props> = ({ team }) => {
  const route = useRoute()

  const {
    isToggled: isConfirmingTeamDeletion,
    setIsToggled: setIsConfirmingTeamDeletion,
    toggle: toggleIsConfirmingTeamDeletion,
  } = useToggleState(false)

  const form = useForm({})

  const confirmTeamDeletion = useCallback(() => {
    setIsConfirmingTeamDeletion(true)
  }, [setIsConfirmingTeamDeletion])

  const deleteTeam = useCallback(() => {
    form.delete(route('teams.destroy', [team]), {
      errorBag: 'deleteTeam',
    })
  }, [form, route, team])

  return (
    <ActionSection
      title="Delete Team"
      description="Permanently delete this team."
    >
      <div className="max-w-xl text-sm text-gray-600">
        Once a team is deleted, all of its resources and data will be
        permanently deleted. Before deleting this team, please download any data
        or information regarding this team that you wish to retain.
      </div>

      <div className="mt-5">
        <DangerButton onClick={confirmTeamDeletion}>Delete Team</DangerButton>
      </div>

      {/* <!-- Delete Team Confirmation Modal --> */}
      <ConfirmationModal
        isOpen={isConfirmingTeamDeletion}
        onClose={toggleIsConfirmingTeamDeletion}
      >
        <ConfirmationModal.Content title="Delete Team">
          Are you sure you want to delete this team? Once a team is deleted, all
          of its resources and data will be permanently deleted.
        </ConfirmationModal.Content>

        <ConfirmationModal.Footer>
          <SecondaryButton onClick={toggleIsConfirmingTeamDeletion}>
            Cancel
          </SecondaryButton>

          <DangerButton
            onClick={deleteTeam}
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Delete Team
          </DangerButton>
        </ConfirmationModal.Footer>
      </ConfirmationModal>
    </ActionSection>
  )
}
