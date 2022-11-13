import { useRoute } from '@/hooks/useRoute'
import { ActionMessage } from '@/components/ActionMessage'
import { FormSection } from '@/components/FormSection'
import { InputError } from '@/components/InputError'
import { InputLabel } from '@/components/InputLabel'
import { PrimaryButton } from '@/components/PrimaryButton'
import { TextInput } from '@/components/forms/TextInput'
import { JetstreamTeamPermissions, Team, User } from '@/types'
import { useForm } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback } from 'react'

interface Props {
  team: Team & { owner: User }
  permissions: JetstreamTeamPermissions
}

export const UpdateTeamNameForm: React.FC<Props> = ({ team, permissions }) => {
  const route = useRoute()
  const form = useForm({
    name: team.name,
  })

  const updateTeamName = useCallback(() => {
    form.put(route('teams.update', [team]), {
      errorBag: 'updateTeamName',
      preserveScroll: true,
    })
  }, [form, route, team])

  return (
    <FormSection
      onSubmit={updateTeamName}
      title="Team Name"
      description={`The team's name and owner information.`}
      renderActions={
        permissions.canUpdateTeam
          ? () => (
              <>
                <ActionMessage on={form.recentlySuccessful} className="mr-3">
                  Saved.
                </ActionMessage>

                <PrimaryButton
                  className={classNames({ 'opacity-25': form.processing })}
                  disabled={form.processing}
                >
                  Save
                </PrimaryButton>
              </>
            )
          : undefined
      }
    >
      {/* <!-- Team Owner Information --> */}
      <div className="col-span-6">
        <InputLabel value="Team Owner" />

        <div className="mt-2 flex items-center">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={team.owner.profile_photo_url}
            alt={team.owner.name}
          />

          <div className="ml-4 leading-tight">
            <div>{team.owner.name}</div>
            <div className="text-sm text-gray-700">{team.owner.email}</div>
          </div>
        </div>
      </div>

      {/* <!-- Team Name --> */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="name" value="Team Name" />

        <TextInput
          id="name"
          type="text"
          className="mt-1 block w-full"
          value={form.data.name}
          onChange={(e) => form.setData('name', e.currentTarget.value)}
          disabled={!permissions.canUpdateTeam}
        />

        <InputError message={form.errors.name} className="mt-2" />
      </div>
    </FormSection>
  )
}
