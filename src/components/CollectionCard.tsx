
import { useState } from 'react';
import { Users, Star, Eye, MessageCircle, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface CollectionCardProps {
  collection: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    linkCount: number;
    subscribers: number;
    isSubscribed: boolean;
    isOwner: boolean;
    collaborators: Array<{
      id: string;
      name: string;
      avatar: string;
    }>;
    lastUpdated: string;
    thumbnail: string;
  };
  onSubscribe?: (id: string) => void;
  onJoin?: (id: string) => void;
}

export function CollectionCard({ collection, onSubscribe, onJoin }: CollectionCardProps) {
  const [isSubscribed, setIsSubscribed] = useState(collection.isSubscribed);
  const [subscriberCount, setSubscriberCount] = useState(collection.subscribers);

  const handleSubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSubscribed(!isSubscribed);
    setSubscriberCount(prev => isSubscribed ? prev - 1 : prev + 1);
    onSubscribe?.(collection.id);
    toast.success(isSubscribed ? '구독을 취소했어요! 👋' : '컬렉션을 구독했어요! 🎉');
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJoin?.(collection.id);
    toast.success('컬렉션 참여 요청을 보냈어요! 📨');
  };

  return (
    <Card className="group bg-white/90 backdrop-blur-sm border-2 border-gray-100 hover:border-pink-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-3xl overflow-hidden cursor-pointer">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-bold text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors text-lg leading-tight">
              {collection.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
              {collection.description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {collection.thumbnail && (
          <div className="mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
            <img
              src={collection.thumbnail}
              alt={collection.title}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {collection.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 hover:from-pink-200 hover:to-purple-200 border-0 rounded-full font-medium shadow-sm">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-2">
            {collection.collaborators.slice(0, 3).map(collaborator => (
              <Avatar key={collaborator.id} className="w-6 h-6 border-2 border-white">
                <AvatarImage src={collaborator.avatar} />
                <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
                  {collaborator.name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {collection.collaborators.length > 3 && (
              <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{collection.collaborators.length - 3}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {collection.linkCount}개
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {subscriberCount}명
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {new Date(collection.lastUpdated).toLocaleDateString('ko-KR')} 업데이트
          </span>
          
          <div className="flex gap-2">
            {!collection.isOwner && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSubscribe}
                  className={`rounded-full text-xs ${
                    isSubscribed 
                      ? 'bg-pink-100 text-pink-700 hover:bg-pink-200' 
                      : 'hover:bg-pink-50'
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      구독중
                    </>
                  ) : (
                    <>
                      <Star className="w-3 h-3 mr-1" />
                      구독
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleJoin}
                  className="rounded-full text-xs hover:bg-blue-50"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  참여
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
