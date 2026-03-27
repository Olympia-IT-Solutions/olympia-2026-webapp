import React from 'react'
import { useTranslation } from 'react-i18next'
import { Badge, Box, Button, Stack, Table, Text, Spinner } from '@chakra-ui/react'
import { FaBan, FaCheck, FaTimes } from 'react-icons/fa'
import type { RoleType } from '../logic/rights'
import type { Result } from '../services/results'

interface ResultsBySportTableProps {
  data: Result[]
  loading?: boolean
  currentRole?: RoleType | null
  currentUserEmail?: string | null
  onApprove?: (resultId: number) => void
  onReject?: (resultId: number) => void
  onInvalidate?: (resultId: number) => void
}

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'yellow'
    case 'APPROVED':
      return 'blue'
    case 'PUBLISHED':
      return 'green'
    case 'REJECTED':
      return 'red'
    case 'INVALIDATED':
      return 'gray'
    default:
      return 'gray'
  }
}

const getMedalColor = (medalType: Result['medalType']) => {
  switch (medalType) {
    case 'GOLD':
      return 'yellow'
    case 'SILVER':
      return 'gray'
    case 'BRONZE':
      return 'orange'
    default:
      return 'gray'
  }
}

export const ResultsBySportTable: React.FC<ResultsBySportTableProps> = ({
  data,
  loading = false,
  currentRole,
  currentUserEmail,
  onApprove,
  onReject,
  onInvalidate,
}) => {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minH="180px">
        <Spinner size="lg" colorPalette="teal" />
      </Box>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500">{t('dashboard.table.noResults')}</Text>
      </Box>
    )
  }

  const canReview = currentRole === 'admin' || currentRole === 'referee'

  return (
    <Box overflowX="auto">
      <Table.Root variant="line">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{t('dashboard.table.columns.athlete')}</Table.ColumnHeader>
            <Table.ColumnHeader>{t('dashboard.table.columns.submittedBy')}</Table.ColumnHeader>
            <Table.ColumnHeader>{t('dashboard.table.columns.country')}</Table.ColumnHeader>
            <Table.ColumnHeader>{t('dashboard.table.columns.result')}</Table.ColumnHeader>
            <Table.ColumnHeader>{t('dashboard.table.columns.medal')}</Table.ColumnHeader>
            <Table.ColumnHeader>{t('dashboard.table.columns.status')}</Table.ColumnHeader>
            <Table.ColumnHeader>{t('dashboard.table.columns.actions')}</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((result) => {
            const normalizedStatus = result.status.toUpperCase()
            const isPending = normalizedStatus === 'PENDING'
            const isOwnSubmission = Boolean(currentUserEmail && result.createdByUsername && currentUserEmail === result.createdByUsername)
            const canReviewPending = canReview && isPending && !isOwnSubmission
            const canInvalidate = currentRole === 'admin' && (normalizedStatus === 'APPROVED' || normalizedStatus === 'PUBLISHED')

            return (
              <Table.Row key={result.id}>
                <Table.Cell>
                  <Text fontWeight="600">{result.athleteName}</Text>
                  <Text fontSize="xs" color="gray.500">{result.sportName}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{result.createdByUsername ?? '-'}</Text>
                  {isOwnSubmission && (
                    <Text fontSize="xs" color="teal.600">
                      {t('dashboard.table.ownSubmission')}
                    </Text>
                  )}
                </Table.Cell>
                <Table.Cell>{result.countryName ?? result.country ?? '-'}</Table.Cell>
                <Table.Cell fontWeight="bold" fontFamily="mono">{result.value}</Table.Cell>
                <Table.Cell>
                  {result.hasMedal && result.medalType ? (
                    <Badge colorPalette={getMedalColor(result.medalType)}>
                      {result.medalType}
                    </Badge>
                  ) : (
                    <Text color="gray.500">-</Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={getStatusColor(normalizedStatus)}>
                    {t(`status.${normalizedStatus.toLowerCase()}`, { defaultValue: normalizedStatus })}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Stack direction="row" gap={2} wrap="wrap">
                    {canReviewPending && onApprove && (
                      <Button size="sm" colorScheme="green" onClick={() => onApprove(result.id)}>
                        <FaCheck style={{ marginRight: '4px' }} />
                        {t('dashboard.buttons.approve')}
                      </Button>
                    )}
                    {canReviewPending && onReject && (
                      <Button size="sm" colorScheme="red" variant="outline" onClick={() => onReject(result.id)}>
                        <FaTimes style={{ marginRight: '4px' }} />
                        {t('dashboard.buttons.reject')}
                      </Button>
                    )}
                    {isPending && isOwnSubmission && (
                      <Text fontSize="xs" color="gray.500" alignSelf="center">
                        {t('dashboard.table.ownSubmissionBlocked')}
                      </Text>
                    )}
                    {canInvalidate && onInvalidate && (
                      <Button size="sm" colorScheme="orange" variant="outline" onClick={() => onInvalidate(result.id)}>
                        <FaBan style={{ marginRight: '4px' }} />
                        {t('dashboard.buttons.invalidate')}
                      </Button>
                    )}
                    {!isPending && !canInvalidate && (
                      <Text fontSize="xs" color="gray.500" alignSelf="center">
                        {t('dashboard.table.noActions', { defaultValue: '-' })}
                      </Text>
                    )}
                  </Stack>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
