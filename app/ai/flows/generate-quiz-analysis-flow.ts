'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered analysis of quiz results.
 * V15 - Implemented hyper-personalization based on quiz focus, category, and type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  GenerateQuizAnalysisInputSchema,
  GenerateQuizAnalysisOutputSchema,
  type GenerateQuizAnalysisInput,
  type GenerateQuizAnalysisOutput
} from './generate-quiz-analysis-flow-types';

// Central mapping for all profile and category keys to human-readable names.
// Keys are all lowercase to ensure case-insensitive matching.
const PROFILE_KEY_TO_NAME_MAP: Record<string, string> = {
  'add': 'Aandacht en Focus',
  'adhd': 'Energie en Impulsiviteit',
  'hsp': 'Prikkelverwerking en Empathie',
  'ass': 'Sociale en Sensorische Voorkeuren',
  'angstdepressie': 'Stemmings- en Zorgpatronen',
  'emoties_gevoelens': 'Emoties en Gevoelens',
  'vriendschappen_sociaal': 'Vriendschappen en Sociaal',
  'leren_school': 'Leren en School',
  'prikkels_omgeving': 'Prikkels en Omgeving',
  'wie_ben_ik': 'Wie ben ik?',
  'dromen_toekomst': 'Dromen en Toekomst',
};


// Helper function for default analysis text
function getDefaultAnalysis(): string {
  return `<h2>Analyse Onvolledig</h2><p>We konden geen analyse genereren omdat er onvoldoende gegevens beschikbaar waren. Dit kan gebeuren als de quiz niet volledig is ingevuld of als er een fout is opgetreden.</p><p><strong>Wat nu?</strong></p><ul><li>Probeer de quiz opnieuw te doen.</li><li>Als het probleem aanhoudt, neem dan contact op met support en vermeld de quiz die je deed.</li></ul>`;
}

export async function generateQuizAnalysis(
  input: GenerateQuizAnalysisInput
): Promise<GenerateQuizAnalysisOutput> {
  if (!input || (!input.finalScores && !input.personalityTypeResult)) {
    console.error("Invalid or empty results in generateQuizAnalysis:", input);
    return { analysis: getDefaultAnalysis() };
  }
  return generateQuizAnalysisFlow(input);
}


// ==================================================
// ENHANCED VALIDATION FUNCTIONS
// ==================================================

interface ValidationResult {
  inputAlignmentScore: number;
  hallucinationPenalty: number;
  contentQualityScore: number;
  overallScore: number;
  issues: string[];
}

/**
 * 1. INPUT-OUTPUT ALIGNMENT VALIDATION
 * Checks if mentioned scores actually match the input data
 */
function validateScoreAccuracy(
  inputScores: Record<string, number> | undefined,
  analysisText: string
): { score: number; issues: string[] } {
  if (!inputScores) return { score: 100, issues: [] };
  
  const issues: string[] = [];
  let matchCount = 0;
  let totalMentions = 0;
  
  // Extract score mentions from analysis (e.g., "3.2/4", "scoort 2.8", etc.)
  const scorePattern = /(\d+\.?\d*)\s*(?:\/\s*4|op\s*4|van\s*4)/gi;
  const matches = analysisText.match(scorePattern);
  
  if (matches) {
    matches.forEach(match => {
      totalMentions++;
      const numericValue = parseFloat(match.match(/\d+\.?\d*/)?.[0] || '0');
      
      // Check if this score exists in our actual input (within 0.3 tolerance)
      const hasMatchingScore = Object.values(inputScores).some(actualScore => 
        Math.abs(actualScore - numericValue) <= 0.3
      );
      
      if (hasMatchingScore) {
        matchCount++;
      } else {
        issues.push(`Mentioned score ${numericValue} doesn't match any input scores`);
      }
    });
  }
  
  const alignmentScore = totalMentions > 0 ? (matchCount / totalMentions) * 100 : 100;
  return { score: alignmentScore, issues };
}

/**
 * 2. HALLUCINATION DETECTION  
 * Detects claims that cannot be supported by the input data
 */
