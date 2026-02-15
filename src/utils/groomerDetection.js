const GROOMING_PATTERNS = [
  { pattern: /how old (are|r) (you|u)/i, severity: 'medium', category: 'age_probing' },
  { pattern: /what('s| is) your age/i, severity: 'medium', category: 'age_probing' },
  { pattern: /are (you|u) (a )?(boy|girl|male|female)/i, severity: 'medium', category: 'age_probing' },
  { pattern: /what grade (are|r) (you|u)/i, severity: 'medium', category: 'age_probing' },
  { pattern: /what school/i, severity: 'high', category: 'location_probing' },
  { pattern: /where (do )?(you|u) (live|stay)/i, severity: 'high', category: 'location_probing' },
  { pattern: /what('s| is) your address/i, severity: 'critical', category: 'location_probing' },
  { pattern: /send (me )?(a )?(pic|photo|selfie|picture)/i, severity: 'high', category: 'image_solicitation' },
  { pattern: /show me (what )?(you|u) look/i, severity: 'high', category: 'image_solicitation' },
  { pattern: /let me see (you|u)/i, severity: 'medium', category: 'image_solicitation' },
  { pattern: /don(')?t tell (your )?(parents|mom|dad|anyone)/i, severity: 'critical', category: 'secrecy' },
  { pattern: /keep (this|it) (a )?secret/i, severity: 'critical', category: 'secrecy' },
  { pattern: /between (you|u) and me/i, severity: 'medium', category: 'secrecy' },
  { pattern: /our (little )?secret/i, severity: 'critical', category: 'secrecy' },
  { pattern: /(add|text|message|dm|hit) me (on|at|@)/i, severity: 'high', category: 'off_platform' },
  { pattern: /(snapchat|snap|insta|instagram|whatsapp|telegram|discord|kik)/i, severity: 'high', category: 'off_platform' },
  { pattern: /what('s| is) your (number|phone|cell)/i, severity: 'high', category: 'off_platform' },
  { pattern: /give me your (number|phone|snap|insta)/i, severity: 'high', category: 'off_platform' },
  { pattern: /can (we|i) (meet|hang|see you) (up|out)?/i, severity: 'critical', category: 'meetup' },
  { pattern: /come (to |over )?my (place|house|room)/i, severity: 'critical', category: 'meetup' },
  { pattern: /pick (you|u) up/i, severity: 'critical', category: 'meetup' },
  { pattern: /you('re| are) (so )?(mature|special|different)/i, severity: 'medium', category: 'flattery_coercion' },
  { pattern: /you('re| are) not like other (kids|girls|boys)/i, severity: 'high', category: 'flattery_coercion' },
  { pattern: /i (love|like) (you|u) (so much|a lot)/i, severity: 'medium', category: 'flattery_coercion' },
];

const SEVERITY_SCORES = { low: 1, medium: 2, high: 4, critical: 8 };

const CATEGORY_LABELS = {
  age_probing: 'Age Probing',
  location_probing: 'Location Probing',
  image_solicitation: 'Image Solicitation',
  secrecy: 'Secrecy / Isolation',
  off_platform: 'Off-Platform Contact',
  meetup: 'Meetup Attempt',
  flattery_coercion: 'Flattery / Coercion',
};

export function analyzeMessage(message) {
  const flags = [];

  for (const { pattern, severity, category } of GROOMING_PATTERNS) {
    if (pattern.test(message)) {
      flags.push({ severity, category, label: CATEGORY_LABELS[category] });
    }
  }

  const riskScore = flags.reduce((sum, f) => sum + SEVERITY_SCORES[f.severity], 0);

  return {
    flags,
    riskScore,
    riskLevel: riskScore >= 8 ? 'critical' : riskScore >= 4 ? 'high' : riskScore >= 2 ? 'medium' : 'low',
    hasCritical: flags.some(f => f.severity === 'critical'),
  };
}

export function calculateAccountRisk(messageHistory) {
  let totalScore = 0;
  const categoryCounts = {};

  for (const msg of messageHistory) {
    const analysis = analyzeMessage(msg);
    totalScore += analysis.riskScore;
    for (const flag of analysis.flags) {
      categoryCounts[flag.category] = (categoryCounts[flag.category] || 0) + 1;
    }
  }

  const diverseCategories = Object.keys(categoryCounts).length;
  const persistenceMultiplier = diverseCategories >= 3 ? 2 : diverseCategories >= 2 ? 1.5 : 1;

  const finalScore = Math.round(totalScore * persistenceMultiplier);

  return {
    score: finalScore,
    level: finalScore >= 20 ? 'critical' : finalScore >= 10 ? 'high' : finalScore >= 5 ? 'medium' : 'low',
    categoryCounts,
    recommendation:
      finalScore >= 20 ? 'AUTO_BAN' :
      finalScore >= 10 ? 'SHADOW_RESTRICT' :
      finalScore >= 5 ? 'FLAG_FOR_REVIEW' :
      'MONITOR',
  };
}

export { CATEGORY_LABELS };
