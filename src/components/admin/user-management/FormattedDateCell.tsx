
// src/components/admin/user-management/FormattedDateCell.tsx
"use client";

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

interface FormattedDateCellProps {
  isoDateString?: string; // Make it optional
  dateFormatPattern: 'P' | 'Pp' | string; // Allow specific patterns or any string
}

export function FormattedDateCell({ isoDateString, dateFormatPattern }: FormattedDateCellProps) {
  const [clientFormattedDate, setClientFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    if (isoDateString) {
      try {
        const date = parseISO(isoDateString); 
        setClientFormattedDate(format(date, dateFormatPattern, { locale: nl }));
      } catch (e) {
        console.error("Failed to format date:", e, "Input was:", isoDateString);
        setClientFormattedDate("-"); // Fallback for invalid dates
      }
    } else {
      setClientFormattedDate("-"); // Show hyphen if no date string is provided
    }
  }, [isoDateString, dateFormatPattern]);

  if (clientFormattedDate === null) {
    // Show a placeholder while client-side formatting is happening, 
    // or if the initial isoDateString was undefined and effect hasn't run.
    return <span className="text-xs text-muted-foreground">-</span>; 
  }

  return <>{clientFormattedDate}</>;
}
