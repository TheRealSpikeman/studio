"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heading2, MessageSquareText, Info, Code2, List, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentationPage } from '@/services/documentationService'; // Import the update function
import type { ContentBlock } from '@/services/documentationService'; // Import ContentBlock type


type TargetAudience = 'ouder' | 'leerling' | 'tutor' | 'coach' | 'admin' | 'public';

// Reusing BlockEditor for displaying generated content (read-only for now)
const BlockEditor = ({ block }: { block: ContentBlock }) => { // Use ContentBlock type
  switch (block.type) {
    case 'heading':
      return <h3 className="text-xl font-semibold mt-4">{block.content}</h3>;
    case 'paragraph':
      return <p className="mt-2">{block.content}</p>;
    case 'list':
      return (
        <ul className="list-disc pl-5 mt-2">
          {(block.content as string[]).map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      );
     case 'info':
        return <div className="p-3 mt-2 bg-blue-100 text-blue-800 rounded-md">{block.content}</div>;
    case 'code':
      return (
        <pre className="p-4 mt-2 bg-gray-100 rounded-md text-sm overflow-x-auto">
          <code>{block.content}</code>
        </pre>
      );
    default:
      return null;
  }
};


export default function AiDocsPage() {
  const [topic, setTopic] = useState('');
  const [selectedAudiences, setSelectedAudiences] = useState<TargetAudience[]>([]);
  const [generatedContent, setGeneratedContent] = useState<ContentBlock[] | null>(null); // Use ContentBlock array type
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  const handleAudienceChange = (audience: TargetAudience, isChecked: boolean) => {
    if (isChecked) {
      setSelectedAudiences([...selectedAudiences, audience]);
    } else {
      setSelectedAudiences(selectedAudiences.filter(a => a !== audience));
    }
  };

  const handleGenerate = async () => {
    if (!topic || selectedAudiences.length === 0) {
        toast({
            title: "Missing Information",
            description: "Please provide a topic and select at least one target audience.",
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/generate-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, selectedAudiences }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate documentation');
      }

      const generatedBlocks: ContentBlock[] = await response.json(); // Cast to ContentBlock array
      setGeneratedContent(generatedBlocks);
       toast({
            title: "Generation Complete",
            description: "Documentation has been generated. Please review.",
            variant: "success",
        });

    } catch (error: any) {
      console.error('Error generating documentation:', error);
       toast({
            title: "Generation Failed",
            description: error.message || "An error occurred during documentation generation.",
            variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

   const handleSave = async () => { // Make handleSave async
      if (!generatedContent || generatedContent.length === 0) {
          toast({
              title: "No Content to Save",
              description: "Generate documentation before attempting to save.",
              variant: "warning",
          });
          return;
      }

       // Determine a title for the new page (e.g., from the first heading)
       const defaultTitle = "AI Generated Documentation";
       const pageTitle = generatedContent[0]?.type === 'heading'
                         ? generatedContent[0].content as string
                         : defaultTitle;

       // Create a simple ID (you might want a more robust ID generation strategy)
       // Ensure the ID is URL-friendly and unique
       const pageId = pageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
       const uniquePageId = pageId + '-' + Date.now(); // Add timestamp for uniqueness


      try {
          // Call the documentation service to save the content
          // You might need to modify updateDocumentationPage in documentationService.ts
          // to handle creating a new page if the ID doesn't exist.
          const updatedPage = await updateDocumentationPage(uniquePageId, generatedContent); // Use uniquePageId

          if (updatedPage) {
              toast({
                  title: "Documentation Saved",
                  description: `Content saved as "${pageTitle}".`,
                  variant: "success",
              });
              setGeneratedContent(null); // Clear preview after saving (optional)
               // TODO: Redirect to the edit page of the newly saved documentation?
          } else {
               toast({
                    title: "Save Failed",
                    description: "Could not save the documentation.",
                    variant: "destructive",
                });
          }

      } catch (error) {
          console.error("Error saving documentation:", error);
           toast({
                title: "Save Failed",
                description: "An error occurred while saving the documentation.",
                variant: "destructive",
            });
      }
   };


  const availableAudiences: TargetAudience[] = ['ouder', 'leerling', 'tutor', 'coach', 'admin', 'public'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Documentation</CardTitle>
        <CardDescription>Generate new documentation content using AI.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="documentation-topic">Documentation Topic</Label>
          <Input
            id="documentation-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Customer journey for parents"
          />
        </div>

        <div className="space-y-2">
          <Label>Target Audiences</Label>
          <div className="flex flex-wrap gap-4">
            {availableAudiences.map((audience) => (
              <div key={audience} className="flex items-center space-x-2">
                <Checkbox
                  id={`audience-${audience}`}
                  checked={selectedAudiences.includes(audience)}
                  onCheckedChange={(isChecked) => handleAudienceChange(audience, isChecked as boolean)}
                />
                <Label htmlFor={`audience-${audience}`}>
                  {audience.charAt(0).toUpperCase() + audience.slice(1)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={isLoading}>
           {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                </>
            ) : (
                'Generate with AI'
            )}
        </Button>

        {/* Display generated content */}
        {generatedContent && generatedContent.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Generated Content Preview</h3>
            <div className="space-y-4">
              {generatedContent.map((block, index) => (
                <BlockEditor key={index} block={block} />
              ))}
            </div>
             <Button onClick={handleSave} className="mt-6">
                <Save className="mr-2 h-4 w-4" />
                Save Documentation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}