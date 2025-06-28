// This component is obsolete. It caused findDOMNode errors with Next.js SSR.
// The new approach is to generate HTML directly with the AI and use a standard <Textarea>
// in the admin forms for editing. The public-facing blog page will use DOMPurify to
// safely render the HTML content. This is a more stable and robust solution.
// This file can be safely deleted.
