import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Box,
  Badge,
  Input,
  Stack,
  Text
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import type { CountryMedalData } from '../services/medals';
import { fetchMedalsTable } from '../services/medals';
import { fetchAllCountries } from '../services/countries';
import { CountryFlag, DataTableState, DataTableSurface, getDataTableRowStyles, LoadingSpinner } from './ui';

const normalizeSearchText = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const escapeCsvValue = (value: string | number | null | undefined) => {
  const text = value == null ? '' : String(value);

  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const toCsvRow = (values: Array<string | number | null | undefined>) => values.map(escapeCsvValue).join(',');

interface CountryLookup {
  name: string;
  code?: string;
}

interface CountryTableProps {
  data?: CountryMedalData[];
  onCountryClick?: (country: string) => void;
}

export const CountryTable: React.FC<CountryTableProps> = ({ data = [], onCountryClick }) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState<'all' | 'goldOnly'>('all');
  const [apiData, setApiData] = useState<CountryMedalData[]>([]);
  const [countryLookups, setCountryLookups] = useState<Record<string, CountryLookup>>({});
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

        const nextCountryLookups = countries.reduce<Record<string, CountryLookup>>((accumulator, country) => {
          const lookup = {
            name: country.name,
            code: country.code?.toUpperCase(),
          };

          if (country.code) {
            accumulator[country.code.toUpperCase()] = lookup;
            accumulator[country.code.toLowerCase()] = lookup;
          }

          accumulator[country.name.toUpperCase()] = lookup;
          accumulator[country.name.toLowerCase()] = lookup;

          return accumulator;
        }, {});

        setCountryLookups(nextCountryLookups);
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

  const resolveCountryLookup = useCallback(
    (country: string) => countryLookups[country] ?? countryLookups[country.toUpperCase()] ?? countryLookups[country.toLowerCase()] ?? null,
    [countryLookups],
  );

  const resolveCountryName = useCallback((country: string) => resolveCountryLookup(country)?.name ?? country, [resolveCountryLookup]);

  const resolveCountryCode = useCallback((country: string) => resolveCountryLookup(country)?.code ?? (country.length <= 3 ? country.toUpperCase() : ''), [resolveCountryLookup]);

  const filteredData = useMemo(() => {
    const normalizedSearchTerm = normalizeSearchText(countrySearchTerm);

    return displayData.filter((row) => {
      const resolvedCountryName = resolveCountryName(row.country);
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        [row.country, resolvedCountryName].some((value) => normalizeSearchText(value).includes(normalizedSearchTerm));
      const matchesFilter = countryFilter === 'all' || row.gold > 0;

      return matchesSearch && matchesFilter;
    });
  }, [countryFilter, countrySearchTerm, displayData, resolveCountryName]);

  const visibleData = showAll ? filteredData : filteredData.slice(0, 50);
  const hasMore = filteredData.length > 50;

  const handleExportCsv = () => {
    if (filteredData.length === 0) {
      return;
    }

    const headerRow = toCsvRow([
      t('countryTable.csvHeaders.countryName'),
      t('countryTable.csvHeaders.countryCode'),
      t('countryTable.columns.bronze'),
      t('countryTable.columns.silver'),
      t('countryTable.columns.gold'),
      t('countryTable.columns.total'),
    ]);

    const csvRows = filteredData.map((row) => {
      const total = row.total ?? row.bronze + row.silver + row.gold;

      return toCsvRow([
        resolveCountryName(row.country),
        resolveCountryCode(row.country),
        row.bronze,
        row.silver,
        row.gold,
        total,
      ]);
    });

    const csvContent = ['\ufeff' + headerRow, ...csvRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.href = downloadUrl;
    downloadLink.download = 'country-medals.csv';
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadUrl);
  };

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
        message={t('countryTable.error')}
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
    <Stack gap={4}>
      <Stack direction={{ base: 'column', md: 'row' }} gap={3} align={{ base: 'stretch', md: 'end' }}>
        <Box flex="1">
          <Text mb={2} fontWeight="500" color="text">{t('countryTable.searchLabel')}</Text>
          <Input
            placeholder={t('countryTable.searchPlaceholder')}
            value={countrySearchTerm}
            color="text"
            bg="input-bg"
            borderColor="border"
            _placeholder={{ color: 'text-muted' }}
            onChange={(event) => setCountrySearchTerm(event.target.value)}
          />
        </Box>
        <Box flex="1">
          <Text mb={2} fontWeight="500" color="text">{t('countryTable.filterLabel')}</Text>
          <select
            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
            value={countryFilter}
            onChange={(event) => setCountryFilter(event.target.value as 'all' | 'goldOnly')}
          >
            <option value="all">{t('countryTable.filters.all')}</option>
            <option value="goldOnly">{t('countryTable.filters.goldOnly')}</option>
          </select>
        </Box>
        <Box flex={{ base: '1', md: '0' }}>
          <Button
            w={{ base: '100%', md: 'auto' }}
            onClick={handleExportCsv}
            variant="outline"
            borderColor="border"
            color="text"
            borderRadius="full"
            transition="all var(--motion-fast) var(--motion-ease)"
            _hover={{ borderColor: 'accent', color: 'accent', bg: 'transparent' }}
            _focusVisible={{
              outline: '2px solid',
              outlineColor: 'accent',
              outlineOffset: '2px',
            }}
          >
            {t('countryTable.exportCsv')}
          </Button>
        </Box>
      </Stack>

      {filteredData.length === 0 ? (
        <DataTableState message={t('countryTable.filteredEmpty')} />
      ) : (
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
                          <Stack direction="row" align="center" gap={2}>
                            <CountryFlag countryCode={resolveCountryCode(row.country)} w="1.5rem" />
                            <Box as="span">{resolveCountryName(row.country)}</Box>
                          </Stack>
                        </Button>
                      ) : (
                        <Stack direction="row" align="center" gap={2} as="span">
                          <CountryFlag countryCode={resolveCountryCode(row.country)} w="1.5rem" />
                          <Box as="span" fontWeight="semibold">{resolveCountryName(row.country)}</Box>
                        </Stack>
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
      )}
    </Stack>
  );
};
