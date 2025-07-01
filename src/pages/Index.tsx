import { useState } from 'react';
import { Plus, Search, User, Share2, Tag, ExternalLink, Clock, Bookmark, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar';
import { AddLinkForm } from '@/components/AddLinkForm';
import { LinkCard } from '@/components/LinkCard';
import { FriendsPanel } from '@/components/FriendsPanel';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { mockLinks } from '@/data/mockData';
import { WeeklyTopLinks } from '@/components/WeeklyTopLinks';
import { CollectionsPanel } from '@/components/CollectionsPanel';

const Index = () => {
  const [links, setLinks] = useState(mockLinks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [currentView, setCurrentView] = useState<'all' | 'popular' | 'friends' | 'unread' | 'recent'>('all');

  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));
  
  const getFilteredLinks = () => {
    let filtered = links;
    
    // 뷰별 필터링
    switch (currentView) {
      case 'popular':
        filtered = links.slice().sort(() => Math.random() - 0.5).slice(0, 8); // 임시로 랜덤 정렬
        break;
      case 'friends':
        filtered = links.filter(link => link.tags.includes('추천') || Math.random() > 0.5).slice(0, 6);
        break;
      case 'unread':
        filtered = links.filter(link => !link.isRead);
        break;
      case 'recent':
        filtered = links.slice().sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).slice(0, 10);
        break;
      default:
        filtered = links;
    }
    
    // 검색 필터링
    if (searchTerm) {
      filtered = filtered.filter(link => 
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 태그 필터링
    if (selectedTags.length > 0) {
      filtered = filtered.filter(link => 
        selectedTags.some(tag => link.tags.includes(tag))
      );
    }
    
    return filtered;
  };

  const filteredLinks = getFilteredLinks();

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
  const todayCount = links.filter(link => {
    const today = new Date();
    const linkDate = new Date(link.addedAt);
    return linkDate.toDateString() === today.toDateString();
  }).length;

  const getViewTitle = () => {
    switch (currentView) {
      case 'popular': return '인기 링크 🔥';
      case 'friends': return '친구들의 링크 👫';
      case 'unread': return '안 읽은 링크 📚';
      case 'recent': return '최근 링크 ⏰';
      default: return '모든 링크 📋';
    }
  };

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

      {/* Navigation Menu */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Menubar className="bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-2xl shadow-sm">
          <MenubarMenu>
            <MenubarTrigger 
              className={`rounded-xl transition-all ${currentView === 'all' ? 'bg-pink-100 text-pink-700' : 'hover:bg-pink-50'}`}
              onClick={() => setCurrentView('all')}
            >
              📋 전체보기
            </MenubarTrigger>
          </MenubarMenu>
          
          <MenubarMenu>
            <MenubarTrigger className="rounded-xl hover:bg-pink-50">🔥 인기 콘텐츠</MenubarTrigger>
            <MenubarContent className="bg-white/95 backdrop-blur-sm rounded-2xl border-pink-200 shadow-lg">
              <MenubarItem 
                className="rounded-xl"
                onClick={() => setCurrentView('popular')}
              >
                <Sparkles className="w-4 h-4 mr-2 text-orange-500" />
                전체 인기 링크
              </MenubarItem>
              <MenubarSeparator />
              {allTags.slice(0, 5).map(tag => (
                <MenubarItem 
                  key={tag}
                  className="rounded-xl"
                  onClick={() => {
                    setSelectedTags([tag]);
                    setCurrentView('all');
                  }}
                >
                  <Tag className="w-4 h-4 mr-2 text-purple-500" />
                  #{tag} 인기글
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger 
              className={`rounded-xl transition-all ${currentView === 'friends' ? 'bg-pink-100 text-pink-700' : 'hover:bg-pink-50'}`}
              onClick={() => setCurrentView('friends')}
            >
              👫 친구들 링크
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="rounded-xl hover:bg-pink-50">📚 내 컬렉션</MenubarTrigger>
            <MenubarContent className="bg-white/95 backdrop-blur-sm rounded-2xl border-pink-200 shadow-lg">
              <MenubarItem 
                className="rounded-xl"
                onClick={() => setCurrentView('unread')}
              >
                <Bookmark className="w-4 h-4 mr-2 text-orange-500" />
                안 읽은 링크 ({unreadCount})
              </MenubarItem>
              <MenubarItem 
                className="rounded-xl"
                onClick={() => setCurrentView('recent')}
              >
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                최근 추가한 링크
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className="rounded-xl">
                <Heart className="w-4 h-4 mr-2 text-pink-500" />
                좋아요 한 링크
              </MenubarItem>
              <MenubarItem className="rounded-xl">
                <Share2 className="w-4 h-4 mr-2 text-green-500" />
                공유한 링크
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="rounded-xl hover:bg-pink-50">⚡ 스마트 기능</MenubarTrigger>
            <MenubarContent className="bg-white/95 backdrop-blur-sm rounded-2xl border-pink-200 shadow-lg">
              <MenubarItem className="rounded-xl">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                AI 추천 링크
              </MenubarItem>
              <MenubarItem className="rounded-xl">
                <ExternalLink className="w-4 h-4 mr-2 text-indigo-500" />
                비슷한 링크 찾기
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className="rounded-xl">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                읽기 시간 예측
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger 
              className="rounded-xl hover:bg-pink-50"
              onClick={() => setShowCollections(true)}
            >
              👥 컬렉션 & 소셜
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-2">
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
              <div className="text-2xl font-bold text-blue-600 mb-1">{todayCount}</div>
              <div className="text-sm text-blue-700 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                오늘 추가
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

        {/* 주간 인기 링크 섹션 추가 */}
        <div className="mb-6">
          <WeeklyTopLinks />
        </div>

        {/* Content Section */}
        {currentView === 'all' ? (
          <SmartRecommendations links={filteredLinks} />
        ) : (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{getViewTitle()}</h2>
              <Badge className="bg-pink-100 text-pink-700 rounded-full">
                {filteredLinks.length}개
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLinks.map(link => (
                <LinkCard key={link.id} link={link} />
              ))}
            </div>
          </section>
        )}

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
                setCurrentView('all');
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

      {/* Collections Panel */}
      {showCollections && (
        <CollectionsPanel onClose={() => setShowCollections(false)} />
      )}
    </div>
  );
};

export default Index;
