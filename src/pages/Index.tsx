
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { PersonalArchive } from '@/components/PersonalArchive';
import { FriendsPanel } from '@/components/FriendsPanel';
import { CollectionsPanel } from '@/components/CollectionsPanel';
import { WeeklyTopLinks } from '@/components/WeeklyTopLinks';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { mockLinks } from '@/data/mockData';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [links, setLinks] = useState(mockLinks);
  const [currentMenu, setCurrentMenu] = useState('home');

  const handleAddLink = (newLink: any) => {
    setLinks(prev => [{ ...newLink, id: Date.now().toString() }, ...prev]);
  };

  const renderContent = () => {
    switch (currentMenu) {
      case 'popular':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">🔥 인기 링크</h1>
              <p className="text-gray-600">지금 가장 인기있는 링크들을 확인해보세요</p>
            </div>
            <SmartRecommendations links={links.slice().sort(() => Math.random() - 0.5).slice(0, 12)} />
          </div>
        );
      case 'friends':
        return <FriendsPanel onClose={() => setCurrentMenu('home')} />;
      case 'collections':
        return <CollectionsPanel onClose={() => setCurrentMenu('home')} />;
      case 'weekly':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">📊 주간 인기 링크</h1>
              <p className="text-gray-600">이번 주 가장 많이 저장된 링크들</p>
            </div>
            <WeeklyTopLinks />
          </div>
        );
      default:
        return <PersonalArchive links={links} onAddLink={handleAddLink} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <AppSidebar onMenuClick={setCurrentMenu} currentMenu={currentMenu} />
        
        <main className="flex-1">
          {/* 상단 헤더 */}
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-200 shadow-sm">
            <div className="flex items-center gap-4 px-4 py-3">
              <SidebarTrigger className="rounded-xl hover:bg-pink-50" />
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">링크포켓</h1>
                  <p className="text-xs text-gray-500">나만의 링크 보관함 💝</p>
                </div>
              </div>
            </div>
          </header>

          {/* 메인 콘텐츠 */}
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
