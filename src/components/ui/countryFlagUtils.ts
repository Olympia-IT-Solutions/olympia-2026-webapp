const ISO3_TO_ISO2_OVERRIDES: Record<string, string> = {
  ALB: 'al',
  AND: 'ad',
  ARG: 'ar',
  ARM: 'am',
  AUS: 'au',
  AUT: 'at',
  AZE: 'az',
  BEL: 'be',
  BIH: 'ba',
  BGR: 'bg',
  BOL: 'bo',
  BRA: 'br',
  CAN: 'ca',
  CHI: 'cl',
  CHN: 'cn',
  COL: 'co',
  CRO: 'hr',
  CYP: 'cy',
  CZE: 'cz',
  DEN: 'dk',
  ESP: 'es',
  EST: 'ee',
  FIN: 'fi',
  FRA: 'fr',
  GEO: 'ge',
  GER: 'de',
  GHA: 'gh',
  GBR: 'gb',
  GRE: 'gr',
  HKG: 'hk',
  HUN: 'hu',
  ICE: 'is',
  IND: 'in',
  IRL: 'ie',
  ISR: 'il',
  ITA: 'it',
  JPN: 'jp',
  KAZ: 'kz',
  KSA: 'sa',
  KGZ: 'kg',
  LAT: 'lv',
  LIB: 'lb',
  LIE: 'li',
  LTU: 'lt',
  LUX: 'lu',
  MAD: 'mg',
  MAR: 'ma',
  MDA: 'md',
  MEX: 'mx',
  MKD: 'mk',
  MGL: 'mn',
  MNE: 'me',
  MON: 'mc',
  NED: 'nl',
  NZL: 'nz',
  NOR: 'no',
  PAK: 'pk',
  PER: 'pe',
  PHI: 'ph',
  POL: 'pl',
  POR: 'pt',
  PUR: 'pr',
  RSA: 'za',
  ROU: 'ro',
  KOR: 'kr',
  SLO: 'si',
  SMR: 'sm',
  SRB: 'rs',
  SVK: 'sk',
  SWE: 'se',
  SUI: 'ch',
  THA: 'th',
  TPE: 'tw',
  TUR: 'tr',
  UAE: 'ae',
  UKR: 'ua',
  USA: 'us',
  UZB: 'uz',
};

export const resolveCountryFlagCode = (countryCode?: string | null) => {
  if (!countryCode) {
    return null;
  }

  const normalizedCode = countryCode.trim().toUpperCase();

  if (normalizedCode === 'AIN') {
    return null;
  }

  if (normalizedCode.length === 2) {
    return normalizedCode.toLowerCase();
  }

  if (normalizedCode.length === 3) {
    return ISO3_TO_ISO2_OVERRIDES[normalizedCode] ?? null;
  }

  return null;
};