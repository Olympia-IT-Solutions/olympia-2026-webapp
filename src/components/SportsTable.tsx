import React from 'react';
import {
  Table,
  Box,
  Text,
  Button,
  Icon
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router';
import { FaMedal } from 'react-icons/fa';
import type { Result } from '../services/results';
import { DataTableState, DataTableSurface, getDataTableRowStyles, LoadingSpinner } from './ui';

interface SportsTableProps {
  data: Result[];
  loading?: boolean;
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

export const SportsTable: React.FC<SportsTableProps> = ({ data, loading = false, resultLabel = 'Ergebnis', resultUnitLabel }) => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang ?? 'de';

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

  if (!data || data.length === 0) {
    return (
      <DataTableState message="Keine Ergebnisse verfügbar." />
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
    <DataTableSurface>
      <Table.ScrollArea>
        <Table.Root variant='outline' size="sm" className="responsive-sports-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader whiteSpace="nowrap" w="88px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">Platz</Table.ColumnHeader>
              <Table.ColumnHeader minW="240px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">Athlet</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap" w="140px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">Land</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right" whiteSpace="nowrap" w="140px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">
                <Box as="span" display="block">{resultLabel}</Box>
                {resultUnitLabel && (
                  <Text as="span" display="block" fontSize="2xs" color="text-muted" textTransform="none" letterSpacing="0">
                    {resultUnitLabel}
                  </Text>
                )}
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" whiteSpace="nowrap" w="110px" py={3} fontSize="xs" color="text-muted" textTransform="uppercase" letterSpacing="0.06em">Medaille</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row, index) => {
              const countryTarget = row.country ?? row.countryName ?? null;
              const countryLabel = row.country ?? row.countryName ?? '-';

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
                      aria-label={`Open country details for ${countryLabel}`}
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
                      aria-label={`Open country details for ${countryLabel}`}
                    >
                      {countryLabel}
                    </Button>
                  ) : (
                    <Text color="text-muted">{countryLabel}</Text>
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
  );
};
