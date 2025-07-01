
import { useState } from 'react';
import { X, Plus, Search, Star, Users, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollectionCard } from './CollectionCard';

interface CollectionsPanelProps {
  onClose: () => void;
}

const mockCollections = [
  {
    id: '1',
    title: '개발자를 위한 최고의 블로그 모음',
    description: '프론트엔드부터 백엔드까지, 개발에 필요한 모든 정보를 모았어요!',
    tags: ['Development', 'Programming', 'Tech'],
    linkCount: 47,
    subscribers: 1204,
    isSubscribed: true,
    isOwner: false,
    collaborators: [
      { id: '1', name: '김개발', avatar: '' },
      { id: '2', name: '이코딩', avatar: '' },
      { id: '3', name: '박프로그래머', avatar: '' }
    ],
    lastUpdated: '2024-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop'
  },
  {
    id: '2',
    title: '디자인 영감 수집소',
    description: 'UI/UX 디자인 트렌드와 인사이트를 공유하는 컬렉션',
    tags: ['Design', 'UI/UX', 'Inspiration'],
    linkCount: 32,
    subscribers: 856,
    isSubscribed: false,
    isOwner: false,
    collaborators: [
      { id: '4', name: '최디자인', avatar: '' },
      { id: '5', name: '한크리에이터', avatar: '' }
    ],
    lastUpdated: '2024-01-14',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop'
  },
  {
    id: '3',
    title: '스타트업 생존 가이드',
    description: '창업부터 투자까지, 스타트업에 필요한 모든 정보',
    tags: ['Startup', 'Business', 'Investment'],
    linkCount: 28,
    subscribers: 643,
    isSubscribed: true,
    isOwner: true,
    collaborators: [
      { id: '6', name: '나', avatar: '' }
    ],
    lastUpdated: '2024-01-13',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=200&fit=crop'
  }
];

export function CollectionsPanel({ onClose }: CollectionsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('discover');

  const filteredCollections = mockCollections.filter(collection =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const myCollections = mockCollections.filter(c => c.isOwner);
  const subscribedCollections = mockCollections.filter(c => c.isSubscribed && !c.isOwner);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-pink-50 to-purple-50">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-pink-500" />
            컬렉션 & 소셜 기능
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* 검색 */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="컬렉션을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 rounded-2xl">
              <TabsTrigger value="discover" className="rounded-xl">🔍 발견하기</TabsTrigger>
              <TabsTrigger value="subscribed" className="rounded-xl">⭐ 구독중</TabsTrigger>
              <TabsTrigger value="my" className="rounded-xl">📁 내 컬렉션</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">인기 컬렉션 둘러보기</h3>
                <Button size="sm" className="bg-pink-500 hover:bg-pink-600 rounded-full">
                  <Plus className="w-4 h-4 mr-1" />
                  새 컬렉션
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredCollections.map(collection => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="subscribed" className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">구독중인 컬렉션 ({subscribedCollections.length}개)</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {subscribedCollections.map(collection => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
              {subscribedCollections.length === 0 && (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">아직 구독한 컬렉션이 없어요</p>
                  <p className="text-sm text-gray-400">관심있는 컬렉션을 구독해보세요!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="my" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">내 컬렉션 ({myCollections.length}개)</h3>
                <Button size="sm" className="bg-purple-500 hover:bg-purple-600 rounded-full">
                  <Plus className="w-4 h-4 mr-1" />
                  컬렉션 만들기
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {myCollections.map(collection => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
