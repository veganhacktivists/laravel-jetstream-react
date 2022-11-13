import { Inertia } from '@inertiajs/inertia'
import { InertiaLink, Head } from '@inertiajs/inertia-react'
import classNames from 'classnames'
import React, { PropsWithChildren, useCallback } from 'react'
import { useRoute } from '@/hooks/useRoute'
import { useTypedPage } from '@/hooks/useTypedPage'
import { ApplicationMark } from '@/components/ApplicationMark'
import { Banner } from '@/components/Banner'
import { Dropdown } from '@/components/Dropdown'
import { DropdownLink } from '@/components/DropdownLink'
import { NavLink } from '@/components/NavLink'
import { ResponsiveNavLink } from '@/components/ResponsiveNavLink'
import { Team } from '@/types'
import { useToggleState } from '@/hooks/useToggleState'

interface Props {
  title: string
  renderHeader?(): JSX.Element
}

export const AppLayout: React.FC<PropsWithChildren<Props>> = ({
  title,
  renderHeader,
  children,
}) => {
  const page = useTypedPage()
  const route = useRoute()

  const {
    isToggled: isShowingNavigationDropdown,
    toggle: toggleIsShowingNavigationDropdown,
  } = useToggleState(false)

  const switchToTeam = useCallback(
    (e: React.FormEvent, team: Team) => {
      e.preventDefault()
      Inertia.put(
        route('current-team.update'),
        {
          team_id: team.id,
        },
        {
          preserveState: false,
        },
      )
    },
    [route],
  )

  const logout = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault()
      Inertia.post(route('logout'))
    },
    [route],
  )

  return (
    <div>
      <Head title={title} />

      <Banner />

      <div className="min-h-screen bg-gray-100">
        <nav className="border-b border-gray-100 bg-white">
          {/* <!-- Primary Navigation Menu --> */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                {/* <!-- Logo --> */}
                <div className="flex flex-shrink-0 items-center">
                  <InertiaLink href={route('dashboard')}>
                    <ApplicationMark className="block h-9 w-auto" />
                  </InertiaLink>
                </div>

                {/* <!-- Navigation Links --> */}
                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                  <NavLink
                    href={route('dashboard')}
                    active={route().current('dashboard')}
                  >
                    Dashboard
                  </NavLink>
                </div>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="relative ml-3">
                  {/* <!-- Teams Dropdown --> */}
                  {page.props.jetstream.hasTeamFeatures ? (
                    <Dropdown
                      align="right"
                      width="60"
                      renderTrigger={() => (
                        <span className="inline-flex rounded-md">
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 focus:bg-gray-50 focus:outline-none active:bg-gray-50"
                          >
                            {page.props.user.current_team?.name}

                            <svg
                              className="ml-2 -mr-0.5 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      )}
                    >
                      <div className="w-60">
                        {/* <!-- Team Management --> */}
                        {page.props.jetstream.hasTeamFeatures ? (
                          <>
                            <div className="block px-4 py-2 text-xs text-gray-400">
                              Manage Team
                            </div>

                            {/* <!-- Team Settings --> */}
                            <DropdownLink
                              href={route('teams.show', [
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                page.props.user.current_team!,
                              ])}
                            >
                              Team Settings
                            </DropdownLink>

                            {page.props.jetstream.canCreateTeams ? (
                              <DropdownLink href={route('teams.create')}>
                                Create New Team
                              </DropdownLink>
                            ) : null}

                            <div className="border-t border-gray-100"></div>

                            {/* <!-- Team Switcher --> */}
                            <div className="block px-4 py-2 text-xs text-gray-400">
                              Switch Teams
                            </div>

                            {page.props.user.all_teams?.map((team) => (
                              <form
                                onSubmit={(e) => switchToTeam(e, team)}
                                key={team.id}
                              >
                                <DropdownLink as="button">
                                  <div className="flex items-center">
                                    {team.id ==
                                      page.props.user.current_team_id && (
                                      <svg
                                        className="mr-2 h-5 w-5 text-green-400"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                      </svg>
                                    )}
                                    <div>{team.name}</div>
                                  </div>
                                </DropdownLink>
                              </form>
                            ))}
                          </>
                        ) : null}
                      </div>
                    </Dropdown>
                  ) : null}
                </div>

                {/* <!-- Settings Dropdown --> */}
                <div className="relative ml-3">
                  <Dropdown
                    align="right"
                    width="48"
                    renderTrigger={() =>
                      page.props.jetstream.managesProfilePhotos ? (
                        <button className="flex rounded-full border-2 border-transparent text-sm transition focus:border-gray-300 focus:outline-none">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={page.props.user.profile_photo_url}
                            alt={page.props.user.name}
                          />
                        </button>
                      ) : (
                        <span className="inline-flex rounded-md">
                          <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition hover:text-gray-700 focus:outline-none"
                          >
                            {page.props.user.name}

                            <svg
                              className="ml-2 -mr-0.5 h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      )
                    }
                  >
                    {/* <!-- Account Management --> */}
                    <div className="block px-4 py-2 text-xs text-gray-400">
                      Manage Account
                    </div>

                    <DropdownLink href={route('profile.show')}>
                      Profile
                    </DropdownLink>

                    {page.props.jetstream.hasApiFeatures ? (
                      <DropdownLink href={route('api-tokens.index')}>
                        API Tokens
                      </DropdownLink>
                    ) : null}

                    <div className="border-t border-gray-100"></div>

                    {/* <!-- Authentication --> */}
                    <form onSubmit={logout}>
                      <DropdownLink as="button">Log Out</DropdownLink>
                    </form>
                  </Dropdown>
                </div>
              </div>

              {/* <!-- Hamburger --> */}
              <div className="-mr-2 flex items-center sm:hidden">
                <button
                  onClick={toggleIsShowingNavigationDropdown}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className={classNames({
                        hidden: isShowingNavigationDropdown,
                        'inline-flex': !isShowingNavigationDropdown,
                      })}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                    <path
                      className={classNames({
                        hidden: !isShowingNavigationDropdown,
                        'inline-flex': isShowingNavigationDropdown,
                      })}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* <!-- Responsive Navigation Menu --> */}
          <div
            className={classNames('sm:hidden', {
              block: isShowingNavigationDropdown,
              hidden: !isShowingNavigationDropdown,
            })}
          >
            <div className="space-y-1 pt-2 pb-3">
              <ResponsiveNavLink
                href={route('dashboard')}
                active={route().current('dashboard')}
              >
                Dashboard
              </ResponsiveNavLink>
            </div>

            {/* <!-- Responsive Settings Options --> */}
            <div className="border-t border-gray-200 pt-4 pb-1">
              <div className="flex items-center px-4">
                {page.props.jetstream.managesProfilePhotos ? (
                  <div className="mr-3 flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={page.props.user.profile_photo_url}
                      alt={page.props.user.name}
                    />
                  </div>
                ) : null}

                <div>
                  <div className="text-base font-medium text-gray-800">
                    {page.props.user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {page.props.user.email}
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <ResponsiveNavLink
                  href={route('profile.show')}
                  active={route().current('profile.show')}
                >
                  Profile
                </ResponsiveNavLink>

                {page.props.jetstream.hasApiFeatures ? (
                  <ResponsiveNavLink
                    href={route('api-tokens.index')}
                    active={route().current('api-tokens.index')}
                  >
                    API Tokens
                  </ResponsiveNavLink>
                ) : null}

                {/* <!-- Authentication --> */}
                <form method="POST" onSubmit={logout}>
                  <ResponsiveNavLink as="button">Log Out</ResponsiveNavLink>
                </form>

                {/* <!-- Team Management --> */}
                {page.props.jetstream.hasTeamFeatures ? (
                  <>
                    <div className="border-t border-gray-200"></div>

                    <div className="block px-4 py-2 text-xs text-gray-400">
                      Manage Team
                    </div>

                    {/* <!-- Team Settings --> */}
                    <ResponsiveNavLink
                      href={route('teams.show', [
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        page.props.user.current_team!,
                      ])}
                      active={route().current('teams.show')}
                    >
                      Team Settings
                    </ResponsiveNavLink>

                    {page.props.jetstream.canCreateTeams ? (
                      <ResponsiveNavLink
                        href={route('teams.create')}
                        active={route().current('teams.create')}
                      >
                        Create New Team
                      </ResponsiveNavLink>
                    ) : null}

                    <div className="border-t border-gray-200"></div>

                    {/* <!-- Team Switcher --> */}
                    <div className="block px-4 py-2 text-xs text-gray-400">
                      Switch Teams
                    </div>
                    {page.props.user?.all_teams?.map((team) => (
                      <form
                        onSubmit={(e) => switchToTeam(e, team)}
                        key={team.id}
                      >
                        <ResponsiveNavLink as="button">
                          <div className="flex items-center">
                            {team.id == page.props.user.current_team_id && (
                              <svg
                                className="mr-2 h-5 w-5 text-green-400"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            )}
                            <div>{team.name}</div>
                          </div>
                        </ResponsiveNavLink>
                      </form>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </nav>

        {/* <!-- Page Heading --> */}
        {renderHeader ? (
          <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
              {renderHeader()}
            </div>
          </header>
        ) : null}

        {/* <!-- Page Content --> */}
        <main>{children}</main>
      </div>
    </div>
  )
}
