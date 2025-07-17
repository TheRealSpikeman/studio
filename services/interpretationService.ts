// services/interpretationService.ts

// Represents the structure for a single level of interpretation (e.g., 'low', 'medium', 'high').
interface InterpretationLevel {
  title: string;
  explanation: string;
  tip?: string;
}

// Defines the structure for all levels for a specific audience.
type AudienceInterpretations = {
  [level: string]: InterpretationLevel;
};

// The main data structure holding all our mock interpretation data.
const interpretations: { [category: string]: { [audience: string]: AudienceInterpretations } } = {
  'Aandacht & Focus': {
    self: {
      very_low: { title: 'Uitzonderlijke Focus', explanation: 'Je hebt een zeldzaam vermogen om je diep en langdurig te concentreren. Dit is een superkracht voor complexe projecten.' },
      low: { title: 'Sterke Focus', explanation: 'Je kunt je aandacht goed vasthouden, zelfs bij minder boeiende taken. Dit helpt je efficiënt te werken.' },
      medium: { title: 'Variabele Focus', explanation: 'Je aandacht kan soms verslappen, vooral bij saaie taken. Afleidingen zijn een bekende uitdaging voor je.' },
      high: { title: 'Dromerige Aandacht', explanation: 'Je gedachten dwalen snel af. Dit kan leiden tot creativiteit, maar maakt focus op schoolwerk lastig.' },
      very_high: { title: 'Zeer Verstrooide Aandacht', explanation: 'Je bent zeer gevoelig voor elke interne of externe prikkel, wat concentreren op één taak extreem moeilijk maakt.' },
    },
    parent: {
      very_low: { title: 'Uitzonderlijke Focus', explanation: 'Uw kind heeft een zeldzaam vermogen om zich diep en langdurig te concentreren. Dit is een kracht voor complexe projecten.' },
      low: { title: 'Sterke Focus', explanation: 'Uw kind kan de aandacht goed vasthouden. Dit helpt bij het efficiënt afronden van taken.' },
      medium: { title: 'Variabele Focus', explanation: 'De aandacht van uw kind kan verslappen, vooral bij saaie taken. Het creëren van een rustige omgeving is belangrijk.' },
      high: { title: 'Dromerige Aandacht', explanation: 'De gedachten van uw kind dwalen snel af. Dit kan wijzen op creativiteit, maar maakt schoolwerk een uitdaging. Structureer taken in kleine, behapbare stukjes.' },
      very_high: { title: 'Zeer Verstrooide Aandacht', explanation: 'Uw kind is zeer gevoelig voor prikkels, wat concentreren extreem moeilijk maakt. Overweeg professionele begeleiding om strategieën te ontwikkelen.' },
    },
  },
  'Energie & Impulsiviteit': {
    self: {
        low: { title: 'Rustige Energie', explanation: 'Je hebt een kalm energieniveau en denkt goed na voordat je handelt.' },
        medium: { title: 'Actieve Energie', explanation: 'Je hebt een gezonde energie en bent soms spontaan, wat vaak in goede banen te leiden is.' },
        high: { title: 'Bruisende Energie', explanation: 'Je hebt veel energie en een drang om te bewegen. Dit maakt je dynamisch, maar stilzitten is lastig.' },
    },
    parent: {
        low: { title: 'Rustige Energie', explanation: 'Uw kind heeft een kalm energieniveau en handelt over het algemeen weloverwogen.' },
        medium: { title: 'Actieve Energie', explanation: 'Uw kind heeft een gezonde energie en een spontane inslag.' },
        high: { title: 'Bruisende Energie', explanation: 'Uw kind heeft veel energie en een sterke bewegingsdrang. Zorg voor voldoende fysieke uitlaatkleppen.' },
    },
  },
  'Standaard': { // A default fallback
    self: {
      low: { title: 'Lage Score', explanation: 'Je scoort laag op dit gebied, wat wijst op een stabiele basis.' },
      medium: { title: 'Gemiddelde Score', explanation: 'Je score is gemiddeld, wat duidt op een goede balans.' },
      high: { title: 'Hoge Score', explanation: 'Je scoort hoog op dit gebied, wat kan wijzen op een aandachtspunt.' },
    },
    parent: {
      low: { title: 'Lage Score', explanation: 'De score van uw kind is laag op dit gebied, wat wijst op een stabiele basis.' },
      medium: { title: 'Gemiddelde Score', explanation: 'De score is gemiddeld, wat duidt op een goede balans.' },
      high: { title: 'Hoge Score', explanation: 'De score is hoog, wat kan wijzen op een aandachtspunt voor uw kind.' },
    },
  },
};

/**
 * Retrieves the interpretation text for a given category and score.
 * @param {string} category The category of the score (e.g., 'Aandacht & Focus').
 * @param {number} score The numerical score.
 * @param {'self' | 'parent'} audience The perspective from which to interpret the score.
 * @returns {InterpretationLevel | null} An InterpretationLevel object or null if not found.
 */
export const getInterpretationForScore = (
    category: string, 
    score: number, 
    audience: 'self' | 'parent' = 'self'
): InterpretationLevel | null => {
  const categoryData = interpretations[category] || interpretations['Standaard'];
  const audienceData = categoryData[audience] || categoryData['self'];

  if (score < 1.5) {
    return audienceData.very_low || audienceData.low;
  } else if (score < 2.5) {
    return audienceData.low;
  } else if (score < 3.5) {
    return audienceData.medium;
  } else if (score < 4.5) {
    return audienceData.high;
  } else {
    return audienceData.very_high || audienceData.high;
  }
};
