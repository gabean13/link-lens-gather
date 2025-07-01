
import { useState } from 'react';
import { TrendingUp, MessageCircle, Heart, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CommentSection } from './CommentSection';

const mockTopLinks = [
  {
    id: '1',
    title: '2024년 프론트엔드 개발 트렌드',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop',
    saves: 342,
    comments: 28,
    likes: 156,
    tags: ['Development', 'Frontend'],
    description: 'React, Vue, Angular의 최신 동향과 새로운 기술들을 살펴봅니다.',
    comments: [
      {
        id: '1',
        user: { id: '1', name: '김개발', avatar: '' },
        content: '정말 유용한 정보네요! 특히 React 18의 새로운 기능들이 인상깊었어요.',
        likes: 12,
        isLiked: false,
        createdAt: '2024-01-15T10:30:00Z',
        replies: [
          {
            id: '2',
            user: { id: '2', name: '이프론트', avatar: '' },
            content: '저도 동감해요! Concurrent Features 부분이 특히 좋았습니다.',
            likes: 5,
            isLiked: true,
            createdAt: '2024-01-15T11:00:00Z'
          }
        ]
      },
      {
        id: '3',
        user: { id: '3', name: '박리액트', avatar: '' },
        content: 'Next.js 13의 app directory도 언급해주셨으면 더 좋았을 것 같아요.',
        likes: 8,
        isLiked: false,
        createdAt: '2024-01-15T14:20:00Z'
      }
    ]
  },
  {
    id: '2',
    title: 'UI/UX 디자인 시스템 구축하기',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop',
    saves: 287,
    comments: 19,
    likes: 134,
    tags: ['Design', 'UI/UX'],
    description: '체계적인 디자인 시스템을 구축하는 방법과 실무 적용 사례',
    comments: [
      {
        id: '4',
        user: { id: '4', name: '최디자인', avatar: '' },
        content: '실무에서 바로 적용할 수 있는 내용들이 많아서 도움이 됐어요!',
        likes: 15,
        isLiked: true,
        createdAt: '2024-01-14T09:15:00Z'
      }
    ]
  },
  {
    id: '3',
    title: '스타트업 투자 유치 가이드',
    url: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=200&fit=crop',
    saves: 198,
    comments: 31,
    likes: 89,
    tags: ['Startup', 'Investment'],
    description: '초기 스타트업부터 시리즈 A까지, 투자 유치의 모든 것',
    comments: [
      {
        id: '5',
        user: { id: '5', name: '한창업', avatar: '' },
        content: '실제 투자 받은 경험담이 포함되어 있어서 더욱 생생했어요.',
        likes: 22,
        isLiked: false,
        createdAt: '2024-01-13T16:45:00Z'
      }
    ]
  }
];

export function WeeklyTopLinks() {
  const [selectedLink, setSelectedLink] = useState<any>(null);

  return (
    <>
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-3xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            이번 주 인기 링크 TOP 3 🔥
            <Badge className="bg-orange-100 text-orange-700 rounded-full text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              1/8 - 1/14
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {mockTopLinks.map((link, index) => (
            <div
              key={link.id}
              className="flex gap-3 p-3 bg-white/80 rounded-2xl hover:bg-white transition-colors cursor-pointer group"
              onClick={() => setSelectedLink(link)}
            >
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                  'bg-gradient-to-r from-amber-600 to-yellow-600'
                }`}>
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-800 line-clamp-1 group-hover:text-pink-600 transition-colors">
                  {link.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1">{link.description}</p>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {link.saves}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {link.comments.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {link.likes}
                  </div>
                </div>
              </div>
              
              {link.image && (
                <img
                  src={link.image}
                  alt={link.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              )}
            </div>
          ))}
          
          <p className="text-xs text-gray-600 mt-3 leading-relaxed text-center">
            가장 많이 저장되고 공유된 링크들이에요! 💫
          </p>
        </CardContent>
      </Card>

      {/* 댓글 다이얼로그 */}
      <Dialog open={!!selectedLink} onOpenChange={() => setSelectedLink(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl">
          {selectedLink && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-lg">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  {selectedLink.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {selectedLink.image && (
                  <img
                    src={selectedLink.image}
                    alt={selectedLink.title}
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                )}
                
                <div className="flex flex-wrap gap-2">
                  {selectedLink.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">{selectedLink.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedLink.saves}번 저장됨
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {selectedLink.likes}개의 좋아요
                  </div>
                </div>
                
                <CommentSection
                  linkId={selectedLink.id}
                  comments={selectedLink.comments}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
