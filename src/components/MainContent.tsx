
import { PersonalArchive } from '@/components/PersonalArchive';
import { FriendsPanel } from '@/components/FriendsPanel';
import { CollectionsPanel } from '@/components/CollectionsPanel';
import { WeeklyTopLinks } from '@/components/WeeklyTopLinks';
import { SmartRecommendations } from '@/components/SmartRecommendations';

interface MainContentProps {
  currentMenu: string;
  links: any[];
  onAddLink: (newLink: any) => void;
  setCurrentMenu: (menu: string) => void;
}

export function MainContent({ currentMenu, links, onAddLink, setCurrentMenu }: MainContentProps) {
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
        return <PersonalArchive links={links} onAddLink={onAddLink} />;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
}
