
import { useState } from 'react';
import { Users, TrendingUp, Star, Folder, Heart, Share2, Sparkles, BookOpen, Clock, Tag } from 'lucide-react';
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

interface AppSidebarProps {
  onMenuClick: (menu: string) => void;
  currentMenu: string;
}

const menuItems = [
  { 
    id: 'popular', 
    title: '🔥 인기 링크', 
    icon: TrendingUp, 
    description: '지금 핫한 링크들'
  },
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
  { 
    id: 'weekly', 
    title: '📊 주간 인기', 
    icon: Star, 
    description: '이번 주 TOP 링크'
  },
];

const smartFeatures = [
  { 
    id: 'ai-recommend', 
    title: 'AI 추천', 
    icon: Sparkles, 
    description: '맞춤 링크 추천'
  },
  { 
    id: 'similar-links', 
    title: '비슷한 링크', 
    icon: BookOpen, 
    description: '연관 링크 찾기'
  },
  { 
    id: 'reading-time', 
    title: '읽기 시간', 
    icon: Clock, 
    description: '예상 읽기 시간'
  },
];

export function AppSidebar({ onMenuClick, currentMenu }: AppSidebarProps) {
  const { open } = useSidebar();

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
              <p className="text-xs text-gray-500">소셜 & 발견</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-pink-600 font-semibold">
            🌟 소셜 기능
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-600 font-semibold">
            ⚡ 스마트 기능
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {smartFeatures.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onMenuClick(item.id)}
                    className={`rounded-xl transition-all ${
                      currentMenu === item.id 
                        ? 'bg-purple-100 text-purple-700 font-medium' 
                        : 'hover:bg-purple-50'
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
