// src/components/admin/user-management/FormattedDateCell.tsx
"use client";

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

interface FormattedDateCellProps {
  isoDateString: string;
  dateFormatPattern: 'P' | 'Pp' | string; // Allow specific patterns or any string
}

export function FormattedDateCell({ isoDateString, dateFormatPattern }: FormattedDateCellProps) {
  const [clientFormattedDate, setClientFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    // Ensure this effect runs only on the client after hydration
    if (isoDateString) {
      try {
        const date = parseISO(isoDateString); // Use parseISO for ISO strings
        setClientFormattedDate(format(date, dateFormatPattern, { locale: nl }));
      } catch (e) {
        console.error("Failed to format date:", e);
        setClientFormattedDate("Ongeldige datum"); // Fallback for invalid dates
      }
    } else {
      setClientFormattedDate("N/A");
    }
  }, [isoDateString, dateFormatPattern]);

  // Render a placeholder or nothing on the server and initial client render
  // to prevent mismatch. The actual formatted date will appear after mount.
  if (clientFormattedDate === null) {
    return <span className="text-muted-foreground text-xs">Laden...</span>; // Or simply return null
  }

  return <>{clientFormattedDate}</>;
}
