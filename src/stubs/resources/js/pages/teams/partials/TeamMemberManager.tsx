import { useRoute } from '@/hooks/useRoute'
import { useTypedPage } from '@/hooks/useTypedPage'
import { ActionMessage } from '@/components/ActionMessage'
import { ActionSection } from '@/components/ActionSection'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { DangerButton } from '@/components/DangerButton'
import { DialogModal } from '@/components/DialogModal'
import { FormSection } from '@/components/FormSection'
import { InputError } from '@/components/InputError'
import { InputLabel } from '@/components/InputLabel'
import { PrimaryButton } from '@/components/PrimaryButton'
import { TextInput } from '@/components/forms/TextInput'
import { SecondaryButton } from '@/components/SecondaryButton'
import { SectionBorder } from '@/components/SectionBorder'
import {
  JetstreamTeamPermissions,
  Nullable,
  Role,
  Team,
  TeamInvitation,
  User,
} from '@/types'
import { Inertia } from '@inertiajs/inertia'
import { useForm } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback, useState } from 'react'
import { useToggleState } from '@/hooks/useToggleState'

interface UserMembership extends User {
  membership: {
    role: string
  }
}

interface Props {
  team: Team & {
    team_invitations: TeamInvitation[]
    users: UserMembership[]
  }
  availableRoles: Role[]
  userPermissions: JetstreamTeamPermissions
}

