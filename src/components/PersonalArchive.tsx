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
  onDeleteLink?: (linkId: string) => void;
  currentMenu?: string;
}

export function PersonalArchive({ links, onAddLink, onDeleteLink, currentMenu = 'home' }: PersonalArchiveProps) {
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

  // 실제 URL 분석 함수
  const analyzeUrl = async (inputUrl: string) => {
    setIsPreviewLoading(true);
    
    try {
      // 실제 서비스에서는 백엔드 API를 호출하거나 외부 서비스를 사용
      // 여기서는 URL 패턴 기반으로 더 정교한 분석 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockData = {
        title: '링크 제목',
        description: '링크 설명',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
        tags: ['일반']
      };

      const domain = new URL(inputUrl).hostname.toLowerCase();
      
      if (domain.includes('github')) {
        mockData = {
          title: 'GitHub Repository - React 프로젝트',
          description: 'React로 만든 현대적인 웹 애플리케이션 프로젝트입니다. TypeScript와 Tailwind CSS를 사용했습니다.',
          image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=200&fit=crop',
          tags: ['개발', '코드', 'React']
        };
      } else if (domain.includes('youtube')) {
        mockData = {
          title: 'React 튜토리얼 - 초보자를 위한 완벽 가이드',
          description: 'React 기초부터 실전까지! 현직 개발자가 알려주는 실무 노하우까지 담은 완벽한 튜토리얼입니다.',
          image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
          tags: ['동영상', '튜토리얼', '학습']
        };
      } else if (domain.includes('medium') || domain.includes('blog') || domain.includes('tistory') || domain.includes('velog')) {
        mockData = {
          title: '웹 개발의 미래: 2024년 트렌드 분석',
          description: '최신 웹 개발 동향과 기술 스택, 그리고 개발자가 알아야 할 핵심 트렌드를 정리했습니다.',
          image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop',
          tags: ['기사', '블로그', '트렌드']
        };
      } else if (domain.includes('stackoverflow')) {
        mockData = {
          title: 'React Hook useState 사용법 - Stack Overflow',
          description: 'React useState Hook의 올바른 사용법과 일반적인 실수들에 대한 질문과 답변입니다.',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
          tags: ['개발', 'Q&A', 'React']
        };
      } else if (domain.includes('figma') || domain.includes('behance') || domain.includes('dribbble')) {
        mockData = {
          title: '모던 UI 디자인 시스템 - 2024',
          description: '클린하고 현대적인 UI/UX 디자인 시스템과 컴포넌트 라이브러리입니다.',
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
          tags: ['디자인', 'UI', 'UX']
        };
      } else if (domain.includes('news') || domain.includes('techcrunch') || domain.includes('아이뉴스24')) {
        mockData = {
          title: 'AI 기술의 새로운 전망, 2024년 주목할 트렌드',
          description: '인공지능 기술의 최신 동향과 산업에 미치는 영향, 그리고 미래 전망을 분석한 기사입니다.',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
          tags: ['뉴스', 'AI', '기술']
        };
      }

      setLinkPreview(mockData);
      setIsPreviewLoading(false);
      return mockData;
    } catch (error) {
      setIsPreviewLoading(false);
      toast.error('URL 분석에 실패했어요');
      return null;
    }
  };

  const handleUrlInput = async (url: string) => {
    if (!url.startsWith('http')) return;
    await analyzeUrl(url);
  };

  // 태그나 폴더별 필터링 로직
  const getFilteredLinks = () => {
    let filtered = links;
    
    // 현재 메뉴에 따른 필터링
    if (currentMenu.startsWith('tag:')) {
      const tagName = currentMenu.replace('tag:', '');
      filtered = links.filter(link => link.tags.includes(tagName));
    } else if (currentMenu.startsWith('folder:')) {
      const folderName = currentMenu.replace('folder:', '');
      filtered = links.filter(link => link.folder === folderName);
    }
    
    // 아카이브 뷰에 따른 추가 필터링
    switch (archiveView) {
      case 'unread':
        filtered = filtered.filter(link => !link.isRead);
        break;
      case 'recent':
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        filtered = filtered.filter(link => new Date(link.addedAt) > threeDaysAgo);
        break;
      case 'frequent':
        filtered = filtered.filter(link => link.readCount && link.readCount > 2);
        break;
      case 'today-pick':
        filtered = filtered.slice().sort(() => Math.random() - 0.5).slice(0, 6);
        break;
      default:
        // 'all'의 경우 이미 태그/폴더 필터링만 적용됨
        break;
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
      handleUrlInput(searchTerm);
    }
  };

  const handleQuickAdd = async () => {
    if (searchTerm.startsWith('http')) {
      let analysisData = linkPreview;
      if (!analysisData) {
        analysisData = await analyzeUrl(searchTerm);
      }
      
      if (analysisData) {
        const newLink = {
          ...analysisData,
          url: searchTerm,
          addedAt: new Date().toISOString(),
          isRead: false,
          id: Date.now().toString(),
          folder: currentMenu.startsWith('folder:') ? currentMenu.replace('folder:', '') : undefined
        };
        onAddLink(newLink);
        setSearchTerm('');
        setLinkPreview(null);
        toast.success('링크가 즉시 저장되었어요! ⚡️');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error('URL을 입력해 주세요! 🔗');
      return;
    }

    if (searchTerm.startsWith('http')) {
      await handleQuickAdd();
    }
  };

  const unreadCount = smartCategories.unread.length;
  const recentCount = smartCategories.recent.length;
  const frequentCount = smartCategories.frequent.length;

  // AI 추천 링크 (사용자의 태그 기반)
  const aiRecommendedLinks = links.filter(link => 
    link.tags.includes(mostUsedTag) && !link.isRead
  ).slice(0, 3);

  // 현재 선택된 태그나 폴더 제목 표시
  const getCurrentMenuTitle = () => {
    if (currentMenu.startsWith('tag:')) {
      return `#${currentMenu.replace('tag:', '')} 태그`;
    } else if (currentMenu.startsWith('folder:')) {
      return `📁 ${currentMenu.replace('folder:', '')} 폴더`;
    }
    return '전체 링크';
  };

  return (
    <div className="space-y-8 relative">
      {/* 간단한 환영 메시지 */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">링크 아카이브 📚</h1>
        <p className="text-gray-600">소중한 링크들을 체계적으로 관리해보세요</p>
      </div>

      {/* 강화된 링크 추가 영역 */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8 rounded-3xl border-2 border-pink-200 shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-pink-400" />
            새로운 링크를 저장해보세요!
          </h2>
          <p className="text-gray-600">URL을 붙여넣으면 자동으로 미리보기가 생성됩니다 ✨</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  <span className="text-pink-600 font-medium">링크 정보를 분석하는 중...</span>
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
                      <h3 className="font-bold text-gray-800 line-clamp-1">{linkPreview.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{linkPreview.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {linkPreview.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>

      {/* AI 추천 섹션 */}
      {aiRecommendedLinks.length > 0 && currentMenu === 'home' && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">맞춤 추천 링크 💝</h2>
              <p className="text-sm text-gray-600">AI가 선별한 특별한 콘텐츠</p>
            </div>
            <Badge className="bg-green-100 text-green-700 rounded-full font-bold">
              AI 추천
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aiRecommendedLinks.map(link => (
              <LinkCard key={link.id} link={link} onDelete={onDeleteLink} />
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
          📋 전체 ({getFilteredLinks().length})
        </Button>
        <Button
          variant={archiveView === 'unread' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('unread')}
          className={`rounded-full ${archiveView === 'unread' ? "bg-orange-500 text-white" : "border-orange-300 hover:bg-orange-50"}`}
        >
          📖 안 읽음 ({currentMenu === 'home' ? unreadCount : filteredLinks.filter(l => !l.isRead).length})
        </Button>
        <Button
          variant={archiveView === 'recent' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('recent')}
          className={`rounded-full ${archiveView === 'recent' ? "bg-blue-500 text-white" : "border-blue-300 hover:bg-blue-50"}`}
        >
          ⏰ 최근 ({currentMenu === 'home' ? recentCount : filteredLinks.filter(l => {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            return new Date(l.addedAt) > threeDaysAgo;
          }).length})
        </Button>
        <Button
          variant={archiveView === 'frequent' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('frequent')}
          className={`rounded-full ${archiveView === 'frequent' ? "bg-purple-500 text-white" : "border-purple-300 hover:bg-purple-50"}`}
        >
          ⭐ 자주 읽음 ({currentMenu === 'home' ? frequentCount : filteredLinks.filter(l => l.readCount && l.readCount > 2).length})
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
            <LinkCard key={link.id} link={link} onDelete={onDeleteLink} />
          ))}
        </div>
      ) : (
        /* 빈 상태 디자인 */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BookOpen className="w-12 h-12 text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {currentMenu === 'home' ? '아직 저장된 링크가 없네요!' : `${getCurrentMenuTitle()}에 저장된 링크가 없어요`}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            {currentMenu === 'home' 
              ? '첫 번째 링크를 저장하고 나만의 아카이브를 만들어보세요! 위의 검색창에 URL을 붙여넣기만 하면 됩니다 ✨'
              : '이 카테고리에 링크를 저장해보세요!'
            }
          </p>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-full px-8 py-3 font-bold text-lg shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            링크 저장하기! 🚀
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
              const linkWithFolder = {
                ...newLink,
                folder: currentMenu.startsWith('folder:') ? currentMenu.replace('folder:', '') : undefined
              };
              onAddLink(linkWithFolder);
              setShowAddDialog(false);
            }}
            initialUrl=""
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
