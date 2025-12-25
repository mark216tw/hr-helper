
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RefreshCcw, Settings, CheckCircle2 } from 'lucide-react';
import { Participant } from '../types';

interface LuckyDrawProps {
  participants: Participant[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<string | null>(null);
  const [availablePool, setAvailablePool] = useState<Participant[]>(participants);

  // Sync pool when participants change
  useEffect(() => {
    setAvailablePool(participants);
  }, [participants]);

  const drawWinner = useCallback(() => {
    if (availablePool.length === 0) {
      alert("抽籤池中已無參加者！");
      return;
    }

    setIsSpinning(true);
    let counter = 0;
    const duration = 2000;
    const intervalTime = 50;
    const steps = duration / intervalTime;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availablePool.length);
      setCurrentDisplay(availablePool[randomIndex].name);
      counter++;

      if (counter >= steps) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * availablePool.length);
        const winner = availablePool[finalIndex];
        
        setWinners(prev => [winner, ...prev]);
        setCurrentDisplay(winner.name);
        setIsSpinning(false);

        if (!allowDuplicates) {
          setAvailablePool(prev => prev.filter(p => p.id !== winner.id));
        }
      }
    }, intervalTime);
  }, [availablePool, allowDuplicates]);

  const reset = () => {
    if (window.confirm('確定要重設抽籤結果嗎？')) {
      setWinners([]);
      setCurrentDisplay(null);
      setAvailablePool(participants);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-50 rounded-full">
            <Trophy className="text-amber-500" size={48} />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-2">獎品抽籤</h2>
        <p className="text-slate-500 mb-8">準備好選出幸運得主了嗎？點擊按鈕開始！</p>

        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-md h-32 flex items-center justify-center bg-slate-900 rounded-2xl border-4 border-indigo-500 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 to-transparent animate-pulse" />
            <span className={`text-4xl font-black tracking-wider transition-all duration-75 ${isSpinning ? 'text-indigo-400 scale-95 blur-[1px]' : 'text-white'}`}>
              {currentDisplay || '準備好了嗎？'}
            </span>
          </div>

          <div className="flex items-center gap-6">
             <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">
                允許重複中獎
              </span>
            </label>
            <button
              onClick={reset}
              className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1 font-medium transition-colors"
            >
              <RefreshCcw size={16} /> 重置抽籤
            </button>
          </div>

          <button
            onClick={drawWinner}
            disabled={isSpinning || availablePool.length === 0}
            className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xl font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 flex items-center gap-3"
          >
            {isSpinning ? '抽獎中...' : '開始抽籤！'}
          </button>
          
          {availablePool.length === 0 && participants.length > 0 && (
            <p className="text-red-500 text-sm font-medium">名單已全數抽出！請重置抽籤池。</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold text-lg">
            <CheckCircle2 size={20} />
            中獎英雄榜
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {winners.length === 0 ? (
              <p className="text-center py-8 text-slate-400 italic">尚無中獎者</p>
            ) : (
              winners.map((winner, idx) => (
                <div key={`${winner.id}-${idx}`} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-emerald-200 text-emerald-700 rounded-full text-xs font-bold">
                      {winners.length - idx}
                    </span>
                    <span className="font-semibold text-slate-700">{winner.name}</span>
                  </div>
                  <Trophy size={16} className="text-emerald-500" />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-slate-600 font-bold text-lg">
            <Settings size={20} />
            抽籤池狀態
          </div>
          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">剩餘人數</span>
              <span className="font-bold text-slate-800">{availablePool.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">總人數</span>
              <span className="font-bold text-slate-800">{participants.length}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500" 
                style={{ width: `${participants.length > 0 ? (availablePool.length / participants.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
