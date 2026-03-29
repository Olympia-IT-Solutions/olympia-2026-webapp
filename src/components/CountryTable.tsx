import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  Button,
  Box,
  Badge
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { CountryMedalData } from '../services/medals';
import { fetchMedalsTable } from '../services/medals';
import { fetchAllCountries } from '../services/countries';
import { DataTableState, DataTableSurface, getDataTableRowStyles, LoadingSpinner } from './ui';

interface CountryTableProps {
  data?: CountryMedalData[];
  onCountryClick?: (country: string) => void;
}

export const CountryTable: React.FC<CountryTableProps> = ({ data = [], onCountryClick }) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [apiData, setApiData] = useState<CountryMedalData[]>([]);
  const [countryNames, setCountryNames] = useState<Record<string, string>>({});
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

  useEffect(() => {
    let isActive = true;

    const fetchCountryNames = async () => {
      try {
        const countries = await fetchAllCountries();

        if (!isActive) {
          return;
        }

        const nextCountryNames = countries.reduce<Record<string, string>>((accumulator, country) => {
          if (country.code) {
            accumulator[country.code.toUpperCase()] = country.name;
            accumulator[country.code.toLowerCase()] = country.name;
          }

          accumulator[country.name.toUpperCase()] = country.name;
          accumulator[country.name.toLowerCase()] = country.name;

          return accumulator;
        }, {});

        setCountryNames(nextCountryNames);
      } catch (fetchError) {
        console.error('Error fetching countries for name lookup:', fetchError);
      }
    };

    void fetchCountryNames();

    return () => {
      isActive = false;
    };
  }, []);

  const displayData = useMemo(() => {
    // Use API data if available, otherwise use passed data
    return apiData.length > 0 ? apiData : data;
  }, [apiData, data]);

  const visibleData = showAll ? displayData : displayData.slice(0, 50);
  const hasMore = displayData.length > 50;

  const resolveCountryName = (country: string) =>
    countryNames[country] ?? countryNames[country.toUpperCase()] ?? countryNames[country.toLowerCase()] ?? country;

  const rowLinkButtonProps = {
    variant: 'ghost' as const,
    p: 0,
    minH: 'unset',
    h: 'auto',
    justifyContent: 'flex-start',
    fontWeight: 'semibold',
    color: 'text',
    transition: 'color var(--motion-fast) var(--motion-ease)',
    _hover: { textDecoration: 'underline', color: 'accent', bg: 'transparent' },
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'accent',
      outlineOffset: '2px',
      borderRadius: 'sm',
    },
  };

  const renderMedalCount = (value: number, medalType: 'bronze' | 'silver' | 'gold') => {
    const medalStyles = {
      bronze: {
        bg: '#b87333',
        color: '#fffaf4',
        borderColor: '#8a4f1f',
      },
      silver: {
        bg: '#d2d7de',
        color: '#111827',
        borderColor: '#8b95a1',
      },
      gold: {
        bg: '#d6a400',
        color: '#111827',
        borderColor: '#9c7600',
      },
    } as const

    const styles = medalStyles[medalType]

    return (
      <Badge
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        minW="2.4rem"
        px={2.5}
        py={0.5}
        borderRadius="full"
        borderWidth="1px"
        borderColor={styles.borderColor}
        bg={styles.bg}
        color={styles.color}
        fontWeight="800"
        fontSize="sm"
        lineHeight="1"
        textShadow={medalType === 'silver' ? 'none' : '0 1px 0 rgba(0, 0, 0, 0.18)'}
      >
        {value}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minH="200px">
        <LoadingSpinner size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <DataTableState
        tone="danger"
        message={t('countryTable.error', { defaultValue: 'Error loading data' })}
        helperText={error}
      />
    );
  }

  if (displayData.length === 0) {
      return (
          <DataTableState message={t('countryTable.noData')} />
      );
  }

  return (
    <DataTableSurface>
      <Table.ScrollArea>
        <Table.Root variant='outline' size="sm" className="responsive-country-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader whiteSpace="nowrap" minW="220px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">{t('countryTable.columns.country')}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" whiteSpace="nowrap" w="110px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">{t('countryTable.columns.bronze')}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" whiteSpace="nowrap" w="110px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">{t('countryTable.columns.silver')}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" whiteSpace="nowrap" w="110px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">{t('countryTable.columns.gold')}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" whiteSpace="nowrap" w="110px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">{t('countryTable.columns.total')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleData.map((row, index) => (
              <Table.Row 
                key={row.country || index}
                {...getDataTableRowStyles(false)}
              >
                <Table.Cell whiteSpace="nowrap" minW="220px" py={3}>
                  {onCountryClick ? (
                    <Button {...rowLinkButtonProps} onClick={() => onCountryClick(row.country)}>
                      {resolveCountryName(row.country)}
                    </Button>
                  ) : (
                    <Box as="span" fontWeight="semibold">{resolveCountryName(row.country)}</Box>
                  )}
                </Table.Cell>
                <Table.Cell textAlign="right" whiteSpace="nowrap" py={3} fontFamily="mono">
                  {renderMedalCount(row.bronze, 'bronze')}
                </Table.Cell>
                <Table.Cell textAlign="right" whiteSpace="nowrap" py={3} fontFamily="mono">
                  {renderMedalCount(row.silver, 'silver')}
                </Table.Cell>
                <Table.Cell textAlign="right" whiteSpace="nowrap" py={3} fontFamily="mono">
                  {renderMedalCount(row.gold, 'gold')}
                </Table.Cell>
                <Table.Cell textAlign="right" whiteSpace="nowrap" py={3} fontFamily="mono">{row.total ?? row.bronze + row.silver + row.gold}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      {!showAll && hasMore && (
        <Box display="flex" justifyContent="center" mt={4}>
            <Button
              onClick={() => setShowAll(true)}
              bg="accent"
              color="neutral.0"
              borderRadius="full"
              transition="all var(--motion-fast) var(--motion-ease)"
              _hover={{ transform: 'translateY(-2px)', bg: 'accent-strong' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'accent',
                outlineOffset: '2px',
              }}
            >
            {t('countryTable.loadMore')}
            </Button>
        </Box>
      )}
    </DataTableSurface>
  );
};
