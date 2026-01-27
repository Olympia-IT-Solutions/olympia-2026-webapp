import { useState } from 'react'
import { Box, Heading, Text, Button, Input, Stack, Table, Badge, Card, Textarea } from '@chakra-ui/react'
import { getCurrentUser } from '../logic/rights'
import { FaPlus, FaCheck, FaGlobe, FaClipboardList, FaEye } from 'react-icons/fa'

interface Result {
  id: string
  sport: string
  event: string
  athlete: string
  country: string
  result: string
  notes: string
  submittedBy: string
  submittedAt: string
  status: 'pending' | 'approved' | 'published'
  approvedBy?: string
  approvedAt?: string
  publishedBy?: string
  publishedAt?: string
}

// Demo data with 4-eye principle workflow
const initialResults: Result[] = [
  { 
    id: '1', 
    sport: 'Ski Alpin', 
    event: 'Downhill Men', 
    athlete: 'Marco Schwarz', 
    country: 'Austria', 
    result: '1:42.56',
    notes: 'Excellent run, no penalties',
    submittedBy: 'referee@test.com', 
    submittedAt: '2026-01-20 14:30',
    status: 'published',
    approvedBy: 'hans.mueller@olympic.org',
    approvedAt: '2026-01-20 15:00',
    publishedBy: 'hans.mueller@olympic.org',
    publishedAt: '2026-01-20 15:05'
  },
  { 
    id: '2', 
    sport: 'Biathlon', 
    event: '10km Sprint Women', 
    athlete: 'Lisa Vittozzi', 
    country: 'Italy', 
    result: '26:34.2',
    notes: 'One missed shot',
    submittedBy: 'referee@test.com', 
    submittedAt: '2026-01-22 10:15',
    status: 'approved',
    approvedBy: 'maria.rossi@olympic.org',
    approvedAt: '2026-01-22 10:45'
  },
  { 
    id: '3', 
    sport: 'Figure Skating', 
    event: 'Short Program Men', 
    athlete: 'Yuzuru Hanyu', 
    country: 'Japan', 
    result: '111.82',
    notes: 'Flawless performance',
    submittedBy: 'jean.dupont@olympic.org', 
    submittedAt: '2026-01-24 18:00',
    status: 'pending'
  },
]

const sportOptions = [
  'Ski Alpin', 'Biathlon', 'Bobsled', 'Cross-Country Skiing', 
  'Curling', 'Figure Skating', 'Freestyle Skiing', 'Ice Hockey',
  'Luge', 'Nordic Combined', 'Short Track', 'Skeleton',
  'Ski Jumping', 'Snowboard', 'Speed Skating'
]

