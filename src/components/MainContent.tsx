
import { PersonalArchive } from '@/components/PersonalArchive';
import { FriendsPanel } from '@/components/FriendsPanel';
import { CollectionsPanel } from '@/components/CollectionsPanel';
import { WeeklyTopLinks } from '@/components/WeeklyTopLinks';
import { SmartRecommendations } from '@/components/SmartRecommendations';

interface MainContentProps {
  currentMenu: string;
  links: any[];
  onAddLink: (newLink: any) => void;
  onDeleteLink?: (linkId: string) => void;
  setCurrentMenu: (menu: string) => void;
}

export function MainContent({ currentMenu, links, onAddLink, onDeleteLink, setCurrentMenu }: MainContentProps) {
  const renderContent = () => {
    switch (currentMenu) {
      case 'friends':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">👫 친구들의 링크</h1>
              <p className="text-gray-600">친구들이 공유한 링크를 확인하고 소통해보세요</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <FriendsPanel onClose={() => setCurrentMenu('home')} />
            </div>
          </div>
        );
      case 'collections':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">👥 컬렉션 & 소셜</h1>
              <p className="text-gray-600">공유 컬렉션을 둘러보고 다른 사용자들과 연결하세요</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <CollectionsPanel onClose={() => setCurrentMenu('home')} />
            </div>
          </div>
        );
      default:
        return <PersonalArchive links={links} onAddLink={onAddLink} onDeleteLink={onDeleteLink} currentMenu={currentMenu} />;
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
}
