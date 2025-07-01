
import { useState } from 'react';
import { ExternalLink, Clock, Share2, Eye, MoreVertical, Heart, Bookmark } from 'lucide-react';
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
  };
}

export function LinkCard({ link }: LinkCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(link.url);
    toast.success('링크가 클립보드에 복사되었어요! 📋✨');
  };

  const handleViewContent = () => {
    setShowPreview(true);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? '좋아요를 취소했어요 💔' : '좋아요! 💖');
  };

  return (
    <>
      <Card className="group bg-white/90 backdrop-blur-sm border-2 border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-3xl overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors text-lg leading-tight">
                {link.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                {link.description}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-pink-50">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-pink-200 rounded-2xl shadow-lg">
                <DropdownMenuItem onClick={handleViewContent} className="rounded-xl">
                  <Eye className="w-4 h-4 mr-2 text-purple-500" />
                  미리보기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare} className="rounded-xl">
                  <Share2 className="w-4 h-4 mr-2 text-blue-500" />
                  공유하기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(link.url, '_blank')} className="rounded-xl">
                  <ExternalLink className="w-4 h-4 mr-2 text-green-500" />
                  새 탭에서 열기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          {link.image && (
            <div className="mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
              <img
                src={link.image}
                alt={link.title}
                className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {link.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 hover:from-pink-200 hover:to-purple-200 border-0 rounded-full font-medium shadow-sm">
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4 text-pink-400" />
              <span className="font-medium">{new Date(link.addedAt).toLocaleDateString('ko-KR')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {!link.isRead && (
                <Badge variant="outline" className="text-xs px-3 py-1 text-orange-600 border-orange-300 bg-orange-50 rounded-full font-bold animate-pulse">
                  새로움! ✨
                </Badge>
              )}
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`opacity-0 group-hover:opacity-100 transition-all h-8 w-8 p-0 rounded-full ${
                    isLiked ? 'text-pink-500 bg-pink-50' : 'hover:bg-pink-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewContent}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 rounded-full hover:bg-purple-50"
                >
                  <Eye className="w-4 h-4 text-purple-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 rounded-full hover:bg-blue-50"
                >
                  <Share2 className="w-4 h-4 text-blue-500" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl border-2 border-pink-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg">
              <Bookmark className="w-5 h-5 text-pink-500" />
              <span className="text-gray-800">{link.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(link.url, '_blank')}
                className="ml-auto rounded-full hover:bg-pink-50"
              >
                <ExternalLink className="w-4 h-4 text-pink-500" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {link.image && (
              <img
                src={link.image}
                alt={link.title}
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
              />
            )}
            
            <div className="flex flex-wrap gap-2">
              {link.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full font-medium">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-base">
                {link.description}
              </p>
              
              <div className="mt-6 p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border-2 border-pink-100">
                <h4 className="font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-500" />
                  콘텐츠 미리보기
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  실제 서비스에서는 여기에 링크의 실제 내용이 표시됩니다! 
                  웹페이지를 떠나지 않고도 콘텐츠를 미리 볼 수 있어서 
                  더욱 편리하게 정보를 확인할 수 있어요. 📖✨
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
