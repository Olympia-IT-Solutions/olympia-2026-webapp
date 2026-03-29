import React from 'react'
import { useTranslation } from 'react-i18next'
import { Badge, Box, Button, Icon, Stack, Table, Text } from '@chakra-ui/react'
import { FaBan, FaCheck, FaEdit, FaTimes } from 'react-icons/fa'
import type { RoleType } from '../logic/rights'
import type { Result } from '../services/results'
import { DataTableState, DataTableSurface, getDataTableRowStyles, LoadingSpinner } from './ui'

interface ResultsBySportTableProps {
  data: Result[]
  loading?: boolean
  currentRole?: RoleType | null
  currentUserEmail?: string | null
  sportName?: string
  onEdit?: (result: Result, sportName?: string) => void
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
  sportName,
  onEdit,
  onApprove,
  onReject,
  onInvalidate,
}) => {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minH="180px">
        <LoadingSpinner size="lg" />
      </Box>
    )
  }

  if (!data || data.length === 0) {
    return (
      <DataTableState message={t('dashboard.table.noResults')} />
    )
  }

  const canReview = currentRole === 'admin' || currentRole === 'referee'

  return (
    <DataTableSurface>
      <Table.ScrollArea>
        <Table.Root variant="outline" size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{t('dashboard.table.columns.athlete')}</Table.ColumnHeader>
              <Table.ColumnHeader py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{t('dashboard.table.columns.submittedBy')}</Table.ColumnHeader>
              <Table.ColumnHeader py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{t('dashboard.table.columns.country')}</Table.ColumnHeader>
              <Table.ColumnHeader py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{t('dashboard.table.columns.result')}</Table.ColumnHeader>
              <Table.ColumnHeader py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{t('dashboard.table.columns.medal')}</Table.ColumnHeader>
              <Table.ColumnHeader py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{t('dashboard.table.columns.status')}</Table.ColumnHeader>
              <Table.ColumnHeader py={3} fontSize="xs" color="text" fontWeight="semibold" textTransform="uppercase" letterSpacing="0.06em">{t('dashboard.table.columns.actions')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((result) => {
              const normalizedStatus = result.status.toUpperCase()
              const isPending = normalizedStatus === 'PENDING'
              const canEdit = currentRole === 'admin' && Boolean(onEdit) && normalizedStatus !== 'APPROVED' && normalizedStatus !== 'PUBLISHED'
              const isOwnSubmission = Boolean(currentUserEmail && result.createdByUsername && currentUserEmail === result.createdByUsername)
              const canReviewPending = canReview && isPending && !isOwnSubmission
              const canInvalidate = currentRole === 'admin' && (normalizedStatus === 'APPROVED' || normalizedStatus === 'PUBLISHED')

              return (
                <Table.Row key={result.id} {...getDataTableRowStyles()}>
                  <Table.Cell py={3}>
                    <Text fontWeight="600">{result.athleteName}</Text>
                    <Text fontSize="xs" color="text-muted">{result.sportName}</Text>
                  </Table.Cell>
                  <Table.Cell py={3}>
                    <Text>{result.createdByUsername ?? '-'}</Text>
                    {isOwnSubmission && (
                      <Text fontSize="xs" color="accent">
                        {t('dashboard.table.ownSubmission')}
                      </Text>
                    )}
                  </Table.Cell>
                  <Table.Cell py={3}>{result.countryName ?? result.country ?? '-'}</Table.Cell>
                  <Table.Cell py={3} fontWeight="bold" fontFamily="mono">{result.value}</Table.Cell>
                  <Table.Cell py={3}>
                    {result.hasMedal && result.medalType ? (
                      <Badge colorPalette={getMedalColor(result.medalType)}>
                        {result.medalType}
                      </Badge>
                    ) : (
                      <Text color="text-muted">-</Text>
                    )}
                  </Table.Cell>
                  <Table.Cell py={3}>
                    <Badge colorPalette={getStatusColor(normalizedStatus)}>
                      {t(`status.${normalizedStatus.toLowerCase()}`, { defaultValue: normalizedStatus })}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell py={3}>
                    <Stack direction="row" gap={2} wrap="wrap">
                      {canEdit && onEdit && (
                        <Button size="sm" colorScheme="blue" variant="solid" onClick={() => onEdit(result, sportName)}>
                          <Icon as={FaEdit} boxSize={3} mr={1} />
                          {t('dashboard.buttons.edit')}
                        </Button>
                      )}
                      {canReviewPending && onApprove && (
                        <Button size="sm" colorScheme="green" variant="solid" onClick={() => onApprove(result.id)}>
                          <Icon as={FaCheck} boxSize={3} mr={1} />
                          {t('dashboard.buttons.approve')}
                        </Button>
                      )}
                      {canReviewPending && onReject && (
                        <Button size="sm" colorScheme="red" variant="solid" onClick={() => onReject(result.id)}>
                          <Icon as={FaTimes} boxSize={3} mr={1} />
                          {t('dashboard.buttons.reject')}
                        </Button>
                      )}
                      {isPending && isOwnSubmission && (
                        <Text fontSize="xs" color="text-muted" alignSelf="center">
                          {t('dashboard.table.ownSubmissionBlocked')}
                        </Text>
                      )}
                      {canInvalidate && onInvalidate && (
                        <Button size="sm" colorScheme="orange" variant="solid" onClick={() => onInvalidate(result.id)}>
                          <Icon as={FaBan} boxSize={3} mr={1} />
                          {t('dashboard.buttons.invalidate')}
                        </Button>
                      )}
                      {!isPending && !canInvalidate && (
                        <Text fontSize="xs" color="text-muted" alignSelf="center">
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
      </Table.ScrollArea>
    </DataTableSurface>
  )
}