export const TeamMemberManager: React.FC<Props> = ({
  team,
  availableRoles,
  userPermissions,
}) => {
  const route = useRoute()
  const addTeamMemberForm = useForm({
    email: '',
    role: null as Nullable<string>,
  })
  const updateRoleForm = useForm({
    role: null as Nullable<string>,
  })
  const leaveTeamForm = useForm({})
  const removeTeamMemberForm = useForm({})

  const {
    isToggled: isCurrentlyManagingRole,
    setIsToggled: setIsCurrentlyManagingRole,
    toggle: toggleIsCurrentlyManagingRole,
  } = useToggleState(false)

  const {
    isToggled: isConfirmingLeavingTeam,
    setIsToggled: setIsConfirmingLeavingTeam,
    toggle: toggleIsConfirmingLeavingTeam,
  } = useToggleState(false)

  const [managingRoleFor, setManagingRoleFor] = useState<Nullable<User>>(null)
  const [teamMemberBeingRemoved, setTeamMemberBeingRemoved] =
    useState<Nullable<User>>(null)
  const page = useTypedPage()

  const addTeamMember = useCallback(() => {
    addTeamMemberForm.post(route('team-members.store', [team]), {
      errorBag: 'addTeamMember',
      preserveScroll: true,
      onSuccess: () => addTeamMemberForm.reset(),
    })
  }, [addTeamMemberForm, route, team])

  const cancelTeamInvitation = useCallback(
    (invitation: TeamInvitation) => {
      Inertia.delete(route('team-invitations.destroy', [invitation]), {
        preserveScroll: true,
      })
    },
    [route],
  )

  const manageRole = useCallback(
    (teamMember: UserMembership) => {
      setManagingRoleFor(teamMember)
      updateRoleForm.setData('role', teamMember.membership.role)
      setIsCurrentlyManagingRole(true)
    },
    [setIsCurrentlyManagingRole, updateRoleForm],
  )

  const updateRole = useCallback(() => {
    if (!managingRoleFor) {
      return
    }
    updateRoleForm.put(route('team-members.update', [team, managingRoleFor]), {
      preserveScroll: true,
      onSuccess: () => setIsCurrentlyManagingRole(false),
    })
  }, [managingRoleFor, route, setIsCurrentlyManagingRole, team, updateRoleForm])

  const confirmLeavingTeam = useCallback(() => {
    setIsConfirmingLeavingTeam(true)
  }, [setIsConfirmingLeavingTeam])

  const leaveTeam = useCallback(() => {
    leaveTeamForm.delete(route('team-members.destroy', [team, page.props.user]))
  }, [leaveTeamForm, page.props.user, route, team])

  const confirmTeamMemberRemoval = useCallback((teamMember: User) => {
    setTeamMemberBeingRemoved(teamMember)
  }, [])

  const removeTeamMember = useCallback(() => {
    if (!teamMemberBeingRemoved) {
      return
    }
    removeTeamMemberForm.delete(
      route('team-members.destroy', [team, teamMemberBeingRemoved]),
      {
        errorBag: 'removeTeamMember',
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => setTeamMemberBeingRemoved(null),
      },
    )
  }, [removeTeamMemberForm, route, team, teamMemberBeingRemoved])

  const displayableRole = useCallback(
    (role: string) => {
      return availableRoles.find((r) => r.key === role)?.name
    },
    [availableRoles],
  )

  return (
    <div>
      {userPermissions.canAddTeamMembers ? (
        <div>
          <SectionBorder />

          {/* <!-- Add Team Member --> */}
          <FormSection
            onSubmit={addTeamMember}
            title="Add Team Member"
            description={
              'Add a new team member to your team, allowing them to collaborate with you.'
            }
            renderActions={() => (
              <>
                <ActionMessage
                  on={addTeamMemberForm.recentlySuccessful}
                  className="mr-3"
                >
                  Added.
                </ActionMessage>

                <PrimaryButton
                  className={classNames({
                    'opacity-25': addTeamMemberForm.processing,
                  })}
                  disabled={addTeamMemberForm.processing}
                >
                  Add
                </PrimaryButton>
              </>
            )}
          >
            <div className="col-span-6">
              <div className="max-w-xl text-sm text-gray-600">
                Please provide the email address of the person you would like to
                add to this team.
              </div>
            </div>

            {/* <!-- Member Email --> */}
            <div className="col-span-6 sm:col-span-4">
              <InputLabel htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={addTeamMemberForm.data.email}
                onChange={(e) =>
                  addTeamMemberForm.setData('email', e.currentTarget.value)
                }
              />
              <InputError
                message={addTeamMemberForm.errors.email}
                className="mt-2"
              />
            </div>

            {/* <!-- Role --> */}
            {availableRoles.length > 0 ? (
              <div className="col-span-6 lg:col-span-4">
                <InputLabel htmlFor="roles" value="Role" />
                <InputError
                  message={addTeamMemberForm.errors.role}
                  className="mt-2"
                />

                <div className="relative z-0 mt-1 cursor-pointer rounded-lg border border-gray-200">
                  {availableRoles.map((role, i) => (
                    <button
                      type="button"
                      className={classNames(
                        'relative inline-flex w-full rounded-lg px-4 py-3 focus:z-10 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200',
                        {
                          'rounded-t-none border-t border-gray-200': i > 0,
                          'rounded-b-none':
                            i != Object.keys(availableRoles).length - 1,
                        },
                      )}
                      onClick={() =>
                        addTeamMemberForm.setData('role', role.key)
                      }
                      key={role.key}
                    >
                      <div
                        className={classNames({
                          'opacity-50':
                            addTeamMemberForm.data.role &&
                            addTeamMemberForm.data.role != role.key,
                        })}
                      >
                        {/* <!-- Role Name --> */}
                        <div className="flex items-center">
                          <div
                            className={classNames('text-sm text-gray-600', {
                              'font-semibold':
                                addTeamMemberForm.data.role == role.key,
                            })}
                          >
                            {role.name}
                          </div>

                          {addTeamMemberForm.data.role == role.key ? (
                            <svg
                              className="ml-2 h-5 w-5 text-green-400"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          ) : null}
                        </div>

                        {/* <!-- Role Description --> */}
                        <div className="mt-2 text-xs text-gray-600">
                          {role.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </FormSection>
        </div>
      ) : null}

      {team.team_invitations.length > 0 && userPermissions.canAddTeamMembers ? (
        <div>
          <SectionBorder />

          {/* <!-- Team Member Invitations --> */}
          <div className="mt-10 sm:mt-0" />

          <ActionSection
            title="Pending Team Invitations"
            description={
              'These people have been invited to your team and have been sent an invitation email. They may join the team by accepting the email invitation.'
            }
          >
            {/* <!-- Pending Team Member Invitation List --> */}
            <div className="space-y-6">
              {team.team_invitations.map((invitation) => (
                <div
                  className="flex items-center justify-between"
                  key={invitation.id}
                >
                  <div className="text-gray-600">{invitation.email}</div>

                  <div className="flex items-center">
                    {/* <!-- Cancel Team Invitation --> */}
                    {userPermissions.canRemoveTeamMembers ? (
                      <button
                        className="ml-6 cursor-pointer text-sm text-red-500 focus:outline-none"
                        onClick={() => cancelTeamInvitation(invitation)}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </ActionSection>
        </div>
      ) : null}

      {team.users.length > 0 ? (
        <div>
          <SectionBorder />

          {/* <!-- Manage Team Members --> */}
          <div className="mt-10 sm:mt-0" />

          <ActionSection
            title="Team Members"
            description="All of the people that are part of this team."
          >
            {/* <!-- Team Member List --> */}
            <div className="space-y-6">
              {team.users.map((user) => (
                <div
                  className="flex items-center justify-between"
                  key={user.id}
                >
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.profile_photo_url}
                      alt={user.name}
                    />
                    <div className="ml-4">{user.name}</div>
                  </div>

                  <div className="flex items-center">
                    {/* <!-- Manage Team Member Role --> */}
                    {userPermissions.canAddTeamMembers &&
                    availableRoles.length ? (
                      <button
                        className="ml-2 text-sm text-gray-400 underline"
                        onClick={() => manageRole(user)}
                      >
                        {displayableRole(user.membership.role)}
                      </button>
                    ) : availableRoles.length ? (
                      <div className="ml-2 text-sm text-gray-400">
                        {displayableRole(user.membership.role)}
                      </div>
                    ) : null}

                    {/* <!-- Leave Team --> */}
                    {page.props.user.id === user.id ? (
                      <button
                        className="ml-6 cursor-pointer text-sm text-red-500"
                        onClick={confirmLeavingTeam}
                      >
                        Leave
                      </button>
                    ) : null}

                    {/* <!-- Remove Team Member --> */}
                    {userPermissions.canRemoveTeamMembers ? (
                      <button
                        className="ml-6 cursor-pointer text-sm text-red-500"
                        onClick={() => confirmTeamMemberRemoval(user)}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </ActionSection>
        </div>
      ) : null}

      {/* <!-- Role Management Modal --> */}
      <DialogModal
        isOpen={isCurrentlyManagingRole}
        onClose={toggleIsCurrentlyManagingRole}
      >
        <DialogModal.Content title="Manage Role"></DialogModal.Content>
        {managingRoleFor ? (
          <div>
            <div className="relative z-0 mt-1 cursor-pointer rounded-lg border border-gray-200">
              {availableRoles.map((role, i) => (
                <button
                  type="button"
                  className={classNames(
                    'relative inline-flex w-full rounded-lg px-4 py-3 focus:z-10 focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-200',
                    {
                      'rounded-t-none border-t border-gray-200': i > 0,
                      'rounded-b-none':
                        i !== Object.keys(availableRoles).length - 1,
                    },
                  )}
                  onClick={() => updateRoleForm.setData('role', role.key)}
                  key={role.key}
                >
                  <div
                    className={classNames({
                      'opacity-50':
                        updateRoleForm.data.role &&
                        updateRoleForm.data.role !== role.key,
                    })}
                  >
                    {/* <!-- Role Name --> */}
                    <div className="flex items-center">
                      <div
                        className={classNames('text-sm text-gray-600', {
                          'font-semibold':
                            updateRoleForm.data.role === role.key,
                        })}
                      >
                        {role.name}
                      </div>
                      {updateRoleForm.data.role === role.key ? (
                        <svg
                          className="ml-2 h-5 w-5 text-green-400"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      ) : null}
                    </div>

                    {/* <!-- Role Description --> */}
                    <div className="mt-2 text-xs text-gray-600">
                      {role.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <DialogModal.Footer>
          <SecondaryButton onClick={toggleIsCurrentlyManagingRole}>
            Cancel
          </SecondaryButton>

          <PrimaryButton
            onClick={updateRole}
            className={classNames('ml-2', {
              'opacity-25': updateRoleForm.processing,
            })}
            disabled={updateRoleForm.processing}
          >
            Save
          </PrimaryButton>
        </DialogModal.Footer>
      </DialogModal>

      {/* <!-- Leave Team Confirmation Modal --> */}
      <ConfirmationModal
        isOpen={isConfirmingLeavingTeam}
        onClose={toggleIsConfirmingLeavingTeam}
      >
        <ConfirmationModal.Content title="Leave Team">
          Are you sure you would like to leave this team?
        </ConfirmationModal.Content>
        <ConfirmationModal.Footer>
          <SecondaryButton onClick={toggleIsConfirmingLeavingTeam}>
            Cancel
          </SecondaryButton>

          <DangerButton
            onClick={leaveTeam}
            className={classNames('ml-2', {
              'opacity-25': leaveTeamForm.processing,
            })}
            disabled={leaveTeamForm.processing}
          >
            Leave
          </DangerButton>
        </ConfirmationModal.Footer>
      </ConfirmationModal>

      {/* <!-- Remove Team Member Confirmation Modal --> */}
      <ConfirmationModal
        isOpen={!!teamMemberBeingRemoved}
        onClose={() => setTeamMemberBeingRemoved(null)}
      >
        <ConfirmationModal.Content title="Remove Team Member">
          Are you sure you would like to remove this person from the team?
        </ConfirmationModal.Content>
        <ConfirmationModal.Footer>
          <SecondaryButton onClick={() => setTeamMemberBeingRemoved(null)}>
            Cancel
          </SecondaryButton>

          <DangerButton
            onClick={removeTeamMember}
            className={classNames('ml-2', {
              'opacity-25': removeTeamMemberForm.processing,
            })}
            disabled={removeTeamMemberForm.processing}
          >
            Remove
          </DangerButton>
        </ConfirmationModal.Footer>
      </ConfirmationModal>
    </div>
  )
}
