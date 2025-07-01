
import { useState } from 'react';
import { Plus, Search, User, Share2, Tag, ExternalLink, Clock, Bookmark, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddLinkForm } from '@/components/AddLinkForm';
import { LinkCard } from '@/components/LinkCard';
import { FriendsPanel } from '@/components/FriendsPanel';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { mockLinks } from '@/data/mockData';

const Index = () => {
  const [links, setLinks] = useState(mockLinks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFriends, setShowFriends] = useState(false);

  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));
  
  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => link.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleAddLink = (newLink: any) => {
    setLinks(prev => [{ ...newLink, id: Date.now().toString() }, ...prev]);
    setShowAddDialog(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const unreadCount = links.filter(link => !link.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">링크포켓</h1>
                <p className="text-xs text-gray-500">나만의 링크 보관함 💝</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFriends(!showFriends)}
                className="text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full"
              >
                <User className="w-4 h-4" />
              </Button>
              
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-full shadow-lg">
                    <Plus className="w-4 h-4 mr-1" />
                    링크 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-center text-lg">✨ 새로운 링크 추가하기</DialogTitle>
                  </DialogHeader>
                  <AddLinkForm onSubmit={handleAddLink} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="어떤 링크를 찾고 계신가요? 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-pink-300 rounded-2xl text-base shadow-sm"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-pink-500" />
            태그로 찾기 (다중 선택 가능!)
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTags.length === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTags([])}
              className={`rounded-full ${selectedTags.length === 0 ? "bg-pink-500 text-white shadow-md" : "border-gray-300 hover:bg-pink-50"}`}
            >
              전체 ({links.length})
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className={`rounded-full transition-all ${
                  selectedTags.includes(tag) 
                    ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md transform scale-105" 
                    : "border-gray-300 hover:bg-pink-50 hover:border-pink-300"
                }`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              선택된 태그: {selectedTags.join(', ')} 
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTags([])}
                className="ml-2 text-xs h-6 px-2 text-pink-600 hover:bg-pink-50"
              >
                전체 해제
              </Button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-pink-100 to-pink-50 border-pink-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-600 mb-1">{links.length}</div>
              <div className="text-sm text-pink-700 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3" />
                전체 링크
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{allTags.length}</div>
              <div className="text-sm text-purple-700 flex items-center justify-center gap-1">
                <Tag className="w-3 h-3" />
                카테고리
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">5</div>
              <div className="text-sm text-blue-700 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                이번 주
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">{unreadCount}</div>
              <div className="text-sm text-orange-700 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                안 읽음
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Recommendations */}
        <SmartRecommendations links={filteredLinks} />

        {/* No Results */}
        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Search className="w-10 h-10 text-pink-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">앗, 찾는 링크가 없어요!</h3>
            <p className="text-gray-600 mb-4">검색어나 태그를 바꿔서 다시 찾아보세요 🤔</p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedTags([]);
              }}
              className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-full"
            >
              전체 링크 보기
            </Button>
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
