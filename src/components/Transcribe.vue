<template>
  
</template>

<script>
// French transcription with nasal vowels and context-sensitive rules

const rules = [
  // Basic letters and digraphs
  { pattern: /à/g, replace: 'a' },
  { pattern: /ç/g, replace: 's' },
  { pattern: /c[iey]/g, replace: 's' },
  { pattern: /c[^ieyh]/g, replace: 'k' },
  { pattern: /qu/g, replace: 'k' },
  { pattern: /ch/g, replace: 'ʃ' },
  { pattern: /gn/g, replace: 'ɲ' },
  { pattern: /j/g, replace: 'ʒ' },
  { pattern: /r/g, replace: 'ʁ' },
  { pattern: /é/g, replace: 'e' },
  { pattern: /è/g, replace: 'ɛ' },
  { pattern: /ê/g, replace: 'ɛ' },
  { pattern: /e/g, replace: 'ə' },
  { pattern: /ô/g, replace: 'o' },
  { pattern: /œu?/g, replace: 'œ' },
  { pattern: /h/g, replace: '' },
  { pattern: /['’]/g, replace: '' },

  // Semi-vowels
  { pattern: /ill/g, replace: 'j' }, // fille → fij
  { pattern: /u([aeiouy])/g, replace: 'ɥ$1' }, // lui → lɥi

  // Common digraphs
  { pattern: /oi/g, replace: 'wa' },
  { pattern: /oin/g, replace: 'wɛ̃' },
  { pattern: /au/g, replace: 'o' },
  { pattern: /eau/g, replace: 'o' },
  { pattern: /eu/g, replace: 'ø' },

  // Nasal vowels
  { pattern: /an(?![aeiouy])/g, replace: 'ɑ̃' },
  { pattern: /en(?![aeiouy])/g, replace: 'ɛ̃' },
  { pattern: /in(?![aeiouy])/g, replace: 'ɛ̃' },
  { pattern: /on(?![aeiouy])/g, replace: 'ɔ̃' },
  { pattern: /un(?![aeiouy])/g, replace: 'œ̃' },

  // Consonant voicing between vowels
  { pattern: /([aeiouy])s([aeiouy])/g, replace: '$1z$2' },

  // Final consonants often silent
  { pattern: /s\b/g, replace: '' },
  { pattern: /t\b/g, replace: '' },
  { pattern: /d\b/g, replace: '' },
  { pattern: /x\b/g, replace: '' },
  { pattern: /p\b/g, replace: '' }
];

// Transcription function
function transcribeFrench(word) {
  let result = word.toLowerCase();
  for (const rule of rules) {
    result = result.replace(rule.pattern, rule.replace);
  }
  return result;
}

</script>