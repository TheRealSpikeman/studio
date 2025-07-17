// src/components/admin/user-management/FormattedDateCell.tsx
"use client";

import { useState, useEffect } from 'react';
import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns';
import { nl } from 'date-fns/locale';

interface FormattedDateCellProps {
  isoDateString?: string | { toDate: () => Date } | Date; // Accept string, Firestore-like Timestamp, or Date
  dateFormatPattern?: 'P' | 'Pp' | string;
  formatAs?: 'relative' | 'absolute';
}

export function FormattedDateCell({ 
  isoDateString, 
  dateFormatPattern = 'P',
  formatAs = 'absolute' 
}: FormattedDateCellProps) {
  const [clientFormattedDate, setClientFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    if (isoDateString) {
      try {
        let date: Date;

        if (typeof isoDateString === 'string') {
          date = parseISO(isoDateString);
        } else if (typeof isoDateString === 'object' && 'toDate' in isoDateString && typeof isoDateString.toDate === 'function') {
          // Handle Firestore Timestamp-like objects
          date = isoDateString.toDate();
        } else if (isoDateString instanceof Date) {
          // Handle cases where it's already a Date object
          date = isoDateString;
        } else {
          throw new Error('Unsupported date format');
        }
        
        if (!isValid(date)) {
            throw new Error('Invalid date provided');
        }

        if (formatAs === 'relative') {
          setClientFormattedDate(formatDistanceToNow(date, { addSuffix: true, locale: nl }));
        } else {
          setClientFormattedDate(format(date, dateFormatPattern, { locale: nl }));
        }
      } catch (e) {
        console.error("Failed to format date:", e, "Input was:", isoDateString);
        setClientFormattedDate("-");
      }
    } else {
      setClientFormattedDate("-");
    }
  }, [isoDateString, dateFormatPattern, formatAs]);

  if (clientFormattedDate === null) {
    return <span className="text-xs text-muted-foreground">-</span>; 
  }

  return <>{clientFormattedDate}</>;
}
