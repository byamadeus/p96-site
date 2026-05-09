export interface Team {
  code: string
  name: string
  flag: string
  isDiaspora: boolean
}

export interface Match {
  id: number
  date: string     // "2026-06-12"
  kickoff: string  // "3:00 PM ET"
  teamA: Team
  teamB: Team
  venue: string
  city: string
  stage: string
  activationScore: number // 1–5
  diasporaNotes: string
}

const t = (code: string, name: string, flag: string, isDiaspora = false): Team =>
  ({ code, name, flag, isDiaspora })

// diaspora nations
const MA = t('MA', 'Morocco', '🇲🇦', true)
const SN = t('SN', 'Senegal', '🇸🇳', true)
const GH = t('GH', 'Ghana', '🇬🇭', true)
const DZ = t('DZ', 'Algeria', '🇩🇿', true)
const EG = t('EG', 'Egypt', '🇪🇬', true)
const TN = t('TN', 'Tunisia', '🇹🇳', true)
const CI = t('CI', 'Ivory Coast', '🇨🇮', true)
const CD = t('CD', 'DR Congo', '🇨🇩', true)
const ZA = t('ZA', 'South Africa', '🇿🇦', true)
const CV = t('CV', 'Cape Verde', '🇨🇻', true)
const HT = t('HT', 'Haiti', '🇭🇹', true)
const CW = t('CW', 'Curaçao', '🇨🇼', true)

