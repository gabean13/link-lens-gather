
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Sparkles } from 'lucide-react';

export function AppHeader() {
  return (
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
  );
}
