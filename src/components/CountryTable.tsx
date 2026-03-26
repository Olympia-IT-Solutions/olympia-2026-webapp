import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  Button,
  Box,
  Text,
  Spinner
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { CountryMedalData } from '../services/medals';
import { fetchMedalsTable } from '../services/medals';

interface CountryTableProps {
  data?: CountryMedalData[];
  onCountryClick?: (country: string) => void;
}

export const CountryTable: React.FC<CountryTableProps> = ({ data = [], onCountryClick }) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [apiData, setApiData] = useState<CountryMedalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedData = await fetchMedalsTable();
        setApiData(fetchedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch medal data';
        setError(errorMessage);
        console.error('Error fetching medal data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayData = useMemo(() => {
    // Use API data if available, otherwise use passed data
    return apiData.length > 0 ? apiData : data;
  }, [apiData, data]);

  const visibleData = showAll ? displayData : displayData.slice(0, 50);
  const hasMore = displayData.length > 50;

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="lg" colorPalette="teal" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Text color="red.500">{t('countryTable.error', { defaultValue: 'Error loading data' })}</Text>
        <Text fontSize="sm" mt={2}>{error}</Text>
      </Box>
    );
  }

  if (displayData.length === 0) {
      return (
          <Box p={4} textAlign="center">
              <Text>{t('countryTable.noData')}</Text>
          </Box>
      );
  }

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
        <Table.Root variant='outline' className="responsive-country-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader whiteSpace="nowrap" minW="220px">{t('countryTable.columns.country')}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" whiteSpace="nowrap" w="110px">{t('countryTable.columns.bronze')}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" whiteSpace="nowrap" w="110px">{t('countryTable.columns.silver')}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" whiteSpace="nowrap" w="110px">{t('countryTable.columns.gold')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleData.map((row, index) => (
              <Table.Row 
                key={row.country || index}
                onClick={() => onCountryClick?.(row.country)}
                transition="background-color var(--motion-fast) var(--motion-ease)"
                _hover={onCountryClick ? { bg: 'var(--hover-bg)', cursor: 'pointer' } : undefined}
              >
                <Table.Cell whiteSpace="nowrap" minW="220px">{row.country}</Table.Cell>
                <Table.Cell textAlign="right" whiteSpace="nowrap">{row.bronze}</Table.Cell>
                <Table.Cell textAlign="right" whiteSpace="nowrap">{row.silver}</Table.Cell>
                <Table.Cell textAlign="right" whiteSpace="nowrap">{row.gold}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      {!showAll && hasMore && (
        <Box display="flex" justifyContent="center" mt={4}>
            <Button onClick={() => setShowAll(true)} colorPalette="teal" borderRadius="full" transition="all var(--motion-fast) var(--motion-ease)" _hover={{ transform: 'translateY(-2px)' }}>
            {t('countryTable.loadMore')}
            </Button>
        </Box>
      )}
    </Box>
  );
};
