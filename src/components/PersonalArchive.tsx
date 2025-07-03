
import { useState, useMemo } from 'react';
import { Search, Plus, Calendar, BookOpen, Clock, Sparkles, Filter, TrendingUp, Heart, Zap, Star, Coffee, Folder, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddLinkForm } from './AddLinkForm';
import { LinkCard } from './LinkCard';
import { toast } from 'sonner';

interface PersonalArchiveProps {
  links: any[];
  onAddLink: (link: any) => void;
  onDeleteLink?: (linkId: string) => void;
  currentMenu: string;
}

export function PersonalArchive({ links, onAddLink, onDeleteLink, currentMenu }: PersonalArchiveProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [archiveView, setArchiveView] = useState<'all' | 'unread' | 'recent' | 'frequent' | 'today-pick'>('all');
  const [linkPreview, setLinkPreview] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // AI 기반 폴더 자동 분류 함수
  const categorizeByAI = (url: string, title: string, description: string): string => {
    const content = `${title} ${description}`.toLowerCase();
    const domain = new URL(url).hostname.toLowerCase();

    // 개발 관련
    if (domain.includes('github') || content.includes('코드') || content.includes('개발') || 
        content.includes('프로그래밍') || content.includes('react') || content.includes('javascript')) {
      return '개발/코딩';
    }
    
    // 디자인 관련
    if (domain.includes('figma') || domain.includes('behance') || domain.includes('dribbble') ||
        content.includes('디자인') || content.includes('ui') || content.includes('ux')) {
      return '디자인/UI-UX';
    }
    
    // 뉴스/기사
    if (domain.includes('news') || content.includes('뉴스') || content.includes('기사') || 
        content.includes('새로운') || content.includes('트렌드')) {
      return '뉴스/트렌드';
    }
    
    // 학습 자료
    if (domain.includes('youtube') || content.includes('튜토리얼') || content.includes('학습') || 
        content.includes('강의') || content.includes('배우기')) {
      return '학습/교육';
    }
    
    // 블로그/아티클
    if (domain.includes('blog') || domain.includes('medium') || domain.includes('tistory') ||
        content.includes('글') || content.includes('포스트')) {
      return '블로그/아티클';
    }
    
    // 도구/유틸리티
    if (content.includes('도구') || content.includes('툴') || content.includes('유틸') ||
        content.includes('서비스') || content.includes('사이트')) {
      return '도구/서비스';
    }
    
    return '기타';
  };

  // 향상된 링크 분석 함수
  const analyzeUrl = async (inputUrl: string) => {
    setIsPreviewLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const domain = new URL(inputUrl).hostname.toLowerCase();
      let mockData = {
        title: '링크 제목',
        description: '링크 설명',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
        tags: ['일반'],
        folder: '기타'
      };

      if (domain.includes('github')) {
        mockData = {
          title: 'React 컴포넌트 라이브러리 - 현대적인 UI 솔루션',
          description: 'TypeScript와 Tailwind CSS로 구축된 재사용 가능한 React 컴포넌트 모음입니다. 접근성과 성능을 고려하여 설계되었습니다.',
          image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=200&fit=crop',
          tags: ['React', 'TypeScript', 'UI', 'Components'],
          folder: '개발/코딩'
        };
      } else if (domain.includes('youtube')) {
        mockData = {
          title: 'React 완벽 가이드 2024 - 실전 프로젝트로 배우는 모던 개발',
          description: '초보자부터 중급자까지! Hook, Context, 상태관리까지 실무에서 바로 쓸 수 있는 React 개발 노하우를 담았습니다.',
          image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
          tags: ['React', '튜토리얼', '개발', '학습'],
          folder: '학습/교육'
        };
      } else if (domain.includes('medium') || domain.includes('blog') || domain.includes('tistory') || domain.includes('velog')) {
        mockData = {
          title: '2024년 웹 개발 트렌드: AI 시대의 프론트엔드',
          description: 'AI가 웹 개발에 미치는 영향과 최신 프레임워크, 도구들을 분석합니다. 개발자가 알아야 할 핵심 트렌드를 정리했습니다.',
          image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=200&fit=crop',
          tags: ['웹개발', '트렌드', 'AI', '프론트엔드'],
          folder: '블로그/아티클'
        };
      } else if (domain.includes('figma') || domain.includes('behance') || domain.includes('dribbble')) {
        mockData = {
          title: '모던 대시보드 UI 키트 - 2024 디자인 시스템',
          description: '120개 이상의 컴포넌트와 일관성 있는 디자인 토큰으로 구성된 완성도 높은 대시보드 UI 키트입니다.',
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',
          tags: ['디자인', 'UI키트', '대시보드', 'Figma'],
          folder: '디자인/UI-UX'
        };
      } else if (domain.includes('news') || domain.includes('techcrunch')) {
        mockData = {
          title: 'OpenAI GPT-5 출시 예정 - AI 업계 판도 변화 전망',
          description: '차세대 AI 모델 GPT-5의 주요 기능과 성능 향상, 그리고 개발자 생태계에 미칠 영향을 분석한 기사입니다.',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
          tags: ['AI', '뉴스', 'OpenAI', '기술'],
          folder: '뉴스/트렌드'
        };
      }

      // AI 분류 적용
      mockData.folder = categorizeByAI(inputUrl, mockData.title, mockData.description);
      
      setLinkPreview(mockData);
      setIsPreviewLoading(false);
      return mockData;
    } catch (error) {
      setIsPreviewLoading(false);
      toast.error('URL 분석에 실패했습니다');
      return null;
    }
  };

  const handleUrlInput = async (url: string) => {
    if (!url.startsWith('http')) return;
    await analyzeUrl(url);
  };

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
      frequent: links.filter(link => link.readCount && link.readCount > 2),
      todayPick: links.slice().sort(() => Math.random() - 0.5).slice(0, 6),
    };

    return categories;
  }, [links]);

  // 현재 메뉴에 따른 필터링
  const getFilteredLinks = () => {
    let filtered = links;
    
    if (currentMenu.startsWith('tag:')) {
      const tagName = currentMenu.replace('tag:', '');
      filtered = links.filter(link => link.tags.includes(tagName));
    } else if (currentMenu.startsWith('folder:')) {
      const folderName = currentMenu.replace('folder:', '');
      filtered = links.filter(link => link.folder === folderName);
    }
    
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
    }
    
    if (searchTerm && !searchTerm.startsWith('http')) {
      filtered = filtered.filter(link => 
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const filteredLinks = getFilteredLinks();

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
          folder: currentMenu.startsWith('folder:') ? currentMenu.replace('folder:', '') : analysisData.folder
        };
        onAddLink(newLink);
        setSearchTerm('');
        setLinkPreview(null);
        toast.success('🚀 스마트 분석 완료! 링크가 자동으로 분류되어 저장되었습니다!');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast.error('URL을 입력해 주세요');
      return;
    }

    if (searchTerm.startsWith('http')) {
      await handleQuickAdd();
    }
  };

  const getCurrentMenuTitle = () => {
    if (currentMenu.startsWith('tag:')) {
      return `#${currentMenu.replace('tag:', '')} 태그`;
    } else if (currentMenu.startsWith('folder:')) {
      return `📁 ${currentMenu.replace('folder:', '')} 폴더`;
    }
    return '전체 링크';
  };

  const unreadCount = smartCategories.unread.length;
  const recentCount = smartCategories.recent.length;
  const frequentCount = smartCategories.frequent.length;

  return (
    <div className="space-y-8 relative">
      {/* 헤더 섹션 */}
      <div className="text-center py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl border-2 border-blue-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-3 flex items-center justify-center gap-3">
            {currentMenu.startsWith('folder:') ? <FolderOpen className="w-8 h-8 text-blue-500" /> : <BookOpen className="w-8 h-8 text-blue-500" />}
            {getCurrentMenuTitle()}
          </h1>
          <p className="text-slate-600 text-lg">AI가 자동으로 분류하는 스마트 링크 관리 시스템</p>
        </div>
      </div>

      {/* 스마트 링크 추가 영역 */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-3 text-xl">
            <Sparkles className="w-6 h-6 text-blue-500" />
            AI 스마트 링크 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-6 h-6" />
                <Input
                  placeholder="https://example.com - AI가 자동으로 분석하고 분류합니다"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.startsWith('http')) {
                      handleUrlInput(e.target.value);
                    } else {
                      setLinkPreview(null);
                    }
                  }}
                  className="pl-14 pr-4 py-4 bg-white/90 border-2 border-blue-300 focus:border-blue-500 rounded-2xl text-lg shadow-sm"
                />
              </div>
              {searchTerm.startsWith('http') && linkPreview && (
                <Button
                  type="button"
                  onClick={handleQuickAdd}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl px-8 py-4 font-bold shadow-lg transform hover:scale-105 transition-all"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  스마트 저장
                </Button>
              )}
            </div>

            {/* AI 분석 로딩 */}
            {isPreviewLoading && (
              <Card className="bg-white/80 border-2 border-blue-200 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <div className="font-semibold text-blue-700 mb-1">🤖 AI가 링크를 분석하고 있습니다...</div>
                      <div className="text-sm text-slate-600">제목, 설명, 태그, 폴더를 자동으로 분류합니다</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI 분석 결과 미리보기 */}
            {linkPreview && (
              <Card className="bg-white border-2 border-green-200 rounded-2xl shadow-md">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img 
                      src={linkPreview.image} 
                      alt="Preview" 
                      className="w-24 h-24 rounded-xl object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-slate-800 line-clamp-1 text-lg">{linkPreview.title}</h3>
                        <Badge className="bg-green-100 text-green-700 text-xs">AI 분석 완료</Badge>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{linkPreview.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Folder className="w-4 h-4 text-purple-500" />
                        <Badge variant="outline" className="text-xs">
                          📁 {linkPreview.folder}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
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
        </CardContent>
      </Card>

      {/* 매거진 스타일 분류 탭 */}
      <div className="flex gap-2 flex-wrap justify-center">
        <Button
          variant={archiveView === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('all')}
          className={`rounded-full transition-all ${archiveView === 'all' ? "bg-blue-600 text-white shadow-lg" : "border-slate-300 hover:bg-blue-50"}`}
        >
          📚 전체 ({filteredLinks.length})
        </Button>
        <Button
          variant={archiveView === 'unread' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('unread')}
          className={`rounded-full transition-all ${archiveView === 'unread' ? "bg-orange-500 text-white shadow-lg" : "border-orange-300 hover:bg-orange-50"}`}
        >
          🔥 안 읽음 ({currentMenu === 'home' ? unreadCount : filteredLinks.filter(l => !l.isRead).length})
        </Button>
        <Button
          variant={archiveView === 'recent' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('recent')}
          className={`rounded-full transition-all ${archiveView === 'recent' ? "bg-green-500 text-white shadow-lg" : "border-green-300 hover:bg-green-50"}`}
        >
          ⚡ 최근 ({currentMenu === 'home' ? recentCount : filteredLinks.filter(l => {
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            return new Date(l.addedAt) > threeDaysAgo;
          }).length})
        </Button>
        <Button
          variant={archiveView === 'frequent' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('frequent')}
          className={`rounded-full transition-all ${archiveView === 'frequent' ? "bg-purple-500 text-white shadow-lg" : "border-purple-300 hover:bg-purple-50"}`}
        >
          ⭐ 자주읽음 ({currentMenu === 'home' ? frequentCount : filteredLinks.filter(l => l.readCount && l.readCount > 2).length})
        </Button>
        <Button
          variant={archiveView === 'today-pick' ? "default" : "outline"}
          size="sm"
          onClick={() => setArchiveView('today-pick')}
          className={`rounded-full transition-all ${archiveView === 'today-pick' ? "bg-pink-500 text-white shadow-lg" : "border-pink-300 hover:bg-pink-50"}`}
        >
          ☕ 오늘의 추천 (6)
        </Button>
      </div>

      {/* 링크 그리드 */}
      {filteredLinks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map(link => (
            <LinkCard key={link.id} link={link} onDelete={onDeleteLink} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <BookOpen className="w-16 h-16 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            {currentMenu === 'home' ? '첫 번째 링크를 저장해보세요!' : `${getCurrentMenuTitle()}에 저장된 링크가 없습니다`}
          </h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
            {currentMenu === 'home' 
              ? 'AI가 자동으로 분석하고 분류하는 스마트 링크 관리를 경험해보세요! ✨'
              : '이 카테고리에 링크를 저장해보세요!'
            }
          </p>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full px-8 py-4 font-bold text-lg shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            링크 저장하기 🚀
          </Button>
        </div>
      )}

      {/* 플로팅 액션 버튼 */}
      <Button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50"
      >
        <Plus className="w-8 h-8 text-white" />
      </Button>

      {/* 링크 추가 다이얼로그 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              새로운 링크 추가
            </DialogTitle>
          </DialogHeader>
          <AddLinkForm 
            onSubmit={(newLink) => {
              const linkWithFolder = {
                ...newLink,
                folder: currentMenu.startsWith('folder:') ? currentMenu.replace('folder:', '') : categorizeByAI(newLink.url, newLink.title, newLink.description)
              };
              onAddLink(linkWithFolder);
              setShowAddDialog(false);
              toast.success('링크가 저장되었습니다! 🎉');
            }}
            initialUrl=""
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
