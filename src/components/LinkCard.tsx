
import { useState } from 'react';
import { ExternalLink, Clock, Share2, Eye, MoreVertical, Heart, Bookmark, Trash, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface LinkCardProps {
  link: {
    id: string;
    title: string;
    description: string;
    url: string;
    tags: string[];
    image: string;
    addedAt: string;
    isRead: boolean;
    folder?: string;
  };
  onDelete?: (linkId: string) => void;
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    toast.success('링크가 클립보드에 복사되었습니다! 📋');
  };

  const handleCardClick = () => {
    setShowPreview(true);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? '좋아요를 취소했습니다' : '좋아요! 💖');
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(link.id);
      toast.success('링크가 삭제되었습니다');
    }
  };

  const handleDirectLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(link.url, '_blank');
  };

  // Mock 미리보기 내용 생성
  const generateMockPreview = () => {
    const domain = new URL(link.url).hostname.toLowerCase();
    
    if (domain.includes('github')) {
      return (
        <div className="bg-slate-900 text-white p-6 rounded-lg font-mono text-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-slate-300">README.md</span>
          </div>
          <div className="space-y-2">
            <div className="text-blue-300"># {link.title}</div>
            <div className="text-slate-300">{link.description}</div>
            <div className="text-green-300">## Installation</div>
            <div className="text-slate-400">npm install react</div>
            <div className="text-green-300">## Usage</div>
            <div className="text-slate-400">import React from 'react'</div>
          </div>
        </div>
      );
    } else if (domain.includes('youtube')) {
      return (
        <div className="bg-black text-white rounded-lg overflow-hidden">
          <div className="bg-red-600 p-4 text-center">
            <div className="text-4xl mb-2">▶️</div>
            <div className="text-lg font-bold">{link.title}</div>
          </div>
          <div className="p-4 bg-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
              <span className="text-sm">채널명</span>
            </div>
            <div className="text-sm text-slate-300">{link.description}</div>
          </div>
        </div>
      );
    } else if (domain.includes('blog') || domain.includes('medium')) {
      return (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{link.title}</h1>
            <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
              <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
              <span>작성자</span>
              <span>•</span>
              <span>5분 읽기</span>
            </div>
            <div className="prose">
              <p className="mb-4">{link.description}</p>
              <p className="text-slate-600">
                이것은 실제 블로그 포스트의 미리보기입니다. 
                실제 내용은 더욱 자세하고 풍부한 정보를 담고 있습니다.
              </p>
              <div className="mt-6 p-4 bg-slate-50 rounded">
                <h3 className="font-semibold mb-2">주요 포인트</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>핵심 개념 설명</li>
                  <li>실용적인 예제</li>
                  <li>실무 적용 방법</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg">
          <div className="text-center">
            <Globe className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">{link.title}</h2>
            <p className="text-slate-600 mb-6">{link.description}</p>
            <div className="bg-white/80 p-4 rounded-lg shadow-sm">
              <div className="text-sm text-slate-500 mb-2">웹사이트 미리보기</div>
              <div className="h-32 bg-gradient-to-r from-slate-100 to-slate-200 rounded flex items-center justify-center">
                <span className="text-slate-500">실제 웹페이지 내용이 여기에 표시됩니다</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Card 
        className="group bg-white hover:bg-slate-50 border-2 border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-2xl overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-lg leading-tight mb-2">
                {link.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {link.description}
              </p>
            </div>
            
            <div onClick={handleMoreClick}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-slate-100">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-slate-200 rounded-xl shadow-lg">
                  <DropdownMenuItem onClick={handleShare} className="rounded-lg">
                    <Share2 className="w-4 h-4 mr-2 text-blue-500" />
                    공유하기
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDirectLink} className="rounded-lg">
                    <ExternalLink className="w-4 h-4 mr-2 text-green-500" />
                    바로가기
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="rounded-lg text-red-600">
                    <Trash className="w-4 h-4 mr-2" />
                    삭제하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-5 pt-0">
          {link.image && (
            <div className="mb-4 rounded-xl overflow-hidden bg-slate-100 shadow-sm">
              <img
                src={link.image}
                alt={link.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {link.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0 rounded-full font-medium">
                #{tag}
              </Badge>
            ))}
            {link.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 rounded-full">
                +{link.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{new Date(link.addedAt).toLocaleDateString('ko-KR')}</span>
              {link.folder && (
                <>
                  <span>•</span>
                  <Bookmark className="w-3 h-3" />
                  <span className="text-xs">{link.folder}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {!link.isRead && (
                <Badge className="text-xs px-2 py-1 bg-orange-100 text-orange-600 border-orange-200 rounded-full font-medium">
                  새로움
                </Badge>
              )}
              
              <Button
                onClick={handleDirectLink}
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg px-4 py-2 font-medium shadow-sm"
              >
                바로가기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 미리보기 다이얼로그 */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border-2 border-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Bookmark className="w-6 h-6 text-blue-500" />
              <span className="text-slate-800 flex-1 truncate">{link.title}</span>
              <Button
                onClick={handleDirectLink}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl px-6 py-2 font-medium shadow-lg"
              >
                바로가기
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {link.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full font-medium">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h4 className="font-bold mb-3 text-slate-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                실시간 미리보기
              </h4>
              {generateMockPreview()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
