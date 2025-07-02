
import { useState } from 'react';
import { Users, Folder, Heart, Share2, Sparkles, Tag, Plus, ChevronRight, ChevronDown } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  onMenuClick: (menu: string) => void;
  currentMenu: string;
}

const socialMenuItems = [
  { 
    id: 'friends', 
    title: '👫 친구들의 링크', 
    icon: Users, 
    description: '친구들이 공유한 링크'
  },
  { 
    id: 'collections', 
    title: '👥 컬렉션 & 소셜', 
    icon: Folder, 
    description: '공유 컬렉션 둘러보기'
  },
];

export function AppSidebar({ onMenuClick, currentMenu }: AppSidebarProps) {
  const { open } = useSidebar();
  const [showTags, setShowTags] = useState(true);
  const [showFolders, setShowFolders] = useState(true);

  // Mock data - 실제로는 props나 상태관리에서 가져올 것
  const userTags = ['React', 'JavaScript', 'Design', 'Tutorial', 'News'];
  const userFolders = ['프로젝트', '공부', '영감', '나중에 읽기'];

  return (
    <Sidebar className="bg-gradient-to-b from-pink-50 to-purple-50 border-r-2 border-pink-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {open && (
            <div>
              <h2 className="font-bold text-gray-800">링크포켓</h2>
              <p className="text-xs text-gray-500">개인 아카이브</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
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
                className="h-6 w-6 p-0 hover:bg-blue-50"
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
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      {open && <span>#{tag}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {open && (
                  <SidebarMenuItem>
                    <SidebarMenuButton className="rounded-xl hover:bg-blue-50 text-blue-600">
                      <Plus className="w-3 h-3" />
                      <span>새 태그</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* 폴더 섹션 */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-600 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              폴더
            </span>
            {open && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFolders(!showFolders)}
                className="h-6 w-6 p-0 hover:bg-purple-50"
              >
                {showFolders ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </Button>
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
                          ? 'bg-purple-100 text-purple-700 font-medium' 
                          : 'hover:bg-purple-50'
                      }`}
                    >
                      <Folder className="w-3 h-3" />
                      {open && <span>{folder}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {open && (
                  <SidebarMenuItem>
                    <SidebarMenuButton className="rounded-xl hover:bg-purple-50 text-purple-600">
                      <Plus className="w-3 h-3" />
                      <span>새 폴더</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* 소셜 기능 섹션 */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-pink-600 font-semibold">
            🌟 소셜 기능
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {socialMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onMenuClick(item.id)}
                    className={`rounded-xl transition-all ${
                      currentMenu === item.id 
                        ? 'bg-pink-100 text-pink-700 font-medium' 
                        : 'hover:bg-pink-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {open && (
                      <div className="flex-1">
                        <span>{item.title}</span>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
