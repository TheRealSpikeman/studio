// src/services/documentationService.ts
'use client';

import { MOCK_DOCUMENTATION_PAGES } from '@/lib/data/documentation-data';
import type { DocumentationPage, ContentBlock } from '@/types';

// This service is now simplified to work with an empty data source
// to save space and resolve build issues.

/**
 * Fetches a single documentation page by its ID.
 * @param {string} id - The ID of the documentation page to fetch.
 * @returns {Promise<DocumentationPage | null>} A promise that resolves to null.
 */
export const getDocumentationPage = async (id: string): Promise<DocumentationPage | null> => {
  const pages = MOCK_DOCUMENTATION_PAGES;
  const page = pages.find(p => p.id === id);
  return page || null;
};

/**
 * Updates a documentation page's content. This is a mock function.
 * @param {string} id - The ID of the page to update.
 * @param {ContentBlock[]} content - The new content for the page.
 * @returns {Promise<DocumentationPage | null>} A promise that resolves to null.
 */
export const updateDocumentationPage = async (id: string, content: ContentBlock[]): Promise<DocumentationPage | null> => {
    // This is a mock implementation and does not persist changes.
    const pageIndex = MOCK_DOCUMENTATION_PAGES.findIndex(p => p.id === id);
    if (pageIndex !== -1) {
       // In a real scenario, you'd update the data source.
       // For this mock, we don't modify the empty array.
       return { ...MOCK_DOCUMENTATION_PAGES[pageIndex], content };
    }
    // Handle creating a new page if the ID doesn't exist (for AI docs generator)
    const newPage: DocumentationPage = { id, title: `AI Doc - ${id}`, content, metadata: { targetAudiences: ['admin'] } };
    // MOCK_DOCUMENTATION_PAGES.push(newPage); // This would grow the array in memory
    return newPage;
}


/**
 * Fetches all documentation pages.
 * @returns {Promise<DocumentationPage[]>} A promise that resolves to an empty array.
 */
export const getAllDocumentationPages = async (): Promise<DocumentationPage[]> => {
    return MOCK_DOCUMENTATION_PAGES;
}

/**
 * Extracts content blocks that are marked as FAQ questions.
 * @param {DocumentationPage} page - The documentation page to extract FAQs from.
 * @returns {ContentBlock[]} An array of content blocks that are FAQ questions.
 */
export const getFaqBlocks = (page: DocumentationPage): ContentBlock[] => {
    return page.content.filter(block => block.metadata?.faq_question);
}

// Re-export types for convenience
export type { DocumentationPage, ContentBlock };
