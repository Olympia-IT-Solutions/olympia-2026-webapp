import { type ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Card, Container, DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogPositioner, DialogRoot, DialogTitle, Heading, Input, Stack, Table, Text } from '@chakra-ui/react'
import { Workbook } from 'exceljs'
import { getCurrentUser } from '../logic/rights'
import { ResultsBySportTable } from '../components/ResultsBySportTable'
import { LoadingSpinner } from '../components/ui'
import { type Sport } from '../services/sports'
import { approveResult, createResult, fetchResultsBySport, invalidateResult, rejectResult, updateResult, type Result as ApiResult } from '../services/results'
import { fetchAllAthletes, type Athlete } from '../services/athletes'
import { useSportsStore } from '../store/sports'

const getResultsErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Failed to fetch results'

const IMPORT_TEMPLATE_MAX_ROWS = 200

const normalizeExcelKey = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

const toExcelColumnName = (columnNumber: number) => {
  let remaining = columnNumber
  let columnName = ''

  while (remaining > 0) {
    const next = (remaining - 1) % 26
    columnName = String.fromCharCode(65 + next) + columnName
    remaining = Math.floor((remaining - 1) / 26)
  }

  return columnName
}

const createSafeRangeName = (sport: Sport) => {
  const normalizedName = normalizeExcelKey(sport.name) || 'sport'
  return `sport_${sport.id}_${normalizedName}`
}

const getSportResultValidationType = (sportName: string) => {
  const templateKey = sportName.toLowerCase().replace(/\s+/g, '')

  if (templateKey === 'biathlon' || templateKey === 'bobsport' || templateKey === 'skilanglauf') {
    return 'time'
  }

  if (templateKey === 'curling' || templateKey === 'eishockey') {
    return 'score'
  }

  if (templateKey === 'eiskunstlauf' || templateKey === 'skispringen') {
    return 'points'
  }

  return 'text'
}

const buildExcelResultValidationFormula = (rowNumber: number) => {
  const valueRef = `$C${rowNumber}`
  const typeRef = `$E${rowNumber}`
  const leftValue = `LEFT(${valueRef},FIND(":",${valueRef})-1)`
  const secondsValue = `MID(${valueRef},FIND(":",${valueRef})+1,2)`
  const rightValue = `RIGHT(${valueRef},LEN(${valueRef})-FIND(":",${valueRef}))`
  const normalizedDecimal = `SUBSTITUTE(${valueRef},",", ".")`

  const timeCheck = `IFERROR(AND(LEN(${valueRef})-LEN(SUBSTITUTE(${valueRef},":",""))=1,ISNUMBER(--${leftValue}),ISNUMBER(--${secondsValue}),--${secondsValue}>=0,--${secondsValue}<60),FALSE)`
  const scoreCheck = `IFERROR(AND(LEN(${valueRef})-LEN(SUBSTITUTE(${valueRef},":",""))=1,ISNUMBER(--${leftValue}),ISNUMBER(--${rightValue}),--${leftValue}>=0,--${leftValue}<=20,--${rightValue}>=0,--${rightValue}<=20),FALSE)`
  const pointsCheck = `IFERROR(AND(ISNUMBER(--${normalizedDecimal}),--${normalizedDecimal}>=0,--${normalizedDecimal}<=300),FALSE)`

  return `IF(${typeRef}="time",${timeCheck},IF(${typeRef}="score",${scoreCheck},IF(${typeRef}="points",${pointsCheck},LEN(TRIM(${valueRef}))>0)))`
}

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

type ParsedImportRow = {
  sourceRow: number
  sportId: number
  sportName: string
  athleteId: number
  athleteName: string
  value: string
  templateKey: string
}

type ImportPreviewRow = ParsedImportRow & {
  rank: number
}

