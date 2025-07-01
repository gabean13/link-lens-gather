
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface AddLinkFormProps {
  onSubmit: (link: any) => void;
}

export function AddLinkForm({ onSubmit }: AddLinkFormProps) {
  const [url, setUrl] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock AI analysis
  const analyzeUrl = async (inputUrl: string) => {
    setIsAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock analysis based on URL patterns
    let mockTags: string[] = [];
    let mockTitle = 'Untitled Link';
    let mockDescription = 'No description available';
    let mockImage = `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop`;
    
    if (inputUrl.includes('github')) {
      mockTags = ['Development', 'Code', 'Repository'];
      mockTitle = 'GitHub Repository - Awesome Project';
      mockDescription = 'A comprehensive guide to modern web development practices and tools.';
    } else if (inputUrl.includes('medium') || inputUrl.includes('blog')) {
      mockTags = ['Article', 'Blog', 'Reading'];
      mockTitle = 'How to Build Better Web Applications';
      mockDescription = 'Learn the best practices for creating modern, scalable web applications.';
    } else if (inputUrl.includes('youtube')) {
      mockTags = ['Video', 'Tutorial', 'Learning'];
      mockTitle = 'Complete React Tutorial for Beginners';
      mockDescription = 'A comprehensive video tutorial covering React fundamentals and advanced concepts.';
    } else if (inputUrl.includes('job') || inputUrl.includes('career')) {
      mockTags = ['Jobs', 'Career', 'Opportunity'];
      mockTitle = 'Frontend Developer Position - TechCorp';
      mockDescription = 'Exciting opportunity for a frontend developer at a growing tech company.';
    } else {
      mockTags = ['General', 'Web', 'Resource'];
      mockTitle = 'Useful Web Resource';
      mockDescription = 'A helpful resource for web development and design.';
    }
    
    setSuggestedTags(mockTags);
    setIsAnalyzing(false);
    
    return {
      title: mockTitle,
      description: mockDescription,
      image: mockImage,
      tags: mockTags
    };
  };

  const handleUrlAnalysis = async () => {
    if (!url.trim()) return;
    
    try {
      const analysis = await analyzeUrl(url);
      toast.success('URL analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze URL');
    }
  };

  const addCustomTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string, isCustom: boolean) => {
    if (isCustom) {
      setCustomTags(customTags.filter(t => t !== tag));
    } else {
      setSuggestedTags(suggestedTags.filter(t => t !== tag));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Get analysis data or use current state
    let analysisData;
    if (suggestedTags.length === 0) {
      analysisData = await analyzeUrl(url);
    } else {
      analysisData = {
        title: 'Saved Link',
        description: 'Link saved successfully',
        image: `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop`,
        tags: suggestedTags
      };
    }

    const newLink = {
      ...analysisData,
      url: url.trim(),
      tags: [...suggestedTags, ...customTags],
      addedAt: new Date().toISOString(),
      isRead: false
    };

    onSubmit(newLink);
    toast.success('Link added successfully!');
    
    // Reset form
    setUrl('');
    setCustomTags([]);
    setSuggestedTags([]);
    setNewTag('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <div className="flex gap-2">
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleUrlAnalysis}
            disabled={!url.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {isAnalyzing && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Analyzing URL content...
          </div>
        </div>
      )}

      {suggestedTags.length > 0 && (
        <div className="space-y-2">
          <Label>Suggested Tags</Label>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-green-50 text-green-700 border-green-200 cursor-pointer hover:bg-green-100"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag, false)}
                  className="ml-1 hover:text-green-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Custom Tags</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add custom tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addCustomTag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {customTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {customTags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag, true)}
                  className="ml-1 hover:text-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
        >
          Add Link
        </Button>
      </div>
    </form>
  );
}
