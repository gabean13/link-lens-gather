
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Sparkles, Heart, Zap, Loader2, Check, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { LinkAnalyzer } from '@/services/linkAnalyzer';

interface AddLinkFormProps {
  onSubmit: (link: any) => void;
  initialUrl?: string;
}

const FOLDER_OPTIONS = [
  '개발/코딩', '디자인/UI-UX', '뉴스/트렌드', '학습/교육', 
  '블로그/아티클', '도구/서비스', '비즈니스/마케팅', '라이프스타일', '기타'
];

export function AddLinkForm({ onSubmit, initialUrl = '' }: AddLinkFormProps) {
  const [url, setUrl] = useState(initialUrl);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [editableResult, setEditableResult] = useState<any>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (url && url.startsWith('http') && !isAnalyzing && !analysisResult) {
        handleAutoAnalysis();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [url]);

  const handleAutoAnalysis = async () => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      toast.error('상단바에서 API 키를 먼저 설정해주세요');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const analyzer = new LinkAnalyzer(apiKey);
      const result = await analyzer.analyzeUrl(url);
      
      setAnalysisResult(result);
      setEditableResult({ ...result });
      toast.success('🤖 AI 분석이 완료되었습니다!');
    } catch (error) {
      console.error('분석 오류:', error);
      toast.error(`분석 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFieldEdit = (field: string, value: string) => {
    setEditableResult(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCustomTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      setNewTag('');
      toast.success(`"${newTag.trim()}" 태그가 추가되었습니다!`);
    }
  };

  const removeTag = (tag: string, isCustom: boolean) => {
    if (isCustom) {
      setCustomTags(customTags.filter(t => t !== tag));
    } else if (editableResult) {
      setEditableResult({
        ...editableResult,
        tags: editableResult.tags.filter((t: string) => t !== tag)
      });
    }
    toast.success(`"${tag}" 태그를 제거했습니다`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('URL을 입력해주세요');
      return;
    }

    let finalResult = editableResult || analysisResult;
    
    if (!finalResult) {
      const apiKey = localStorage.getItem('gemini_api_key');
      if (!apiKey) {
        toast.error('상단바에서 API 키를 설정해주세요');
        return;
      }
      
      setIsAnalyzing(true);
      try {
        const analyzer = new LinkAnalyzer(apiKey);
        finalResult = await analyzer.analyzeUrl(url);
      } catch (error) {
        toast.error('분석에 실패했습니다. 다시 시도해주세요.');
        setIsAnalyzing(false);
        return;
      }
      setIsAnalyzing(false);
    }

    const newLink = {
      ...finalResult,
      url: url.trim(),
      tags: [...(finalResult?.tags || []), ...customTags],
      addedAt: new Date().toISOString(),
      isRead: false,
      id: Date.now().toString()
    };

    onSubmit(newLink);
    toast.success('링크가 성공적으로 저장되었습니다! 🎉');
    
    // Reset form
    setUrl('');
    setCustomTags([]);
    setAnalysisResult(null);
    setEditableResult(null);
    setNewTag('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="url" className="text-base font-medium text-gray-700 flex items-center gap-2">
            <Zap className="w-4 h-4 text-pink-500" />
            링크 주소 (자동 분석됩니다)
          </Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="py-3 px-4 border-2 border-gray-200 focus:border-pink-300 rounded-2xl"
          />
        </div>

        {isAnalyzing && (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-3 text-pink-600 bg-pink-50 px-6 py-3 rounded-2xl">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">AI가 웹페이지를 분석하고 있습니다...</span>
            </div>
          </div>
        )}

        {editableResult && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">AI 분석 결과 (수정 가능)</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm font-medium text-gray-600">제목</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingTitle(!isEditingTitle)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                  {isEditingTitle ? (
                    <Input
                      value={editableResult.title}
                      onChange={(e) => handleFieldEdit('title', e.target.value)}
                      onBlur={() => setIsEditingTitle(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                      className="text-sm"
                      autoFocus
                    />
                  ) : (
                    <p className="text-gray-800 font-medium cursor-pointer hover:bg-gray-50 p-2 rounded" 
                       onClick={() => setIsEditingTitle(true)}>
                      {editableResult.title}
                    </p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm font-medium text-gray-600">설명</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingDescription(!isEditingDescription)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                  {isEditingDescription ? (
                    <Textarea
                      value={editableResult.description}
                      onChange={(e) => handleFieldEdit('description', e.target.value)}
                      onBlur={() => setIsEditingDescription(false)}
                      className="text-sm"
                      autoFocus
                    />
                  ) : (
                    <p className="text-gray-700 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded" 
                       onClick={() => setIsEditingDescription(true)}>
                      {editableResult.description}
                    </p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-sm font-medium text-gray-600">요약</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingSummary(!isEditingSummary)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                  {isEditingSummary ? (
                    <Textarea
                      value={editableResult.summary}
                      onChange={(e) => handleFieldEdit('summary', e.target.value)}
                      onBlur={() => setIsEditingSummary(false)}
                      className="text-sm"
                      autoFocus
                    />
                  ) : (
                    <p className="text-gray-700 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded" 
                       onClick={() => setIsEditingSummary(true)}>
                      {editableResult.summary}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">폴더</Label>
                  <Select 
                    value={editableResult.folder} 
                    onValueChange={(value) => handleFieldEdit('folder', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FOLDER_OPTIONS.map(folder => (
                        <SelectItem key={folder} value={folder}>📁 {folder}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">AI 생성 태그</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {editableResult.tags.map((tag: string) => (
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
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-base font-medium text-gray-700 flex items-center gap-2">
            <Heart className="w-4 h-4 text-purple-500" />
            추가 태그
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="예: 중요함, 나중에읽기"
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
            disabled={isAnalyzing}
            className="w-full py-3 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-2xl font-bold text-base shadow-lg transform transition-transform hover:scale-105"
          >
            <Heart className="w-5 h-5 mr-2" />
            {isAnalyzing ? '분석 중...' : '링크 저장하기! 💖'}
          </Button>
        </div>
      </form>
    </div>
  );
}