type ImportPreviewSummary = {
  fileRows: number
  validRows: number
  readyRows: number
  skippedRows: number
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
const normalizeLookupValue = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ')

const canUseResultForRanking = (status: string | null | undefined) => {
  const normalizedStatus = status?.toUpperCase() ?? ''
  return normalizedStatus !== 'REJECTED' && normalizedStatus !== 'INVALIDATED'
}

const parseTimeResultValue = (value: string) => {
  const [minutesPart, secondsPart] = value.split(':')
  const minutes = Number(minutesPart)
  const seconds = Number(secondsPart)

  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return null
  }

  return minutes * 60 + seconds
}

const parseScoreResultValue = (value: string) => {
  const [leftPart, rightPart] = value.split(':')
  const left = Number(leftPart)
  const right = Number(rightPart)

  if (!Number.isInteger(left) || !Number.isInteger(right)) {
    return null
  }

  return { left, right, diff: left - right }
}

const parsePointsResultValue = (value: string) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

const getImportSortScore = (templateKey: string, normalizedValue: string) => {
  if (templateKey === 'biathlon' || templateKey === 'bobsport' || templateKey === 'skilanglauf') {
    const timeValue = parseTimeResultValue(normalizedValue)
    return [timeValue ?? Number.POSITIVE_INFINITY, 0, 0]
  }

  if (templateKey === 'curling' || templateKey === 'eishockey') {
    const scoreValue = parseScoreResultValue(normalizedValue)
    if (!scoreValue) {
      return [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    }

    return [-scoreValue.diff, -scoreValue.left, scoreValue.right]
  }

  if (templateKey === 'eiskunstlauf' || templateKey === 'skispringen') {
    const pointsValue = parsePointsResultValue(normalizedValue)
    return [-(pointsValue ?? Number.NEGATIVE_INFINITY), 0, 0]
  }

  return [0, 0, 0]
}

const compareImportRows = (leftRow: ParsedImportRow, rightRow: ParsedImportRow) => {
  const leftScore = getImportSortScore(leftRow.templateKey, leftRow.value)
  const rightScore = getImportSortScore(rightRow.templateKey, rightRow.value)

  if (leftScore[0] !== rightScore[0]) {
    return leftScore[0] - rightScore[0]
  }

  if (leftScore[1] !== rightScore[1]) {
    return leftScore[1] - rightScore[1]
  }

  if (leftScore[2] !== rightScore[2]) {
    return leftScore[2] - rightScore[2]
  }

  return leftRow.sourceRow - rightRow.sourceRow
}

const getExcelCellString = (cellValue: unknown): string => {
  if (cellValue == null) {
    return ''
  }

  if (typeof cellValue === 'string' || typeof cellValue === 'number' || typeof cellValue === 'boolean') {
    return String(cellValue).trim()
  }

  if (cellValue instanceof Date) {
    return cellValue.toISOString()
  }

  if (typeof cellValue === 'object') {
    const textValue = cellValue as {
      text?: unknown
      result?: unknown
      richText?: Array<{ text?: unknown }>
    }

    if (typeof textValue.text === 'string') {
      return textValue.text.trim()
    }

    if (Array.isArray(textValue.richText)) {
      return textValue.richText
        .map((entry) => (typeof entry.text === 'string' ? entry.text : ''))
        .join('')
        .trim()
    }

    if (textValue.result !== undefined) {
      return getExcelCellString(textValue.result)
    }
  }

  return ''
}

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
  const [showImportResultModal, setShowImportResultModal] = useState(false)
  const [createResultLoading, setCreateResultLoading] = useState(false)
  const [createResultError, setCreateResultError] = useState<string | null>(null)
  const [importTemplateLoading, setImportTemplateLoading] = useState(false)
  const [importPreviewLoading, setImportPreviewLoading] = useState(false)
  const [importSubmitLoading, setImportSubmitLoading] = useState(false)
  const [importTemplateError, setImportTemplateError] = useState<string | null>(null)
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreviewRows, setImportPreviewRows] = useState<ImportPreviewRow[]>([])
  const [importPreviewSummary, setImportPreviewSummary] = useState<ImportPreviewSummary | null>(null)
  const [importWarnings, setImportWarnings] = useState<string[]>([])
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

  const openImportResultModal = () => {
    setImportFile(null)
    setImportPreviewRows([])
    setImportPreviewSummary(null)
    setImportWarnings([])
    setImportTemplateError(null)
    setImportSuccessMessage(null)
    setShowImportResultModal(true)
  }

  const closeCreateResultModal = () => {
    if (!createResultLoading) {
      setShowCreateResultModal(false)
    }
  }

  const closeImportResultModal = () => {
    if (importTemplateLoading || importPreviewLoading || importSubmitLoading) {
      return
    }

    setShowImportResultModal(false)
    setImportFile(null)
    setImportPreviewRows([])
    setImportPreviewSummary(null)
    setImportWarnings([])
    setImportTemplateError(null)
    setImportSuccessMessage(null)
  }

  const handleImportFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setImportFile(nextFile)
    setImportPreviewRows([])
    setImportPreviewSummary(null)
    setImportWarnings([])
    setImportTemplateError(null)
    setImportSuccessMessage(null)
  }

  const buildImportPreview = async () => {
    if (importPreviewLoading || importSubmitLoading) {
      return
    }

    if (!importFile) {
      setImportTemplateError(t('dashboard.importResultNoFile'))
      return
    }

    if (sports.length === 0) {
      setImportTemplateError(t('dashboard.noSports'))
      return
    }

    setImportPreviewLoading(true)
    setImportTemplateError(null)
    setImportSuccessMessage(null)
    setImportWarnings([])
    setImportPreviewRows([])
    setImportPreviewSummary(null)

    try {
      const athletes = allAthletes.length > 0 ? allAthletes : await fetchAllAthletes()
      if (allAthletes.length === 0) {
        setAllAthletes(athletes)
      }

      const workbook = new Workbook()
      await workbook.xlsx.load(await importFile.arrayBuffer())

      const importSheet = workbook.getWorksheet('Import') ?? workbook.worksheets[0]
      if (!importSheet) {
        setImportTemplateError(t('dashboard.importResultReadError'))
        return
      }

      const sportsByName = new Map<string, Sport>()
      sports.forEach((sport) => {
        sportsByName.set(normalizeLookupValue(sport.name), sport)
      })

      const athletesBySportAndName = new Map<string, Athlete>()
      athletes.forEach((athlete) => {
        if (typeof athlete.sportId !== 'number' || athlete.sportId <= 0) {
          return
        }

        athletesBySportAndName.set(`${athlete.sportId}:${normalizeLookupValue(athlete.name)}`, athlete)
      })

      const parsedRows: ParsedImportRow[] = []
      const warningMessages: string[] = []
      const importedAthletesInFile = new Set<string>()
      let fileRows = 0
      const maxRowNumber = Math.max(importSheet.rowCount, IMPORT_TEMPLATE_MAX_ROWS)

      for (let rowNumber = 2; rowNumber <= maxRowNumber; rowNumber += 1) {
        const row = importSheet.getRow(rowNumber)
        const sportNameValue = getExcelCellString(row.getCell(1).value)
        const athleteNameValue = getExcelCellString(row.getCell(2).value)
        const resultValue = getExcelCellString(row.getCell(3).value)

        if (!sportNameValue && !athleteNameValue && !resultValue) {
          continue
        }

        fileRows += 1

        if (!sportNameValue || !athleteNameValue || !resultValue) {
          warningMessages.push(t('dashboard.importResultRowIncomplete', { row: rowNumber }))
          continue
        }

        const sport = sportsByName.get(normalizeLookupValue(sportNameValue))
        if (!sport) {
          warningMessages.push(t('dashboard.importResultUnknownSport', { row: rowNumber, sport: sportNameValue }))
          continue
        }

        const templateKey = getSportTemplateKey(sport.name)
        const template = sportResultTemplates[templateKey] ?? null
        if (!template) {
          warningMessages.push(t('dashboard.validation.templateMissing'))
          continue
        }

        const athlete = athletesBySportAndName.get(`${sport.id}:${normalizeLookupValue(athleteNameValue)}`)
        if (!athlete) {
          warningMessages.push(t('dashboard.importResultUnknownAthlete', { row: rowNumber, athlete: athleteNameValue, sport: sport.name }))
          continue
        }

        const valueErrorKey = template.validate(resultValue)
        if (valueErrorKey) {
          warningMessages.push(t('dashboard.importResultInvalidValue', { row: rowNumber, athlete: athlete.name, reason: t(valueErrorKey) }))
          continue
        }

        const normalizedValue = template.normalize(resultValue)
        const importAthleteKey = `${sport.id}:${athlete.id}`

        if (importedAthletesInFile.has(importAthleteKey)) {
          warningMessages.push(t('dashboard.importResultDuplicateInFile', { row: rowNumber, athlete: athlete.name, sport: sport.name }))
          continue
        }

        importedAthletesInFile.add(importAthleteKey)
        parsedRows.push({
          sourceRow: rowNumber,
          sportId: sport.id,
          sportName: sport.name,
          athleteId: athlete.id,
          athleteName: athlete.name,
          value: normalizedValue,
          templateKey,
        })
      }

      const sportIds = Array.from(new Set(parsedRows.map((row) => row.sportId)))
      const latestResultsBySport: Record<number, ApiResult[]> = {}

      if (sportIds.length > 0) {
        const responses = await Promise.all(
          sportIds.map(async (sportId) => ({
            sportId,
            results: await fetchResultsBySport(sportId),
          }))
        )

        responses.forEach((entry) => {
          latestResultsBySport[entry.sportId] = entry.results
        })

        setResultsBySport((previousResults) => {
          const nextResults = { ...previousResults }
          responses.forEach((entry) => {
            nextResults[entry.sportId] = entry.results
          })
          return nextResults
        })
      }

      const previewRowsBySport: ImportPreviewRow[] = []

      sportIds.forEach((sportId) => {
        const existingSportResults = (latestResultsBySport[sportId] || []).filter((result) => canUseResultForRanking(result.status))
        const occupiedRanks = new Set(
          existingSportResults
            .map((result) => Number(result.rank))
            .filter((rankValue) => Number.isInteger(rankValue) && rankValue > 0)
        )
        const existingAthleteIds = new Set(existingSportResults.map((result) => result.athleteId))

        const sportRows = parsedRows
          .filter((row) => row.sportId === sportId)
          .filter((row) => {
            if (existingAthleteIds.has(row.athleteId)) {
              warningMessages.push(t('dashboard.importResultDuplicateInDb', { athlete: row.athleteName, sport: row.sportName }))
              return false
            }

            return true
          })
          .sort(compareImportRows)

        let nextRank = 1
        sportRows.forEach((row) => {
          while (occupiedRanks.has(nextRank)) {
            nextRank += 1
          }

          previewRowsBySport.push({
            ...row,
            rank: nextRank,
          })
          occupiedRanks.add(nextRank)
          nextRank += 1
        })
      })

      const sortedPreviewRows = [...previewRowsBySport].sort((leftRow, rightRow) => {
        const bySport = leftRow.sportName.localeCompare(rightRow.sportName, undefined, { sensitivity: 'base' })
        if (bySport !== 0) {
          return bySport
        }

        if (leftRow.rank !== rightRow.rank) {
          return leftRow.rank - rightRow.rank
        }

        return leftRow.sourceRow - rightRow.sourceRow
      })

      setImportPreviewRows(sortedPreviewRows)
      setImportWarnings(warningMessages)
      setImportPreviewSummary({
        fileRows,
        validRows: parsedRows.length,
        readyRows: sortedPreviewRows.length,
        skippedRows: Math.max(fileRows - sortedPreviewRows.length, 0),
      })

      if (sortedPreviewRows.length === 0) {
        setImportTemplateError(t('dashboard.importResultNoImportableRows'))
      }
    } catch (error) {
      setImportTemplateError(error instanceof Error ? error.message : t('dashboard.importResultReadError'))
    } finally {
      setImportPreviewLoading(false)
    }
  }

  const confirmImportPreview = async () => {
    if (importSubmitLoading || importPreviewLoading) {
      return
    }

    if (importPreviewRows.length === 0) {
      setImportTemplateError(t('dashboard.importResultNoImportableRows'))
      return
    }

    setImportSubmitLoading(true)
    setImportTemplateError(null)
    setImportSuccessMessage(null)

    const failedImports: string[] = []
    let successfulImports = 0

    for (const row of importPreviewRows) {
      try {
        await createResult({
          athleteId: row.athleteId,
          sportId: row.sportId,
          value: row.value,
          rank: row.rank,
        })
        successfulImports += 1
      } catch (error) {
        const reason = getResultsErrorMessage(error)
        failedImports.push(t('dashboard.importResultImportRowFailed', { row: row.sourceRow, athlete: row.athleteName, reason }))
      }
    }

    const affectedSports = Array.from(new Set(importPreviewRows.map((row) => row.sportId)))
    if (affectedSports.length > 0) {
      try {
        const refreshedEntries = await Promise.all(
          affectedSports.map(async (sportId) => ({
            sportId,
            results: await fetchResultsBySport(sportId),
          }))
        )

        setResultsBySport((previousResults) => {
          const nextResults = { ...previousResults }
          refreshedEntries.forEach((entry) => {
            nextResults[entry.sportId] = entry.results
          })
          return nextResults
        })
      } catch (error) {
        setResultsError(getResultsErrorMessage(error))
      }
    }

    if (failedImports.length > 0) {
      setImportWarnings((previousWarnings) => [...failedImports, ...previousWarnings])
      setImportTemplateError(t('dashboard.importResultPartialError', {
        imported: successfulImports,
        failed: failedImports.length,
      }))
      setImportPreviewRows([])
      setImportPreviewSummary(null)
      setImportFile(null)
      setImportSuccessMessage(null)
    } else {
      setImportWarnings([])
      setImportPreviewRows([])
      setImportPreviewSummary(null)
      setImportFile(null)
      setImportSuccessMessage(t('dashboard.importResultSuccess', { count: successfulImports }))
    }

    setImportSubmitLoading(false)
  }

  const downloadImportTemplate = async () => {
    if (importTemplateLoading) {
      return
    }

    if (sports.length === 0) {
      setImportTemplateError(t('dashboard.noSports'))
      return
    }

    setImportTemplateLoading(true)
    setImportTemplateError(null)

    try {
      const athletes = allAthletes.length > 0 ? allAthletes : await fetchAllAthletes()
      if (allAthletes.length === 0) {
        setAllAthletes(athletes)
      }

      const workbook = new Workbook()
      workbook.creator = 'Olympia IT Solutions'
      workbook.lastModifiedBy = 'Olympia IT Solutions'
      workbook.created = new Date()
      workbook.modified = new Date()

      const templateSheet = workbook.addWorksheet('Import')
      const helperLookupSportColumn = 'W'
      const helperLookupKeyColumn = 'X'
      const helperLookupTypeColumn = 'Y'
      const helperEmptyColumn = 'Z'
      const helperAthleteStartColumnNumber = 27

      templateSheet.views = [{ state: 'frozen', ySplit: 1 }]
      templateSheet.columns = [
        { header: 'Sportart', key: 'sport', width: 24 },
        { header: 'Spieler', key: 'athlete', width: 32 },
        { header: 'Ergebnis', key: 'value', width: 20 },
      ]

      const headerRow = templateSheet.getRow(1)
      headerRow.font = { bold: true }
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
      templateSheet.autoFilter = 'A1:C1'

      const sortedSports = [...sports].sort((leftSport, rightSport) => leftSport.name.localeCompare(rightSport.name, undefined, { sensitivity: 'base' }))
      const sportRowsStart = 2
      const sportRowsEnd = sortedSports.length + 1

      templateSheet.getCell('D1').value = 'AthleteRangeKey'
      templateSheet.getCell('E1').value = 'ResultType'
      templateSheet.getCell('F1').value = 'ResultIsValid'
      templateSheet.getCell(`${helperLookupSportColumn}1`).value = 'Sportart'
      templateSheet.getCell(`${helperLookupKeyColumn}1`).value = 'Schluessel'
      templateSheet.getCell(`${helperLookupTypeColumn}1`).value = 'ErgebnisTyp'
      templateSheet.getCell(`${helperEmptyColumn}1`).value = 'Leer'
      templateSheet.getCell(`${helperEmptyColumn}2`).value = ''

      sortedSports.forEach((sport, index) => {
        const rowNumber = index + 2
        const safeRangeName = createSafeRangeName(sport)
        templateSheet.getCell(`${helperLookupSportColumn}${rowNumber}`).value = sport.name
        templateSheet.getCell(`${helperLookupKeyColumn}${rowNumber}`).value = safeRangeName
        templateSheet.getCell(`${helperLookupTypeColumn}${rowNumber}`).value = getSportResultValidationType(sport.name)
      })

      const sportsListRange = `'Import'!$${helperLookupSportColumn}$${sportRowsStart}:$${helperLookupSportColumn}$${sportRowsEnd}`
      workbook.definedNames.add(sportsListRange, 'SportsList')
      workbook.definedNames.add(`'Import'!$${helperEmptyColumn}$2:$${helperEmptyColumn}$2`, 'EmptyList')

      sortedSports.forEach((sport, index) => {
        const safeRangeName = createSafeRangeName(sport)
        const athletesForSport = athletes
          .filter((athlete) => athlete.sportId === sport.id)
          .map((athlete) => athlete.name)
          .sort((leftName, rightName) => leftName.localeCompare(rightName, undefined, { sensitivity: 'base' }))

        const athletesColumnNumber = helperAthleteStartColumnNumber + index
        const athletesColumnLetter = toExcelColumnName(athletesColumnNumber)

        templateSheet.getCell(`${athletesColumnLetter}1`).value = sport.name

        const values = athletesForSport.length > 0 ? athletesForSport : ['']
        values.forEach((athleteName, athleteIndex) => {
          templateSheet.getCell(`${athletesColumnLetter}${athleteIndex + 2}`).value = athleteName
        })

        const athletesRangeEnd = Math.max(2, athletesForSport.length + 1)
        const athletesRange = `'Import'!$${athletesColumnLetter}$2:$${athletesColumnLetter}$${athletesRangeEnd}`
        workbook.definedNames.add(athletesRange, safeRangeName)
      })

      const lastHelperColumnNumber = Math.max(helperEmptyColumn.charCodeAt(0) - 64, helperAthleteStartColumnNumber + sortedSports.length - 1)
      templateSheet.getColumn('D').hidden = true
      templateSheet.getColumn('E').hidden = true
      templateSheet.getColumn('F').hidden = true

      for (let columnNumber = helperLookupSportColumn.charCodeAt(0) - 64; columnNumber <= lastHelperColumnNumber; columnNumber += 1) {
        templateSheet.getColumn(columnNumber).hidden = true
      }

      for (let rowNumber = 2; rowNumber <= IMPORT_TEMPLATE_MAX_ROWS; rowNumber += 1) {
        const sportCell = templateSheet.getCell(`A${rowNumber}`)
        const athleteCell = templateSheet.getCell(`B${rowNumber}`)
        const valueCell = templateSheet.getCell(`C${rowNumber}`)
        const athleteRangeKeyCell = templateSheet.getCell(`D${rowNumber}`)
        const resultTypeCell = templateSheet.getCell(`E${rowNumber}`)
        const resultValidityCell = templateSheet.getCell(`F${rowNumber}`)

        athleteRangeKeyCell.value = {
          formula: `IFERROR(VLOOKUP($A${rowNumber},$${helperLookupSportColumn}$2:$${helperLookupTypeColumn}$${sportRowsEnd},2,FALSE),"EmptyList")`,
        }

        resultTypeCell.value = {
          formula: `IFERROR(VLOOKUP($A${rowNumber},$${helperLookupSportColumn}$2:$${helperLookupTypeColumn}$${sportRowsEnd},3,FALSE),"text")`,
        }

        resultValidityCell.value = {
          formula: buildExcelResultValidationFormula(rowNumber),
        }

        sportCell.dataValidation = {
          type: 'list',
          allowBlank: true,
          showErrorMessage: true,
          formulae: ['SportsList'],
        }

        athleteCell.dataValidation = {
          type: 'list',
          allowBlank: true,
          showErrorMessage: true,
          formulae: [`INDIRECT($D${rowNumber})`],
        }

        valueCell.dataValidation = {
          type: 'custom',
          allowBlank: true,
          showErrorMessage: true,
          formulae: [`$F${rowNumber}`],
        }
      }

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const downloadUrl = window.URL.createObjectURL(blob)
      const downloadLink = document.createElement('a')

      downloadLink.href = downloadUrl
      downloadLink.download = 'olympia-result-import-template.xlsx'
      downloadLink.click()

      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      setImportTemplateError(error instanceof Error ? error.message : t('dashboard.importResultDownloadError'))
    } finally {
      setImportTemplateLoading(false)
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

        <Stack direction={{ base: 'column', sm: 'row' }} gap={3} mb={6} align="start">
          <Button colorScheme="teal" onClick={openCreateResultModal}>
            {t('dashboard.addResult')}
          </Button>
          <Button variant="outline" colorScheme="teal" onClick={openImportResultModal}>
            {t('dashboard.buttons.importResult')}
          </Button>
        </Stack>

        {isInitialLoading ? (
          <Box p={8} display="flex" justifyContent="center" alignItems="center" minH="240px">
            <LoadingSpinner size="lg" />
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
                  <LoadingSpinner size="md" />
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

        <DialogRoot open={showImportResultModal} onOpenChange={(open) => { if (!open) closeImportResultModal() }}>
          <DialogPositioner>
            <DialogBackdrop />
            <DialogContent bg="var(--card-bg)" p={6} borderRadius="lg" boxShadow="xl" maxW="4xl">
              <DialogHeader display="flex" alignItems="start" justifyContent="space-between" p={0} pb={3}>
                <DialogTitle>{t('dashboard.importResultTitle')}</DialogTitle>
                <DialogCloseTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={closeImportResultModal}
                    disabled={importTemplateLoading || importPreviewLoading || importSubmitLoading}
                  >
                    ×
                  </Button>
                </DialogCloseTrigger>
              </DialogHeader>

              <DialogBody p={0}>
                {importTemplateError && (
                  <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid red" mb={4}>
                    <Text color="red.700">{importTemplateError}</Text>
                  </Box>
                )}

                {importSuccessMessage && (
                  <Box bg="green.50" p={4} borderRadius="md" borderLeft="4px solid green" mb={4}>
                    <Text color="green.700">{importSuccessMessage}</Text>
                  </Box>
                )}

                <Stack gap={4}>
                  <Text color="text-muted">{t('dashboard.importResultDescription')}</Text>

                  <Box>
                    <Text mb={2} fontWeight="500">{t('dashboard.importResultSelectedFile')}</Text>
                    <Input
                      type="file"
                      accept=".xlsx"
                      onChange={handleImportFileSelection}
                      disabled={importPreviewLoading || importSubmitLoading}
                      p={1}
                    />
                    <Text mt={2} fontSize="sm" color="text-muted">
                      {importFile?.name ?? t('dashboard.importResultNoFileSelected')}
                    </Text>
                  </Box>

                  {importPreviewSummary && (
                    <Box bg="surface-muted" p={4} borderRadius="md" borderWidth="1px" borderColor="border">
                      <Text fontWeight="600" mb={1}>{t('dashboard.importResultSummaryTitle')}</Text>
                      <Text fontSize="sm" color="text-muted">
                        {t('dashboard.importResultSummary', {
                          fileRows: importPreviewSummary.fileRows,
                          validRows: importPreviewSummary.validRows,
                          readyRows: importPreviewSummary.readyRows,
                          skippedRows: importPreviewSummary.skippedRows,
                        })}
                      </Text>
                    </Box>
                  )}

                  {importWarnings.length > 0 && (
                    <Box bg="yellow.50" p={4} borderRadius="md" borderLeft="4px solid #d69e2e">
                      <Text color="yellow.800" fontWeight="600" mb={2}>
                        {t('dashboard.importResultWarningsTitle')}
                      </Text>
                      <Stack gap={1}>
                        {importWarnings.slice(0, 12).map((warningMessage, index) => (
                          <Text key={`${warningMessage}-${index}`} fontSize="sm" color="yellow.900">
                            - {warningMessage}
                          </Text>
                        ))}
                        {importWarnings.length > 12 && (
                          <Text fontSize="sm" color="yellow.900">
                            {t('dashboard.importResultWarningsMore', { count: importWarnings.length - 12 })}
                          </Text>
                        )}
                      </Stack>
                    </Box>
                  )}

                  {importPreviewRows.length > 0 && (
                    <Box>
                      <Text fontWeight="600" mb={2}>{t('dashboard.importResultPreviewTitle')}</Text>
                      <Table.ScrollArea borderWidth="1px" borderColor="border" borderRadius="md" maxH="320px">
                        <Table.Root variant="outline" size="sm">
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeader>{t('dashboard.importResultPreviewRow')}</Table.ColumnHeader>
                              <Table.ColumnHeader>{t('dashboard.labels.sport')}</Table.ColumnHeader>
                              <Table.ColumnHeader>{t('dashboard.labels.athlete')}</Table.ColumnHeader>
                              <Table.ColumnHeader>{t('dashboard.labels.resultValue')}</Table.ColumnHeader>
                              <Table.ColumnHeader>{t('dashboard.labels.rank')}</Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {importPreviewRows.map((row) => (
                              <Table.Row key={`${row.sportId}-${row.athleteId}-${row.sourceRow}`}>
                                <Table.Cell>{row.sourceRow}</Table.Cell>
                                <Table.Cell>{row.sportName}</Table.Cell>
                                <Table.Cell>{row.athleteName}</Table.Cell>
                                <Table.Cell fontFamily="mono">{row.value}</Table.Cell>
                                <Table.Cell>{row.rank}</Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      </Table.ScrollArea>
                    </Box>
                  )}
                </Stack>
              </DialogBody>

              <DialogFooter p={0} gap={3} justifyContent="flex-end" mt={6}>
                <Button
                  variant="solid"
                  colorPalette="gray"
                  onClick={closeImportResultModal}
                  disabled={importTemplateLoading || importPreviewLoading || importSubmitLoading}
                >
                  {t('dashboard.buttons.cancel')}
                </Button>
                <Button
                  variant="outline"
                  colorScheme="teal"
                  onClick={downloadImportTemplate}
                  loading={importTemplateLoading}
                  disabled={importPreviewLoading || importSubmitLoading}
                >
                  {t('dashboard.buttons.downloadExcel')}
                </Button>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  onClick={buildImportPreview}
                  loading={importPreviewLoading}
                  disabled={!importFile || importSubmitLoading || importTemplateLoading}
                >
                  {t('dashboard.buttons.previewImport')}
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={confirmImportPreview}
                  loading={importSubmitLoading}
                  disabled={importPreviewRows.length === 0 || importPreviewLoading || importTemplateLoading}
                >
                  {t('dashboard.buttons.confirmImport')}
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
