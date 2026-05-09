export interface Nation {
  code: string   // 2-letter ISO (matches matches.ts teamA/B codes)
  short: string  // 3-letter display code
  name: string
  flag: string
}

export const NATIONS: Nation[] = [
  { code: 'MA', short: 'MOR', name: 'Morocco',       flag: '🇲🇦' },
  { code: 'SN', short: 'SEN', name: 'Senegal',       flag: '🇸🇳' },
  { code: 'GH', short: 'GHA', name: 'Ghana',         flag: '🇬🇭' },
  { code: 'DZ', short: 'ALG', name: 'Algeria',       flag: '🇩🇿' },
  { code: 'EG', short: 'EGY', name: 'Egypt',         flag: '🇪🇬' },
  { code: 'TN', short: 'TUN', name: 'Tunisia',       flag: '🇹🇳' },
  { code: 'CI', short: 'CIV', name: 'Ivory Coast',   flag: '🇨🇮' },
  { code: 'CD', short: 'COD', name: 'DR Congo',      flag: '🇨🇩' },
  { code: 'ZA', short: 'RSA', name: 'South Africa',  flag: '🇿🇦' },
  { code: 'CV', short: 'CPV', name: 'Cape Verde',    flag: '🇨🇻' },
  { code: 'HT', short: 'HAI', name: 'Haiti',         flag: '🇭🇹' },
  { code: 'CW', short: 'CUW', name: 'Curaçao',       flag: '🇨🇼' },
]

export const NATION_BY_CODE: Record<string, Nation> = Object.fromEntries(
  NATIONS.map(n => [n.code, n])
)

export const BOROUGHS = [
  'Bronx',
  'Brooklyn',
  'Central Park',
  'Chelsea',
  'Chinatown',
  'East Village',
  'Financial District',
  'Flatiron',
  'Gramercy Park',
  'Greenwich Village',
  'Hudson Yards',
  'Kips Bay',
  'Koreatown',
  'Long Island',
  'Lower East Side',
  'Meatpacking District',
  'Midtown',
  'Murray Hill',
  'Nomad',
  'Queens',
  'SoHo',
  'Tribeca',
  'Union Square',
  'Upper Manhattan',
  'Upper West Side',
  'Virtual (NYC)',
  'West Village',
] as const
