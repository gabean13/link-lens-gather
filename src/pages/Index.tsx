
import { useState } from 'react';
import { Plus, Search, User, Share2, Tag, ExternalLink, Clock, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddLinkForm } from '@/components/AddLinkForm';
import { LinkCard } from '@/components/LinkCard';
import { FriendsPanel } from '@/components/FriendsPanel';
import { mockLinks } from '@/data/mockData';

const Index = () => {
  const [links, setLinks] = useState(mockLinks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFriends, setShowFriends] = useState(false);

  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));
  
  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || link.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleAddLink = (newLink: any) => {
    setLinks(prev => [{ ...newLink, id: Date.now().toString() }, ...prev]);
    setShowAddDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">LinkKeeper</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFriends(!showFriends)}
                className="text-gray-600 hover:text-gray-900"
              >
                <User className="w-4 h-4" />
              </Button>
              
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Link
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Link</DialogTitle>
                  </DialogHeader>
                  <AddLinkForm onSubmit={handleAddLink} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search your links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-300"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
              className={selectedTag === null ? "bg-gray-900 text-white" : ""}
            >
              All
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={selectedTag === tag ? "bg-blue-500 text-white" : "border-gray-200"}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{links.length}</div>
              <div className="text-sm text-gray-600">Total Links</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{allTags.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">This Week</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Unread</div>
            </CardContent>
          </Card>
        </div>

        {/* Links Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>

        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links found</h3>
            <p className="text-gray-600">Try adjusting your search or add some new links.</p>
          </div>
        )}
      </div>

      {/* Friends Panel */}
      {showFriends && (
        <FriendsPanel onClose={() => setShowFriends(false)} />
      )}
    </div>
  );
};

export default Index;
