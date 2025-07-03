
import { useState, useMemo } from 'react';
import { Search, Plus, BookOpen, Sparkles, Loader2, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddLinkForm } from './AddLinkForm';
import { LinkCard } from './LinkCard';
import { LinkAnalyzer } from '@/services/linkAnalyzer';
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
  const [isQuickAnalyzing, setIsQuickAnalyzing] = useState(false);

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

  // Quick add 기능
  const handleQuickAdd = async () => {
    if (!searchTerm.startsWith('http')) {
      toast.error('올바른 URL을 입력해주세요');
      return;
    }

    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      toast.error('상단바에서 Gemini API 키를 먼저 설정해주세요');
      return;
    }

    setIsQuickAnalyzing(true);
    
    try {
      const analyzer = new LinkAnalyzer(apiKey);
      const analysisResult = await analyzer.analyzeUrl(searchTerm);
      
      const newLink = {
        ...analysisResult,
        url: searchTerm,
        addedAt: new Date().toISOString(),
        isRead: false,
        id: Date.now().toString(),
        folder: currentMenu.startsWith('folder:') ? currentMenu.replace('folder:', '') : analysisResult.folder
      };
      
      onAddLink(newLink);
      setSearchTerm('');
      toast.success('🚀 링크가 자동으로 분석되어 저장되었습니다!');
    } catch (error) {
      toast.error('분석에 실패했습니다. 수동으로 추가해주세요.');
      setShowAddDialog(true);
    } finally {
      setIsQuickAnalyzing(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
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
            <BookOpen className="w-8 h-8 text-blue-500" />
            {getCurrentMenuTitle()}
          </h1>
          <p className="text-slate-600 text-lg">Gemini AI가 실시간으로 분석하는 스마트 링크 관리 서비스</p>
        </div>
      </div>

      {/* AI 스마트 링크 추가 영역 */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-3 text-xl">
            <Sparkles className="w-6 h-6 text-blue-500" />
            Gemini AI 실시간 링크 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-6 h-6" />
                <Input
                  placeholder="https://example.com - 입력하면 자동으로 분석됩니다"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 pr-4 py-4 bg-white/90 border-2 border-blue-300 focus:border-blue-500 rounded-2xl text-lg shadow-sm"
                />
              </div>
              {searchTerm.startsWith('http') && (
                <Button
                  type="button"
                  onClick={handleQuickAdd}
                  disabled={isQuickAnalyzing}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl px-8 py-4 font-bold shadow-lg transform hover:scale-105 transition-all"
                >
                  {isQuickAnalyzing ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  {isQuickAnalyzing ? '분석중...' : '빠른 저장'}
                </Button>
              )}
            </div>

            {isQuickAnalyzing && (
              <Card className="bg-white/80 border-2 border-blue-200 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Loader2 className="w-10 h-10 border-3 text-blue-500 animate-spin" />
                    <div>
                      <div className="font-semibold text-blue-700 mb-1">🤖 Gemini AI가 웹페이지를 분석하고 있습니다...</div>
                      <div className="text-sm text-slate-600">제목, 설명, 요약, 태그, 폴더를 자동으로 생성합니다</div>
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
              ? 'Gemini AI가 자동으로 분석하고 분류하는 스마트 링크 관리를 경험해보세요! ✨'
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
        <DialogContent className="sm:max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              Gemini AI 링크 분석
            </DialogTitle>
          </DialogHeader>
          <AddLinkForm 
            onSubmit={(newLink) => {
              const linkWithFolder = {
                ...newLink,
                folder: currentMenu.startsWith('folder:') ? currentMenu.replace('folder:', '') : newLink.folder
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
