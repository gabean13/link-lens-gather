
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { MainContent } from '@/components/MainContent';
import { mockLinks } from '@/data/mockData';

const Index = () => {
  const [links, setLinks] = useState(mockLinks.map(link => ({
    ...link,
    folder: link.folder || '기타' // 기본 폴더 설정
  })));
  const [currentMenu, setCurrentMenu] = useState('home');
  const [userFolders, setUserFolders] = useState([
    '개발/코딩', '디자인/UI-UX', '뉴스/트렌드', '학습/교육', '블로그/아티클', '도구/서비스', '기타'
  ]);

  const handleAddLink = (newLink: any) => {
    // AI 자동 분류된 폴더가 사용자 폴더 목록에 없으면 추가
    if (newLink.folder && !userFolders.includes(newLink.folder)) {
      setUserFolders(prev => [...prev, newLink.folder]);
    }
    
    setLinks(prev => [{ ...newLink, id: Date.now().toString() }, ...prev]);
  };

  const handleDeleteLink = (linkId: string) => {
    setLinks(prev => prev.filter(link => link.id !== linkId));
  };

  const handleCreateFolder = (folderName: string) => {
    if (!userFolders.includes(folderName)) {
      setUserFolders(prev => [...prev, folderName]);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <AppSidebar 
          onMenuClick={setCurrentMenu} 
          currentMenu={currentMenu}
          userFolders={userFolders}
          onCreateFolder={handleCreateFolder}
        />
        
        <main className="flex-1">
          <AppHeader />
          <MainContent 
            currentMenu={currentMenu}
            links={links}
            onAddLink={handleAddLink}
            onDeleteLink={handleDeleteLink}
            setCurrentMenu={setCurrentMenu}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
