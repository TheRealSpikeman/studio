// src/app/quiz/teen-neurodiversity-quiz/page.tsx
"use client"; // Deze mag blijven staan, of je kunt hem verwijderen, heeft hier minder effect

import React, { Suspense } from 'react'; // Importeer alleen React en Suspense
// Importeer de nieuwe component die je net hebt gemaakt
import QuizPageContent from './QuizPageContent';

// De hoofd page component die nu alleen de Suspense wrapper rendert.
// Deze component is server-side renderbaar (ondanks "use client" kan Next.js dit optimaliseren)
// totdat het de Suspense boundary bereikt.
export default function TeenNeurodiversityQuizPage() {
  return (
    // Wikkel de content component (met de client-side hooks) in een Suspense boundary.
    // De 'fallback' prop toont iets terwijl de client-side code van QuizPageContent laadt.
    <Suspense fallback={<div>Quiz laden...</div>}>
      <QuizPageContent />
    </Suspense>
  );
}
