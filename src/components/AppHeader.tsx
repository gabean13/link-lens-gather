
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Sparkles, Search, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { ApiKeyInput } from './ApiKeyInput';

export function AppHeader() {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  useEffect(() => {
    const handleStorageChange = () => {
      setApiKey(localStorage.getItem('gemini_api_key') || '');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setShowApiKeyDialog(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="rounded-xl hover:bg-slate-100 transition-colors" />
            
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">링크포켓</h1>
                <p className="text-xs text-slate-500">스마트 링크 관리 시스템</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="링크 검색..."
                className="pl-10 w-64 bg-slate-50 border-slate-200 focus:border-blue-400 rounded-xl"
              />
            </div>
            
            {apiKey ? (
              <Badge 
                variant="outline" 
                className="bg-green-50 border-green-200 text-green-700 cursor-pointer hover:bg-green-100"
                onClick={() => setShowApiKeyDialog(true)}
              >
                <Key className="w-3 h-3 mr-1" />
                AI 연결됨
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeyDialog(true)}
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
              >
                <Key className="w-4 h-4 mr-2" />
                API 키 설정
              </Button>
            )}
          </div>
        </div>
      </header>

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
              <Key className="w-6 h-6 text-blue-500" />
              Gemini API 키 관리
            </DialogTitle>
          </DialogHeader>
          <ApiKeyInput onApiKeySet={handleApiKeySet} currentApiKey={apiKey} />
        </DialogContent>
      </Dialog>
    </>
  );
}
