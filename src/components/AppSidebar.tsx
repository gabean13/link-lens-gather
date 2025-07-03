
import { useState } from 'react';
import { Folder, Tag, Plus, ChevronRight, ChevronDown, FolderPlus, Home } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AppSidebarProps {
  onMenuClick: (menu: string) => void;
  currentMenu: string;
  userFolders: string[];
  onCreateFolder: (folderName: string) => void;
}

export function AppSidebar({ onMenuClick, currentMenu, userFolders, onCreateFolder }: AppSidebarProps) {
  const { open } = useSidebar();
  const [showTags, setShowTags] = useState(true);
  const [showFolders, setShowFolders] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const userTags = ['React', 'JavaScript', 'Design', 'Tutorial', 'News', 'AI', 'Development'];

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateDialog(false);
      toast.success(`"${newFolderName}" 폴더가 생성되었습니다! 📁`);
    }
  };

  return (
    <Sidebar className="bg-gradient-to-b from-slate-50 to-slate-100 border-r-2 border-slate-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Folder className="w-6 h-6 text-white" />
          </div>
          {open && (
            <div>
              <Button
                variant="ghost"
                onClick={() => onMenuClick('home')}
                className="p-0 h-auto font-bold text-slate-800 hover:text-blue-600 transition-colors"
              >
                링크포켓
              </Button>
              <p className="text-xs text-slate-500">스마트 링크 관리</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* 홈 버튼 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onMenuClick('home')}
                  className={`rounded-xl transition-all ${
                    currentMenu === 'home' 
                      ? 'bg-blue-100 text-blue-700 font-medium shadow-sm' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  {open && <span>홈</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 폴더 섹션 */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-600 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              폴더
            </span>
            {open && (
              <div className="flex gap-1">
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-purple-100 text-purple-600"
                    >
                      <FolderPlus className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>새 폴더 만들기</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="폴더 이름을 입력하세요"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          취소
                        </Button>
                        <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                          생성
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFolders(!showFolders)}
                  className="h-6 w-6 p-0 hover:bg-purple-100"
                >
                  {showFolders ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </Button>
              </div>
            )}
          </SidebarGroupLabel>
          {showFolders && (
            <SidebarGroupContent>
              <SidebarMenu>
                {userFolders.map((folder) => (
                  <SidebarMenuItem key={folder}>
                    <SidebarMenuButton
                      onClick={() => onMenuClick(`folder:${folder}`)}
                      className={`rounded-xl transition-all ${
                        currentMenu === `folder:${folder}` 
                          ? 'bg-purple-100 text-purple-700 font-medium shadow-sm' 
                          : 'hover:bg-purple-50'
                      }`}
                    >
                      <Folder className="w-3 h-3" />
                      {open && <span>{folder}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* 태그 섹션 */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-600 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              태그
            </span>
            {open && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTags(!showTags)}
                className="h-6 w-6 p-0 hover:bg-blue-100"
              >
                {showTags ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </Button>
            )}
          </SidebarGroupLabel>
          {showTags && (
            <SidebarGroupContent>
              <SidebarMenu>
                {userTags.map((tag) => (
                  <SidebarMenuItem key={tag}>
                    <SidebarMenuButton
                      onClick={() => onMenuClick(`tag:${tag}`)}
                      className={`rounded-xl transition-all ${
                        currentMenu === `tag:${tag}` 
                          ? 'bg-blue-100 text-blue-700 font-medium shadow-sm' 
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      {open && <span>#{tag}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
