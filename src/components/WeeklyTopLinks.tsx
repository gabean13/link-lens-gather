
import { useState } from 'react';
import { TrendingUp, ExternalLink, Heart, MessageCircle, Share2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const mockWeeklyLinks = [
  {
    id: '1',
    title: '🚀 React 19의 새로운 기능들',
    description: 'React 19에서 새롭게 추가된 기능들과 변경사항을 정리한 포스트입니다.',
    url: 'https://example.com/react-19',
    tags: ['React', 'JavaScript', '프론트엔드'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    saveCount: 127,
    commentCount: 23,
    likeCount: 89,
    trendingRank: 1
  },
  {
    id: '2',
    title: '💡 AI 시대의 개발자 생존 가이드',
    description: 'AI가 발전하는 시대에 개발자가 어떻게 대응해야 하는지에 대한 인사이트',
    url: 'https://example.com/ai-developer-guide',
    tags: ['AI', '개발자', '커리어'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    saveCount: 98,
    commentCount: 45,
    likeCount: 156,
    trendingRank: 2
  },
  {
    id: '3',
    title: '🎨 디자인 시스템 구축하기',
    description: '스케일 가능한 디자인 시스템을 구축하는 방법과 베스트 프랙티스',
    url: 'https://example.com/design-system',
    tags: ['디자인', 'UI/UX', '시스템'],
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400',
    saveCount: 76,
    commentCount: 18,
    likeCount: 92,
    trendingRank: 3
  }
];

export function WeeklyTopLinks() {
  const [likedLinks, setLikedLinks] = useState<string[]>([]);

  const handleLike = (linkId: string) => {
    setLikedLinks(prev => 
      prev.includes(linkId) 
        ? prev.filter(id => id !== linkId)
        : [...prev, linkId]
    );
    toast.success('좋아요! 💖');
  };

  const handleShare = (link: any) => {
    navigator.clipboard.writeText(link.url);
    toast.success('링크가 클립보드에 복사되었어요! 📋');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockWeeklyLinks.map((link) => (
          <Card key={link.id} className="group bg-white/90 backdrop-blur-sm border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-3xl overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full font-bold text-xs">
                    #{link.trendingRank} 트렌딩
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {link.saveCount}회 저장
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg leading-tight group-hover:text-orange-600 transition-colors">
                {link.title}
              </CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">
                {link.description}
              </p>
            </CardHeader>
            
            <CardContent className="p-4 pt-0">
              {link.image && (
                <div className="mb-4 rounded-2xl overflow-hidden">
                  <img
                    src={link.image}
                    alt={link.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {link.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-orange-100 text-orange-700 rounded-full">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{link.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{link.commentCount}</span>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(link.id)}
                    className={`h-8 w-8 p-0 rounded-full ${
                      likedLinks.includes(link.id) ? 'text-red-500 bg-red-50' : 'hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedLinks.includes(link.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(link)}
                    className="h-8 w-8 p-0 rounded-full hover:bg-blue-50"
                  >
                    <Share2 className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
                    className="h-8 w-8 p-0 rounded-full hover:bg-green-50"
                  >
                    <ExternalLink className="w-4 h-4 text-green-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
