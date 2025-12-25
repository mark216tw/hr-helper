
import React, { useState } from 'react';
import { LayoutDashboard, Users, Trophy, Settings2, Info } from 'lucide-react';
import ListManager from './components/ListManager';
import LuckyDraw from './components/LuckyDraw';
import AutoGrouping from './components/AutoGrouping';
import { Participant, ViewType } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('setup');
  const [participants, setParticipants] = useState<Participant[]>([]);

  // State for LuckyDraw persistence
  const [winners, setWinners] = useState<Participant[]>([]);
  const [availablePool, setAvailablePool] = useState<Participant[]>([]);

  // State for AutoGrouping persistence
  const [groups, setGroups] = useState<any[]>([]); // Using any for Group temporarily or import it

  // Initialize pool when participants change, but ONLY if we haven't started drawing yet 
  // OR if we want to reset. 
  // Actually, standard behavior: if I change participants, pool should reset?
  // Let's keep it simple: sync functionality in App or let LuckyDraw handle sync via effect but we pass the state.
  // Better: Let LuckyDraw manage its internal logic but receive 'initialPool' and 'onWinnersChange'?
  // No, to persist, 'winners' and 'availablePool' must live here.

  // Sync availablePool with participants ONLY when participants change and we reset?
  // Or just sync initially.
  // Simplified approach: When entering LuckyDraw, if pool is empty/mismatched, we might want to sync.
  // Let's passed shared state to components.

  const handleUpdateList = (newList: Participant[]) => {
    setParticipants(newList);
    // When list changes, we should probably reset the poll or at least ensure new people are added?
    // For simplicity: reset pool to new list.
    setAvailablePool(newList);
    setWinners([]);
  };

  const navItems = [
    { id: 'setup', label: '設定名單', icon: Settings2 },
    { id: 'lucky-draw', label: '獎品抽籤', icon: Trophy },
    { id: 'grouping', label: '自動分組', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <LayoutDashboard size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                  HR 萬用工具箱
                </h1>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">專業活動管理助手</p>
              </div>
            </div>

            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as ViewType)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeView === item.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-400 font-medium">目前的清單</p>
                <p className="text-sm font-bold text-slate-700">{participants.length} 位成員</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in duration-500">
          <div style={{ display: activeView === 'setup' ? 'block' : 'none' }}>
            <ListManager participants={participants} onUpdate={handleUpdateList} />
          </div>
          {activeView === 'lucky-draw' && (
            <LuckyDraw
              participants={participants}
              savedWinners={winners}
              savedPool={availablePool}
              onSaveState={(newWinners, newPool) => {
                setWinners(newWinners);
                setAvailablePool(newPool);
              }}
            />
          )}
          {activeView === 'grouping' && (
            <AutoGrouping
              participants={participants}
              savedGroups={groups}
              onSaveGroups={setGroups}
            />
          )}
        </div>
      </main>

      {/* Footer / Mobile Nav */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`flex flex-col items-center gap-1 transition-all ${activeView === item.id ? 'text-indigo-600' : 'text-slate-400'
                  }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-bold uppercase">{item.label}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};

export default App;
