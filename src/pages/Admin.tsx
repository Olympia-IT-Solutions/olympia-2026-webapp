import { useState, useEffect, useMemo, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Heading, Text, Button, Stack, Table, Badge, Container, Spinner, VStack, Input, DialogRoot, DialogPositioner, DialogBackdrop, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogCloseTrigger } from '@chakra-ui/react'
import { AthletesTable } from '../components/AthletesTable'
import { isAdmin } from '../logic/rights'
import { fetchAllUsers, createUser, deactivateUser, type ApiUser, type CreateUserRequest } from '../services/auth'
import { FaUserPlus, FaUsers, FaBan } from 'react-icons/fa'

type UserSortField = 'username' | 'name' | 'role' | 'status'
type SortDirection = 'asc' | 'desc'

export function Admin() {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'ADMIN' | 'REFEREE'>('all')
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [userSortField, setUserSortField] = useState<UserSortField>('username')
  const [userSortDirection, setUserSortDirection] = useState<SortDirection>('asc')
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [confirmDeactivateUserId, setConfirmDeactivateUserId] = useState<number | null>(null)
  const [addUserLoading, setAddUserLoading] = useState(false)
  const [addUserError, setAddUserError] = useState<string | null>(null)
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    name: '',
    username: '',
    password: '',
    role: 'REFEREE',
  })
  const { t } = useTranslation()

  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true)
      setUsersError(null)
      try {
        const data = await fetchAllUsers()
        setUsers(data)
      } catch (error) {
        setUsersError(error instanceof Error ? error.message : 'Failed to load users')
      } finally {
        setUsersLoading(false)
      }
    }

    loadUsers()
  }, [])

  const resetUserFilters = () => {
    setUserSearchTerm('')
    setUserRoleFilter('all')
    setUserStatusFilter('all')
    setUserSortField('username')
    setUserSortDirection('asc')
  }

  const toggleUserSort = (field: UserSortField) => {
    if (userSortField === field) {
      setUserSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'))
      return
    }

    setUserSortField(field)
    setUserSortDirection('asc')
  }

  const filteredUsers = useMemo(() => {
    const normalizedSearchTerm = userSearchTerm.trim().toLowerCase()

    const matchesSearch = (user: ApiUser) => {
      if (!normalizedSearchTerm) {
        return true
      }

      return [user.username, user.name, user.role, user.active ? 'active' : 'inactive']
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearchTerm))
    }

    const filtered = users.filter((user) => {
      const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter
      const matchesStatus =
        userStatusFilter === 'all'
          || (userStatusFilter === 'active' ? user.active : !user.active)

      return matchesRole && matchesStatus && matchesSearch(user)
    })

    return [...filtered].sort((leftUser, rightUser) => {
      let comparison = 0

      switch (userSortField) {
        case 'username':
          comparison = leftUser.username.localeCompare(rightUser.username, undefined, { sensitivity: 'base' })
          break
        case 'name':
          comparison = leftUser.name.localeCompare(rightUser.name, undefined, { sensitivity: 'base' })
          break
        case 'role':
          comparison = leftUser.role.localeCompare(rightUser.role, undefined, { sensitivity: 'base' })
          break
        case 'status':
          comparison = Number(leftUser.active) - Number(rightUser.active)
          break
      }

      return userSortDirection === 'asc' ? comparison : -comparison
    })
  }, [userRoleFilter, userSearchTerm, userSortDirection, userSortField, userStatusFilter, users])

  const renderUserSortHeader = (field: UserSortField, label: string) => {
    const isActiveSort = userSortField === field

    return (
      <Button
        variant="ghost"
        size="sm"
        px={0}
        justifyContent="flex-start"
        onClick={() => toggleUserSort(field)}
      >
        {label}
        <Text as="span" ml={2} fontSize="xs" color="gray.500">
          {isActiveSort ? (userSortDirection === 'asc' ? '↑' : '↓') : '↕'}
        </Text>
      </Button>
    )
  }

  if (!isAdmin()) {
    return (
      <Box p={10} textAlign="center">
        <Heading>{t('admin.accessDeniedTitle')}</Heading>
        <Text>{t('admin.accessDeniedText')}</Text>
      </Box>
    )
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.username || !newUser.password) {
      setAddUserError(t('admin.addUserValidationError'))
      return
    }

    setAddUserLoading(true)
    setAddUserError(null)
    try {
      const createdUser = await createUser(newUser)
      setUsers([...users, createdUser])
      setNewUser({ name: '', username: '', password: '', role: 'REFEREE' })
      setShowAddUserModal(false)
    } catch (error) {
      setAddUserError(error instanceof Error ? error.message : 'Failed to create user')
    } finally {
      setAddUserLoading(false)
    }
  }

  const handleDeactivateUser = async (userId: number) => {
    setUsersLoading(true)
    setUsersError(null)

    try {
      await deactivateUser(userId)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, active: false } : user
        )
      )
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : 'Failed to deactivate user')
    } finally {
      setUsersLoading(false)
    }
  }

  const openDeactivateDialog = (userId: number) => {
    setConfirmDeactivateUserId(userId)
  }

  const closeDeactivateDialog = () => {
    setConfirmDeactivateUserId(null)
  }

  const confirmDeactivate = async () => {
    if (confirmDeactivateUserId === null) return
    await handleDeactivateUser(confirmDeactivateUserId)
    closeDeactivateDialog()
  }

  return (
    <Box p={10}>
      <Container maxW="container.xl">
        <Heading mb={2}>{t('admin.title')}</Heading>

        {/* Users Management Section */}
        <Box mb={8} p={6} bg="var(--card-bg)" boxShadow="md" borderRadius="lg">
          <Stack direction="row" justify="space-between" align="center" mb={4}>
            <Heading size="lg">
              <FaUsers style={{ display: 'inline', marginRight: '10px' }} />
              {t('admin.usersManage')}
            </Heading>
            <Button
              colorScheme="teal"
              onClick={() => setShowAddUserModal(true)}
            >
              <FaUserPlus style={{ marginRight: '8px' }} />
              {t('admin.addUser')}
            </Button>
          </Stack>

          {usersLoading ? (
            <VStack justify="center" py={8}>
              <Spinner size="lg" />
              <Text>{t('admin.loading')}</Text>
            </VStack>
          ) : usersError ? (
            <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red">
              <Text color="red.700">{t('admin.usersLoadError')}: {usersError}</Text>
            </Box>
          ) : users.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={4}>{t('admin.noUsers')}</Text>
          ) : (
            <>
              <Stack gap={3} mb={4}>
                <Input
                  placeholder={t('admin.searchUsersPlaceholder')}
                  value={userSearchTerm}
                  onChange={(event) => setUserSearchTerm(event.target.value)}
                />
                <Stack direction={{ base: 'column', md: 'row' }} gap={3}>
                  <Box flex="1">
                    <Text mb={2} fontWeight="500">{t('admin.table.columns.role')}</Text>
                    <select
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                      value={userRoleFilter}
                      onChange={(event) => setUserRoleFilter(event.target.value as 'all' | 'ADMIN' | 'REFEREE')}
                    >
                      <option value="all">{t('admin.filters.all')}</option>
                      <option value="ADMIN">{t('admin.roleAdmin')}</option>
                      <option value="REFEREE">{t('admin.roleReferee')}</option>
                    </select>
                  </Box>
                  <Box flex="1">
                    <Text mb={2} fontWeight="500">{t('admin.table.columns.status')}</Text>
                    <select
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                      value={userStatusFilter}
                      onChange={(event) => setUserStatusFilter(event.target.value as 'all' | 'active' | 'inactive')}
                    >
                      <option value="all">{t('admin.filters.all')}</option>
                      <option value="active">{t('admin.active')}</option>
                      <option value="inactive">{t('admin.inactive')}</option>
                    </select>
                  </Box>
                  <Box display="flex" alignItems="end">
                    <Button variant="outline" onClick={resetUserFilters} width={{ base: '100%', md: 'auto' }}>
                      {t('admin.resetFilters')}
                    </Button>
                  </Box>
                </Stack>
              </Stack>

              <Table.Root variant="line">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>{renderUserSortHeader('username', t('admin.table.columns.username'))}</Table.ColumnHeader>
                    <Table.ColumnHeader>{renderUserSortHeader('name', t('admin.table.columns.name'))}</Table.ColumnHeader>
                    <Table.ColumnHeader>{renderUserSortHeader('role', t('admin.table.columns.role'))}</Table.ColumnHeader>
                    <Table.ColumnHeader>{renderUserSortHeader('status', t('admin.table.columns.status'))}</Table.ColumnHeader>
                    <Table.ColumnHeader>{t('admin.table.columns.actions')}</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredUsers.map((user) => (
                    <Table.Row key={user.id}>
                      <Table.Cell fontWeight="500">{user.username}</Table.Cell>
                      <Table.Cell>{user.name}</Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={user.role === 'ADMIN' ? 'red' : 'blue'}>
                          {user.role === 'ADMIN' ? t('admin.roleAdmin') : t('admin.roleReferee')}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge colorPalette={user.active ? 'green' : 'red'}>
                          {user.active ? t('admin.active') : t('admin.inactive')}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        {user.active && (
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => openDeactivateDialog(user.id)}
                            title={t('admin.deactivateUser')}
                          >
                            <FaBan />
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
              {filteredUsers.length === 0 && (
                <Text textAlign="center" color="gray.500" py={4}>{t('admin.noFilteredUsers')}</Text>
              )}
            </>
          )}
        </Box>

        <AthletesTable />

        {/* Add User Modal */}
        {showAddUserModal && (
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            bg="rgba(0,0,0,0.5)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="1000"
            onClick={() => setShowAddUserModal(false)}
          >
            <Box
              p={6}
              bg="var(--card-bg)"
              boxShadow="lg"
              borderRadius="lg"
              maxW="500px"
              width="90%"
              onClick={(e) => e.stopPropagation()}
            >
              <Heading mb={4}>{t('admin.addUserTitle')}</Heading>

              {addUserError && (
                <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={4}>
                  <Text color="red.700">{addUserError}</Text>
                </Box>
              )}

              <Stack gap={4} mb={6}>
                <div>
                  <Text mb={2} fontWeight="500">{t('admin.form.name')} *</Text>
                  <Input
                    placeholder={t('admin.form.namePlaceholder')}
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>

                <div>
                  <Text mb={2} fontWeight="500">{t('admin.form.username')} *</Text>
                  <Input
                    placeholder={t('admin.form.usernamePlaceholder')}
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  />
                </div>

                <div>
                  <Text mb={2} fontWeight="500">{t('admin.form.password')} *</Text>
                  <Input
                    type="password"
                    placeholder={t('admin.form.passwordPlaceholder')}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>

                <div>
                  <Text mb={2} fontWeight="500">{t('admin.form.role')} *</Text>
                  <select
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                    value={newUser.role}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewUser({ ...newUser, role: e.target.value as 'ADMIN' | 'REFEREE' })}
                  >
                    <option value="REFEREE">{t('admin.roleReferee')}</option>
                    <option value="ADMIN">{t('admin.roleAdmin')}</option>
                  </select>
                </div>
              </Stack>

              <Stack direction="row" gap={3}>
                <Button
                  colorScheme="teal"
                  onClick={handleAddUser}
                  loading={addUserLoading}
                  flex="1"
                >
                  {t('admin.buttons.save')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddUserModal(false)}
                  disabled={addUserLoading}
                  flex="1"
                >
                  {t('admin.buttons.cancel')}
                </Button>
              </Stack>
            </Box>
          </Box>
        )}

        {/* Deactivate confirmation modal */}
        <DialogRoot open={confirmDeactivateUserId !== null} onOpenChange={(open) => { if (!open) closeDeactivateDialog() }}>
          <DialogPositioner>
            <DialogBackdrop />
            <DialogContent bg="var(--card-bg)" p={6} borderRadius="lg" boxShadow="xl" maxW="md">
              <DialogHeader display="flex" alignItems="start" justifyContent="space-between" p={0} pb={3}>
                <DialogTitle>{t('admin.confirmDeactivateTitle')}</DialogTitle>
                <DialogCloseTrigger asChild>
                  <Button size="sm" variant="ghost" onClick={closeDeactivateDialog}>×</Button>
                </DialogCloseTrigger>
              </DialogHeader>

              <DialogBody p={0} pb={6}>
                <Text>{t('admin.confirmDeactivateUser')}</Text>
              </DialogBody>

              <DialogFooter p={0} gap={3} justifyContent="flex-end">
                <Button variant="outline" onClick={closeDeactivateDialog}>
                  {t('admin.buttons.cancel')}
                </Button>
                <Button colorScheme="red" onClick={confirmDeactivate}>
                  {t('admin.deactivateUser')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      </Container>
    </Box>
  )
}
