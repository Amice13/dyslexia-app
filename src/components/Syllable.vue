<template>
</template>

<script>
import syllabify from 'syllabify-fr'
const { syllabes, nb, max } = syllabify('exemple')

console.log(`Syllables: ${syllabes.join(", ")}`);
console.log(`Number of syllables: ${nb}`);
console.log(`Maximum syllable length: ${max}`);

</script>