import React from 'react';
import {
  Table,
  Box,
  Text,
  Icon
} from '@chakra-ui/react';
import { FaMedal } from 'react-icons/fa';

export interface SportResult {
  id: string | number;
  name: string;
  country: string;
  result: string;
  medal?: 'gold' | 'silver' | 'bronze';
}

interface SportsTableProps {
  data: SportResult[];
}

const MedalIcon = ({ medal }: { medal: 'gold' | 'silver' | 'bronze' }) => {
  const colors = {
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  };

  return (
    <Icon as={FaMedal} color={colors[medal]} boxSize={6} />
  );
};

export const SportsTable: React.FC<SportsTableProps> = ({ data }) => {
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
        <Table.Root variant='outline' colorScheme="whiteAlpha">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader color="white">Platz</Table.ColumnHeader>
              <Table.ColumnHeader color="white">Name</Table.ColumnHeader>
              <Table.ColumnHeader color="white">Land</Table.ColumnHeader>
              <Table.ColumnHeader color="white" textAlign="right">Ergebnis</Table.ColumnHeader>
              <Table.ColumnHeader color="white" textAlign="center">Medaille</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row, index) => (
              <Table.Row key={row.id}>
                <Table.Cell color="white">{index + 1}</Table.Cell>
                <Table.Cell color="white" fontWeight="bold">{row.name}</Table.Cell>
                <Table.Cell color="white">{row.country}</Table.Cell>
                <Table.Cell color="white" textAlign="right">{row.result}</Table.Cell>
                <Table.Cell textAlign="center">
                  {row.medal && <MedalIcon medal={row.medal} />}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
};
