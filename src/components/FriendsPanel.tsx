
import { useState } from 'react';
import { X, UserPlus, Share2, Tag, ExternalLink } from 'lucide-react';
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
      toast.error('Please enter an email address');
      return;
    }
    
    toast.success(`Friend request sent to ${email}`);
    setEmail('');
  };

  const handleShareTag = (friendName: string, tag: string) => {
    toast.success(`Shared "${tag}" collection with ${friendName}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Friends & Sharing</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={activeTab === 'friends' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('friends')}
              className="flex-1"
            >
              Friends
            </Button>
            <Button
              variant={activeTab === 'shared' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('shared')}
              className="flex-1"
            >
              Shared Links
            </Button>
          </div>

          {activeTab === 'friends' && (
            <div className="space-y-4">
              {/* Add Friend */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter friend's email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleAddFriend}>
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Friends List */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {mockFriends.map(friend => (
                  <div key={friend.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-medium text-sm">{friend.name}</div>
                        <div className="text-xs text-gray-500">{friend.recentLinks} recent links</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {friend.sharedTags.slice(0, 2).map(tag => (
                        <Button
                          key={tag}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareTag(friend.name, tag)}
                          className="h-6 px-2 text-xs"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shared' && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {mockSharedLinks.map(link => (
                <div key={link.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm line-clamp-2">{link.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(link.url, '_blank')}
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {link.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Shared by {link.sharedBy}</span>
                    <span>{link.sharedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
