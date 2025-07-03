
import { useState } from 'react';
import { UserPlus, Share2, Tag, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface FriendsPanelProps {
  onClose: () => void;
}

const mockFriends = [
  {
    id: '1',
    name: 'Sarah Kim',
    email: 'sarah@example.com',
    avatar: '',
    sharedTags: ['Development', 'Design', 'Career'],
    recentLinks: 3
  },
  {
    id: '2',
    name: 'James Park',
    email: 'james@example.com', 
    avatar: '',
    sharedTags: ['Jobs', 'Tech', 'Startup'],
    recentLinks: 7
  },
  {
    id: '3',
    name: 'Emily Lee',
    email: 'emily@example.com',
    avatar: '',
    sharedTags: ['Travel', 'Photography', 'Lifestyle'],
    recentLinks: 2
  }
];

const mockSharedLinks = [
  {
    id: '1',
    title: 'Best React Practices 2024',
    url: 'https://example.com',
    sharedBy: 'Sarah Kim',
    tags: ['Development', 'React'],
    sharedAt: '2 hours ago'
  },
  {
    id: '2', 
    title: 'UI Design Trends',
    url: 'https://example.com',
    sharedBy: 'Emily Lee',
    tags: ['Design', 'UI/UX'],
    sharedAt: '1 day ago'
  }
];

export function FriendsPanel({ onClose }: FriendsPanelProps) {
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'shared'>('friends');

  const handleAddFriend = () => {
    if (!email.trim()) {
      toast.error('이메일 주소를 입력해 주세요');
      return;
    }
    
    toast.success(`${email}에게 친구 요청을 보냈어요! 📧`);
    setEmail('');
  };

  const handleShareTag = (friendName: string, tag: string) => {
    toast.success(`${friendName}님과 "${tag}" 컬렉션을 공유했어요! 🎉`);
  };

  return (
    <div className="space-y-6">
      {/* 뒤로가기 버튼 */}
      <Button
        variant="ghost"
        onClick={onClose}
        className="mb-4 hover:bg-pink-50 rounded-full"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        뒤로가기
      </Button>

      {/* 탭 네비게이션 */}
      <div className="flex bg-gray-100 rounded-2xl p-1 max-w-md mx-auto">
        <Button
          variant={activeTab === 'friends' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('friends')}
          className="flex-1 rounded-xl"
        >
          👫 친구 목록
        </Button>
        <Button
          variant={activeTab === 'shared' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('shared')}
          className="flex-1 rounded-xl"
        >
          🔗 공유 링크
        </Button>
      </div>

      {activeTab === 'friends' && (
        <div className="space-y-6">
          {/* 친구 추가 섹션 */}
          <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5 text-pink-500" />
                새로운 친구 추가하기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="친구의 이메일 주소를 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-2xl border-2 border-pink-300 focus:border-pink-400"
                />
                <Button 
                  onClick={handleAddFriend}
                  className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-2xl px-6"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  추가
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 친구 목록 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockFriends.map(friend => (
              <Card key={friend.id} className="bg-white/90 border-2 border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300 rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 font-bold">
                        {friend.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{friend.name}</div>
                      <div className="text-sm text-gray-500">{friend.email}</div>
                      <div className="text-xs text-green-600 font-medium">
                        최근 {friend.recentLinks}개 링크 공유
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 mb-2">공유 태그</div>
                    <div className="flex flex-wrap gap-2">
                      {friend.sharedTags.map(tag => (
                        <Button
                          key={tag}
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareTag(friend.name, tag)}
                          className="h-8 px-3 text-xs rounded-full border-pink-300 hover:bg-pink-50 hover:border-pink-400"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          #{tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'shared' && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">친구들이 공유한 링크들 ✨</h3>
            <p className="text-gray-600">친구들의 흥미로운 발견을 확인해보세요!</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {mockSharedLinks.map(link => (
              <Card key={link.id} className="bg-white/90 border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-gray-800 line-clamp-2 flex-1">{link.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(link.url, '_blank')}
                      className="h-8 w-8 p-0 rounded-full hover:bg-blue-50"
                    >
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {link.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                          {link.sharedBy.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-600 font-medium">{link.sharedBy}</span>
                    </div>
                    <span className="text-gray-500">{link.sharedAt}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
