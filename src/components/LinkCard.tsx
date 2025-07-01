
import { useState } from 'react';
import { ExternalLink, Clock, Share2, Eye, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface LinkCardProps {
  link: {
    id: string;
    title: string;
    description: string;
    url: string;
    tags: string[];
    image: string;
    addedAt: string;
    isRead: boolean;
  };
}

export function LinkCard({ link }: LinkCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(link.url);
    toast.success('Link copied to clipboard!');
  };

  const handleViewContent = () => {
    setShowPreview(true);
  };

  return (
    <>
      <Card className="group bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {link.description}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleViewContent}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(link.url, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          {link.image && (
            <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={link.image}
                alt={link.title}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mb-3">
            {link.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(link.addedAt).toLocaleDateString()}
            </div>
            
            <div className="flex items-center gap-2">
              {!link.isRead && (
                <Badge variant="outline" className="text-xs px-2 py-0 text-orange-600 border-orange-200">
                  New
                </Badge>
              )}
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewContent}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                >
                  <Eye className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                >
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{link.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(link.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {link.image && (
              <img
                src={link.image}
                alt={link.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            
            <div className="flex flex-wrap gap-2">
              {link.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {link.description}
              </p>
              
              {/* Simulated content preview */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Content Preview</h4>
                <p className="text-sm text-gray-600">
                  This is a simulated preview of the article content. In a real implementation, 
                  this would show the actual scraped content from the URL, formatted and displayed 
                  for easy reading without leaving the app.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
