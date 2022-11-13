import { useForm } from '@inertiajs/inertia-react'
import React, { useCallback } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { useTypedPage } from '@/hooks/useTypedPage'
import { ActionMessage } from '@/components/ActionMessage'
import { FormSection } from '@/components/FormSection'
import { InputError } from '@/components/InputError'
import { InputLabel } from '@/components/InputLabel'
import { PrimaryButton } from '@/components/PrimaryButton'
import { TextInput } from '@/components/forms/TextInput'
import classNames from 'classnames'

export const CreateTeamForm = () => {
  const route = useRoute()
  const page = useTypedPage()
  const form = useForm({
    name: '',
  })

  const createTeam = useCallback(() => {
    form.post(route('teams.store'), {
      errorBag: 'createTeam',
      preserveScroll: true,
    })
  }, [form, route])

  return (
    <FormSection
      onSubmit={createTeam}
      title="Team Details"
      description="Create a new team to collaborate with others on projects."
      renderActions={() => (
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
      )}
    >
      <div className="col-span-6">
        <InputLabel value="Team Owner" />

        <div className="mt-2 flex items-center">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={page.props.user.profile_photo_url}
            alt={page.props.user.name}
          />

          <div className="ml-4 leading-tight">
            <div>{page.props.user.name}</div>
            <div className="text-sm text-gray-700">{page.props.user.email}</div>
          </div>
        </div>
      </div>

      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="name" value="Team Name" />
        <TextInput
          id="name"
          type="text"
          className="mt-1 block w-full"
          value={form.data.name}
          onChange={(e) => form.setData('name', e.currentTarget.value)}
          autoFocus
        />
        <InputError message={form.errors.name} className="mt-2" />
      </div>
    </FormSection>
  )
}
