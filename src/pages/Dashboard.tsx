import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge, Box, Button, Card, Container, DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogPositioner, DialogRoot, DialogTitle, Heading, Input, Spinner, Stack, Text } from '@chakra-ui/react'
import { getCurrentUser } from '../logic/rights'
import { ResultsBySportTable } from '../components/ResultsBySportTable'
import { type Sport } from '../services/sports'
import { approveResult, createResult, fetchResultsBySport, invalidateResult, rejectResult, type Result as ApiResult } from '../services/results'
import { fetchAllAthletes, type Athlete } from '../services/athletes'
import { useSportsStore } from '../store/sports'

const getResultsErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Failed to fetch results'

type PendingAction = {
  action: 'approve' | 'reject' | 'invalidate'
  resultId: number
  sportId: number
  athleteName: string
}

type CreateResultFormState = {
  athleteId: string
  sportId: string
  value: string
  rank: string
}

export function Dashboard() {
  const currentUser = getCurrentUser()
  const { t } = useTranslation()
  const currentRole = currentUser?.role ?? null
  const sports = useSportsStore((state) => state.sports)
  const sportsLoading = useSportsStore((state) => state.loading)
  const sportsError = useSportsStore((state) => state.error)
  const initializeSports = useSportsStore((state) => state.initializeSports)
  const [resultsBySport, setResultsBySport] = useState<Record<number, ApiResult[]>>({})
  const [resultsLoading, setResultsLoading] = useState(false)
  const [resultsError, setResultsError] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [showCreateResultModal, setShowCreateResultModal] = useState(false)
  const [createResultLoading, setCreateResultLoading] = useState(false)
  const [createResultError, setCreateResultError] = useState<string | null>(null)
  const [newResult, setNewResult] = useState<CreateResultFormState>({
    athleteId: '',
    sportId: '',
    value: '',
    rank: '',
  })
  const [athletesBySport, setAthletesBySport] = useState<Record<number, Athlete[]>>({})
  const [allAthletes, setAllAthletes] = useState<Athlete[]>([])
  const [athletesLoading, setAthletesLoading] = useState(false)
  const [athletesError, setAthletesError] = useState<string | null>(null)

  useEffect(() => {
    if (sports.length === 0 && !sportsLoading) {
      initializeSports()
    }
  }, [initializeSports, sports.length, sportsLoading])

  useEffect(() => {
    let isActive = true

    const loadResults = async (sportList: Sport[]) => {
      const activeSports = sportList.filter((sport) => sport.active)

      if (activeSports.length === 0) {
        setResultsBySport({})
        return
      }

      setResultsLoading(true)
      setResultsError(null)

      try {
        const responses = await Promise.all(
          activeSports.map(async (sport) => ({
            sportId: sport.id,
            results: await fetchResultsBySport(sport.id),
          }))
        )

        if (!isActive) return

        const nextResults = responses.reduce<Record<number, ApiResult[]>>((accumulator, entry) => {
          accumulator[entry.sportId] = entry.results
          return accumulator
        }, {})

        setResultsBySport(nextResults)
      } catch (error) {
        if (!isActive) return
        setResultsError(getResultsErrorMessage(error))
      } finally {
        if (isActive) {
          setResultsLoading(false)
        }
      }
    }

    if (sports.length > 0) {
      void loadResults(sports)
    }

    return () => {
      isActive = false
    }
  }, [sports])

  const activeSports = useMemo(() => sports.filter((sport) => sport.active), [sports])
  const hasAnyResults = Object.values(resultsBySport).some((sportResults) => sportResults.length > 0)
  const isInitialLoading = sportsLoading || (resultsLoading && !hasAnyResults)

  const updateSportResultStatus = (sportId: number, resultId: number, nextStatus: ApiResult['status']) => {
    setResultsBySport((previousResults) => ({
      ...previousResults,
      [sportId]: (previousResults[sportId] || []).map((result) =>
        result.id === resultId ? { ...result, status: nextStatus } : result
      ),
    }))
  }

  const openActionConfirmation = (
    action: PendingAction['action'],
    sportId: number,
    resultId: number,
    athleteName: string
  ) => {
    setPendingAction({ action, sportId, resultId, athleteName })
  }

  const closeActionConfirmation = () => {
    if (!actionLoading) {
      setPendingAction(null)
    }
  }

  const confirmPendingAction = async () => {
    if (!pendingAction) return

    setActionLoading(true)
    setResultsError(null)

    try {
      if (pendingAction.action === 'approve') {
        await approveResult(pendingAction.resultId)
        updateSportResultStatus(pendingAction.sportId, pendingAction.resultId, 'APPROVED')
      }

      if (pendingAction.action === 'reject') {
        await rejectResult(pendingAction.resultId)
        updateSportResultStatus(pendingAction.sportId, pendingAction.resultId, 'REJECTED')
      }

      if (pendingAction.action === 'invalidate') {
        await invalidateResult(pendingAction.resultId)
        updateSportResultStatus(pendingAction.sportId, pendingAction.resultId, 'INVALIDATED')
      }

      setPendingAction(null)
    } catch (error) {
      setResultsError(getResultsErrorMessage(error))
    } finally {
      setActionLoading(false)
    }
  }

  const getActionLabel = (action: PendingAction['action']) => {
    switch (action) {
      case 'approve':
        return t('dashboard.buttons.approve')
      case 'reject':
        return t('dashboard.buttons.reject')
      case 'invalidate':
        return t('dashboard.buttons.invalidate')
    }
  }

  const loadAthletesForSport = async (sportId: number) => {
    if (athletesBySport[sportId]) {
      return
    }

    setAthletesLoading(true)
    setAthletesError(null)

    try {
      const athletes = allAthletes.length > 0 ? allAthletes : await fetchAllAthletes()
      if (allAthletes.length === 0) {
        setAllAthletes(athletes)
      }

      const athletesForSport = athletes.filter((athlete) => athlete.sportId === sportId)
      setAthletesBySport((previousAthletes) => ({
        ...previousAthletes,
        [sportId]: athletesForSport,
      }))
    } catch (error) {
      setAthletesError(getResultsErrorMessage(error))
    } finally {
      setAthletesLoading(false)
    }
  }

  const openCreateResultModal = () => {
    const defaultSportId = activeSports[0]?.id

    if (!defaultSportId) {
      setResultsError(t('dashboard.noActiveSports'))
      return
    }

    setCreateResultError(null)
    setNewResult({
      athleteId: '',
      sportId: String(defaultSportId),
      value: '',
      rank: '',
    })
    setShowCreateResultModal(true)
    void loadAthletesForSport(defaultSportId)
  }

  const closeCreateResultModal = () => {
    if (!createResultLoading) {
      setShowCreateResultModal(false)
    }
  }

  const handleCreateResult = async () => {
    if (!newResult.athleteId || !newResult.sportId || !newResult.value || !newResult.rank) {
      setCreateResultError(t('dashboard.createResultValidationError'))
      return
    }

    setCreateResultLoading(true)
    setCreateResultError(null)
    setResultsError(null)

    const sportId = Number(newResult.sportId)

    try {
      await createResult({
        athleteId: Number(newResult.athleteId),
        sportId,
        value: newResult.value,
        rank: Number(newResult.rank),
      })

      const refreshedResults = await fetchResultsBySport(sportId)
      setResultsBySport((previousResults) => ({
        ...previousResults,
        [sportId]: refreshedResults,
      }))

      setShowCreateResultModal(false)
      setNewResult({ athleteId: '', sportId: '', value: '', rank: '' })
    } catch (error) {
      setCreateResultError(getResultsErrorMessage(error))
    } finally {
      setCreateResultLoading(false)
    }
  }

  useEffect(() => {
    const sportId = Number(newResult.sportId)

    if (showCreateResultModal && sportId) {
      void loadAthletesForSport(sportId)
    }
  }, [newResult.sportId, showCreateResultModal])

  return (
    <Box p={10}>
      <Container maxW="container.xl">
        <Heading mb={2}>{t('dashboard.title')}</Heading>
        <Text color="gray.500" mb={2}>
          {t('dashboard.demoNote')}
        </Text>
        {currentUser && (
          <Text fontSize="sm" color="teal.600" mb={8}>
            {t('dashboard.loggedInAs', { email: currentUser.email, role: currentUser.role })}
          </Text>
        )}

        <Button colorScheme="teal" mb={6} onClick={openCreateResultModal}>
          {t('dashboard.addResult')}
        </Button>

        <Card.Root mb={6} p={4} bg="blue.50" borderRadius="lg" borderLeft="4px solid" borderLeftColor="blue.500">
          <Stack direction="row" align="center" gap={3}>
            <Box>
              <Text fontWeight="bold" color="blue.800">
                {t('dashboard.infoTitle')}
              </Text>
              <Text fontSize="sm" color="blue.700">
                {t('dashboard.infoText')}
              </Text>
            </Box>
          </Stack>
        </Card.Root>

        {isInitialLoading ? (
          <Box p={8} display="flex" justifyContent="center" alignItems="center" minH="240px">
            <Spinner size="lg" />
          </Box>
        ) : sportsError ? (
          <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={6}>
            <Text color="red.700">{sportsError}</Text>
          </Box>
        ) : resultsError ? (
          <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={6}>
            <Text color="red.700">{resultsError}</Text>
          </Box>
        ) : null}

        {activeSports.map((sport) => {
          const sportResults = resultsBySport[sport.id] || []

          return (
            <Card.Root key={sport.id} mb={8} p={6} bg="var(--card-bg)" boxShadow="md" borderRadius="lg">
              <Stack direction="row" justify="space-between" align="center" mb={4}>
                <Heading size="lg">{sport.name}</Heading>
                <Badge colorPalette={sport.active ? 'green' : 'gray'}>
                  {sport.active ? t('admin.active') : t('admin.inactive')}
                </Badge>
              </Stack>

              {resultsLoading && sportResults.length === 0 ? (
                <Box p={4} display="flex" justifyContent="center" alignItems="center" minH="160px">
                  <Spinner size="md" />
                </Box>
              ) : sportResults.length === 0 ? (
                <Text textAlign="center" color="gray.500" py={4}>
                  {t('dashboard.table.noResults')}
                </Text>
              ) : (
                <ResultsBySportTable
                  data={sportResults}
                  currentRole={currentRole}
                  onApprove={(resultId) => {
                    const result = sportResults.find((entry) => entry.id === resultId)
                    if (result) {
                      openActionConfirmation('approve', sport.id, resultId, result.athleteName)
                    }
                  }}
                  onReject={(resultId) => {
                    const result = sportResults.find((entry) => entry.id === resultId)
                    if (result) {
                      openActionConfirmation('reject', sport.id, resultId, result.athleteName)
                    }
                  }}
                  onInvalidate={(resultId) => {
                    const result = sportResults.find((entry) => entry.id === resultId)
                    if (result) {
                      openActionConfirmation('invalidate', sport.id, resultId, result.athleteName)
                    }
                  }}
                />
              )}
            </Card.Root>
          )
        })}

        {!sportsLoading && activeSports.length === 0 && (
          <Box bg="gray.50" p={4} borderRadius="md" borderLeft="4px solid gray">
            <Text color="gray.700">{t('dashboard.table.noResults')}</Text>
          </Box>
        )}

        <DialogRoot open={showCreateResultModal} onOpenChange={(open) => { if (!open) closeCreateResultModal() }}>
          <DialogPositioner>
            <DialogBackdrop />
            <DialogContent bg="var(--card-bg)" p={6} borderRadius="lg" boxShadow="xl" maxW="md">
              <DialogHeader display="flex" alignItems="start" justifyContent="space-between" p={0} pb={3}>
                <DialogTitle>{t('dashboard.newResultTitle')}</DialogTitle>
                <DialogCloseTrigger asChild>
                  <Button size="sm" variant="ghost" onClick={closeCreateResultModal}>×</Button>
                </DialogCloseTrigger>
              </DialogHeader>

              <DialogBody p={0}>
                {createResultError && (
                  <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={4}>
                    <Text color="red.700">{createResultError}</Text>
                  </Box>
                )}

                {athletesError && (
                  <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={4}>
                    <Text color="red.700">{athletesError}</Text>
                  </Box>
                )}

                <Stack gap={4}>
                  <Box>
                    <Text mb={2} fontWeight="500">{t('dashboard.labels.sport')} *</Text>
                    <select
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                      value={newResult.sportId}
                      onChange={(e) => setNewResult({ ...newResult, sportId: e.target.value, athleteId: '' })}
                    >
                      <option value="">{t('dashboard.placeholders.selectSport')}</option>
                      {activeSports.map((sport) => (
                        <option key={sport.id} value={sport.id}>{sport.name}</option>
                      ))}
                    </select>
                  </Box>

                  <Box>
                    <Text mb={2} fontWeight="500">{t('dashboard.labels.athlete')} *</Text>
                    <select
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                      value={newResult.athleteId}
                      onChange={(e) => setNewResult({ ...newResult, athleteId: e.target.value })}
                      disabled={!newResult.sportId || athletesLoading}
                    >
                      <option value="">
                        {athletesLoading
                          ? t('dashboard.placeholders.loadingAthletes')
                          : t('dashboard.placeholders.selectAthlete')}
                      </option>
                      {(athletesBySport[Number(newResult.sportId)] || []).map((athlete) => (
                        <option key={athlete.id} value={athlete.id}>
                          {athlete.name}
                        </option>
                      ))}
                    </select>
                  </Box>

                  <Box>
                    <Text mb={2} fontWeight="500">{t('dashboard.labels.resultValue')} *</Text>
                    <Input
                      value={newResult.value}
                      onChange={(e) => setNewResult({ ...newResult, value: e.target.value })}
                      placeholder={t('dashboard.placeholders.resultValueExample')}
                    />
                  </Box>

                  <Box>
                    <Text mb={2} fontWeight="500">{t('dashboard.labels.rank')} *</Text>
                    <Input
                      type="number"
                      value={newResult.rank}
                      onChange={(e) => setNewResult({ ...newResult, rank: e.target.value })}
                      placeholder={t('dashboard.placeholders.rankExample')}
                    />
                  </Box>
                </Stack>
              </DialogBody>

              <DialogFooter p={0} gap={3} justifyContent="flex-end" mt={6}>
                <Button variant="outline" onClick={closeCreateResultModal} disabled={createResultLoading}>
                  {t('dashboard.buttons.cancel')}
                </Button>
                <Button colorScheme="teal" onClick={handleCreateResult} loading={createResultLoading}>
                  {t('dashboard.buttons.submit')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>

        <DialogRoot open={pendingAction !== null} onOpenChange={(open) => { if (!open) closeActionConfirmation() }}>
          <DialogPositioner>
            <DialogBackdrop />
            <DialogContent bg="var(--card-bg)" p={6} borderRadius="lg" boxShadow="xl" maxW="md">
              <DialogHeader display="flex" alignItems="start" justifyContent="space-between" p={0} pb={3}>
                <DialogTitle>{t('dashboard.confirmActionTitle')}</DialogTitle>
                <DialogCloseTrigger asChild>
                  <Button size="sm" variant="ghost" onClick={closeActionConfirmation}>×</Button>
                </DialogCloseTrigger>
              </DialogHeader>

              <DialogBody p={0} pb={6}>
                <Text>
                  {pendingAction
                    ? t('dashboard.confirmActionText', {
                        action: getActionLabel(pendingAction.action),
                        athlete: pendingAction.athleteName,
                      })
                    : ''}
                </Text>
              </DialogBody>

              <DialogFooter p={0} gap={3} justifyContent="flex-end">
                <Button variant="outline" onClick={closeActionConfirmation} disabled={actionLoading}>
                  {t('dashboard.buttons.cancel')}
                </Button>
                <Button colorScheme="red" onClick={confirmPendingAction} loading={actionLoading}>
                  {t('dashboard.buttons.confirm')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      </Container>
    </Box>
  )
}
