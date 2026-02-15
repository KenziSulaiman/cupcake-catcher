const PROFANITY_LIST = [
  'fuck', 'shit', 'ass', 'damn', 'hell', 'bitch', 'bastard', 'dick',
  'piss', 'crap', 'slut', 'whore', 'cock', 'pussy', 'nigger', 'nigga',
  'faggot', 'retard', 'cunt',
];

const LEETSPEAK_MAP = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's',
  '7': 't', '@': 'a', '$': 's', '!': 'i',
};

function normalizeLeetspeak(text) {
  return text
    .split('')
    .map(ch => LEETSPEAK_MAP[ch] || ch)
    .join('');
}

function stripSpacesAndSymbols(text) {
  return text.replace(/[\s._\-*~`^]/g, '');
}

export function filterProfanity(text) {
  if (!text) return text;

  let result = text;
  const normalized = normalizeLeetspeak(stripSpacesAndSymbols(text.toLowerCase()));

  for (const word of PROFANITY_LIST) {
    const regex = new RegExp(word, 'gi');
    if (regex.test(normalized) || regex.test(text.toLowerCase())) {
      const wordRegex = new RegExp(
        word.split('').join('[\\s._\\-*~`^]*'),
        'gi'
      );
      result = result.replace(wordRegex, '######');

      const directRegex = new RegExp(word, 'gi');
      result = result.replace(directRegex, '######');
    }
  }

  return result;
}

export function containsProfanity(text) {
  if (!text) return false;
  const normalized = normalizeLeetspeak(stripSpacesAndSymbols(text.toLowerCase()));
  return PROFANITY_LIST.some(word => {
    const regex = new RegExp(word, 'i');
    return regex.test(normalized) || regex.test(text.toLowerCase());
  });
}