function detectHallucinations(
  input: z.infer<typeof PromptInternalInputSchema>,
  analysisText: string
): { penalty: number; issues: string[] } {
  const issues: string[] = [];
  let penalty = 0;
  
  // Check 1: Invented behavioral details not in questions
  const behavioralClaims = [
    /\b(altijd|nooit|constant|continue)\s+\w+/gi,  // Absolute statements
    /\bin\s+de\s+klas\s+\w+/gi,                   // Classroom specifics
    /\bthuis\s+\w+/gi,                            // Home specifics  
    /\bmet\s+vrienden\s+\w+/gi                    // Friend specifics
  ];
  
  behavioralClaims.forEach(pattern => {
    const matches = analysisText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Check if this claim can be supported by any answered question
        const isSupported = input.answeredQuestions.some(qa => 
          qa.question.toLowerCase().includes(match.split(' ')[1]?.toLowerCase() || '') ||
          qa.answer.toLowerCase().includes(match.split(' ')[1]?.toLowerCase() || '')
        );
        
        if (!isSupported) {
          issues.push(`Unsupported behavioral claim: "${match}"`);
          penalty += 5;
        }
      });
    }
  });
  
  // Check 2: Specific details about child that weren't provided
  if (input.childName) {
    // Look for specific activities/situations mentioned without basis
    const specificClaims = analysisText.match(/\b(voetbal|piano|tekenen|sport|muziek)\b/gi);
    if (specificClaims) {
      specificClaims.forEach(claim => {
        const isInInput = input.answeredQuestions.some(qa => 
          qa.question.toLowerCase().includes(claim.toLowerCase()) ||
          qa.answer.toLowerCase().includes(claim.toLowerCase())
        );
        
        if (!isInInput) {
          issues.push(`Mentioned activity "${claim}" not found in input`);
          penalty += 3;
        }
      });
    }
  }
  
  // Check 3: Age-inappropriate content
  if (input.ageGroup) {
    const ageSpecificChecks: Record<string, RegExp[]> = {
      '12-14': [/\bwerk\b/gi, /\bbaan\b/gi, /\buniversiteit\b/gi],
      '15-18': [/\bkleuterschool\b/gi, /\bspeelgoed\b/gi],
      '18+': [/\bschool\b/gi] // Should mention school less for adults
    };
    
    const checksForAge = ageSpecificChecks[input.ageGroup as keyof typeof ageSpecificChecks];
    if (checksForAge) {
      checksForAge.forEach(pattern => {
        const matches = analysisText.match(pattern);
        if (matches && matches.length > 2) { // More than 2 mentions
          issues.push(`Age-inappropriate content for ${input.ageGroup}`);
          penalty += 2;
        }
      });
    }
  }
  
    // Check 4: Focus-specific language validation
    if (input.isADHDFriendly) {
        const adhdInappropriate = analysisText.match(/\b(altijd|nooit|perfect|gefaald)\b/gi);
        if (adhdInappropriate && adhdInappropriate.length > 2) {
            penalty += 5;
            issues.push('ADHD-inappropriate absolute language detected');
        }
    }
    if (input.isAutismFriendly) {
        const implicitLanguage = analysisText.match(/\b(waarschijnlijk|misschien|soort van)\b/gi);
        if (implicitLanguage && implicitLanguage.length > 3) {
            penalty += 3;
            issues.push('Autism-inappropriate implicit language detected');
        }
    }
    if (input.isHSPFriendly) {
        const overwhelmingWords = analysisText.match(/\b(moet|moeten|altijd|verplicht)\b/gi);
        if (overwhelmingWords && overwhelmingWords.length > 2) {
            penalty += 3;
            issues.push('HSP-inappropriate demanding language detected');
        }
    }

  return { penalty: Math.min(penalty, 30), issues }; // Cap penalty at 30
}

/**
 * 3. CONTENT QUALITY VALIDATION
 * Checks if content is actually useful and specific
 */
