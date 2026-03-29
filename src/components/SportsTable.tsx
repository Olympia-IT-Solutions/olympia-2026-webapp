import React, { useMemo, useState } from 'react';
import {
  Table,
  Box,
  Text,
  Button,
  Icon,
  Input,
  Stack
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { FaMedal } from 'react-icons/fa';
import type { Result } from '../services/results';
import { CountryFlag, DataTableState, DataTableSurface, getDataTableRowStyles, LoadingSpinner } from './ui';

const normalizeSearchText = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

interface SportsTableProps {
  data: Result[];
  loading?: boolean;
  error?: string | null;
  resultLabel?: string;
  resultUnitLabel?: string;
}

const MedalIcon = ({ medalType }: { medalType: Result['medalType'] }) => {
  const colors: Record<'GOLD' | 'SILVER' | 'BRONZE', string> = {
    GOLD: 'medal-gold',
    SILVER: 'medal-silver',
    BRONZE: 'medal-bronze',
  };

  if (!medalType || !colors[medalType]) return null;

  return (
    <Icon as={FaMedal} color={colors[medalType]} boxSize={5} />
  );
};

export const SportsTable: React.FC<SportsTableProps> = ({ data, loading = false, error = null, resultLabel, resultUnitLabel }) => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();
  const currentLang = lang ?? 'de';
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<'all' | 'medalOnly'>('all');
  const localizedResultLabel = resultLabel ?? t('sportsTable.columns.result');

  const filteredData = useMemo(() => {
    const normalizedSearchTerm = normalizeSearchText(searchTerm);

    return data.filter((row) => {
      const countryLabel = row.countryName ?? row.country ?? '-';
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        [row.athleteName, countryLabel, row.value].some((value) => normalizeSearchText(String(value)).includes(normalizedSearchTerm));
      const matchesFilter = resultFilter === 'all' || row.hasMedal;

      return matchesSearch && matchesFilter;
    });
  }, [data, resultFilter, searchTerm]);

  const rowLinkButtonProps = {
    variant: 'ghost' as const,
    p: 0,
    minH: 'unset',
    h: 'auto',
    justifyContent: 'flex-start',
    textAlign: 'left' as const,
    transition: 'color var(--motion-fast) var(--motion-ease)',
    _hover: { textDecoration: 'underline', color: 'accent', bg: 'transparent' },
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'accent',
      outlineOffset: '2px',
      borderRadius: 'sm',
    },
  };

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
        message={t('sport.resultsLoadError')}
        helperText={error}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <DataTableState message={t('sportsTable.noResults')} />
    );
  }

  const goToCountry = (country: string) => {
    const normalizedCountry = country.trim();

    if (!normalizedCountry) {
      return;
    }

    navigate(`/${currentLang}/country/${encodeURIComponent(normalizedCountry)}`);
  };

  return (
    <Stack gap={4}>
      <Stack direction={{ base: 'column', md: 'row' }} gap={3}>
        <Box flex="1">
          <Text mb={2} fontWeight="500" color="text">{t('sportsTable.searchLabel')}</Text>
          <Input
            placeholder={t('sportsTable.searchPlaceholder')}
            value={searchTerm}
            color="text"
            bg="input-bg"
            borderColor="border"
            _placeholder={{ color: 'text-muted' }}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </Box>
        <Box flex="1">
          <Text mb={2} fontWeight="500" color="text">{t('sportsTable.filterLabel')}</Text>
          <select
            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
            value={resultFilter}
            onChange={(event) => setResultFilter(event.target.value as 'all' | 'medalOnly')}
          >
            <option value="all">{t('sportsTable.filters.all')}</option>
            <option value="medalOnly">{t('sportsTable.filters.medalOnly')}</option>
          </select>
        </Box>
      </Stack>

      {filteredData.length === 0 ? (
        <DataTableState message={t('sportsTable.filteredEmpty')} />
      ) : (
        <DataTableSurface>
          <Table.ScrollArea>
            <Table.Root variant='outline' size="sm" className="responsive-sports-table">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader whiteSpace="nowrap" w="88px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">{t('sportsTable.columns.rank')}</Table.ColumnHeader>
                  <Table.ColumnHeader minW="240px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">{t('sportsTable.columns.athlete')}</Table.ColumnHeader>
                  <Table.ColumnHeader whiteSpace="nowrap" w="140px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">{t('sportsTable.columns.country')}</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right" whiteSpace="nowrap" w="140px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">
                    <Box as="span" display="block">{localizedResultLabel}</Box>
                    {resultUnitLabel && (
                      <Text as="span" display="block" fontSize="2xs" color="text-muted" textTransform="none" letterSpacing="0">
                        {resultUnitLabel}
                      </Text>
                    )}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" whiteSpace="nowrap" w="110px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">{t('sportsTable.columns.medal')}</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredData.map((row, index) => {
                  const countryTarget = row.countryCode ?? row.country ?? row.countryName ?? null;
                  const countryLabel = row.countryName ?? row.country ?? '-';

                  return (
                    <Table.Row
                      key={row.id}
                      {...getDataTableRowStyles(false)}
                    >
                      <Table.Cell fontWeight="bold" whiteSpace="nowrap" py={3}>{index + 1}</Table.Cell>
                      <Table.Cell minW="240px">
                        {countryTarget ? (
                          <Button
                            {...rowLinkButtonProps}
                            color="text"
                            fontWeight="semibold"
                            onClick={() => goToCountry(countryTarget)}
                            aria-label={t('sportsTable.openCountryDetails', { country: countryLabel })}
                          >
                            {row.athleteName}
                          </Button>
                        ) : (
                          <Text color="text-muted" fontWeight="semibold">
                            {row.athleteName}
                          </Text>
                        )}
                      </Table.Cell>
                      <Table.Cell whiteSpace="nowrap" py={3}>
                        {countryTarget ? (
                          <Button
                            {...rowLinkButtonProps}
                            color="text"
                            onClick={() => goToCountry(countryTarget)}
                            aria-label={t('sportsTable.openCountryDetails', { country: countryLabel })}
                          >
                            <Stack direction="row" align="center" gap={2}>
                              <CountryFlag countryCode={row.countryCode ?? row.country ?? null} w="1.5rem" />
                              <Text as="span">{countryLabel}</Text>
                            </Stack>
                          </Button>
                        ) : (
                          <Stack direction="row" align="center" gap={2}>
                            <CountryFlag countryCode={row.countryCode ?? row.country ?? null} w="1.5rem" />
                            <Text color="text-muted">{countryLabel}</Text>
                          </Stack>
                        )}
                      </Table.Cell>
                      <Table.Cell textAlign="right" fontFamily="mono" whiteSpace="nowrap" py={3}>{row.value}</Table.Cell>
                      <Table.Cell textAlign="center" whiteSpace="nowrap" py={3}>
                        {row.hasMedal && <MedalIcon medalType={row.medalType} />}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </DataTableSurface>
      )}
    </Stack>
  );
};
