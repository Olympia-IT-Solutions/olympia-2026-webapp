import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Heading, Text, Button, Input, Stack, Table, Badge, Card } from '@chakra-ui/react'
import { isAdmin } from '../logic/rights'
import { FaUserPlus, FaTrash, FaUser } from 'react-icons/fa'

interface Referee {
  id: string
  name: string
  email: string
  country: string
  sports: string[]
  createdAt: string
}

interface Result {
  id: string
  sport: string
  event: string
  athlete: string
  country: string
  result: string
  submittedBy: string
  status: 'pending' | 'approved' | 'published'
  createdAt: string
}

// Demo data
const initialReferees: Referee[] = [
  { id: '1', name: 'Hans Müller', email: 'hans.mueller@olympic.org', country: 'Germany', sports: ['Ski Alpin', 'Biathlon'], createdAt: '2025-12-01' },
  { id: '2', name: 'Maria Rossi', email: 'maria.rossi@olympic.org', country: 'Italy', sports: ['Figure Skating'], createdAt: '2025-12-05' },
  { id: '3', name: 'Jean Dupont', email: 'jean.dupont@olympic.org', country: 'France', sports: ['Ice Hockey'], createdAt: '2025-12-10' },
]

const initialResults: Result[] = [
  { id: '1', sport: 'Ski Alpin', event: 'Downhill Men', athlete: 'Marco Schwarz', country: 'Austria', result: '1:42.56', submittedBy: 'Hans Müller', status: 'published', createdAt: '2026-01-20' },
  { id: '2', sport: 'Biathlon', event: '10km Sprint Women', athlete: 'Lisa Vittozzi', country: 'Italy', result: '26:34.2', submittedBy: 'Maria Rossi', status: 'approved', createdAt: '2026-01-22' },
  { id: '3', sport: 'Figure Skating', event: 'Short Program Men', athlete: 'Yuzuru Hanyu', country: 'Japan', result: '111.82', submittedBy: 'Jean Dupont', status: 'pending', createdAt: '2026-01-24' },
]

