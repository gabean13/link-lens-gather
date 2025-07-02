
import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Tag, Calendar, Eye, BookOpen, Clock, Sparkles, Filter, User, TrendingUp, Heart, Zap, Star, Coffee, Bookmark } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AddLinkForm } from './AddLinkForm';
import { LinkCard } from './LinkCard';
import { SmartRecommendations } from './SmartRecommendations';
import { toast } from 'sonner';

interface PersonalArchiveProps {
  links: any[];
  onAddLink: (link: any) => void;
}

export function PersonalArchive({ links, onAddLink }: PersonalArchiveProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFAB, setShowFAB] = useState(true);
  const [archiveView, setArchiveView] = useState<'all' | 'unread' | 'recent' | 'frequent' | 'today-pick'>('all');
  const [linkPreview, setLinkPreview] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Mock user data
  const userName = "김코딩";
  const thisWeekLinks = links.filter(link => {
    const linkDate = new Date(link.addedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return linkDate > weekAgo;
  }).length;

  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));
  const mostUsedTag = allTags.length > 0 ? allTags[0] : '없음';
  
  // 스마트 분류 로직
  const smartCategories = useMemo(() => {
    const categories = {
      recent: links.filter(link => {
        const linkDate = new Date(link.addedAt);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return linkDate > threeDaysAgo;
      }),
      unread: links.filter(link => !link.isRead),
      frequent: links.filter(link => link.readCount && link.readCount > 2), // 2번 이상 읽은 링크
      todayPick: links.slice().sort(() => Math.random() - 0.5).slice(0, 6), // 랜덤 추천
    };

    return categories;
  }, [links]);

  // URL 미리보기 자동 생성
  const handleUrlInput = async (url: string) => {
    if (!url.startsWith('http')) return;
    
    setIsPreviewLoading(true);
    
    // Mock preview generation
    setTimeout(() => {
      const mockPreview = {
        title: 'React 최신 가이드 - 2024 완전판',
        description: '최신 React 개발 패턴과 모범 사례를 정리한 완전한 가이드입니다.',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
        favicon: '⚛️'
      };
      setLinkPreview(mockPreview);
      setIsPreviewLoading(false);
    }, 1000);
  };

  const getFilteredLinks = () => {
    let filtered = links;
    
    switch (archiveView) {
      case 'unread':
        filtered = smartCategories.unread;
        break;
      case 'recent':
        filtered = smartCategories.recent;
        break;
      case 'frequent':
        filtered = smartCategories.frequent;
        break;
      case 'today-pick':
        filtered = smartCategories.todayPick;
        break;
      default:
        filtered = links;
    }
    
    if (searchTerm && !searchTerm.startsWith('http')) {
      filtered = filtered.filter(link => 
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredLinks = getFilteredLinks();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.startsWith('http')) {
      // URL이면 바로 미리보기 생성
      handleUrlInput(searchTerm);
    }
  };

  const handleQuickAdd = () => {
    if (searchTerm.startsWith('http') && linkPreview) {
      const newLink = {
        ...linkPreview,
        url: searchTerm,
        tags: ['새로저장'],
        addedAt: new Date().toISOString(),
        isRead: false,
        id: Date.now().toString()
      };
      onAddLink(newLink);
      setSearchTerm('');
      setLinkPreview(null);
      toast.success('링크가 즉시 저장되었어요! ⚡️');
    }
  };

  const unreadCount = smartCategories.unread.length;
  const recentCount = smartCategories.recent.length;
  const frequentCount = smartCategories.frequent.length;

  // AI 추천 링크 (사용자의 태그 기반)
  const aiRecommendedLinks = links.filter(link => 
    link.tags.includes(mostUsedTag) && !link.isRead
  ).slice(0, 3);

  return (
    <div className="space-y-8 relative">
      {/* 개인화된 환영 메시지 */}
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{userName}님, 안녕하세요! 👋</h1>
            <p className="text-gray-600">오늘도 새로운 영감을 발견해 보세요!</p>
          </div>
        </div>

        {/* 개인화 대시보드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{thisWeekLinks}개</div>
              <div className="text-sm text-blue-600">이번 주 저장한 링크</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">#{mostUsedTag}</div>
              <div className="text-sm text-green-600">가장 많이 사용하는 태그</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{links.length}개</div>
              <div className="text-sm text-purple-600">총 보관 중인 링크</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 강화된 링크 추가 영역 */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8 rounded-3xl border-2 border-pink-200 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-pink-500" />
            새로운 링크를 저장해보세요!
          </h2>
          <p className="text-gray-600">URL을 붙여넣으면 자동으로 미리보기가 생성됩니다 ✨</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-6 h-6" />
              <Input
                placeholder="https://example.com (링크를 붙여넣어 보세요!)"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.startsWith('http')) {
                    handleUrlInput(e.target.value);
                  } else {
                    setLinkPreview(null);
                  }
                }}
                className="pl-14 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-pink-300 focus:border-pink-400 rounded-2xl text-lg shadow-sm"
              />
            </div>
            {searchTerm.startsWith('http') && linkPreview && (
              <Button
                type="button"
                onClick={handleQuickAdd}
                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-2xl px-8 py-4 font-bold shadow-lg transform hover:scale-105 transition-all"
              >
                <Zap className="w-5 h-5 mr-2" />
                즉시 저장!
              </Button>
            )}
          </div>

          {/* 인터랙티브 링크 미리보기 */}
          {isPreviewLoading && (
            <Card className="bg-white/80 border-2 border-pink-200 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-pink-600 font-medium">링크 정보를 가져오는 중...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {linkPreview && (
            <Card className="bg-white/90 border-2 border-green-200 rounded-2xl shadow-md">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={linkPreview.image} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{linkPreview.favicon}</span>
                      <h3 className="font-bold text-gray-800 line-clamp-1">{linkPreview.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{linkPreview.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>

      {/* AI 추천 섹션을 메인으로 이동 */}
      {aiRecommendedLinks.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{userName}님을 위한 맞춤 링크 💝</h2>
              <p className="text-sm text-gray-600">AI가 선별한 당신만의 특별한 콘텐츠</p>
            </div>
            <Badge className="bg-green-100 text-green-700 rounded-full font-bold">
              AI 추천
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aiRecommendedLinks.map(link => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        </section>
      )}

      {/* 잡지 스타일 분류 탭 */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={archiveView === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('all')}
          className={`rounded-full ${archiveView === 'all' ? "bg-pink-500 text-white" : "border-gray-300 hover:bg-pink-50"}`}
        >
          📋 전체 ({links.length})
        </Button>
        <Button
          variant={archiveView === 'unread' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('unread')}
          className={`rounded-full ${archiveView === 'unread' ? "bg-orange-500 text-white" : "border-orange-300 hover:bg-orange-50"}`}
        >
          📖 안 읽음 ({unreadCount})
        </Button>
        <Button
          variant={archiveView === 'recent' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('recent')}
          className={`rounded-full ${archiveView === 'recent' ? "bg-blue-500 text-white" : "border-blue-300 hover:bg-blue-50"}`}
        >
          ⏰ 최근 ({recentCount})
        </Button>
        <Button
          variant={archiveView === 'frequent' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('frequent')}
          className={`rounded-full ${archiveView === 'frequent' ? "bg-purple-500 text-white" : "border-purple-300 hover:bg-purple-50"}`}
        >
          ⭐ 자주 읽음 ({frequentCount})
        </Button>
        <Button
          variant={archiveView === 'today-pick' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('today-pick')}
          className={`rounded-full ${archiveView === 'today-pick' ? "bg-green-500 text-white" : "border-green-300 hover:bg-green-50"}`}
        >
          ☕ 오늘은 이 포스트 어때요? (6)
        </Button>
      </div>

      {/* 링크 리스트 */}
      {filteredLinks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      ) : (
        /* 빈 상태 디자인 */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BookOpen className="w-12 h-12 text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">아직 저장된 링크가 없네요!</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            첫 번째 링크를 저장하고 나만의 아카이브를 만들어보세요! 
            위의 검색창에 URL을 붙여넣기만 하면 됩니다 ✨
          </p>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-full px-8 py-3 font-bold text-lg shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            첫 링크 저장하기! 🚀
          </Button>
        </div>
      )}

      {/* 플로팅 액션 버튼 (FAB) */}
      {showFAB && (
        <Button
          onClick={() => setShowAddDialog(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 z-50"
        >
          <Plus className="w-8 h-8 text-white" />
        </Button>
      )}

      {/* 링크 추가 다이얼로그 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">✨ 새로운 링크 추가하기</DialogTitle>
          </DialogHeader>
          <AddLinkForm 
            onSubmit={(newLink) => {
              onAddLink(newLink);
              setShowAddDialog(false);
            }}
            initialUrl=""
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
