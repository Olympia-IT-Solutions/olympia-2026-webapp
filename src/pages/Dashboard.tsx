import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Card, Container, DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogPositioner, DialogRoot, DialogTitle, Heading, Input, Spinner, Stack, Text } from '@chakra-ui/react'
import { getCurrentUser } from '../logic/rights'
import { ResultsBySportTable } from '../components/ResultsBySportTable'
import { type Sport } from '../services/sports'
import { approveResult, createResult, fetchResultsBySport, invalidateResult, rejectResult, updateResult, type Result as ApiResult } from '../services/results'
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

type EditResultFormState = {
  resultId: number
  sportId: number
  sportName: string
  athleteName: string
  value: string
  rank: string
  status: string
}

type SportResultTemplate = {
  label: string
  placeholder: string
  helperText: string
  inputMode: 'text' | 'numeric' | 'decimal'
  normalize: (value: string) => string
  validate: (value: string) => string | null
}

const TIME_RESULT_REGEX = /^\d{1,3}:[0-5]\d(?:\.\d{1,2})?$/
const SCORE_RESULT_REGEX = /^\d{1,2}:\d{1,2}$/
const POINTS_RESULT_REGEX = /^\d{1,3}(?:\.\d{1,2})?$/

const normalizeTrimmedValue = (value: string) => value.trim()

const normalizeDecimalValue = (value: string) => value.trim().replace(',', '.')

const createTimeTemplate = (placeholder: string, helperText: string): SportResultTemplate => ({
  label: 'Zeit',
  placeholder,
  helperText,
  inputMode: 'text',
  normalize: normalizeDecimalValue,
  validate: (value) => (TIME_RESULT_REGEX.test(normalizeDecimalValue(value)) ? null : 'dashboard.validation.timeFormat'),
})

const createScoreTemplate = (placeholder: string, helperText: string, maxScore: number): SportResultTemplate => ({
  label: 'Endstand',
  placeholder,
  helperText,
  inputMode: 'numeric',
  normalize: normalizeTrimmedValue,
  validate: (value) => {
    const normalizedValue = normalizeTrimmedValue(value)

    if (!SCORE_RESULT_REGEX.test(normalizedValue)) {
      return 'dashboard.validation.scoreFormat'
    }

    const [leftScore, rightScore] = normalizedValue.split(':').map(Number)

    if (!Number.isInteger(leftScore) || !Number.isInteger(rightScore) || leftScore < 0 || rightScore < 0 || leftScore > maxScore || rightScore > maxScore) {
      return 'dashboard.validation.scoreRange'
    }

    return null
  },
})

const createPointsTemplate = (placeholder: string, helperText: string, maxPoints: number): SportResultTemplate => ({
  label: 'Punkte',
  placeholder,
  helperText,
  inputMode: 'decimal',
  normalize: normalizeDecimalValue,
  validate: (value) => {
    const normalizedValue = normalizeDecimalValue(value)

    if (!POINTS_RESULT_REGEX.test(normalizedValue)) {
      return 'dashboard.validation.pointsFormat'
    }

    const points = Number(normalizedValue)

    if (!Number.isFinite(points) || points < 0 || points > maxPoints) {
      return 'dashboard.validation.pointsRange'
    }

    return null
  },
})

const sportResultTemplates: Record<string, SportResultTemplate> = {
  biathlon: createTimeTemplate('z. B. 25:34.50', 'Erwartet wird ein Zeitwert im Format mm:ss.hh. Sekunden müssen zwischen 00 und 59 liegen.'),
  bobsport: createTimeTemplate('z. B. 1:39.18', 'Erwartet wird ein Zeitwert im Format m:ss.hh für die Laufzeit.'),
  curling: createScoreTemplate('z. B. 6:4', 'Erwartet wird ein Endstand im Format x:y mit ganzen Zahlen.', 20),
  eishockey: createScoreTemplate('z. B. 3:2', 'Erwartet wird ein Endstand im Format x:y mit ganzen Zahlen.', 20),
  eiskunstlauf: createPointsTemplate('z. B. 184.72', 'Erwartet werden Punkte zwischen 0 und 300 mit bis zu zwei Nachkommastellen.', 300),
  skilanglauf: createTimeTemplate('z. B. 31:08.40', 'Erwartet wird ein Zeitwert im Format mm:ss.hh für die Laufzeit.'),
  skispringen: createPointsTemplate('z. B. 131.5', 'Erwartet werden Punkte zwischen 0 und 300 mit bis zu zwei Nachkommastellen.', 300),
}

const getSportTemplateKey = (sportName?: string | null) => sportName?.toLowerCase().replace(/\s+/g, '') ?? ''
const getResultValueString = (value: unknown) => (value == null ? '' : String(value))