export function Dashboard() {
  const currentUser = getCurrentUser()
  const [results, setResults] = useState<Result[]>(initialResults)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newResult, setNewResult] = useState({
    sport: '',
    event: '',
    athlete: '',
    country: '',
    result: '',
    notes: ''
  })

  const handleAddResult = () => {
    if (newResult.sport && newResult.event && newResult.athlete && newResult.result) {
      const result: Result = {
        id: Date.now().toString(),
        ...newResult,
        submittedBy: currentUser?.email || 'unknown',
        submittedAt: new Date().toLocaleString('de-DE'),
        status: 'pending'
      }
      setResults([result, ...results])
      setNewResult({ sport: '', event: '', athlete: '', country: '', result: '', notes: '' })
      setShowAddForm(false)
    }
  }

  const handleApprove = (id: string) => {
    setResults(results.map(r => {
      if (r.id === id && r.submittedBy !== currentUser?.email) {
        return {
          ...r,
          status: 'approved' as const,
          approvedBy: currentUser?.email,
          approvedAt: new Date().toLocaleString('de-DE')
        }
      }
      return r
    }))
  }

  const handlePublish = (id: string) => {
    setResults(results.map(r => {
      if (r.id === id && r.status === 'approved') {
        return {
          ...r,
          status: 'published' as const,
          publishedBy: currentUser?.email,
          publishedAt: new Date().toLocaleString('de-DE')
        }
      }
      return r
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow'
      case 'approved': return 'blue'
      case 'published': return 'green'
      default: return 'gray'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ausstehend'
      case 'approved': return 'Genehmigt'
      case 'published': return 'Veröffentlicht'
      default: return status
    }
  }

  const canApprove = (result: Result) => {
    // 4-eye principle: Cannot approve your own submission
    return result.status === 'pending' && result.submittedBy !== currentUser?.email
  }

  const canPublish = (result: Result) => {
    // Can publish if approved
    return result.status === 'approved'
  }

  return (
    <Box p={10} maxW="1400px" mx="auto">
      <Heading mb={2}>Schiedsrichter Dashboard</Heading>
      <Text color="gray.500" mb={2}>
        Demo Version - Ergebnisverwaltung mit 4-Augen-Prinzip
      </Text>
      {currentUser && (
        <Text fontSize="sm" color="teal.600" mb={8}>
          Angemeldet als: {currentUser.email} ({currentUser.role})
        </Text>
      )}

      {/* Info Box about 4-Eye Principle */}
      <Card.Root mb={6} p={4} bg="blue.50" borderRadius="lg" borderLeft="4px solid" borderLeftColor="blue.500">
        <Stack direction="row" align="center" gap={3}>
          <FaEye color="#3182CE" size={24} />
          <Box>
            <Text fontWeight="bold" color="blue.800">4-Augen-Prinzip</Text>
            <Text fontSize="sm" color="blue.700">
              Ergebnisse müssen von einem anderen Schiedsrichter genehmigt werden, bevor sie veröffentlicht werden können. 
              Sie können Ihre eigenen Einreichungen nicht genehmigen.
            </Text>
          </Box>
        </Stack>
      </Card.Root>

      {/* Add New Result Section */}
      <Card.Root mb={8} p={6} bg="var(--card-bg)" boxShadow="md" borderRadius="lg">
        <Stack direction="row" justify="space-between" align="center" mb={4}>
          <Heading size="lg">
            <FaClipboardList style={{ display: 'inline', marginRight: '10px' }} />
            Neues Ergebnis einreichen
          </Heading>
          <Button
            colorScheme="teal"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <FaPlus style={{ marginRight: '8px' }} />
            Ergebnis hinzufügen
          </Button>
        </Stack>

        {showAddForm && (
          <Box bg="var(--muted-bg)" p={4} borderRadius="md" mb={4}>
            <Stack gap={3}>
              <Stack direction={{ base: 'column', md: 'row' }} gap={3}>
                <Box flex={1}>
                  <Text fontSize="sm" mb={1} fontWeight="medium">Sportart</Text>
                  <Input
                    placeholder="z.B. Ski Alpin"
                    value={newResult.sport}
                    onChange={(e) => setNewResult({ ...newResult, sport: e.target.value })}
                    list="sports"
                  />
                  <datalist id="sports">
                    {sportOptions.map(s => <option key={s} value={s} />)}
                  </datalist>
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" mb={1} fontWeight="medium">Event</Text>
                  <Input
                    placeholder="z.B. Downhill Men"
                    value={newResult.event}
                    onChange={(e) => setNewResult({ ...newResult, event: e.target.value })}
                  />
                </Box>
              </Stack>
              <Stack direction={{ base: 'column', md: 'row' }} gap={3}>
                <Box flex={1}>
                  <Text fontSize="sm" mb={1} fontWeight="medium">Athlet</Text>
                  <Input
                    placeholder="Name des Athleten"
                    value={newResult.athlete}
                    onChange={(e) => setNewResult({ ...newResult, athlete: e.target.value })}
                  />
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" mb={1} fontWeight="medium">Land</Text>
                  <Input
                    placeholder="z.B. Austria"
                    value={newResult.country}
                    onChange={(e) => setNewResult({ ...newResult, country: e.target.value })}
                  />
                </Box>
                <Box flex={1}>
                  <Text fontSize="sm" mb={1} fontWeight="medium">Ergebnis</Text>
                  <Input
                    placeholder="z.B. 1:42.56"
                    value={newResult.result}
                    onChange={(e) => setNewResult({ ...newResult, result: e.target.value })}
                  />
                </Box>
              </Stack>
              <Box>
                <Text fontSize="sm" mb={1} fontWeight="medium">Notizen (optional)</Text>
                <Textarea
                  placeholder="Zusätzliche Bemerkungen..."
                  value={newResult.notes}
                  onChange={(e) => setNewResult({ ...newResult, notes: e.target.value })}
                />
              </Box>
              <Stack direction="row" gap={2}>
                <Button colorScheme="green" onClick={handleAddResult}>Einreichen</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Abbrechen</Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Card.Root>

      {/* Results Table */}
      <Card.Root p={6} bg="var(--card-bg)" boxShadow="md" borderRadius="lg">
        <Heading size="lg" mb={4}>
          Eingereichte Ergebnisse
        </Heading> 

        <Box overflowX="auto">
          <Table.Root variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Sportart / Event</Table.ColumnHeader>
                <Table.ColumnHeader>Athlet</Table.ColumnHeader>
                <Table.ColumnHeader>Land</Table.ColumnHeader>
                <Table.ColumnHeader>Ergebnis</Table.ColumnHeader>
                <Table.ColumnHeader>Eingereicht von</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Aktionen</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {results.map((result) => (
                <Table.Row key={result.id}>
                  <Table.Cell>
                    <Text fontWeight="bold">{result.sport}</Text>
                    <Text fontSize="sm" color="gray.500">{result.event}</Text>
                  </Table.Cell>
                  <Table.Cell>{result.athlete}</Table.Cell>
                  <Table.Cell>{result.country}</Table.Cell>
                  <Table.Cell fontWeight="bold" fontFamily="mono">{result.result}</Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm">{result.submittedBy}</Text>
                    <Text fontSize="xs" color="gray.500">{result.submittedAt}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={getStatusColor(result.status)}>
                      {getStatusText(result.status)}
                    </Badge>
                    {result.approvedBy && (
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Genehmigt von: {result.approvedBy}
                      </Text>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Stack direction="row" gap={2}>
                      {canApprove(result) && (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleApprove(result.id)}
                          title="Genehmigen (4-Augen-Prinzip)"
                        >
                          <FaCheck style={{ marginRight: '4px' }} />
                          Genehmigen
                        </Button>
                      )}
                      {canPublish(result) && (
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handlePublish(result.id)}
                          title="Veröffentlichen"
                        >
                          <FaGlobe style={{ marginRight: '4px' }} />
                          Veröffentlichen
                        </Button>
                      )}
                      {result.status === 'pending' && result.submittedBy === currentUser?.email && (
                        <Text fontSize="xs" color="gray.500" alignSelf="center">
                          Wartet auf Genehmigung
                        </Text>
                      )}
                      {result.status === 'published' && (
                        <Text fontSize="xs" color="green.500" alignSelf="center">
                          ✓ Veröffentlicht
                        </Text>
                      )}
                    </Stack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
        {results.length === 0 && (
          <Text textAlign="center" color="gray.500" py={4}>Keine Ergebnisse vorhanden</Text>
        )}
      </Card.Root>
    </Box>
  )
}
