export interface Team {
  code: string
  name: string
  flag: string
  isDiaspora: boolean
}

export interface Match {
  id: number
  date: string     // "2026-06-11"
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

// ── Diaspora nations ──────────────────────────────────────────────
const MA  = t('MA',  'Morocco',      '🇲🇦', true)
const SN  = t('SN',  'Senegal',      '🇸🇳', true)
const GH  = t('GH',  'Ghana',        '🇬🇭', true)
const DZ  = t('DZ',  'Algeria',      '🇩🇿', true)
const EG  = t('EG',  'Egypt',        '🇪🇬', true)
const TN  = t('TN',  'Tunisia',      '🇹🇳', true)
const CI  = t('CI',  'Ivory Coast',  '🇨🇮', true)
const CD  = t('CD',  'DR Congo',     '🇨🇩', true)
const ZA  = t('ZA',  'South Africa', '🇿🇦', true)
const CV  = t('CV',  'Cape Verde',   '🇨🇻', true)
const HT  = t('HT',  'Haiti',        '🇭🇹', true)
const CW  = t('CW',  'Curaçao',      '🇨🇼', true)

// ── Opponents ─────────────────────────────────────────────────────
const MX  = t('MX',  'Mexico',       '🇲🇽')
const BR  = t('BR',  'Brazil',       '🇧🇷')
const SCO = t('SCO', 'Scotland',     '🏴󠁧󠁢󠁳󠁣󠁴󠁿')
const DE  = t('DE',  'Germany',      '🇩🇪')
const ECU = t('ECU', 'Ecuador',      '🇪🇨')
const SE  = t('SE',  'Sweden',       '🇸🇪')
const ES  = t('ES',  'Spain',        '🇪🇸')
const BE  = t('BE',  'Belgium',      '🇧🇪')
const FR  = t('FR',  'France',       '🇫🇷')
const AR  = t('AR',  'Argentina',    '🇦🇷')
const PT  = t('PT',  'Portugal',     '🇵🇹')
const PA  = t('PA',  'Panama',       '🇵🇦')
const NO  = t('NO',  'Norway',       '🇳🇴')
const EN  = t('EN',  'England',      '🏴󠁧󠁢󠁥󠁮󠁧󠁿')
const CO  = t('CO',  'Colombia',     '🇨🇴')
const NL  = t('NL',  'Netherlands',  '🇳🇱')
const IQ  = t('IQ',  'Iraq',         '🇮🇶')
const SA  = t('SA',  'Saudi Arabia', '🇸🇦')
const IR  = t('IR',  'Iran',         '🇮🇷')
const KR  = t('KR',  'South Korea',  '🇰🇷')
const UZ  = t('UZ',  'Uzbekistan',   '🇺🇿')
const HR  = t('HR',  'Croatia',      '🇭🇷')
const NZ  = t('NZ',  'New Zealand',  '🇳🇿')
const UY  = t('UY',  'Uruguay',      '🇺🇾')

const v = (venue: string, city: string) => ({ venue, city })
const TBD = v('TBD', 'TBD')

export const matches: Match[] = [

  // ── Jun 11 — Opener ──────────────────────────────────────────────
  { id: 1, date: '2026-06-11', kickoff: '3:00 PM ET', teamA: MX, teamB: ZA,
    ...v('MetLife Stadium', 'East Rutherford, NJ'), stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Tournament opener. South Africa first WC since 2010 — huge cultural moment.' },

  // ── Jun 13 ───────────────────────────────────────────────────────
  { id: 2, date: '2026-06-13', kickoff: '6:00 PM ET', teamA: BR, teamB: MA,
    ...TBD, stage: 'Group Stage', activationScore: 5,
    diasporaNotes: 'Brazil vs Morocco. NYC Moroccan diaspora will be electric.' },
  { id: 3, date: '2026-06-13', kickoff: '9:00 PM ET', teamA: HT, teamB: SCO,
    ...TBD, stage: 'Group Stage', activationScore: 5,
    diasporaNotes: 'Haiti\'s first WC group game. Historic for the diaspora.' },

  // ── Jun 14 ───────────────────────────────────────────────────────
  { id: 4, date: '2026-06-14', kickoff: '1:00 PM ET', teamA: CW, teamB: DE,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Curaçao at a World Cup — David vs Goliath. First WC ever.' },
  { id: 5, date: '2026-06-14', kickoff: '7:00 PM ET', teamA: CI, teamB: ECU,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Ivory Coast opens their WC2026 campaign.' },
  { id: 6, date: '2026-06-14', kickoff: '10:00 PM ET', teamA: TN, teamB: SE,
    ...TBD, stage: 'Group Stage', activationScore: 3,
    diasporaNotes: 'Tunisia group stage opener.' },

  // ── Jun 15 ───────────────────────────────────────────────────────
  { id: 7, date: '2026-06-15', kickoff: '12:00 PM ET', teamA: CV, teamB: ES,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Cape Verde vs Spain. Giant-killer potential — huge for Boston/Brockton diaspora.' },
  { id: 8, date: '2026-06-15', kickoff: '3:00 PM ET', teamA: EG, teamB: BE,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Egypt opens WC2026. Brooklyn Egyptian community game.' },

  // ── Jun 16 ───────────────────────────────────────────────────────
  { id: 9, date: '2026-06-16', kickoff: '3:00 PM ET', teamA: FR, teamB: SN,
    ...TBD, stage: 'Group Stage', activationScore: 5,
    diasporaNotes: 'France vs Senegal — the rivalry of the diaspora. Massive in NYC/BK.' },
  { id: 10, date: '2026-06-16', kickoff: '6:00 PM ET', teamA: AR, teamB: DZ,
    ...TBD, stage: 'Group Stage', activationScore: 5,
    diasporaNotes: 'Argentina vs Algeria. Paterson NJ and NYC Algerian community is huge.' },

  // ── Jun 17 ───────────────────────────────────────────────────────
  { id: 11, date: '2026-06-17', kickoff: '1:00 PM ET', teamA: CD, teamB: PT,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'DR Congo vs Portugal. Congolese diaspora NYC.' },
  { id: 12, date: '2026-06-17', kickoff: '7:00 PM ET', teamA: GH, teamB: PA,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Ghana opens WC2026 campaign.' },

  // ── Jun 19 ───────────────────────────────────────────────────────
  { id: 13, date: '2026-06-19', kickoff: '6:00 PM ET', teamA: MA, teamB: SCO,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Morocco second group match.' },
  { id: 14, date: '2026-06-19', kickoff: '9:00 PM ET', teamA: BR, teamB: HT,
    ...TBD, stage: 'Group Stage', activationScore: 5,
    diasporaNotes: 'Brazil vs Haiti. Miami and NYC Haitian diaspora — national moment.' },

  // ── Jun 20 ───────────────────────────────────────────────────────
  { id: 15, date: '2026-06-20', kickoff: '4:00 PM ET', teamA: CI, teamB: DE,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Ivory Coast vs Germany. Big test for Les Éléphants.' },
  { id: 16, date: '2026-06-20', kickoff: '8:00 PM ET', teamA: CW, teamB: ECU,
    ...TBD, stage: 'Group Stage', activationScore: 3,
    diasporaNotes: 'Curaçao second group match.' },

  // ── Jun 21 ───────────────────────────────────────────────────────
  { id: 17, date: '2026-06-21', kickoff: '6:00 PM ET', teamA: CV, teamB: UY,
    ...TBD, stage: 'Group Stage', activationScore: 3,
    diasporaNotes: 'Cape Verde second group match.' },
  { id: 18, date: '2026-06-21', kickoff: '9:00 PM ET', teamA: EG, teamB: NZ,
    ...TBD, stage: 'Group Stage', activationScore: 3,
    diasporaNotes: 'Egypt second group match.' },

  // ── Jun 22 ───────────────────────────────────────────────────────
  { id: 19, date: '2026-06-22', kickoff: '8:00 PM ET', teamA: NO, teamB: SN,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Norway vs Senegal — Lions of Teranga second match.' },

  // ── Jun 23 ───────────────────────────────────────────────────────
  { id: 20, date: '2026-06-23', kickoff: '4:00 PM ET', teamA: GH, teamB: EN,
    ...TBD, stage: 'Group Stage', activationScore: 5,
    diasporaNotes: 'Ghana vs England. BK Ghanaian community goes all out.' },
  { id: 21, date: '2026-06-23', kickoff: '10:00 PM ET', teamA: CD, teamB: CO,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'DR Congo second group match.' },

  // ── Jun 24 ───────────────────────────────────────────────────────
  { id: 22, date: '2026-06-24', kickoff: '6:00 PM ET', teamA: MA, teamB: HT,
    ...v('MetLife Stadium', 'East Rutherford, NJ'), stage: 'Group Stage', activationScore: 5,
    diasporaNotes: 'Morocco vs Haiti — two diaspora heavyweights share the pitch.' },
  { id: 23, date: '2026-06-24', kickoff: '9:00 PM ET', teamA: ZA, teamB: KR,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'South Africa second group match.' },

  // ── Jun 25 ───────────────────────────────────────────────────────
  { id: 24, date: '2026-06-25', kickoff: '7:00 PM ET', teamA: TN, teamB: NL,
    ...TBD, stage: 'Group Stage', activationScore: 3,
    diasporaNotes: 'Tunisia second group match vs Netherlands.' },

  // ── Jun 26 ───────────────────────────────────────────────────────
  { id: 25, date: '2026-06-26', kickoff: '3:00 PM ET', teamA: SN, teamB: IQ,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Senegal final group match.' },
  { id: 26, date: '2026-06-26', kickoff: '8:00 PM ET', teamA: CV, teamB: SA,
    ...TBD, stage: 'Group Stage', activationScore: 3,
    diasporaNotes: 'Cape Verde final group match.' },
  { id: 27, date: '2026-06-26', kickoff: '11:00 PM ET', teamA: EG, teamB: IR,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Egypt final group match — must-win potential.' },

  // ── Jun 27 ───────────────────────────────────────────────────────
  { id: 28, date: '2026-06-27', kickoff: '5:00 PM ET', teamA: GH, teamB: HR,
    ...TBD, stage: 'Group Stage', activationScore: 4,
    diasporaNotes: 'Ghana final group match vs Croatia.' },
  { id: 29, date: '2026-06-27', kickoff: '7:30 PM ET', teamA: CD, teamB: UZ,
    ...TBD, stage: 'Group Stage', activationScore: 3,
    diasporaNotes: 'DR Congo final group match.' },

  // ── Jun 30 — Round of 32 ─────────────────────────────────────────
  { id: 30, date: '2026-06-30', kickoff: '5:00 PM ET',
    teamA: MA, teamB: { code: 'TBD', name: 'Opponent TBD', flag: '🏆', isDiaspora: false },
    ...v('MetLife Stadium', 'East Rutherford, NJ'), stage: 'Round of 32', activationScore: 5,
    diasporaNotes: 'Knockout stage begins. P96 IVORY activation.' },
]
