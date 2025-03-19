---
id: 5c461a2dbc58620a44555950ab
title: "ChordPro to PCO Converter"
feature_image: 
description:
date: 2025-03-12
slug: pco
script: pco.js
---
<div>
<label for="chordpro_source" class="inline-block font-medium text-sm">ChordPro Text</label>
<textarea id="chordpro_source" rows="6" class="block p-2.5 w-full text-sm rounded-lg border border-gray-300" placeholder="Paste your chordpro text here..."></textarea>
<!--<button id="convertCPOButton" class="inline-block bg-blue-500 mr-2 text-white font-bold py-2 px-4 rounded text-sm">Convert</button>--><button id="copyCPOButton" class="inline-block bg-blue-500 mr-2 text-white font-bold py-2 px-4 rounded text-sm">Copy</button> <label for="pco_source" class="inline-block font-medium text-sm mt-3">Formatted for Planning Center</label>
<textarea id="pco_source" rows="6" class="block p-2.5 w-full text-sm rounded-lg border border-gray-300"></textarea>
</div>

<script type="module">
 import { setup } from "/assets/pco.js";
document.addEventListener("DOMContentLoaded", function(event) {
    setup();
});
</script>