function validateContentQuality(
  input: z.infer<typeof PromptInternalInputSchema>,
  analysisText: string
): { score: number; issues: string[] } {
  const issues: string[] = [];
  let qualityScore = 100;
  
  // Check 1: Generic vs Specific content
  const genericPhrases = [ 'het is belangrijk', 'dit kan helpen', 'probeer eens', 'het is goed om', 'denk eraan' ];
  
  const genericCount = genericPhrases.reduce((count, phrase) => {
    return count + (analysisText.toLowerCase().match(new RegExp(phrase, 'g'))?.length || 0);
  }, 0);
  
  if (genericCount > 5) {
    qualityScore -= 15;
    issues.push(`Too many generic phrases (${genericCount})`);
  }
  
  // Check 2: Specific examples presence
  const hasSpecificExamples = [ /bijvoorbeeld:/gi, /zoals\s+wanneer/gi, /stel\s+dat/gi, /\d+\s+minuten/gi, /\d+\s+stappen/gi ].some(pattern => pattern.test(analysisText));
  
  if (!hasSpecificExamples) {
    qualityScore -= 10;
    issues.push('Lacks specific, actionable examples');
  }
  
  // Check 3: Question relevance
  if (input.answeredQuestions.length > 0) {
    const questionKeywords = input.answeredQuestions.flatMap(qa => 
      [qa.question, qa.answer].join(' ').toLowerCase().split(/\s+/)
        .filter(word => word.length > 4)
        .filter(word => !['deze', 'vaak', 'soms', 'nooit', 'altijd', 'heel', 'echt'].includes(word))
    );
    
    const relevantKeywords = [...new Set(questionKeywords)].filter(keyword => 
      analysisText.toLowerCase().includes(keyword)
    );
    
    const relevanceRatio = relevantKeywords.length / Math.max([...new Set(questionKeywords)].length, 1);
    if (relevanceRatio < 0.3) {
      qualityScore -= 20;
      issues.push(`Low relevance to input (${Math.round(relevanceRatio * 100)}%)`);
    }
  }

  // Check 4: Category relevance
  const categoryKeywords: Record<string, string[]> = {
    focusEmotions: ['gevoel', 'emotie', 'voelen', 'empathie', 'stemming'],
    focusSocial: ['sociaal', 'vrienden', 'groep', 'interactie', 'communicatie'],
    focusLearning: ['leren', 'school', 'studie', 'concentratie', 'huiswerk'],
    focusSensory: ['prikkel', 'geluid', 'licht', 'omgeving', 'gevoelig'],
    focusIdentity: ['zelfbeeld', 'identiteit', 'persoonlijkheid', 'wie ben ik'],
    focusFuture: ['toekomst', 'droom', 'doel', 'ambitie', 'carrière'],
  };

  Object.entries(categoryKeywords).forEach(([flag, keywords]) => {
      if ((input as any)[flag]) {
          const mentions = keywords.reduce((count, word) =>
              count + (analysisText.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g'))?.length || 0),
          0);
          if (mentions < 2) {
              qualityScore -= 5;
              issues.push(`Insufficient content for category flag: ${flag}`);
          }
      }
  });
  
  return { score: Math.max(0, qualityScore), issues };
}

/**
 * 4. ENHANCED VALIDATION FUNCTION
 * Combines all validation checks into one comprehensive score
 */
function performEnhancedValidation(
  input: z.infer<typeof PromptInternalInputSchema>,
  analysisText: string
): ValidationResult {
  // Run all validation checks
  const scoreAccuracy = validateScoreAccuracy(input.finalScores, analysisText);
  const hallucinations = detectHallucinations(input, analysisText);
  const contentQuality = validateContentQuality(input, analysisText);
  
  // Combine all issues
  const allIssues = [
    ...scoreAccuracy.issues,
    ...hallucinations.issues,
    ...contentQuality.issues
  ];
  
  // Calculate weighted overall score
  const weights = {
    inputAlignment: 0.4,    // Most important - accuracy
    contentQuality: 0.35,   // Second most important
    hallucinations: 0.25    // Penalty-based
  };
  
  const overallScore = Math.max(0,
    (scoreAccuracy.score * weights.inputAlignment) +
    (contentQuality.score * weights.contentQuality) +
    ((100 - hallucinations.penalty) * weights.hallucinations)
  );
  
  return {
    inputAlignmentScore: scoreAccuracy.score,
    hallucinationPenalty: hallucinations.penalty,
    contentQualityScore: contentQuality.score,
    overallScore,
    issues: allIssues
  };
}


// New internal schema to make data iterable for Handlebars and add booleans
const PromptInternalInputSchema = GenerateQuizAnalysisInputSchema.extend({
  finalScoresArray: z.array(z.object({
    key: z.string(),
    value: z.number(),
    isHigh: z.boolean(),
    isMedium: z.boolean(),
    isLow: z.boolean(),
    isMediumOrHigh: z.boolean(),
    // Booleans for string comparison
    isEmotions: z.boolean(),
    isAttention: z.boolean(),
    isSocial: z.boolean(),
  })).optional(),
  
  isParentPerspective: z.boolean(),
  isScoreBased: z.boolean(),
  isPersonalityType: z.boolean(),
  numAnsweredQuestions: z.number().optional(),
  
  // Focus flags for template conditionals
  isADHDFriendly: z.boolean(),
  isAutismFriendly: z.boolean(), 
  isHSPFriendly: z.boolean(),
  isDyslexiaFriendly: z.boolean(),
  isHighGiftedFocus: z.boolean(),
  isExecutiveFocus: z.boolean(),
  isSensoryFocus: z.boolean(),
  isEmotionRegulationFocus: z.boolean(),

  // Category flags for specifieke content
  focusEmotions: z.boolean(),
  focusSocial: z.boolean(),
  focusLearning: z.boolean(),
  focusSensory: z.boolean(),
  focusIdentity: z.boolean(),
  focusFuture: z.boolean(),

  // Quiz type voor content aanpassing
  isAdaptiveQuiz: z.boolean(),
  isAIGeneratedQuiz: z.boolean(),
  
  validation: z.object({
      score: z.number(),
      level: z.string(),
      title: z.string(),
      iconSvg: z.string(),
      iconColor: z.string(),
  }).optional(),
});

// The output schema for the prompt itself ONLY defines the `analysis` string.
// The `scores` are added back in the flow logic.
const PromptOutputSchema = z.object({
  analysis: GenerateQuizAnalysisOutputSchema.shape.analysis,
});


const masterPrompt = ai.definePrompt({
    name: 'generateQuizAnalysisMasterPrompt_v15_hyper_personalized',
    input: { schema: PromptInternalInputSchema },
    output: { schema: PromptOutputSchema },
    prompt: `{{!-- ROLE & PERSPECTIVE DEFINITION --}}
{{#if isParentPerspective}}
  CONTEXT: Je bent Dr. Florentine Sage, een GZ-psycholoog gespecialiseerd in neurodiversiteit. Je analyseert een vragenlijst die een OUDER heeft ingevuld over hun kind ({{{ageGroup}}}). Je richt je CONSEQUENT tot de ouder met "u", "uw", "uw kind". Als de naam van het kind bekend is ({{{childName}}}), gebruik je die naam waar gepast.
{{else}}
  CONTEXT: Je bent Dr. Florentine Sage, een GZ-psycholoog gespecialiseerd in neurodiversiteit. Je analyseert een zelfreflectie van een jongere ({{{ageGroup}}}). Je richt je CONSEQUENT tot de jongere met "jij", "je", "jouw". Je schrijfstijl is warm, bemoedigend en toegankelijk.
{{/if}}

{{!-- CORE INSTRUCTIONS --}}
KRITIEKE INSTRUCTIES:
1. **CONSISTENTE TAAL**: Gebruik ALLEEN {{#if isParentPerspective}}"u/uw/uw kind" of de naam "{{{childName}}}"{{else}}"jij/je/jouw"{{/if}} door het hele rapport
2. **CONCRETE CONTENT**: ELKE sectie moet specifieke, herkenbare voorbeelden bevatten die direct aansluiten op het thema.
3. **GEEN MEDISCHE LABELS**: Gebruik beschrijvende termen zoals "energiek denken", "gevoelig waarnemen".
4. **GEBRUIKSVRIENDELIJKE SCORES**: Leg scores uit in begrijpelijke taal, niet technische cijfers.
5. **IMPLEMENTEERBARE TIPS**: Geef concrete stappen met tijdsaanduiding, direct gelinkt aan het thema.
6. **STERKE CONVERSIE**: Eindig met een overtuigende CTA voor vervolgstappen.

{{!-- FOCUS-SPECIFIC ADAPTATIONS --}}
{{#if isADHDFriendly}}
ADHD-VRIENDELIJKE AANPASSINGEN:
- Gebruik kortere zinnen (max 20 woorden)
- Geef concrete tijdsaanduidingen ("5 minuten", "deze week")
- Vermijd abstracte concepten zonder concrete voorbeelden
- Focus op praktische, onmiddellijk toepasbare tips
{{/if}}

{{#if isAutismFriendly}}
AUTISME-VRIENDELIJKE AANPASSINGEN:
- Gebruik duidelijke, voorspelbare structuur
- Geef expliciete instructies zonder impliciete aannames
- Vermijd metaforen en dubbelzinnige taal
- Benoem expliciet wat er verwacht wordt
{{/if}}

{{#if isHSPFriendly}}
HSP-VRIENDELIJKE AANPASSINGEN:
- Erken prikkelgevoeligheid in alle adviezen
- Geef tijd en ruimte voor verwerking
- Focus op geleidelijke, kleine stappen
- Gebruik zachte, ondersteunende taal
{{/if}}

{{#if isDyslexiaFriendly}}
DYSLEXIE-VRIENDELIJKE AANPASSINGEN:
- Gebruik eenvoudige zinsstructuren
- Vermijd lange alinea's (max 3 zinnen)
- Geef visuele structuur met duidelijke koppen
- Focus op sterke kanten en alternatieve leerstrategieën
{{/if}}

{{!-- SCORING CONTEXT --}}
SCHAAL INFORMATIE:
- 4-punts schaal: Nooit (1), Soms (2), Vaak (3), Altijd (4)
- Hoog: 3.0-4.0 (Vaak tot Altijd)
- Gemiddeld: 2.0-2.9 (Soms tot bijna Vaak)
- Laag: 1.0-1.9 (Nooit tot bijna Soms)

{{!-- DATA VOOR ANALYSE --}}
ANALYSEER:
- Quiz: "{{quizTitle}}"
{{#if childName}}
- Kind: {{{childName}}}
{{/if}}
- Leeftijdsgroep: {{{ageGroup}}}
{{#if finalScoresArray}}
- Thema Scores: {{#each finalScoresArray}}{{this.key}}: {{this.value}}/4 | {{/each}}
{{/if}}
- Antwoorden: {{#each answeredQuestions}}"{{this.question}}" → "{{this.answer}}" | {{/each}}

--- RAPPORT START ---

<h2>{{#if isParentPerspective}}Analyse van {{#if childName}}{{childName}}{{else}}Uw Kind{{/if}}{{else}}Jouw Persoonlijkheidsanalyse{{/if}}</h2>

{{#if isParentPerspective}}
<p>Beste ouder, dank u voor het invullen van de vragenlijst over {{#if childName}}{{childName}}{{else}}uw kind{{/if}}. Dit rapport biedt concrete inzichten en praktische tips gebaseerd op uw observaties.</p>
{{else}}
<p>Hoi! Wat gaaf dat je deze vragenlijst hebt ingevuld. Dit rapport helpt je om jezelf beter te leren kennen en geeft je praktische tips die echt werken.</p>
{{/if}}

{{!-- CONDITIONALE VISUELE SECTIE --}}
{{#if showChart}}
<h2>{{#if isParentPerspective}}Profiel van {{#if childName}}{{childName}}{{else}}Uw Kind{{/if}}{{else}}Jouw Profiel{{/if}} Visueel</h2>
<p>Het diagram toont {{#if isParentPerspective}}de scores van {{#if childName}}{{childName}}{{else}}uw kind{{/if}}{{else}}jouw scores{{/if}} per thema. Hoe hoger de score, hoe vaker {{#if isParentPerspective}}u dit bij {{#if childName}}{{childName}}{{else}}uw kind{{/if}} ziet{{else}}je dit doet of ervaart{{/if}}.</p>
{{else}}
<h2>{{#if isParentPerspective}}Belangrijkste Thema van {{#if childName}}{{childName}}{{else}}Uw Kind{{/if}}{{else}}Jouw Belangrijkste Thema{{/if}}</h2>
{{#if finalScoresArray}}
{{#each finalScoresArray}}{{#if @first}}<p>{{#if ../isParentPerspective}}Het hoogste scorende thema voor {{#if ../childName}}{{../childName}}{{else}}uw kind{{/if}} is <strong>{{this.key}}</strong> - dit is een belangrijke eigenschap om te begrijpen en te ondersteunen.{{else}}Je scoort het hoogst op <strong>{{this.key}}</strong> - dit is een belangrijke eigenschap van jou!{{/if}}</p>{{/if}}{{/each}}
{{/if}}
{{/if}}

{{!-- SCORES SECTIE MET GEBRUIKSVRIENDELIJKE UITLEG --}}
{{#if finalScoresArray}}
<h2>{{#if isParentPerspective}}Wat Betekenen Deze Scores?{{else}}Wat Betekenen Jouw Scores?{{/if}}</h2>

{{#each finalScoresArray}}
<h3>{{this.key}}</h3>
{{#if ../isParentPerspective}}
  {{#if this.isHigh}}
    <p><strong>Hoog Herkenbaar:</strong> U ziet dit vaak tot altijd bij {{#if ../childName}}{{../childName}}{{else}}uw kind{{/if}}. Dit is een sterke eigenschap die regelmatig naar voren komt in het gedrag.</p>
  {{else if this.isMedium}}
    <p><strong>Gemiddeld Herkenbaar:</strong> U ziet dit soms bij {{#if ../childName}}{{../childName}}{{else}}uw kind{{/if}}. Het komt regelmatig voor, maar niet constant.</p>
  {{else}}
    <p><strong>Minder Herkenbaar:</strong> U ziet dit zelden bij {{#if ../childName}}{{../childName}}{{else}}uw kind{{/if}}. Dit is minder kenmerkend voor de persoonlijkheid.</p>
  {{/if}}
{{else}}
  {{#if this.isHigh}}
    <p><strong>Hoog Herkenbaar:</strong> Je doet dit vaak tot altijd! Dit is echt een kenmerkende eigenschap van jou.</p>
  {{else if this.isMedium}}
    <p><strong>Gemiddeld Herkenbaar:</strong> Je doet dit soms. Het komt regelmatig voor, maar niet altijd.</p>
  {{else}}
    <p><strong>Minder Herkenbaar:</strong> Je doet dit zelden. Dit is minder kenmerkend voor jou.</p>
  {{/if}}
{{/if}}
{{/each}}
{{/if}}


{{!-- EMOTIONS FOCUS CONTENT --}}
{{#if focusEmotions}}
<h2>{{#if isParentPerspective}}Emotionele Navigatie van {{#if childName}}{{childName}}{{else}}Uw Kind{{/if}}{{else}}Jouw Emotionele Kompas{{/if}}</h2>
{{#each finalScoresArray}}
  {{#if this.isEmotions}}
    {{#if this.isHigh}}
      {{#if ../isHSPFriendly}}
        {{#if ../isParentPerspective}}
        <p><strong>Emotionele Intensiteit als HSP-Kracht:</strong> {{#if ../childName}}{{../childName}}{{else}}Uw kind{{/if}} voelt emoties zeer diep. Dit is geen zwakte maar een bijzondere eigenschap. HSP-kinderen ervaren de wereld in HD - alles komt binnen met extra detail en nuance.</p>
        <p><strong>Praktische HSP-tip:</strong> Creëer een "emotie-thermometer" van 1-10. Vanaf 7/10 is het tijd voor een rustpauze in een rustige ruimte zonder prikkels.</p>
        {{else}}
        <p><strong>Jouw HSP-Superkracht:</strong> Je voelt emoties heel intens en dat is eigenlijk een bijzondere gave. Je ervaart de wereld in HD - je pikt nuances op die anderen missen.</p>
        <p><strong>Jouw HSP-tip:</strong> Maak een "emotie-thermometer" voor jezelf (1-10). Vanaf 7/10: tijd voor een rustige plek zonder veel prikkels.</p>
        {{/if}}
      {{else if ../isADHDFriendly}}
        {{#if ../isParentPerspective}}
        <p><strong>ADHD + Emoties = Krachtige Combinatie:</strong> {{#if ../childName}}{{../childName}}{{else}}Uw kind{{/if}} voelt emoties intens en direct. Dit zorgt voor authenticiteit en empathie, maar kan ook overweldigend zijn.</p>
        <p><strong>ADHD-emotie tip:</strong> Gebruik de "STOP-techniek": Stop, Tel tot 5, Observeer je gevoel, Plan je reactie. Perfect voor het impulsieve ADHD-brein.</p>
        {{else}}
        <p><strong>ADHD + Emoties = Jouw Kracht:</strong> Je voelt emoties heel direct en intens. Dat maakt je authentiek en empathisch, maar kan soms ook veel zijn.</p>
        <p><strong>ADHD-emotie tip:</strong> Probeer de "STOP-techniek": Stop, Tel tot 5, Observeer je gevoel, Plan je reactie. Perfect voor jouw snelle brein.</p>
        {{/if}}
      {{else}}
        {{!-- Generic emotional intensity content --}}
      {{/if}}
    {{/if}}
  {{/if}}
{{/each}}
{{/if}}

{{!-- SOCIAL FOCUS CONTENT --}}
{{#if focusSocial}}
<h2>{{#if isParentPerspective}}Sociale Wereld van {{#if childName}}{{childName}}{{else}}Uw Kind{{/if}}{{else}}Jouw Sociale Kompas{{/if}}</h2>
{{#if isAutismFriendly}}
  {{#if isParentPerspective}}
  <p><strong>Autisme-vriendelijke sociale navigatie:</strong> {{#if childName}}{{childName}}{{else}}Uw kind{{/if}} heeft een unieke, authentieke manier van contact maken. Dit is waardevol - diepte boven oppervlakkigheid.</p>
  <p><strong>Sociale energie-tip:</strong> Plan bewust rusttijd na sociale activiteiten. Sociale interacties kosten extra energie voor autistische mensen - dat is normaal en oké.</p>
  {{else}}
  <p><strong>Jouw autisme-vriendelijke sociale stijl:</strong> Je maakt contact op jouw eigen, authentieke manier. Je houdt van diepte in plaats van oppervlakkig geklets - dat is een kracht!</p>
  <p><strong>Sociale energie-tip:</strong> Plan na sociale momenten bewust tijd voor jezelf. Sociale interacties kosten jou extra energie - plan daar rekening mee.</p>
  {{/if}}
{{else if isHSPFriendly}}
  {{!-- HSP-specific social content --}}
{{else if isADHDFriendly}}
  {{!-- ADHD-specific social content --}}
{{/if}}
{{/if}}

{{!-- LEARNING FOCUS CONTENT --}}
{{#if focusLearning}}
<h2>{{#if isParentPerspective}}Leertraject van {{#if childName}}{{childName}}{{else}}Uw Kind{{/if}}{{else}}Jouw Leertraject{{/if}}</h2>
{{#if isADHDFriendly}}
<h3>ADHD-Brain Learning Hacks</h3>
{{#if isParentPerspective}}
<p><strong>ADHD-leren is anders-leren:</strong> {{#if childName}}{{childName}}{{else}}Uw kind{{/if}} heeft een brein dat geweldig is in hyperfocus, maar moeite heeft met routine-taken. Werk mét het brein, niet ertegen.</p>
<ul>
  <li><strong>Pomodoro-methode:</strong> 25 min focus, 5 min pauze - perfect voor ADHD</li>
  <li><strong>Fidget-tools:</strong> Stress-balletje tijdens huiswerk kan focus verbeteren</li>
  <li><strong>Interesse-koppeling:</strong> Verbind saaie vakken aan interessante onderwerpen</li>
  <li><strong>Beweging-breaks:</strong> Elke 30 minuten 2 minuten bewegen</li>
</ul>
{{else}}
<p><strong>Jouw ADHD-brein is een diamond:</strong> Je kunt hyperfocussen op interessante dingen, maar saaie taken zijn lastig. Dat is normaal - werk met je brein mee!</p>
<ul>
  <li><strong>Pomodoro voor jou:</strong> 25 min focus, 5 min pauze - probeer het uit!</li>
  <li><strong>Fidget tijdens leren:</strong> Knijp in een stress-balletje, het kan je focus verbeteren</li>
  <li><strong>Maak het interessant:</strong> Verbind saaie vakken aan dingen die je wél leuk vindt</li>
  <li><strong>Beweeg tussen door:</strong> Elke 30 min even bewegen helpt je brein</li>
</ul>
{{/if}}
{{else if isDyslexiaFriendly}}
<h3>Dyslexie-Krachten in het Leren</h3>
{{#if isParentPerspective}}
<p><strong>Dyslexie = Andere intelligentie:</strong> {{#if childName}}{{childName}}{{else}}Uw kind{{/if}} heeft vaak sterke visueel-ruimtelijke vaardigheden en creatief denkvermogen. Focus op deze krachten!</p>
{{else}}
<p><strong>Jouw dyslexie-krachten:</strong> Je denkt waarschijnlijk visueel en creatief. Dat zijn echte superkrachten - gebruik ze!</p>
{{/if}}
{{/if}}
{{/if}}


<h2>{{#if isParentPerspective}}Praktische Tips voor Thuis{{else}}Tips die Bij Jou Passen{{/if}}</h2>
{{#if isADHDFriendly}}
<h3>🧠 ADHD-Vriendelijke Acties (Begin Klein!)</h3>
{{#if isParentPerspective}}
<ul>
  <li><strong>Deze week:</strong> Probeer 1x de pomodoro-techniek (25 min focus, 5 min pauze) tijdens huiswerk</li>
  <li><strong>Deze maand:</strong> Introduceer een vaste 10-minuten ochtend-routine</li>
  <li><strong>Lange termijn:</strong> Bouw systemen die het ADHD-brein ondersteunen in plaats van ertegen te vechten</li>
</ul>
{{else}}
<ul>
  <li><strong>Deze week:</strong> Probeer 1 pomodoro-sessie van 25 minuten voor een taak die je uitstelt</li>
  <li><strong>Deze maand:</strong> Maak een kleurgecodeerde planning voor verschillende activiteiten</li>
  <li><strong>Lange termijn:</strong> Omarm je ADHD-brein en leer werken mét je natuurlijke ritmes</li>
</ul>
{{/if}}
{{/if}}
{{#if isAutismFriendly}}
<h3>🔄 Autisme-Vriendelijke Acties (Voorspelbaar & Duidelijk)</h3>
{{#if isParentPerspective}}
<ul>
  <li><strong>Deze week:</strong> Kies 1 specifieke tip uit dit rapport en plan exact wanneer u het gaat proberen</li>
  <li><strong>Deze maand:</strong> Creëer samen een vaste routine rond het nieuwe gedrag</li>
  <li><strong>Lange termijn:</strong> Bouw geleidelijk een persoonlijk systeem dat comfort en voorspelbaarheid biedt</li>
</ul>
{{else}}
<ul>
  <li><strong>Deze week:</strong> Kies 1 tip en plan exact wanneer en hoe je het gaat proberen</li>
  <li><strong>Deze maand:</strong> Maak er een vaste routine van - routines geven rust</li>
  <li><strong>Lange termijn:</strong> Bouw jouw persoonlijke systeem dat bij jou past</li>
</ul>
{{/if}}
{{/if}}
{{#if isHSPFriendly}}
<h3>🌸 HSP-Vriendelijke Acties (Zachte Overgangen)</h3>
{{#if isParentPerspective}}
<ul>
  <li><strong>Deze week:</strong> Probeer 1 kleine verandering en observeer hoe {{#if childName}}{{childName}}{{else}}uw kind{{/if}} reageert</li>
  <li><strong>Deze maand:</strong> Geef tijd voor gewenning - HSP-kinderen hebben tijd nodig voor aanpassing</li>
  <li><strong>Lange termijn:</strong> Respecteer de behoefte aan geleidelijke verandering en rustige momenten</li>
</ul>
{{else}}
<ul>
  <li><strong>Deze week:</strong> Probeer 1 kleine verandering en voel hoe het voor je is</li>
  <li><strong>Deze maand:</strong> Geef jezelf de tijd om te wennen - jij hebt tijd nodig en dat is oké</li>
  <li><strong>Lange termijn:</strong> Respecteer je eigen tempo en behoefte aan rust</li>
</ul>
{{/if}}
{{/if}}


{{!-- GESPREKSONDERWERPEN (ALLEEN VOOR OUDERS) --}}
{{#if isParentPerspective}}
<h2>Gespreksonderwerpen met {{#if childName}}{{childName}}{{else}}Uw Kind{{/if}}</h2>
<p>Deze vragen helpen u om dieper met {{#if childName}}{{childName}}{{else}}uw kind{{/if}} in gesprek te gaan:</p>
<ul>
{{#each finalScoresArray}}
  {{#if this.isMediumOrHigh}}
    {{#if this.isEmotions}}
      <li>"Ik merkte dat je vandaag [emotie] leek te voelen. Klopt dat? Hoe was dat voor je?"</li>
    {{else if this.isAttention}}
      <li>"Bij welk vak voel je de 'hyperfocus' het meest? En bij welk vak helemaal niet? Wat maakt het verschil, denk je?"</li>
    {{else if this.isSocial}}
      <li>"Wat vind jij het fijnste aan afspreken met je beste vriend(in)?"</li>
    {{else}}
      <li>"Wat vind je het allerleukste aan [{{this.key}}]? Kun je me er meer over vertellen?"</li>
    {{/if}}
  {{/if}}
{{/each}}
</ul>
{{/if}}

{{!-- VOLGENDE STAPPEN --}}
<h2>{{#if isParentPerspective}}Volgende Stappen voor Uw Gezin{{else}}Jouw Volgende Stappen{{/if}}</h2>
<p>{{#if isParentPerspective}}Nu u meer inzicht heeft, zijn dit logische vervolgstappen:{{else}}Nu je meer over jezelf weet, zijn dit logische vervolgstappen:{{/if}}</p>
<ul>
  <li><strong>Deze week:</strong> Probeer één van de praktische tips uit en kijk hoe het voelt.</li>
  <li><strong>Deze maand:</strong> Deel je inzichten met een vriend of ouder, of gebruik ze in een gesprek met je leerkracht.</li>
  <li><strong>Voor de lange termijn:</strong> Blijf de tools op dit platform gebruiken om je sterke kanten te benutten en je uitdagingen te navigeren.</li>
</ul>

{{!-- BELANGRIJKE OVERWEGINGEN --}}
<h2>Belangrijke Overwegingen</h2>
{{#if isParentPerspective}}
<p>Deze analyse is gebaseerd op uw observaties en biedt inzichten in de unieke eigenschappen van {{#if childName}}{{childName}}{{else}}uw kind{{/if}}. Het is <strong>geen medische diagnose</strong> en vervangt geen professionele hulp. Bij aanhoudende zorgen over het welzijn van {{#if childName}}{{childName}}{{else}}uw kind{{/if}} raden wij aan contact op te nemen met de huisarts, school of een GZ-psycholoog.</p>
{{else}}
<p>Deze analyse is gebaseerd op jouw antwoorden en helpt je om jezelf beter te leren kennen. Het is <strong>geen medische diagnose</strong> en vervangt geen professionele hulp. Als je je zorgen maakt over jezelf, praat dan met je ouders, een vertrouwenspersoon op school, of een andere volwassene die je vertrouwt.</p>
{{/if}}
{{#if numAnsweredQuestions}}
<p>Deze analyse is gebaseerd op uw antwoorden op <strong>{{numAnsweredQuestions}} vragen</strong>. Voor een nog dieper en genuanceerder beeld bieden onze premium abonnementen toegang tot uitgebreidere vragenlijsten en analyses.</p>
{{/if}}

{{!-- KRACHTIGE CONVERSIE SECTIE --}}
{{#if showParentalCta}}
<div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
  <h2 style="font-size: 1.5rem; font-weight: bold; text-align: center; margin-bottom: 0.5rem;">Klaar om Verder te Gaan?</h2>
  <p style="text-align: center; color: #6b7280; max-width: 600px; margin: 0 auto 1.5rem auto;">Dit rapport is slechts het begin. <strong>Wilt u {{#if childName}}{{childName}}{{else}}uw kind{{/if}} echt helpen groeien?</strong> MindNavigator biedt de complete ondersteuning die uw gezin nodig heeft met het "Gezins Gids" abonnement.</p>
  <div style="text-align: center; margin: 2rem 0; padding: 1rem; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
    <p style="font-weight: 600; font-size: 1.125rem;">🎁 Probeer het 14 dagen GRATIS</p>
    <a href="/signup" style="display: inline-block; margin-top: 1rem; background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);">Start Je Gratis Proefperiode</a>
  </div>
</div>
{{/if}}

{{#if validation}}
<div style="margin-top: 30px; padding: 1rem; border-radius: 0.75rem; border: 1px solid hsl(var(--border) / 0.5); background-color: hsl(var(--muted) / 0.3); display: flex; align-items: center; gap: 1rem;">
  <div style="color: {{validation.iconColor}}; flex-shrink: 0;">
    {{{validation.iconSvg}}}
  </div>
  <div>
    <strong style="display: block; font-size: 1.125rem; font-weight: 600; color: hsl(var(--foreground));">{{validation.title}} (Validatie Score: {{validation.score}}%)</strong>
    <p style="font-size: 0.875rem; color: hsl(var(--muted-foreground)); margin-top: 0.25rem;">
        Om te verzekeren dat de AI-analyse betrouwbaar is en direct gebaseerd is op uw antwoorden, controleren we de consistentie en volledigheid. Dit is een kwaliteitskenmerk.
    </p>
  </div>
</div>
{{/if}}

<p style="font-size: 12px; color: #666; text-align: center; margin-top: 30px;">
  <em>Rapport gegenereerd door MindNavigator • {{#if isParentPerspective}}Gebaseerd op ouderobservaties{{else}}Gebaseerd op zelfreflectie{{/if}} • Geen medische diagnose</em>
</p>
`,
});

const generateQuizAnalysisFlow = ai.defineFlow(
  {
    name: 'generateQuizAnalysisFlow_v15_hyper_personalized',
    inputSchema: GenerateQuizAnalysisInputSchema,
    outputSchema: GenerateQuizAnalysisOutputSchema,
  },
  async (input: GenerateQuizAnalysisInput) => {
    
    // Transform the finalScores record into an array with human-readable keys and boolean flags
    const finalScoresArray = input.finalScores ? Object.keys(input.finalScores).map(key => {
        const value = input.finalScores![key];
        const isHigh = value >= 3;
        const isMedium = value >= 2 && value < 3;
        const isLow = value < 2;
        const isMediumOrHigh = value >= 2;

        const normalizedKey = key.toLowerCase();
        const displayName = PROFILE_KEY_TO_NAME_MAP[normalizedKey] || key;
        
        return { 
          key: displayName,
          value: Math.round(value * 10) / 10,
          isHigh,
          isMedium,
          isLow,
          isMediumOrHigh,
          isEmotions: displayName === 'Emoties en Gevoelens',
          isAttention: displayName === 'Aandacht en Focus',
          isSocial: displayName === 'Vriendschappen en Sociaal',
        };
    }) : undefined;
    
     // Data Transformation Logic
    const quizFocus = input.quizFocus || [];
    const categories = input.primaryCategories || [];

    const enhancedInput: z.infer<typeof PromptInternalInputSchema> = {
        ...input,
        finalScoresArray: finalScoresArray,
        isParentPerspective: input.quizAudience.toLowerCase().includes('ouder'),
        isScoreBased: input.resultType === 'score-based' || (!!input.finalScores && Object.keys(input.finalScores).length > 0),
        isPersonalityType: input.resultType === 'personality-4-types' && !!input.personalityTypeResult,
        numAnsweredQuestions: input.answeredQuestions.length,
        validation: undefined,
        
        // Focus flags
        isADHDFriendly: quizFocus.includes('adhd-vriendelijk'),
        isAutismFriendly: quizFocus.includes('autisme-vriendelijk'),
        isHSPFriendly: quizFocus.includes('hsp-vriendelijk'),
        isDyslexiaFriendly: quizFocus.includes('dyslexie-vriendelijk'),
        isHighGiftedFocus: quizFocus.includes('hoogbegaafdheid'),
        isExecutiveFocus: quizFocus.includes('executieve-functies'),
        isSensoryFocus: quizFocus.includes('sensorische-verwerking'),
        isEmotionRegulationFocus: quizFocus.includes('emotieregulatie'),
        
        // Category flags
        focusEmotions: categories.includes('emoties_gevoelens'),
        focusSocial: categories.includes('vriendschappen_sociaal'),
        focusLearning: categories.includes('leren_school'),
        focusSensory: categories.includes('prikkels_omgeving'),
        focusIdentity: categories.includes('wie_ben_ik'),
        focusFuture: categories.includes('dromen_toekomst'),
        
        // Quiz type flags
        isAdaptiveQuiz: input.quizType === 'adaptive',
        isAIGeneratedQuiz: input.quizType === 'ai-generated',
    };
    
    // 1. Generate initial report without watermark for validation purposes
    console.log('Sending input to masterPrompt (initial):', enhancedInput);
    const { output } = await masterPrompt(enhancedInput);
    
    if (!output?.analysis) {
        throw new Error('AI did not return an analysis for validation.');
    }
    
    // 2. ENHANCED VALIDATION
    const analysisForValidation = output.analysis;
    const enhancedValidation = performEnhancedValidation(enhancedInput, analysisForValidation);
    
    // 3. Calculate final validation score (combining enhanced + basic checks)
    let validationScore = enhancedValidation.overallScore * 0.7; // 70% weight to enhanced validation
    
    const sectionsToCheck = ["Scores", "Praktische Tips"];
    const sectionsPresent = sectionsToCheck.filter(section => analysisForValidation.includes(section)).length;
    let basicScore = (sectionsPresent / sectionsToCheck.length) * 100;
    
    if (input.childName && analysisForValidation.includes(input.childName)) basicScore += 10;
    if (input.showParentalCta && analysisForValidation.includes('Start Je Gratis Proefperiode')) basicScore += 10;
    
    validationScore += (Math.min(basicScore, 100) * 0.3);
    validationScore = Math.min(validationScore, 98); // Cap for realism
    
    // 4. Log validation results for monitoring
    console.log('Enhanced Validation Results:', {
      overallScore: Math.round(validationScore),
      inputAlignment: Math.round(enhancedValidation.inputAlignmentScore),
      contentQuality: Math.round(enhancedValidation.contentQualityScore),
      hallucinationPenalty: enhancedValidation.hallucinationPenalty,
      issuesFound: enhancedValidation.issues.length,
      issues: enhancedValidation.issues
    });
    
    // 5. Flag for human review if quality is too low
    if (validationScore < 70 || enhancedValidation.issues.length > 3) {
      console.warn('Report flagged for human review:', {
        score: validationScore,
        issuesCount: enhancedValidation.issues.length,
        criticalIssues: enhancedValidation.issues.filter(issue => 
          issue.includes('score') || issue.includes('Unsupported')
        )
      });
    }

    const shieldIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`;

    // 6. Determine Watermark Level based on enhanced validation
    let watermark = {
        level: 'basic',
        title: 'Gevalideerd Rapport',
        iconSvg: shieldIconSvg,
        iconColor: 'hsl(215, 5%, 53%)', // gray
    };

    if (validationScore >= 90 && enhancedValidation.issues.length === 0) {
        watermark = { ...watermark, level: 'gold', title: 'Kwaliteit Geverifieerd', iconColor: 'hsl(48, 96%, 53%)' };
    } else if (validationScore >= 75 && enhancedValidation.hallucinationPenalty < 10) {
        watermark = { ...watermark, level: 'professional', title: 'Professioneel Rapport', iconColor: 'hsl(221, 83%, 53%)' };
    }
    
    // 7. Prepare the final input object for the prompt, now with enhanced validation data
    const promptInputWithValidation: z.infer<typeof PromptInternalInputSchema> = {
      ...enhancedInput,
      validation: {
        score: Math.round(validationScore),
        level: watermark.level,
        title: watermark.title,
        iconSvg: watermark.iconSvg,
        iconColor: watermark.iconColor,
      },
    };

    console.log('Sending input to masterPrompt (final, with validation):', promptInputWithValidation);
    // 8. Call the prompt a second time to generate the final report WITH the enhanced watermark
    const finalResponse = await masterPrompt(promptInputWithValidation);

    if (!finalResponse.output?.analysis) {
      throw new Error('AI did not return a final analysis.');
    }
    
    // Return the final, validated analysis and the original scores
    return {
      analysis: finalResponse.output.analysis,
      scores: input.finalScores,
    };
  }
);