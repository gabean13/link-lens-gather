
import { Clock, TrendingUp, Eye, Heart, Sparkles, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LinkCard } from './LinkCard';

interface SmartRecommendationsProps {
  links: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    tags: string[];
    image: string;
    addedAt: string;
    isRead: boolean;
  }>;
}

export function SmartRecommendations({ links }: SmartRecommendationsProps) {
  const unreadLinks = links.filter(link => !link.isRead);
  const recentLinks = links
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 3);
  const trendingTags = ['Development', 'Design', 'Travel'];
  const recommendedLinks = links.filter(link => 
    link.tags.some(tag => trendingTags.includes(tag))
  ).slice(0, 2);

  if (links.length === 0) return null;

  return (
    <div className="space-y-8 mb-8">
      {/* 안 읽은 링크들 */}
      {unreadLinks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">아직 안 읽은 링크들 📚</h2>
            <Badge className="bg-orange-100 text-orange-700 rounded-full">
              {unreadLinks.length}개
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unreadLinks.slice(0, 3).map(link => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        </section>
      )}

      {/* 최근 추가된 링크들 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">최근에 추가한 링크들 ⏰</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentLinks.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      </section>

      {/* 추천 링크들 */}
      {recommendedLinks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">이런 링크는 어때요? 💡</h2>
            <Badge className="bg-green-100 text-green-700 rounded-full">
              AI 추천
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendedLinks.map(link => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        </section>
      )}

      {/* 인기 태그 섹션 */}
      <section>
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              요즘 인기 태그들 🔥
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag, index) => (
                <Badge 
                  key={tag} 
                  className={`rounded-full font-medium px-4 py-2 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-700' :
                    index === 1 ? 'bg-gradient-to-r from-pink-200 to-red-200 text-red-700' :
                    'bg-gradient-to-r from-blue-200 to-purple-200 text-purple-700'
                  }`}
                >
                  <Star className="w-3 h-3 mr-1" />
                  #{tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              다른 사용자들이 많이 저장한 태그들이에요! 트렌드를 놓치지 마세요 ✨
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 전체 링크 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">모든 링크들 📋</h2>
          <Badge className="bg-gray-100 text-gray-700 rounded-full">
            {links.length}개
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {links.map(link => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      </section>
    </div>
  );
}
