import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
const xmlExample = `<changes>
  <description>[Een korte samenvatting van de wijzigingen]</description>
  <change>
    <file>[Het volledige, absolute pad naar het bestand]</file>
    <content><![CDATA[De volledige, definitieve inhoud van het bestand hier. Geen diffs of snippets. Zorg ervoor dat alle code correct is ge-escaped.`;