export function Admin() {
  const [referees, setReferees] = useState<Referee[]>(initialReferees)
  const [results, setResults] = useState<Result[]>(initialResults)
  const [newReferee, setNewReferee] = useState({ name: '', email: '', country: '', sports: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const { t } = useTranslation()

  if (!isAdmin()) {
    return (
      <Box p={10} textAlign="center">
        <Heading>{t('admin.accessDeniedTitle')}</Heading>
        <Text>{t('admin.accessDeniedText')}</Text>
      </Box>
    )
  }

  const handleAddReferee = () => {
    if (newReferee.name && newReferee.email) {
      const referee: Referee = {
        id: Date.now().toString(),
        name: newReferee.name,
        email: newReferee.email,
        country: newReferee.country,
        sports: newReferee.sports.split(',').map(s => s.trim()),
        createdAt: new Date().toISOString().split('T')[0]
      }
      setReferees([...referees, referee])
      setNewReferee({ name: '', email: '', country: '', sports: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteReferee = (id: string) => {
    setReferees(referees.filter(r => r.id !== id))
  }

  const handleDeleteResult = (id: string) => {
    setResults(results.filter(r => r.id !== id))
  }

  const handleDeleteAllResults = () => {
    setResults([])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow'
      case 'approved': return 'blue'
      case 'published': return 'green'
      default: return 'gray'
    }
  }

  return (
    <Box p={10} maxW="1400px" mx="auto">
      <Heading mb={2}>{t('admin.title')}</Heading>
      <Text color="gray.500" mb={8}>{t('admin.demoNote')}</Text>

      {/* Referee Management Section */}
      <Card.Root mb={8} p={6} bg="var(--card-bg)" boxShadow="md" borderRadius="lg">
        <Stack direction="row" justify="space-between" align="center" mb={4}>
          <Heading size="lg">
            <FaUser style={{ display: 'inline', marginRight: '10px' }} />
            {t('admin.refereesManage')}
          </Heading>
          <Button
            colorScheme="teal"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <FaUserPlus style={{ marginRight: '8px' }} />
            {t('admin.newReferee')}
          </Button>
        </Stack>

        {showAddForm && (
          <Box bg="var(--muted-bg)" p={4} borderRadius="md" mb={4}>
            <Stack gap={3}>
              <Input
                placeholder={t('admin.placeholders.name')}
                value={newReferee.name}
                onChange={(e) => setNewReferee({ ...newReferee, name: e.target.value })}
              />
              <Input
                placeholder={t('admin.placeholders.email')}
                value={newReferee.email}
                onChange={(e) => setNewReferee({ ...newReferee, email: e.target.value })}
              />
              <Input
                placeholder={t('admin.placeholders.country')}
                value={newReferee.country}
                onChange={(e) => setNewReferee({ ...newReferee, country: e.target.value })}
              />
              <Input
                placeholder={t('admin.placeholders.sports')}
                value={newReferee.sports}
                onChange={(e) => setNewReferee({ ...newReferee, sports: e.target.value })}
              />
              <Stack direction="row" gap={2}>
                <Button colorScheme="green" onClick={handleAddReferee}>{t('admin.buttons.save')}</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>{t('admin.buttons.cancel')}</Button>
              </Stack>
            </Stack>
          </Box>
        )}

        <Table.Root variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>{t('admin.table.columns.name')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('admin.table.columns.email')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('admin.table.columns.country')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('admin.table.columns.sports')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('admin.table.columns.createdAt')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('admin.table.columns.actions')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {referees.map((referee) => (
              <Table.Row key={referee.id}>
                <Table.Cell>{referee.name}</Table.Cell>
                <Table.Cell>{referee.email}</Table.Cell>
                <Table.Cell>{referee.country}</Table.Cell>
                <Table.Cell>{referee.sports.join(', ')}</Table.Cell>
                <Table.Cell>{referee.createdAt}</Table.Cell>
                <Table.Cell>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDeleteReferee(referee.id)}
                  >
                    <FaTrash />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        {referees.length === 0 && (
          <Text textAlign="center" color="gray.500" py={4}>{t('admin.noReferees')}</Text>
        )}
      </Card.Root>

      {/* Results Management Section */}
      <Card.Root p={6} bg="var(--card-bg)" boxShadow="md" borderRadius="lg">
        <Stack direction="row" justify="space-between" align="center" mb={4}>
          <Heading size="lg">
            {t('admin.resultsTitle')}
          </Heading> 
          <Button
            colorScheme="red"
            variant="outline"
            onClick={handleDeleteAllResults}
            disabled={results.length === 0}
          >
            <FaTrash style={{ marginRight: '8px' }} />
            {t('admin.buttons.deleteAll')}
          </Button>
        </Stack>

        <Table.Root variant="line">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>{t('dashboard.table.columns.sportEvent')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('dashboard.table.columns.athlete')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('dashboard.table.columns.country')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('dashboard.table.columns.result')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('dashboard.table.columns.submittedBy')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('dashboard.table.columns.status')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('dashboard.table.columns.actions')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {results.map((result) => (
              <Table.Row key={result.id}>
                <Table.Cell>{result.sport}</Table.Cell>
                <Table.Cell>{result.event}</Table.Cell>
                <Table.Cell>{result.athlete}</Table.Cell>
                <Table.Cell>{result.country}</Table.Cell>
                <Table.Cell fontWeight="bold">{result.result}</Table.Cell>
                <Table.Cell>{result.submittedBy}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={getStatusColor(result.status)}>
                    {result.status === 'pending' ? t('status.pending') : result.status === 'approved' ? t('status.approved') : t('status.published')}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDeleteResult(result.id)}
                  >
                    <FaTrash />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        {results.length === 0 && (
          <Text textAlign="center" color="gray.500" py={4}>{t('dashboard.table.noResults')}</Text>
        )}
      </Card.Root>
    </Box>
  )
}
