import { useForm } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { useCallback, useState } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { ActionMessage } from '@/components/ActionMessage'
import { ActionSection } from '@/components/ActionSection'
import { Checkbox } from '@/components/Checkbox'
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
import { ApiToken } from '@/types'
import { useTypedPage } from '@/hooks/useTypedPage'
import { useToggleState } from '@/hooks/useToggleState'

interface Props {
  tokens: ApiToken[]
  availablePermissions: string[]
  defaultPermissions: string[]
}

export const APITokenManager: React.FC<Props> = ({
  tokens,
  availablePermissions,
  defaultPermissions,
}) => {
  const route = useRoute()
  const createApiTokenForm = useForm({
    name: '',
    permissions: defaultPermissions,
  })
  const updateApiTokenForm = useForm({
    permissions: [] as string[],
  })
  const deleteApiTokenForm = useForm({})
  const {
    isToggled: isDisplayingToken,
    setIsToggled: setIsDisplayingToken,
    toggle: toggleIsDisplayingToken,
  } = useToggleState(false)

  const [managingPermissionsFor, setManagingPermissionsFor] =
    useState<ApiToken | null>(null)
  const [apiTokenBeingDeleted, setApiTokenBeingDeleted] =
    useState<ApiToken | null>(null)
  const page = useTypedPage()

  const createApiToken = useCallback(() => {
    createApiTokenForm.post(route('api-tokens.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDisplayingToken(true)
        createApiTokenForm.reset()
      },
    })
  }, [createApiTokenForm, route])

  const manageApiTokenPermissions = useCallback(
    (token: ApiToken) => {
      updateApiTokenForm.setData('permissions', token.abilities)
      setManagingPermissionsFor(token)
    },
    [updateApiTokenForm],
  )

  const updateApiToken = useCallback(() => {
    if (!managingPermissionsFor) {
      return
    }
    updateApiTokenForm.put(
      route('api-tokens.update', [managingPermissionsFor]),
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => setManagingPermissionsFor(null),
      },
    )
  }, [managingPermissionsFor, route, updateApiTokenForm])

  const confirmApiTokenDeletion = useCallback((token: ApiToken) => {
    setApiTokenBeingDeleted(token)
  }, [])

  const deleteApiToken = useCallback(() => {
    if (!apiTokenBeingDeleted) {
      return
    }
    deleteApiTokenForm.delete(
      route('api-tokens.destroy', [apiTokenBeingDeleted]),
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => setApiTokenBeingDeleted(null),
      },
    )
  }, [apiTokenBeingDeleted, deleteApiTokenForm, route])

  return (
    <div>
      {/* <!-- Generate API Token --> */}
      <FormSection
        onSubmit={createApiToken}
        title="Create API Token"
        description={
          'API tokens allow third-party services to authenticate with our application on your behalf.'
        }
        renderActions={() => (
          <>
            <ActionMessage
              on={createApiTokenForm.recentlySuccessful}
              className="mr-3"
            >
              Created.
            </ActionMessage>

            <PrimaryButton
              className={classNames({
                'opacity-25': createApiTokenForm.processing,
              })}
              disabled={createApiTokenForm.processing}
            >
              Create
            </PrimaryButton>
          </>
        )}
      >
        {/* <!-- Token Name --> */}
        <div className="col-span-6 sm:col-span-4">
          <InputLabel htmlFor="name">Name</InputLabel>
          <TextInput
            id="name"
            type="text"
            className="mt-1 block w-full"
            value={createApiTokenForm.data.name}
            onChange={(e) =>
              createApiTokenForm.setData('name', e.currentTarget.value)
            }
            autoFocus
          />
          <InputError
            message={createApiTokenForm.errors.name}
            className="mt-2"
          />
        </div>

        {/* <!-- Token Permissions --> */}
        {availablePermissions.length > 0 && (
          <div className="col-span-6">
            <InputLabel htmlFor="permissions">Permissions</InputLabel>

            <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              {availablePermissions.map((permission) => (
                <div key={permission}>
                  <label className="flex items-center">
                    <Checkbox
                      value={permission}
                      checked={createApiTokenForm.data.permissions.includes(
                        permission,
                      )}
                      onChange={(e) => {
                        if (
                          createApiTokenForm.data.permissions.includes(
                            e.currentTarget.value,
                          )
                        ) {
                          createApiTokenForm.setData(
                            'permissions',
                            createApiTokenForm.data.permissions.filter(
                              (p) => p !== e.currentTarget.value,
                            ),
                          )
                        } else {
                          createApiTokenForm.setData('permissions', [
                            e.currentTarget.value,
                            ...createApiTokenForm.data.permissions,
                          ])
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {permission}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </FormSection>

      {tokens.length > 0 ? (
        <div>
          <SectionBorder />

          {/* <!-- Manage API Tokens --> */}
          <div className="mt-10 sm:mt-0">
            <ActionSection
              title="Manage API Tokens"
              description={
                'You may delete any of your existing tokens if they are no longer needed.'
              }
            >
              {/* <!-- API Token List --> */}
              <div className="space-y-6">
                {tokens.map((token) => (
                  <div
                    className="flex items-center justify-between"
                    key={token.id}
                  >
                    <div>{token.name}</div>

                    <div className="flex items-center">
                      {token.last_used_ago && (
                        <div className="text-sm text-gray-400">
                          Last used {token.last_used_ago}
                        </div>
                      )}

                      {availablePermissions.length > 0 ? (
                        <PrimaryButton
                          className="ml-6 cursor-pointer text-sm text-gray-400 underline"
                          onClick={() => manageApiTokenPermissions(token)}
                        >
                          Permissions
                        </PrimaryButton>
                      ) : null}

                      <PrimaryButton
                        className="ml-6 cursor-pointer text-sm text-red-500"
                        onClick={() => confirmApiTokenDeletion(token)}
                      >
                        Delete
                      </PrimaryButton>
                    </div>
                  </div>
                ))}
              </div>
            </ActionSection>
          </div>
        </div>
      ) : null}

      {/* <!-- Token Value Modal --> */}
      <DialogModal isOpen={isDisplayingToken} onClose={toggleIsDisplayingToken}>
        <DialogModal.Content title="API Token">
          <div>
            Please copy your new API token. For your security, it won't be shown
            again.
          </div>

          <div className="mt-4 rounded bg-gray-100 px-4 py-2 font-mono text-sm text-gray-500">
            {page.props?.jetstream?.flash?.token}
          </div>
        </DialogModal.Content>
        <DialogModal.Footer>
          <SecondaryButton onClick={toggleIsDisplayingToken}>
            Close
          </SecondaryButton>
        </DialogModal.Footer>
      </DialogModal>

      {/* <!-- API Token Permissions Modal --> */}
      <DialogModal
        isOpen={!!managingPermissionsFor}
        onClose={() => setManagingPermissionsFor(null)}
      >
        <DialogModal.Content title="API Token Permissions">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {availablePermissions.map((permission) => (
              <div key={permission}>
                <label className="flex items-center">
                  <Checkbox
                    value={permission}
                    checked={updateApiTokenForm.data.permissions.includes(
                      permission,
                    )}
                    onChange={(e) => {
                      if (
                        updateApiTokenForm.data.permissions.includes(
                          e.currentTarget.value,
                        )
                      ) {
                        updateApiTokenForm.setData(
                          'permissions',
                          updateApiTokenForm.data.permissions.filter(
                            (p) => p !== e.currentTarget.value,
                          ),
                        )
                      } else {
                        updateApiTokenForm.setData('permissions', [
                          e.currentTarget.value,
                          ...updateApiTokenForm.data.permissions,
                        ])
                      }
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {permission}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </DialogModal.Content>
        <DialogModal.Footer>
          <SecondaryButton onClick={() => setManagingPermissionsFor(null)}>
            Cancel
          </SecondaryButton>

          <PrimaryButton
            onClick={updateApiToken}
            className={classNames('ml-2', {
              'opacity-25': updateApiTokenForm.processing,
            })}
            disabled={updateApiTokenForm.processing}
          >
            Save
          </PrimaryButton>
        </DialogModal.Footer>
      </DialogModal>

      {/* <!-- Delete Token Confirmation Modal --> */}
      <ConfirmationModal
        isOpen={!!apiTokenBeingDeleted}
        onClose={() => setApiTokenBeingDeleted(null)}
      >
        <ConfirmationModal.Content title="Delete API Token">
          Are you sure you would like to delete this API token?
        </ConfirmationModal.Content>
        <ConfirmationModal.Footer>
          <SecondaryButton onClick={() => setApiTokenBeingDeleted(null)}>
            Cancel
          </SecondaryButton>

          <DangerButton
            onClick={deleteApiToken}
            className={classNames('ml-2', {
              'opacity-25': deleteApiTokenForm.processing,
            })}
            disabled={deleteApiTokenForm.processing}
          >
            Delete
          </DangerButton>
        </ConfirmationModal.Footer>
      </ConfirmationModal>
    </div>
  )
}