// opponents
const BR = t('BR', 'Brazil', '🇧🇷')
const FR = t('FR', 'France', '🇫🇷')
const ES = t('ES', 'Spain', '🇪🇸')
const DE = t('DE', 'Germany', '🇩🇪')
const EN = t('EN', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿')
const AR = t('AR', 'Argentina', '🇦🇷')
const PT = t('PT', 'Portugal', '🇵🇹')
const IT = t('IT', 'Italy', '🇮🇹')
const NL = t('NL', 'Netherlands', '🇳🇱')
const HR = t('HR', 'Croatia', '🇭🇷')
const MX = t('MX', 'Mexico', '🇲🇽')
const CO = t('CO', 'Colombia', '🇨🇴')
const US = t('US', 'USA', '🇺🇸')
const KR = t('KR', 'South Korea', '🇰🇷')
const JP = t('JP', 'Japan', '🇯🇵')
const SE = t('SE', 'Sweden', '🇸🇪')
const PL = t('PL', 'Poland', '🇵🇱')
const TR = t('TR', 'Turkey', '🇹🇷')
const CA = t('CA', 'Canada', '🇨🇦')
const UY = t('UY', 'Uruguay', '🇺🇾')
const BE = t('BE', 'Belgium', '🇧🇪')
const CH = t('CH', 'Switzerland', '🇨🇭')
const AU = t('AU', 'Australia', '🇦🇺')
const CR = t('CR', 'Costa Rica', '🇨🇷')

export const matches: Match[] = [
  // ── GROUP STAGE ROUND 1 (June 11–15) ──────────────────────────

  {
    id: 1,
    date: '2026-06-12',
    kickoff: '3:00 PM ET',
    teamA: MA, teamB: BR,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Group A',
    activationScore: 5,
    diasporaNotes: 'NYC Moroccan community is huge — MetLife game is the one.',
  },
  {
    id: 2,
    date: '2026-06-12',
    kickoff: '9:00 PM ET',
    teamA: GH, teamB: FR,
    venue: 'SoFi Stadium', city: 'Los Angeles, CA',
    stage: 'Group C',
    activationScore: 4,
    diasporaNotes: 'Ghanaian diaspora large in LA and NYC. France is a huge draw.',
  },
  {
    id: 3,
    date: '2026-06-13',
    kickoff: '6:00 PM ET',
    teamA: SN, teamB: EN,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Group B',
    activationScore: 5,
    diasporaNotes: 'Senegalese community major in NYC/BK. MetLife block party energy.',
  },
  {
    id: 4,
    date: '2026-06-13',
    kickoff: '9:00 PM ET',
    teamA: DZ, teamB: ES,
    venue: 'Hard Rock Stadium', city: 'Miami, FL',
    stage: 'Group D',
    activationScore: 4,
    diasporaNotes: 'Algerian community strong in NYC, Paterson NJ. Major match.',
  },
  {
    id: 5,
    date: '2026-06-14',
    kickoff: '3:00 PM ET',
    teamA: EG, teamB: DE,
    venue: 'AT&T Stadium', city: 'Dallas, TX',
    stage: 'Group E',
    activationScore: 4,
    diasporaNotes: 'Egypt has large diaspora in NJ and Brooklyn.',
  },
  {
    id: 6,
    date: '2026-06-14',
    kickoff: '6:00 PM ET',
    teamA: TN, teamB: IT,
    venue: 'Gillette Stadium', city: 'Boston, MA',
    stage: 'Group F',
    activationScore: 3,
    diasporaNotes: 'Tunisia vs Italy — both communities present in NYC.',
  },
  {
    id: 7,
    date: '2026-06-15',
    kickoff: '3:00 PM ET',
    teamA: CI, teamB: KR,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Group G',
    activationScore: 4,
    diasporaNotes: 'Ivory Coast community concentrated in BK, Bronx. NYC game.',
  },
  {
    id: 8,
    date: '2026-06-15',
    kickoff: '6:00 PM ET',
    teamA: CD, teamB: AU,
    venue: 'NRG Stadium', city: 'Houston, TX',
    stage: 'Group H',
    activationScore: 3,
    diasporaNotes: 'Congolese diaspora growing in NYC.',
  },
  {
    id: 9,
    date: '2026-06-15',
    kickoff: '9:00 PM ET',
    teamA: HT, teamB: CA,
    venue: 'Hard Rock Stadium', city: 'Miami, FL',
    stage: 'Group K',
    activationScore: 5,
    diasporaNotes: 'Haitian diaspora massive in Miami and NYC. National event.',
  },
  {
    id: 10,
    date: '2026-06-16',
    kickoff: '6:00 PM ET',
    teamA: ZA, teamB: CH,
    venue: 'Levi\'s Stadium', city: 'Santa Clara, CA',
    stage: 'Group I',
    activationScore: 3,
    diasporaNotes: 'South African diaspora concentrated on East Coast.',
  },
  {
    id: 11,
    date: '2026-06-16',
    kickoff: '9:00 PM ET',
    teamA: CV, teamB: TR,
    venue: 'Gillette Stadium', city: 'Boston, MA',
    stage: 'Group J',
    activationScore: 3,
    diasporaNotes: 'Cape Verdean diaspora is strong in Boston and Brockton MA.',
  },
  {
    id: 12,
    date: '2026-06-17',
    kickoff: '6:00 PM ET',
    teamA: CW, teamB: CO,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Group L',
    activationScore: 4,
    diasporaNotes: 'Curaçao diaspora significant in NYC. First WC — big moment.',
  },

  // ── GROUP STAGE ROUND 2 (June 17–21) ──────────────────────────

  {
    id: 13,
    date: '2026-06-18',
    kickoff: '3:00 PM ET',
    teamA: MA, teamB: CO,
    venue: 'AT&T Stadium', city: 'Dallas, TX',
    stage: 'Group A',
    activationScore: 4,
    diasporaNotes: 'Morocco pushes for group leader.',
  },
  {
    id: 14,
    date: '2026-06-18',
    kickoff: '6:00 PM ET',
    teamA: SN, teamB: NL,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Group B',
    activationScore: 5,
    diasporaNotes: 'Senegal vs Netherlands — MetLife. P96 activation match.',
  },
  {
    id: 15,
    date: '2026-06-19',
    kickoff: '3:00 PM ET',
    teamA: GH, teamB: AR,
    venue: 'Hard Rock Stadium', city: 'Miami, FL',
    stage: 'Group C',
    activationScore: 5,
    diasporaNotes: 'Ghana vs Argentina — classic rivalry rematch. Massive.',
  },
  {
    id: 16,
    date: '2026-06-19',
    kickoff: '9:00 PM ET',
    teamA: DZ, teamB: PT,
    venue: 'SoFi Stadium', city: 'Los Angeles, CA',
    stage: 'Group D',
    activationScore: 4,
    diasporaNotes: 'Algeria continues group stage.',
  },
  {
    id: 17,
    date: '2026-06-20',
    kickoff: '3:00 PM ET',
    teamA: CI, teamB: JP,
    venue: 'NRG Stadium', city: 'Houston, TX',
    stage: 'Group G',
    activationScore: 3,
    diasporaNotes: 'Ivory Coast vs Japan — must-win scenario potential.',
  },
  {
    id: 18,
    date: '2026-06-20',
    kickoff: '6:00 PM ET',
    teamA: EG, teamB: BE,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Group E',
    activationScore: 4,
    diasporaNotes: 'Egypt vs Belgium in NYC. Egyptian community in NJ/BK strong.',
  },
  {
    id: 19,
    date: '2026-06-21',
    kickoff: '3:00 PM ET',
    teamA: HT, teamB: US,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Group K',
    activationScore: 5,
    diasporaNotes: 'Haiti vs USA in NYC. Haitian-American community makes this an event.',
  },
  {
    id: 20,
    date: '2026-06-21',
    kickoff: '6:00 PM ET',
    teamA: TN, teamB: HR,
    venue: 'AT&T Stadium', city: 'Dallas, TX',
    stage: 'Group F',
    activationScore: 3,
    diasporaNotes: 'Tunisia fighting for knockout spot.',
  },

  // ── GROUP STAGE ROUND 3 (June 23–27) ──────────────────────────

  {
    id: 21,
    date: '2026-06-24',
    kickoff: '3:00 PM ET',
    teamA: MA, teamB: UY,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Group A',
    activationScore: 5,
    diasporaNotes: 'Morocco clinching match at MetLife. Biggest Moroccan event of the summer.',
  },
  {
    id: 22,
    date: '2026-06-24',
    kickoff: '3:00 PM ET',
    teamA: SN, teamB: AU,
    venue: 'Gillette Stadium', city: 'Boston, MA',
    stage: 'Group B',
    activationScore: 3,
    diasporaNotes: 'Senegal group stage finish.',
  },
  {
    id: 23,
    date: '2026-06-25',
    kickoff: '3:00 PM ET',
    teamA: GH, teamB: MX,
    venue: 'AT&T Stadium', city: 'Dallas, TX',
    stage: 'Group C',
    activationScore: 4,
    diasporaNotes: 'Ghana needs result. High stakes.',
  },
  {
    id: 24,
    date: '2026-06-26',
    kickoff: '6:00 PM ET',
    teamA: EG, teamB: IT,
    venue: 'Lincoln Financial Field', city: 'Philadelphia, PA',
    stage: 'Group E',
    activationScore: 3,
    diasporaNotes: 'Egypt group decider.',
  },
  {
    id: 25,
    date: '2026-06-26',
    kickoff: '9:00 PM ET',
    teamA: CI, teamB: PL,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Group G',
    activationScore: 4,
    diasporaNotes: 'Ivory Coast must win to advance. High energy NYC match.',
  },
  {
    id: 26,
    date: '2026-06-27',
    kickoff: '3:00 PM ET',
    teamA: HT, teamB: CR,
    venue: 'Hard Rock Stadium', city: 'Miami, FL',
    stage: 'Group K',
    activationScore: 4,
    diasporaNotes: 'Haiti final group match. Miami buzzing.',
  },
  {
    id: 27,
    date: '2026-06-27',
    kickoff: '6:00 PM ET',
    teamA: CD, teamB: SE,
    venue: 'Levi\'s Stadium', city: 'Santa Clara, CA',
    stage: 'Group H',
    activationScore: 3,
    diasporaNotes: 'DR Congo group decider.',
  },

  // ── ROUND OF 32 ──────────────────────────────────────────────

  {
    id: 28,
    date: '2026-07-01',
    kickoff: '3:00 PM ET',
    teamA: MA, teamB: KR,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Round of 32',
    activationScore: 5,
    diasporaNotes: 'Morocco in the knockouts at MetLife. Summer peak moment.',
  },
  {
    id: 29,
    date: '2026-07-02',
    kickoff: '6:00 PM ET',
    teamA: SN, teamB: UY,
    venue: 'Hard Rock Stadium', city: 'Miami, FL',
    stage: 'Round of 32',
    activationScore: 4,
    diasporaNotes: 'Senegal pushing deep.',
  },
  {
    id: 30,
    date: '2026-07-03',
    kickoff: '3:00 PM ET',
    teamA: GH, teamB: PT,
    venue: 'AT&T Stadium', city: 'Dallas, TX',
    stage: 'Round of 32',
    activationScore: 4,
    diasporaNotes: 'Ghana vs Portugal. Diaspora ready.',
  },
  {
    id: 31,
    date: '2026-07-03',
    kickoff: '9:00 PM ET',
    teamA: HT, teamB: MX,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Round of 32',
    activationScore: 5,
    diasporaNotes: 'Haiti vs Mexico in NYC. Haitian-American diaspora dream scenario.',
  },

  // ── QUARTERFINALS ────────────────────────────────────────────

  {
    id: 32,
    date: '2026-07-10',
    kickoff: '6:00 PM ET',
    teamA: MA, teamB: FR,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Quarterfinal',
    activationScore: 5,
    diasporaNotes: 'Morocco vs France QF — NYC. Biggest diaspora match possible.',
  },

  // ── SEMIFINAL ────────────────────────────────────────────────

  {
    id: 33,
    date: '2026-07-15',
    kickoff: '6:00 PM ET',
    teamA: MA, teamB: BR,
    venue: 'MetLife Stadium', city: 'East Rutherford, NJ',
    stage: 'Semifinal',
    activationScore: 5,
    diasporaNotes: 'Morocco in the final four. NYC entire summer.',
  },
]
