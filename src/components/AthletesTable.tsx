import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge, Box, Button, DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogPositioner, DialogRoot, DialogTitle, Heading, Icon, Input, Stack, Table, Text } from '@chakra-ui/react'
import { FaBan, FaCheck, FaEdit, FaUserPlus, FaUsers } from 'react-icons/fa'
import { useSportsStore } from '../store/sports'
import { fetchAllCountries, type CountryOption } from '../services/countries'
import { activateAthlete, createAthlete, deactivateAthlete, fetchAllAthletes, updateAthlete, type Athlete, type CreateAthleteRequest, type UpdateAthleteRequest } from '../services/athletes'
import { DataTableState, DataTableSurface, getDataTableRowStyles, LoadingSpinner } from './ui'

type AthleteSortField = 'id' | 'name' | 'countryCode' | 'countryName' | 'sportId' | 'sportName' | 'active'
type SortDirection = 'asc' | 'desc'

export function AthletesTable() {
  const { t } = useTranslation()
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [athleteSearchTerm, setAthleteSearchTerm] = useState('')
  const [athleteStatusFilter, setAthleteStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [athleteSportFilter, setAthleteSportFilter] = useState('all')
  const [athleteCountryFilter, setAthleteCountryFilter] = useState('all')
  const [athleteSortField, setAthleteSortField] = useState<AthleteSortField>('id')
  const [athleteSortDirection, setAthleteSortDirection] = useState<SortDirection>('asc')
  const [showAddAthleteModal, setShowAddAthleteModal] = useState(false)
  const [addAthleteLoading, setAddAthleteLoading] = useState(false)
  const [addAthleteError, setAddAthleteError] = useState<string | null>(null)
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [countriesLoading, setCountriesLoading] = useState(false)
  const [countriesError, setCountriesError] = useState<string | null>(null)
  const [showEditAthleteModal, setShowEditAthleteModal] = useState(false)
  const [editAthleteLoading, setEditAthleteLoading] = useState(false)
  const [editAthleteError, setEditAthleteError] = useState<string | null>(null)
  const [editAthleteForm, setEditAthleteForm] = useState<UpdateAthleteRequest>({
    id: 0,
    name: '',
    sportId: 0,
    countryId: 0,
  })
  const [statusActionLoadingId, setStatusActionLoadingId] = useState<number | null>(null)
  const [statusActionError, setStatusActionError] = useState<string | null>(null)
  const [statusActionPrompt, setStatusActionPrompt] = useState<{
    athleteId: number
    athleteName: string
    action: 'activate' | 'deactivate'
  } | null>(null)
  const [newAthlete, setNewAthlete] = useState<CreateAthleteRequest>({
    name: '',
    sportId: 0,
    countryId: 0,
  })
  const sports = useSportsStore((state) => state.sports)
  const sportsLoading = useSportsStore((state) => state.loading)
  const sportsError = useSportsStore((state) => state.error)
  const initializeSports = useSportsStore((state) => state.initializeSports)
  const activeSports = useMemo(
    () => [...sports.filter((sport) => sport.active)].sort((leftSport, rightSport) => leftSport.name.localeCompare(rightSport.name, undefined, { sensitivity: 'base' })),
    [sports],
  )
  const allSports = useMemo(
    () => [...sports].sort((leftSport, rightSport) => leftSport.name.localeCompare(rightSport.name, undefined, { sensitivity: 'base' })),
    [sports],
  )
  const sortedCountries = useMemo(
    () => [...countries].sort((leftCountry, rightCountry) => leftCountry.name.localeCompare(rightCountry.name, undefined, { sensitivity: 'base' })),
    [countries],
  )

  const loadAthletes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchAllAthletes()
      setAthletes(data)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to fetch athletes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAthletes()
  }, [loadAthletes])

  useEffect(() => {
    if (sports.length === 0 && !sportsLoading) {
      void initializeSports()
    }
  }, [initializeSports, sports.length, sportsLoading])

  useEffect(() => {
    const loadCountries = async () => {
      setCountriesLoading(true)
      setCountriesError(null)

      try {
        const data = await fetchAllCountries()
        setCountries(data)
      } catch (loadError) {
        setCountriesError(loadError instanceof Error ? loadError.message : 'Failed to fetch countries')
      } finally {
        setCountriesLoading(false)
      }
    }

    void loadCountries()
  }, [])

  const resetAthleteFilters = () => {
    setAthleteSearchTerm('')
    setAthleteStatusFilter('all')
    setAthleteSportFilter('all')
    setAthleteCountryFilter('all')
    setAthleteSortField('id')
    setAthleteSortDirection('asc')
  }

  const toggleAthleteSort = (field: AthleteSortField) => {
    if (athleteSortField === field) {
      setAthleteSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'))
      return
    }

    setAthleteSortField(field)
    setAthleteSortDirection('asc')
  }

  const filteredAthletes = useMemo(() => {
    const normalizedSearchTerm = athleteSearchTerm.trim().toLowerCase()

    const matchesSearch = (athlete: Athlete) => {
      if (!normalizedSearchTerm) {
        return true
      }

      return [
        athlete.id.toString(),
        athlete.name,
        athlete.countryCode ?? '',
        athlete.countryName ?? '',
        athlete.sportId?.toString() ?? '',
        athlete.sportName ?? '',
        athlete.active ? 'active' : 'inactive',
      ].some((value) => value.toLowerCase().includes(normalizedSearchTerm))
    }

    const filtered = athletes.filter((athlete) => {
      const matchesStatus =
        athleteStatusFilter === 'all'
          || (athleteStatusFilter === 'active' ? athlete.active : !athlete.active)
      const matchesSport = athleteSportFilter === 'all' || String(athlete.sportId ?? '') === athleteSportFilter
      const matchesCountry = athleteCountryFilter === 'all' || String(athlete.countryId ?? '') === athleteCountryFilter

      return matchesStatus && matchesSport && matchesCountry && matchesSearch(athlete)
    })

    return [...filtered].sort((leftAthlete, rightAthlete) => {
      let comparison = 0

      switch (athleteSortField) {
        case 'id':
          comparison = leftAthlete.id - rightAthlete.id
          break
        case 'name':
          comparison = leftAthlete.name.localeCompare(rightAthlete.name, undefined, { sensitivity: 'base' })
          break
        case 'countryCode':
          comparison = (leftAthlete.countryCode ?? '').localeCompare(rightAthlete.countryCode ?? '', undefined, { sensitivity: 'base' })
          break
        case 'countryName':
          comparison = (leftAthlete.countryName ?? '').localeCompare(rightAthlete.countryName ?? '', undefined, { sensitivity: 'base' })
          break
        case 'sportId':
          comparison = (leftAthlete.sportId ?? 0) - (rightAthlete.sportId ?? 0)
          break
        case 'sportName':
          comparison = (leftAthlete.sportName ?? '').localeCompare(rightAthlete.sportName ?? '', undefined, { sensitivity: 'base' })
          break
        case 'active':
          comparison = Number(leftAthlete.active) - Number(rightAthlete.active)
          break
      }

      return athleteSortDirection === 'asc' ? comparison : -comparison
    })
  }, [athleteCountryFilter, athleteSearchTerm, athleteSortDirection, athleteSortField, athleteSportFilter, athleteStatusFilter, athletes])

  const renderAthleteSortHeader = (field: AthleteSortField, label: string) => {
    const isActiveSort = athleteSortField === field

    return (
      <Button
        variant="ghost"
        size="sm"
        px={0}
        justifyContent="flex-start"
        color="text"
        fontWeight="semibold"
        onClick={() => toggleAthleteSort(field)}
      >
        {label}
        <Text as="span" ml={2} fontSize="xs" color="text-muted">
          {isActiveSort ? (athleteSortDirection === 'asc' ? '↑' : '↓') : '↕'}
        </Text>
      </Button>
    )
  }

  const handleCreateAthlete = async () => {
    if (!newAthlete.name || !newAthlete.sportId || !newAthlete.countryId) {
      setAddAthleteError(t('admin.addAthleteValidationError'))
      return
    }

    setAddAthleteLoading(true)
    setAddAthleteError(null)

    try {
      await createAthlete(newAthlete)
      await loadAthletes()
      setNewAthlete({ name: '', sportId: 0, countryId: 0 })
      setShowAddAthleteModal(false)
    } catch (createError) {
      setAddAthleteError(createError instanceof Error ? createError.message : t('admin.addAthleteValidationError'))
    } finally {
      setAddAthleteLoading(false)
    }
  }

  const openEditAthleteModal = (athlete: Athlete) => {
    setEditAthleteError(null)
    setEditAthleteForm({
      id: athlete.id,
      name: athlete.name,
      sportId: athlete.sportId ?? 0,
      countryId: athlete.countryId ?? 0,
    })
    setShowEditAthleteModal(true)
  }

  const closeEditAthleteModal = () => {
    if (!editAthleteLoading) {
      setShowEditAthleteModal(false)
    }
  }

  const handleUpdateAthlete = async () => {
    if (!editAthleteForm.name || !editAthleteForm.sportId || !editAthleteForm.countryId) {
      setEditAthleteError(t('admin.editAthleteValidationError'))
      return
    }

    setEditAthleteLoading(true)
    setEditAthleteError(null)

    try {
      await updateAthlete(editAthleteForm)
      await loadAthletes()
      setShowEditAthleteModal(false)
    } catch (updateError) {
      setEditAthleteError(updateError instanceof Error ? updateError.message : t('admin.editAthleteValidationError'))
    } finally {
      setEditAthleteLoading(false)
    }
  }

  const handleAthleteStatusAction = async (athleteId: number, action: 'activate' | 'deactivate') => {
    setStatusActionLoadingId(athleteId)
    setStatusActionError(null)

    try {
      if (action === 'activate') {
        await activateAthlete(athleteId)
      } else {
        await deactivateAthlete(athleteId)
      }

      await loadAthletes()
    } catch (actionError) {
      setStatusActionError(actionError instanceof Error ? actionError.message : t('admin.athletesStatusActionError'))
    } finally {
      setStatusActionLoadingId(null)
    }
  }

  const openStatusActionPrompt = (athleteId: number, athleteName: string, action: 'activate' | 'deactivate') => {
    setStatusActionError(null)
    setStatusActionPrompt({ athleteId, athleteName, action })
  }

  const closeStatusActionPrompt = () => {
    if (statusActionLoadingId === null) {
      setStatusActionPrompt(null)
    }
  }

  const confirmStatusAction = async () => {
    if (!statusActionPrompt) {
      return
    }

    await handleAthleteStatusAction(statusActionPrompt.athleteId, statusActionPrompt.action)
    setStatusActionPrompt(null)
  }

  const getStatusActionLabel = (action: 'activate' | 'deactivate') => {
    return action === 'activate' ? t('admin.athleteActivate') : t('admin.athleteDeactivate')
  }

  return (
    <Box
      mb={8}
      p={6}
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      boxShadow="ring-soft"
      borderRadius="3xl"
      overflowX="auto"
    >
      <Stack direction="row" justify="space-between" align="center" mb={4} gap={4}>
        <Heading size="lg" display="flex" alignItems="center" gap={2}>
          <Icon as={FaUsers} boxSize={4} color="accent" />
          {t('admin.athletesTitle')}
        </Heading>
        <Button
          colorScheme="teal"
          onClick={() => {
            setAddAthleteError(null)
            setNewAthlete({ name: '', sportId: 0, countryId: 0 })
            setShowAddAthleteModal(true)
          }}
        >
          <Icon as={FaUserPlus} boxSize={3.5} mr={1.5} />
          {t('admin.addAthlete')}
        </Button>
      </Stack>
      {sportsError && (
        <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={4}>
          <Text color="red.700">{sportsError}</Text>
        </Box>
      )}
      {statusActionError && (
        <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={4}>
          <Text color="red.700">{t('admin.athletesStatusActionError')}: {statusActionError}</Text>
        </Box>
      )}
      {loading ? (
        <Box p={4} display="flex" justifyContent="center" alignItems="center" minH="200px">
          <LoadingSpinner size="lg" />
        </Box>
      ) : error ? (
        <DataTableState
          tone="danger"
          message={t('admin.athletesLoadError')}
          helperText={error}
        />
      ) : athletes.length === 0 ? (
        <DataTableState message={t('admin.noAthletes')} />
      ) : (
        <>
          <Stack gap={3} mb={4}>
            <Input
              placeholder={t('admin.searchAthletesPlaceholder')}
              value={athleteSearchTerm}
              color="text"
              bg="input-bg"
              borderColor="border"
              _placeholder={{ color: 'text-muted' }}
              onChange={(event) => setAthleteSearchTerm(event.target.value)}
            />
            <Stack direction={{ base: 'column', lg: 'row' }} gap={3}>
              <Box flex="1">
                <Text mb={2} fontWeight="500">{t('admin.table.columns.status')}</Text>
                <select
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                  value={athleteStatusFilter}
                  onChange={(event) => setAthleteStatusFilter(event.target.value as 'all' | 'active' | 'inactive')}
                >
                  <option value="all">{t('admin.filters.all')}</option>
                  <option value="active">{t('admin.active')}</option>
                  <option value="inactive">{t('admin.inactive')}</option>
                </select>
              </Box>
              <Box flex="1">
                <Text mb={2} fontWeight="500">{t('admin.athletesTable.columns.sportName')}</Text>
                <select
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                  value={athleteSportFilter}
                  onChange={(event) => setAthleteSportFilter(event.target.value)}
                  disabled={sportsLoading || allSports.length === 0}
                >
                  <option value="all">
                    {sportsLoading
                      ? t('admin.loading')
                      : t('admin.filters.all')}
                  </option>
                  {allSports.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
                {!sportsLoading && allSports.length === 0 && (
                  <Text fontSize="sm" color="text-muted" mt={2}>
                    {t('admin.noSports')}
                  </Text>
                )}
              </Box>
              <Box flex="1">
                <Text mb={2} fontWeight="500">{t('admin.athletesTable.columns.countryName')}</Text>
                <select
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                  value={athleteCountryFilter}
                  onChange={(event) => setAthleteCountryFilter(event.target.value)}
                  disabled={countriesLoading || sortedCountries.length === 0}
                >
                  <option value="all">
                    {countriesLoading
                      ? t('admin.loading')
                      : t('admin.filters.all')}
                  </option>
                  {sortedCountries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {countriesError && (
                  <Text fontSize="sm" color="red.500" mt={2}>
                    {t('admin.countriesLoadError')}: {countriesError}
                  </Text>
                )}
                {!countriesLoading && !countriesError && sortedCountries.length === 0 && (
                  <Text fontSize="sm" color="text-muted" mt={2}>
                    {t('admin.noCountries')}
                  </Text>
                )}
              </Box>
              <Box display="flex" alignItems="end">
                <Button variant="solid" colorPalette="gray" onClick={resetAthleteFilters} width={{ base: '100%', lg: 'auto' }}>
                  {t('admin.resetFilters')}
                </Button>
              </Box>
            </Stack>
          </Stack>

          <DataTableSurface elevated={false}>
            <Table.ScrollArea>
              <Table.Root variant="outline" size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader whiteSpace="nowrap" w="90px" py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{renderAthleteSortHeader('id', t('admin.athletesTable.columns.id'))}</Table.ColumnHeader>
                    <Table.ColumnHeader minW="220px" py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{renderAthleteSortHeader('name', t('admin.athletesTable.columns.name'))}</Table.ColumnHeader>
                    <Table.ColumnHeader whiteSpace="nowrap" w="140px" py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{renderAthleteSortHeader('countryCode', t('admin.athletesTable.columns.countryCode'))}</Table.ColumnHeader>
                    <Table.ColumnHeader minW="180px" py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{renderAthleteSortHeader('countryName', t('admin.athletesTable.columns.countryName'))}</Table.ColumnHeader>
                    <Table.ColumnHeader whiteSpace="nowrap" w="100px" py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{renderAthleteSortHeader('sportId', t('admin.athletesTable.columns.sportId'))}</Table.ColumnHeader>
                    <Table.ColumnHeader minW="180px" py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{renderAthleteSortHeader('sportName', t('admin.athletesTable.columns.sportName'))}</Table.ColumnHeader>
                    <Table.ColumnHeader whiteSpace="nowrap" w="110px" py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{renderAthleteSortHeader('active', t('admin.athletesTable.columns.active'))}</Table.ColumnHeader>
                    <Table.ColumnHeader whiteSpace="nowrap" w="120px" py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{t('admin.athletesTable.columns.edit')}</Table.ColumnHeader>
                    <Table.ColumnHeader whiteSpace="nowrap" w="130px" py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{t('admin.athletesTable.columns.actions')}</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredAthletes.map((athlete) => (
                    <Table.Row key={athlete.id} {...getDataTableRowStyles()}>
                      <Table.Cell fontWeight="500" py={3}>{athlete.id}</Table.Cell>
                      <Table.Cell py={3}>{athlete.name}</Table.Cell>
                      <Table.Cell py={3}>{athlete.countryCode ?? '-'}</Table.Cell>
                      <Table.Cell py={3}>{athlete.countryName ?? '-'}</Table.Cell>
                      <Table.Cell py={3}>{athlete.sportId ?? '-'}</Table.Cell>
                      <Table.Cell py={3}>{athlete.sportName ?? '-'}</Table.Cell>
                      <Table.Cell py={3}>
                        <Badge colorPalette={athlete.active ? 'green' : 'red'}>
                          {athlete.active ? t('admin.active') : t('admin.inactive')}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell py={3}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="solid"
                          onClick={() => openEditAthleteModal(athlete)}
                        >
                          <Icon as={FaEdit} boxSize={3.5} mr={1.5} />
                          {t('admin.athleteEdit')}
                        </Button>
                      </Table.Cell>
                      <Table.Cell py={3}>
                        {athlete.active ? (
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="solid"
                            onClick={() => openStatusActionPrompt(athlete.id, athlete.name, 'deactivate')}
                            loading={statusActionLoadingId === athlete.id}
                          >
                            <Icon as={FaBan} boxSize={3.5} mr={1.5} />
                            {t('admin.athleteDeactivate')}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            colorScheme="green"
                            variant="solid"
                            onClick={() => openStatusActionPrompt(athlete.id, athlete.name, 'activate')}
                            loading={statusActionLoadingId === athlete.id}
                          >
                            <Icon as={FaCheck} boxSize={3.5} mr={1.5} />
                            {t('admin.athleteActivate')}
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </DataTableSurface>
          {filteredAthletes.length === 0 && (
            <Text textAlign="center" color="text-muted" py={4}>{t('admin.noFilteredAthletes')}</Text>
          )}
        </>
      )}

      <DialogRoot open={showAddAthleteModal} onOpenChange={(open) => { if (!open) setShowAddAthleteModal(false) }}>
        <DialogPositioner>
          <DialogBackdrop />
          <DialogContent bg="var(--card-bg)" p={6} borderRadius="lg" boxShadow="xl" maxW="md">
            <DialogHeader display="flex" alignItems="start" justifyContent="space-between" p={0} pb={3}>
              <DialogTitle>{t('admin.addAthleteTitle')}</DialogTitle>
              <DialogCloseTrigger asChild>
                <Button size="sm" variant="ghost" onClick={() => setShowAddAthleteModal(false)}>×</Button>
              </DialogCloseTrigger>
            </DialogHeader>

            <DialogBody p={0}>
              {addAthleteError && (
                <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={4}>
                  <Text color="red.700">{addAthleteError}</Text>
                </Box>
              )}

              <Stack gap={4}>
                <Box>
                  <Text mb={2} fontWeight="500">{t('admin.athleteForm.name')} *</Text>
                  <Input
                    placeholder={t('admin.athleteForm.namePlaceholder')}
                    value={newAthlete.name}
                    onChange={(event) => setNewAthlete({ ...newAthlete, name: event.target.value })}
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="500">{t('admin.athleteForm.sportId')} *</Text>
                  <select
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                    value={newAthlete.sportId ? String(newAthlete.sportId) : ''}
                    onChange={(event) => setNewAthlete({ ...newAthlete, sportId: Number(event.target.value) || 0, countryId: 0 })}
                    disabled={sportsLoading || activeSports.length === 0}
                  >
                    <option value="">
                      {sportsLoading
                        ? t('admin.loading')
                        : t('admin.athleteForm.sportIdPlaceholder')}
                    </option>
                    {activeSports.map((sport) => (
                      <option key={sport.id} value={sport.id}>
                        {sport.name}
                      </option>
                    ))}
                  </select>
                  {!sportsLoading && activeSports.length === 0 && (
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      {t('admin.noSports')}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text mb={2} fontWeight="500">{t('admin.athleteForm.countryId')} *</Text>
                  <select
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                    value={newAthlete.countryId ? String(newAthlete.countryId) : ''}
                    onChange={(event) => setNewAthlete({ ...newAthlete, countryId: Number(event.target.value) || 0 })}
                    disabled={countriesLoading || countries.length === 0}
                  >
                    <option value="">
                      {countriesLoading
                        ? t('admin.loading')
                        : t('admin.athleteForm.countryIdPlaceholder')}
                    </option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {countriesError && (
                    <Text fontSize="sm" color="red.500" mt={2}>
                      {t('admin.countriesLoadError')}: {countriesError}
                    </Text>
                  )}
                  {!countriesLoading && !countriesError && countries.length === 0 && (
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      {t('admin.noCountries')}
                    </Text>
                  )}
                </Box>
              </Stack>
            </DialogBody>

            <DialogFooter p={0} gap={3} justifyContent="flex-end" mt={6}>
              <Button variant="solid" colorPalette="gray" onClick={() => setShowAddAthleteModal(false)} disabled={addAthleteLoading}>
                {t('admin.buttons.cancel')}
              </Button>
              <Button colorScheme="teal" variant="solid" onClick={handleCreateAthlete} loading={addAthleteLoading}>
                {t('admin.buttons.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      <DialogRoot open={showEditAthleteModal} onOpenChange={(open) => { if (!open) closeEditAthleteModal() }}>
        <DialogPositioner>
          <DialogBackdrop />
          <DialogContent bg="var(--card-bg)" p={6} borderRadius="lg" boxShadow="xl" maxW="md">
            <DialogHeader display="flex" alignItems="start" justifyContent="space-between" p={0} pb={3}>
              <DialogTitle>{t('admin.editAthleteTitle')}</DialogTitle>
              <DialogCloseTrigger asChild>
                <Button size="sm" variant="ghost" onClick={closeEditAthleteModal}>×</Button>
              </DialogCloseTrigger>
            </DialogHeader>

            <DialogBody p={0}>
              {editAthleteError && (
                <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={4}>
                  <Text color="red.700">{editAthleteError}</Text>
                </Box>
              )}

              <Stack gap={4}>
                <Box>
                  <Text mb={2} fontWeight="500">{t('admin.athleteForm.name')} *</Text>
                  <Input
                    placeholder={t('admin.athleteForm.namePlaceholder')}
                    value={editAthleteForm.name}
                    onChange={(event) => setEditAthleteForm({ ...editAthleteForm, name: event.target.value })}
                  />
                </Box>

                <Box>
                  <Text mb={2} fontWeight="500">{t('admin.athleteForm.sportId')} *</Text>
                  <select
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                    value={editAthleteForm.sportId ? String(editAthleteForm.sportId) : ''}
                    onChange={(event) => setEditAthleteForm({ ...editAthleteForm, sportId: Number(event.target.value) || 0 })}
                    disabled={sportsLoading || activeSports.length === 0}
                  >
                    <option value="">
                      {sportsLoading
                        ? t('admin.loading')
                        : t('admin.athleteForm.sportIdPlaceholder')}
                    </option>
                    {activeSports.map((sport) => (
                      <option key={sport.id} value={sport.id}>
                        {sport.name}
                      </option>
                    ))}
                  </select>
                </Box>

                <Box>
                  <Text mb={2} fontWeight="500">{t('admin.athleteForm.countryId')} *</Text>
                  <select
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                    value={editAthleteForm.countryId ? String(editAthleteForm.countryId) : ''}
                    onChange={(event) => setEditAthleteForm({ ...editAthleteForm, countryId: Number(event.target.value) || 0 })}
                    disabled={countriesLoading || countries.length === 0}
                  >
                    <option value="">
                      {countriesLoading
                        ? t('admin.loading')
                        : t('admin.athleteForm.countryIdPlaceholder')}
                    </option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </Box>
              </Stack>
            </DialogBody>

            <DialogFooter p={0} gap={3} justifyContent="flex-end" mt={6}>
              <Button variant="solid" colorPalette="gray" onClick={closeEditAthleteModal} disabled={editAthleteLoading}>
                {t('admin.buttons.cancel')}
              </Button>
              <Button colorScheme="blue" variant="solid" onClick={handleUpdateAthlete} loading={editAthleteLoading}>
                {t('admin.buttons.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

      <DialogRoot open={statusActionPrompt !== null} onOpenChange={(open) => { if (!open) closeStatusActionPrompt() }}>
        <DialogPositioner>
          <DialogBackdrop />
          <DialogContent bg="var(--card-bg)" p={6} borderRadius="lg" boxShadow="xl" maxW="md">
            <DialogHeader display="flex" alignItems="start" justifyContent="space-between" p={0} pb={3}>
              <DialogTitle>{t('admin.athleteStatusConfirmTitle')}</DialogTitle>
              <DialogCloseTrigger asChild>
                <Button size="sm" variant="ghost" onClick={closeStatusActionPrompt}>×</Button>
              </DialogCloseTrigger>
            </DialogHeader>

            <DialogBody p={0} pb={6}>
              <Text>
                {statusActionPrompt
                  ? t('admin.athleteStatusConfirmText', {
                      action: getStatusActionLabel(statusActionPrompt.action),
                      athlete: statusActionPrompt.athleteName,
                    })
                  : ''}
              </Text>
            </DialogBody>

            <DialogFooter p={0} gap={3} justifyContent="flex-end">
              <Button variant="solid" colorPalette="gray" onClick={closeStatusActionPrompt} disabled={statusActionLoadingId !== null}>
                {t('admin.buttons.cancel')}
              </Button>
              <Button
                colorScheme={statusActionPrompt?.action === 'activate' ? 'green' : 'red'}
                variant="solid"
                onClick={confirmStatusAction}
                loading={statusActionLoadingId !== null}
              >
                {t('admin.buttons.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  )
}