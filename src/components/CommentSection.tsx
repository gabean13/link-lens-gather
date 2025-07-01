
import { useState } from 'react';
import { MessageCircle, Heart, Reply, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  linkId: string;
  comments: Comment[];
  onAddComment?: (content: string) => void;
}

export function CommentSection({ linkId, comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onAddComment?.(newComment);
    setNewComment('');
    toast.success('댓글을 등록했어요! 💬');
  };

  const handleLikeComment = (commentId: string) => {
    toast.success('댓글에 좋아요를 눌렀어요! 💖');
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    setReplyingTo(null);
    setReplyContent('');
    toast.success('답글을 등록했어요! 💬');
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-12 mt-3' : 'mb-4'}`}>
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.user.avatar} />
          <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
            {comment.user.name[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="bg-gray-50 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-gray-800">{comment.user.name}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-2 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeComment(comment.id)}
              className={`h-6 px-2 text-xs rounded-full ${
                comment.isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
              }`}
            >
              <Heart className={`w-3 h-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
              {comment.likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(comment.id)}
              className="h-6 px-2 text-xs text-gray-500 hover:text-blue-500 rounded-full"
            >
              <Reply className="w-3 h-3 mr-1" />
              답글
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem className="text-xs">신고하기</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-3 ml-2">
              <div className="flex gap-2">
                <Input
                  placeholder="답글을 입력해주세요..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1 text-sm rounded-full"
                />
                <Button
                  size="sm"
                  onClick={() => handleReply(comment.id)}
                  className="bg-pink-500 hover:bg-pink-600 rounded-full"
                >
                  등록
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                  className="rounded-full"
                >
                  취소
                </Button>
              </div>
            </div>
          )}
          
          {comment.replies && comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-pink-500" />
        <h3 className="font-bold text-gray-800">댓글 {comments.length}개</h3>
      </div>
      
      {/* 댓글 작성 */}
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">나</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="댓글을 입력해주세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 rounded-full"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="bg-pink-500 hover:bg-pink-600 rounded-full"
          >
            등록
          </Button>
        </div>
      </div>
      
      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
