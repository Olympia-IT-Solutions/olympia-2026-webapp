import React from 'react';
import {
  Table,
  Box,
  Text,
  Icon,
  Spinner
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router';
import { FaMedal } from 'react-icons/fa';
import type { Result } from '../services/results';

interface SportsTableProps {
  data: Result[];
  loading?: boolean;
}

const MedalIcon = ({ medalType }: { medalType: string | null }) => {
  const colors: Record<string, string> = {
    GOLD: '#FFD700',
    SILVER: '#C0C0C0',
    BRONZE: '#CD7F32',
  };

  if (!medalType || !colors[medalType]) return null;

  return (
    <Icon as={FaMedal} color={colors[medalType]} boxSize={5} />
  );
};

export const SportsTable: React.FC<SportsTableProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="lg" colorPalette="teal" />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text>Keine Ergebnisse verfügbar.</Text>
      </Box>
    );
  }

  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const goToCountry = (country: string) => {
    navigate(`/${lang || 'de'}/country/${country}`);
  };

  return (
    <Box
      className="responsive-data-table"
      width="100%"
      overflowX="auto"
      bg="var(--card-bg)"
      border="1px solid"
      borderColor="var(--border-color)"
      borderRadius="2xl"
      boxShadow="var(--ring-soft)"
      p={2}
      style={{ animation: 'fadeUpIn var(--motion-base) var(--motion-ease)' }}
    >
      <Table.ScrollArea>
        <Table.Root variant='outline' className="responsive-sports-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader whiteSpace="nowrap" w="88px">Platz</Table.ColumnHeader>
              <Table.ColumnHeader minW="240px">Athlet</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap" w="140px">Land</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" whiteSpace="nowrap" w="140px">Ergebnis</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" whiteSpace="nowrap" w="110px">Medaille</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row, index) => (
              <Table.Row
                key={row.id}
                transition="background-color var(--motion-fast) var(--motion-ease)"
                _hover={{ bg: 'var(--hover-bg)' }}
              >
                <Table.Cell fontWeight="bold" whiteSpace="nowrap">{index + 1}</Table.Cell>
                <Table.Cell minW="240px">
                  <Text
                    onClick={() => goToCountry(row.country)}
                    cursor="pointer"
                    transition="color var(--motion-fast) var(--motion-ease)"
                    _hover={{ textDecoration: 'underline', color: '#007f80' }}
                    color="var(--card-text)"
                  >
                    {row.athleteName}
                  </Text>
                </Table.Cell>
                <Table.Cell whiteSpace="nowrap">
                  <Text
                    onClick={() => goToCountry(row.country)}
                    cursor="pointer"
                    transition="color var(--motion-fast) var(--motion-ease)"
                    _hover={{ textDecoration: 'underline', color: '#007f80' }}
                    color="var(--card-text)"
                  >
                    {row.country}
                  </Text>
                </Table.Cell>
                <Table.Cell textAlign="right" fontFamily="monospace" whiteSpace="nowrap">{row.value}</Table.Cell>
                <Table.Cell textAlign="center" whiteSpace="nowrap">
                  {row.hasMedal && <MedalIcon medalType={row.medalType} />}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
};
