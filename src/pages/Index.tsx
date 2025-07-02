
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { MainContent } from '@/components/MainContent';
import { mockLinks } from '@/data/mockData';

const Index = () => {
  const [links, setLinks] = useState(mockLinks);
  const [currentMenu, setCurrentMenu] = useState('home');

  const handleAddLink = (newLink: any) => {
    setLinks(prev => [{ ...newLink, id: Date.now().toString() }, ...prev]);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <AppSidebar onMenuClick={setCurrentMenu} currentMenu={currentMenu} />
        
        <main className="flex-1">
          <AppHeader />
          <MainContent 
            currentMenu={currentMenu}
            links={links}
            onAddLink={handleAddLink}
            setCurrentMenu={setCurrentMenu}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
