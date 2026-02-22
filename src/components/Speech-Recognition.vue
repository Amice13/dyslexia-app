<template>
  
</template>

<script>
const speechRecognition = SpeechRecognition ?? webkitSpeechRecognition
const speechGrammarList = SpeechGrammarList ?? webkitSpeechGrammarList
const speechRecognitionEvent =
  SpeechRecognitionEvent ?? webkitSpeechRecognitionEvent

const colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral']

const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

const recognition = new speechRecognition()
const speechRecognitionList = new speechGrammarList()

speechRecognitionList.addFromString(grammar, 1)

recognition.grammars = speechRecognitionList
recognition.continuous = false
recognition.lang = "en-US"
recognition.interimResults = false
recognition.maxAlternatives = 1

recognition.onresult = function (event) {
  var color = event.results[0][0].transcript
  const textContent = "Result received: " + color + ".";
  console.log(textContent, ". Confidence: " + event.results[0][0].confidence);
}

setTimeout(() => {
  recognition.stop()
}, 10000)

setTimeout(() => {
  recognition.start()
}, 1000)

recognition.onnomatch = function (event) {
  console.log("I didnt recognise that color.")
}

recognition.onerror = function (event) {
  console.log("Error occurred in recognition: " + event.error)
}



</script>