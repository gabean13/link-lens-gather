
import { useState, useMemo } from 'react';
import { Search, Plus, Tag, Calendar, Eye, BookOpen, Clock, Sparkles, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddLinkForm } from './AddLinkForm';
import { LinkCard } from './LinkCard';

import { mockLinks } from '@/data/mockData';

interface PersonalArchiveProps {
  links: any[];
  onAddLink: (link: any) => void;
}

export function PersonalArchive({ links, onAddLink }: PersonalArchiveProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [archiveView, setArchiveView] = useState<'all' | 'unread' | 'recent' | 'categories'>('all');

  const allTags = Array.from(new Set(links.flatMap(link => link.tags)));
  
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
      byTag: {} as Record<string, any[]>
    };

    // 태그별 자동 분류
    allTags.forEach(tag => {
      categories.byTag[tag] = links.filter(link => link.tags.includes(tag));
    });

    return categories;
  }, [links, allTags]);

  const getFilteredLinks = () => {
    let filtered = links;
    
    switch (archiveView) {
      case 'unread':
        filtered = smartCategories.unread;
        break;
      case 'recent':
        filtered = smartCategories.recent;
        break;
      default:
        filtered = links;
    }
    
    if (searchTerm) {
      filtered = filtered.filter(link => 
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(link => 
        selectedTags.some(tag => link.tags.includes(tag))
      );
    }
    
    return filtered;
  };

  const filteredLinks = getFilteredLinks();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.startsWith('http')) {
      // URL이면 바로 링크 추가 모드로
      setShowAddDialog(true);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const unreadCount = smartCategories.unread.length;
  const recentCount = smartCategories.recent.length;

  return (
    <div className="space-y-6">
      {/* 개인 아카이브 헤더 */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">나만의 링크 아카이브 📚</h1>
            <p className="text-gray-600">소중한 링크들을 똑똑하게 정리해드려요</p>
          </div>
        </div>
      </div>

      {/* 통합 검색/추가 바 */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="링크를 검색하거나 URL을 붙여넣어서 바로 추가하세요! 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-pink-300 rounded-2xl text-base shadow-sm"
            />
          </div>
          {searchTerm.startsWith('http') && (
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-2xl px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              추가하기
            </Button>
          )}
        </div>
      </form>

      {/* 스마트 분류 탭 */}
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
      </div>

      {/* 태그 필터 */}
      {allTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-pink-500" />
            태그로 필터링
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className={`rounded-full transition-all ${
                  selectedTags.includes(tag) 
                    ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md" 
                    : "border-gray-300 hover:bg-pink-50"
                }`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag} ({smartCategories.byTag[tag]?.length || 0})
              </Button>
            ))}
            {selectedTags.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTags([])}
                className="rounded-full text-pink-600 hover:bg-pink-50"
              >
                전체 해제
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 스마트 분류 미리보기 (카테고리 뷰일 때) */}
      {archiveView === 'categories' && (
        <div className="grid gap-6">
          {Object.entries(smartCategories.byTag).map(([tag, tagLinks]) => (
            tagLinks.length > 0 && (
              <div key={tag} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full">
                    #{tag} ({tagLinks.length}개)
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tagLinks.slice(0, 6).map(link => (
                    <LinkCard key={link.id} link={link} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* 링크 리스트 */}
      {archiveView !== 'categories' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      )}

      {/* 검색 결과 없음 */}
      {filteredLinks.length === 0 && archiveView !== 'categories' && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-10 h-10 text-pink-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">링크가 없어요!</h3>
          <p className="text-gray-600 mb-4">첫 번째 링크를 추가해보세요 🚀</p>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            링크 추가하기
          </Button>
        </div>
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
              setSearchTerm('');
            }}
            initialUrl={searchTerm.startsWith('http') ? searchTerm : ''}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
