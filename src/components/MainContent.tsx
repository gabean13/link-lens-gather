
import { PersonalArchive } from '@/components/PersonalArchive';

interface MainContentProps {
  currentMenu: string;
  links: any[];
  onAddLink: (newLink: any) => void;
  onDeleteLink?: (linkId: string) => void;
  setCurrentMenu: (menu: string) => void;
}

export function MainContent({ currentMenu, links, onAddLink, onDeleteLink }: MainContentProps) {
  return (
    <div className="p-6">
      <PersonalArchive 
        links={links} 
        onAddLink={onAddLink} 
        onDeleteLink={onDeleteLink} 
        currentMenu={currentMenu} 
      />
    </div>
  );
}
