// src/services/changelogService.ts
'use server';

import type { ChangelogEntry } from '@/types/changelog';
import { initialChangelogEntries } from '@/lib/data/initial-changelog';

// This service is now simplified to return an empty array,
// as the large static data has been removed to save space.

/**
 * Fetches all changelog entries.
 * Returns an empty array as the data source has been cleared.
 * @returns {Promise<ChangelogEntry[]>} A promise that resolves to an empty array.
 */
export const getChangelogEntries = async (): Promise<ChangelogEntry[]> => {
  // Directly return an empty array to reflect the cleared data source.
  return Promise.resolve([]);
};

// The service object for consistency, though it's now simplified.
export const changelogService = {
  getChangelogEntries,
};
