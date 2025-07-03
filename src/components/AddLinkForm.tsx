import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Sparkles, Heart, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface AddLinkFormProps {
  onSubmit: (link: any) => void;
  initialUrl?: string;
}

export function AddLinkForm({ onSubmit, initialUrl = '' }: AddLinkFormProps) {
  const [url, setUrl] = useState(initialUrl);
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
    let mockTitle = '제목 없음';
    let mockDescription = '설명이 없습니다';
    let mockImage = `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop`;
    
    if (inputUrl.includes('github')) {
      mockTags = ['개발', '코드', '저장소'];
      mockTitle = 'GitHub 저장소 - 멋진 프로젝트';
      mockDescription = '현대적인 웹 개발 방법론과 도구에 대한 종합 가이드입니다.';
    } else if (inputUrl.includes('medium') || inputUrl.includes('blog')) {
      mockTags = ['기사', '블로그', '읽기'];
      mockTitle = '더 나은 웹 애플리케이션 만들기';
      mockDescription = '확장 가능한 현대적인 웹 애플리케이션을 만들기 위한 모범 사례를 배워보세요.';
    } else if (inputUrl.includes('youtube')) {
      mockTags = ['동영상', '튜토리얼', '학습'];
      mockTitle = '초보자를 위한 완전한 React 튜토리얼';
      mockDescription = 'React 기초부터 고급 개념까지 다루는 종합적인 동영상 튜토리얼입니다.';
    } else if (inputUrl.includes('job') || inputUrl.includes('career')) {
      mockTags = ['채용', '경력', '기회'];
      mockTitle = '프론트엔드 개발자 포지션 - 테크기업';
      mockDescription = '성장하는 기술 회사에서 프론트엔드 개발자를 모집합니다.';
    } else {
      mockTags = ['일반', '웹', '자료'];
      mockTitle = '유용한 웹 자료';
      mockDescription = '웹 개발과 디자인에 도움이 되는 자료입니다.';
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
      toast.success('URL 분석이 완료되었어요! ✨');
    } catch (error) {
      toast.error('URL 분석에 실패했어요 😢');
    }
  };

  const addCustomTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      setNewTag('');
      toast.success(`"${newTag.trim()}" 태그가 추가됐어요! 🏷️`);
    }
  };

  const removeTag = (tag: string, isCustom: boolean) => {
    if (isCustom) {
      setCustomTags(customTags.filter(t => t !== tag));
    } else {
      setSuggestedTags(suggestedTags.filter(t => t !== tag));
    }
    toast.success(`"${tag}" 태그를 제거했어요!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('URL을 입력해 주세요! 🔗');
      return;
    }

    // Get analysis data or use current state
    let analysisData;
    if (suggestedTags.length === 0) {
      analysisData = await analyzeUrl(url);
    } else {
      analysisData = {
        title: '저장된 링크',
        description: '링크가 성공적으로 저장되었습니다',
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
    toast.success('링크가 성공적으로 추가되었어요! 🎉');
    
    // Reset form
    setUrl('');
    setCustomTags([]);
    setSuggestedTags([]);
    setNewTag('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="url" className="text-base font-medium text-gray-700 flex items-center gap-2">
          <Zap className="w-4 h-4 text-pink-500" />
          링크 주소
        </Label>
        <div className="flex gap-2">
          <Input
            id="url"
            type="url"
            placeholder="https://example.com (저장하고 싶은 링크를 입력하세요!)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 py-3 px-4 border-2 border-gray-200 focus:border-pink-300 rounded-2xl"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleUrlAnalysis}
            disabled={!url.trim() || isAnalyzing}
            className="rounded-2xl border-2 hover:bg-pink-50 hover:border-pink-300"
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 text-pink-500" />
            )}
          </Button>
        </div>
      </div>

      {isAnalyzing && (
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-3 text-pink-600 bg-pink-50 px-6 py-3 rounded-2xl">
            <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">AI가 링크를 분석하고 있어요...</span>
          </div>
        </div>
      )}

      {suggestedTags.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-medium text-gray-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-500" />
            AI 추천 태그 ✨
          </Label>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 cursor-pointer hover:from-green-200 hover:to-emerald-200 rounded-full px-3 py-1 font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag, false)}
                  className="ml-2 hover:text-green-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-base font-medium text-gray-700 flex items-center gap-2">
          <Heart className="w-4 h-4 text-purple-500" />
          나만의 태그 추가하기
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="예: 나중에-읽기, 중요함, 즐겨찾기"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
            className="flex-1 py-3 px-4 border-2 border-gray-200 focus:border-purple-300 rounded-2xl"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={addCustomTag}
            className="rounded-2xl border-2 hover:bg-purple-50 hover:border-purple-300"
          >
            <Plus className="w-4 h-4 text-purple-500" />
          </Button>
        </div>
        
        {customTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {customTags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-purple-50 border-purple-300 text-purple-700 rounded-full px-3 py-1 font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag, true)}
                  className="ml-2 hover:text-purple-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-2xl font-bold text-base shadow-lg transform transition-transform hover:scale-105"
        >
          <Heart className="w-5 h-5 mr-2" />
          링크 저장하기! 💖
        </Button>
      </div>
    </form>
  );
}
