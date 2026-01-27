import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Box,
  Text
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { DebugManager } from '../debug';

export interface CountryMedalData {
  country: string;
  bronze: number;
  silver: number;
  gold: number;
}

interface CountryTableProps {
  data?: CountryMedalData[];
}

export const CountryTable: React.FC<CountryTableProps> = ({ data = [] }) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);

  const displayData = useMemo(() => {
    // Check if debug mode is enabled and we should use test data
    if (DebugManager.enableTestData()) {
       // Generate dummy data (more than 50 to test pagination)
       const dummyData: CountryMedalData[] = Array.from({ length: 65 }, (_, i) => ({
         country: `Land ${i + 1}`,
         gold: Math.floor(Math.random() * 20),
         silver: Math.floor(Math.random() * 20),
         bronze: Math.floor(Math.random() * 20),
       }));
       return dummyData;
    }

    return data;
  }, [data]);

  const visibleData = showAll ? displayData : displayData.slice(0, 50);
  const hasMore = displayData.length > 50;

  if (displayData.length === 0) {
      return (
          <Box p={4} textAlign="center">
              <Text>{t('countryTable.noData')}</Text>
          </Box>
      );
  }

  return (
    <Box width="100%" overflowX="auto">
      <Table.ScrollArea>
        <Table.Root variant='outline'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>{t('countryTable.columns.country')}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">{t('countryTable.columns.bronze')}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">{t('countryTable.columns.silver')}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">{t('countryTable.columns.gold')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleData.map((row, index) => (
              <Table.Row key={row.country || index}>
                <Table.Cell>{row.country}</Table.Cell>
                <Table.Cell textAlign="right">{row.bronze}</Table.Cell>
                <Table.Cell textAlign="right">{row.silver}</Table.Cell>
                <Table.Cell textAlign="right">{row.gold}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      {!showAll && hasMore && (
        <Box display="flex" justifyContent="center" mt={4}>
            <Button onClick={() => setShowAll(true)} colorPalette="teal">
            {t('countryTable.loadMore')}
            </Button>
        </Box>
      )}
    </Box>
  );
};
