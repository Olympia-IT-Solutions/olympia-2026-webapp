import React from 'react';
import {
  Table,
  Box,
  Text,
  Icon,
  Spinner
} from '@chakra-ui/react';
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

  return (
    <Box width="100%" overflowX="auto">
      <Table.ScrollArea>
        <Table.Root variant='outline'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Platz</Table.ColumnHeader>
              <Table.ColumnHeader>Athlet</Table.ColumnHeader>
              <Table.ColumnHeader>Land</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Ergebnis</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Medaille</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row, index) => (
              <Table.Row key={row.id}>
                <Table.Cell fontWeight="bold">{index + 1}</Table.Cell>
                <Table.Cell>{row.athleteName}</Table.Cell>
                <Table.Cell>{row.country}</Table.Cell>
                <Table.Cell textAlign="right" fontFamily="monospace">{row.value}</Table.Cell>
                <Table.Cell textAlign="center">
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