const parsePositiveInteger = (value: string) => {
  if (!/^\d+$/.test(value.trim())) {
    return null
  }

  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null
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
  const [showEditResultModal, setShowEditResultModal] = useState(false)
  const [editResultLoading, setEditResultLoading] = useState(false)
  const [editResultError, setEditResultError] = useState<string | null>(null)
  const [editResult, setEditResult] = useState<EditResultFormState | null>(null)
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
  const selectedSportId = newResult.sportId ? Number(newResult.sportId) : null
  const selectedSport = useMemo(
    () => (selectedSportId !== null ? sports.find((sport) => sport.id === selectedSportId) ?? null : null),
    [selectedSportId, sports]
  )
  const selectedSportTemplate = selectedSport ? sportResultTemplates[getSportTemplateKey(selectedSport.name)] ?? null : null
  const editSport = editResult ? sports.find((sport) => sport.id === editResult.sportId) ?? null : null
  const editSportTemplate = editSport ? sportResultTemplates[getSportTemplateKey(editSport.name)] ?? null : null
  const selectedSportResults = selectedSportId !== null ? resultsBySport[selectedSportId] || [] : []
  const selectedSportAthletes = selectedSportId !== null ? athletesBySport[selectedSportId] || [] : []

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

  const openEditResultModal = (result: ApiResult, fallbackSportName?: string) => {
    const numericSportId = Number(result.sportId)
    const resolvedSportName = fallbackSportName ?? result.sportName ?? sports.find((sport) => sport.id === numericSportId)?.name ?? ''
    setEditResultError(null)
    setEditResult({
      resultId: result.id,
      sportId: Number.isFinite(numericSportId) ? numericSportId : 0,
      sportName: resolvedSportName,
      athleteName: result.athleteName,
      value: getResultValueString(result.value),
      rank: getResultValueString(result.rank),
      status: result.status.toUpperCase(),
    })
    setShowEditResultModal(true)
  }

  const closeActionConfirmation = () => {
    if (!actionLoading) {
      setPendingAction(null)
    }
  }

  const closeEditResultModal = () => {
    if (!editResultLoading) {
      setShowEditResultModal(false)
      setEditResult(null)
    }
  }

  const handleUpdateResult = async () => {
    if (!editResult) {
      setEditResultError(t('dashboard.editResultValidationError'))
      return
    }

    if (editResult.status === 'APPROVED' || editResult.status === 'PUBLISHED') {
      setEditResultError(t('dashboard.validation.editLocked'))
      return
    }

    const sport = sports.find((entry) => entry.id === editResult.sportId) ?? null
    const template = sport ? sportResultTemplates[getSportTemplateKey(sport.name)] ?? null : null

    if (!sport || !template) {
      setEditResultError(t('dashboard.validation.templateMissing'))
      return
    }

    if (!editResult.value.trim()) {
      setEditResultError(t('dashboard.validation.valueRequired'))
      return
    }

    if (!editResult.rank.trim()) {
      setEditResultError(t('dashboard.validation.rankRequired'))
      return
    }

    const rank = parsePositiveInteger(editResult.rank)
    if (rank === null) {
      setEditResultError(t('dashboard.validation.rankInvalid'))
      return
    }

    const valueErrorKey = template.validate(editResult.value)
    if (valueErrorKey) {
      setEditResultError(t(valueErrorKey))
      return
    }

    const currentSportResults = resultsBySport[editResult.sportId] || []
    if (currentSportResults.some((entry) => entry.id !== editResult.resultId && entry.rank === rank)) {
      setEditResultError(t('dashboard.validation.duplicateRank'))
      return
    }

    setEditResultLoading(true)
    setEditResultError(null)
    setResultsError(null)

    try {
      await updateResult(editResult.resultId, {
        value: template.normalize(editResult.value),
        rank,
      })

      const refreshedResults = await fetchResultsBySport(editResult.sportId)
      setResultsBySport((previousResults) => ({
        ...previousResults,
        [editResult.sportId]: refreshedResults,
      }))

      setShowEditResultModal(false)
      setEditResult(null)
    } catch (error) {
      setEditResultError(getResultsErrorMessage(error))
    } finally {
      setEditResultLoading(false)
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

  const loadAthletesForSport = useCallback(async (sportId: number) => {
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
  }, [allAthletes, athletesBySport])

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
    if (!selectedSportId || !selectedSport) {
      setCreateResultError(t('dashboard.validation.selectSport'))
      return
    }

    if (!selectedSportTemplate) {
      setCreateResultError(t('dashboard.validation.templateMissing'))
      return
    }

    if (!newResult.athleteId) {
      setCreateResultError(t('dashboard.validation.selectAthlete'))
      return
    }

    if (!newResult.value.trim()) {
      setCreateResultError(t('dashboard.validation.valueRequired'))
      return
    }

    if (!newResult.rank.trim()) {
      setCreateResultError(t('dashboard.validation.rankRequired'))
      return
    }

    const athleteId = Number(newResult.athleteId)
    const rank = parsePositiveInteger(newResult.rank)

    if (!Number.isInteger(athleteId)) {
      setCreateResultError(t('dashboard.validation.selectAthlete'))
      return
    }

    if (rank === null) {
      setCreateResultError(t('dashboard.validation.rankInvalid'))
      return
    }

    if (!selectedSportAthletes.some((athlete) => athlete.id === athleteId)) {
      setCreateResultError(t('dashboard.validation.athleteMismatch'))
      return
    }

    if (selectedSportResults.some((result) => result.athleteId === athleteId)) {
      setCreateResultError(t('dashboard.validation.duplicateAthlete'))
      return
    }

    if (selectedSportResults.some((result) => result.rank === rank)) {
      setCreateResultError(t('dashboard.validation.duplicateRank'))
      return
    }

    const valueErrorKey = selectedSportTemplate.validate(newResult.value)
    if (valueErrorKey) {
      setCreateResultError(t(valueErrorKey))
      return
    }

    const normalizedValue = selectedSportTemplate.normalize(newResult.value)

    setCreateResultLoading(true)
    setCreateResultError(null)
    setResultsError(null)

    try {
      await createResult({
        athleteId,
        sportId: selectedSportId,
        value: normalizedValue,
        rank,
      })

      const refreshedResults = await fetchResultsBySport(selectedSportId)
      setResultsBySport((previousResults) => ({
        ...previousResults,
        [selectedSportId]: refreshedResults,
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
    const sportId = selectedSportId ?? 0

    if (showCreateResultModal && sportId) {
      void loadAthletesForSport(sportId)
    }
  }, [loadAthletesForSport, selectedSportId, showCreateResultModal])

  return (
    <Box p={10}>
      <Container maxW="container.xl">
        <Heading mb={2}>{t('dashboard.title')}</Heading>
        {currentUser && (
          <Text fontSize="sm" color="text-muted" mb={8}>
            {t('dashboard.loggedInAs', { email: currentUser.email, role: currentUser.role })}
          </Text>
        )}

        <Button colorScheme="teal" mb={6} onClick={openCreateResultModal}>
          {t('dashboard.addResult')}
        </Button>

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
                <Heading size="lg" color="text" fontWeight="semibold">{sport.name}</Heading>
              </Stack>

              {resultsLoading && sportResults.length === 0 ? (
                <Box p={4} display="flex" justifyContent="center" alignItems="center" minH="160px">
                  <Spinner size="md" />
                </Box>
              ) : sportResults.length === 0 ? (
                <Text textAlign="center" color="text-muted" py={4}>
                  {t('dashboard.table.noResults')}
                </Text>
              ) : (
                <ResultsBySportTable
                  data={sportResults}
                  currentRole={currentRole}
                  currentUserEmail={currentUser?.email ?? null}
                  sportName={sport.name}
                  onEdit={currentRole === 'admin' ? openEditResultModal : undefined}
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
          <Box bg="surface-muted" p={4} borderRadius="md" borderLeft="4px solid" borderLeftColor="border">
            <Text color="text">{t('dashboard.table.noResults')}</Text>
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
                      onChange={(e) => setNewResult({ ...newResult, sportId: e.target.value, athleteId: '', value: '', rank: '' })}
                    >
                      <option value="">{t('dashboard.placeholders.selectSport')}</option>
                      {activeSports.map((sport) => (
                        <option key={sport.id} value={sport.id}>{sport.name}</option>
                      ))}
                    </select>
                  </Box>

                  <Box bg="surface-muted" p={4} borderRadius="lg" borderWidth="1px" borderColor="border">
                    <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="text-muted">
                      {t('dashboard.resultTemplates.title')}
                    </Text>
                    {selectedSportTemplate ? (
                      <Stack gap={1} mt={2}>
                        <Text fontWeight="600" color="text">
                          {t('dashboard.resultTemplates.selected', { sport: selectedSport?.name ?? '' })}
                        </Text>
                        <Text fontSize="sm" color="text-muted">
                          {selectedSportTemplate.helperText}
                        </Text>
                      </Stack>
                    ) : (
                      <Text mt={2} fontSize="sm" color="text-muted">
                        {t('dashboard.resultTemplates.selectSportHint')}
                      </Text>
                    )}
                  </Box>

                  <Box>
                    <Text mb={2} fontWeight="500">{t('dashboard.labels.athlete')} *</Text>
                    <select
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
                      value={newResult.athleteId}
                      onChange={(e) => setNewResult({ ...newResult, athleteId: e.target.value })}
                      disabled={!selectedSportId || athletesLoading}
                    >
                      <option value="">
                        {athletesLoading
                          ? t('dashboard.placeholders.loadingAthletes')
                          : t('dashboard.placeholders.selectAthlete')}
                      </option>
                      {selectedSportAthletes.map((athlete) => (
                        <option key={athlete.id} value={athlete.id}>
                          {athlete.name}
                        </option>
                      ))}
                    </select>
                  </Box>

                  <Box>
                    <Text mb={2} fontWeight="500">{selectedSportTemplate ? selectedSportTemplate.label : t('dashboard.labels.resultValue')} *</Text>
                    <Input
                      value={newResult.value}
                      onChange={(e) => setNewResult({ ...newResult, value: e.target.value })}
                      placeholder={selectedSportTemplate ? selectedSportTemplate.placeholder : t('dashboard.placeholders.resultValueExample')}
                      inputMode={selectedSportTemplate?.inputMode ?? 'text'}
                      disabled={!selectedSportTemplate}
                    />
                  </Box>

                  <Box>
                    <Text mb={2} fontWeight="500">{t('dashboard.labels.rank')} *</Text>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={newResult.rank}
                      onChange={(e) => setNewResult({ ...newResult, rank: e.target.value })}
                      placeholder={t('dashboard.placeholders.rankExample')}
                    />
                  </Box>
                </Stack>
              </DialogBody>

              <DialogFooter p={0} gap={3} justifyContent="flex-end" mt={6}>
                <Button variant="solid" colorPalette="gray" onClick={closeCreateResultModal} disabled={createResultLoading}>
                  {t('dashboard.buttons.cancel')}
                </Button>
                <Button colorScheme="teal" onClick={handleCreateResult} loading={createResultLoading}>
                  {t('dashboard.buttons.submit')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>

        <DialogRoot open={showEditResultModal} onOpenChange={(open) => { if (!open) closeEditResultModal() }}>
          <DialogPositioner>
            <DialogBackdrop />
            <DialogContent bg="var(--card-bg)" p={6} borderRadius="lg" boxShadow="xl" maxW="md">
              <DialogHeader display="flex" alignItems="start" justifyContent="space-between" p={0} pb={3}>
                <DialogTitle>{t('dashboard.editResultTitle')}</DialogTitle>
                <DialogCloseTrigger asChild>
                  <Button size="sm" variant="ghost" onClick={closeEditResultModal}>×</Button>
                </DialogCloseTrigger>
              </DialogHeader>

              <DialogBody p={0}>
                {editResultError && (
                  <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={4}>
                    <Text color="red.700">{editResultError}</Text>
                  </Box>
                )}

                {editResult && (
                  <Stack gap={4}>
                    <Box bg="surface-muted" p={4} borderRadius="lg" borderWidth="1px" borderColor="border">
                      <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="text-muted">
                        {t('dashboard.editResultContext', { defaultValue: 'Bearbeitete Sportart' })}
                      </Text>
                      <Text mt={2} fontWeight="600" color="text">{editSport?.name ?? editResult.sportName ?? t('dashboard.labels.sport')}</Text>
                      <Text fontSize="sm" color="text-muted">{editResult.athleteName}</Text>
                    </Box>

                    <Box>
                      <Text mb={2} fontWeight="500">{editSportTemplate ? editSportTemplate.label : t('dashboard.labels.resultValue')} *</Text>
                      <Input
                        value={editResult.value}
                        onChange={(event) => setEditResult({ ...editResult, value: event.target.value })}
                        placeholder={editSportTemplate ? editSportTemplate.placeholder : t('dashboard.placeholders.resultValueExample')}
                      />
                      {editSportTemplate && (
                        <Text mt={2} fontSize="sm" color="text-muted">
                          {editSportTemplate.helperText}
                        </Text>
                      )}
                    </Box>

                    <Box>
                      <Text mb={2} fontWeight="500">{t('dashboard.labels.rank')} *</Text>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={editResult.rank}
                        onChange={(event) => setEditResult({ ...editResult, rank: event.target.value })}
                        placeholder={t('dashboard.placeholders.rankExample')}
                      />
                    </Box>
                  </Stack>
                )}
              </DialogBody>

              <DialogFooter p={0} gap={3} justifyContent="flex-end" mt={6}>
                <Button variant="solid" colorPalette="gray" onClick={closeEditResultModal} disabled={editResultLoading}>
                  {t('dashboard.buttons.cancel')}
                </Button>
                <Button colorScheme="blue" variant="solid" onClick={handleUpdateResult} loading={editResultLoading}>
                  {t('dashboard.editResultSave')}
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
                <Button variant="solid" colorPalette="gray" onClick={closeActionConfirmation} disabled={actionLoading}>
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
