
import React, { useState } from 'react';
import { Users, Shuffle, LayoutGrid, Loader2, Download } from 'lucide-react';
import { Participant, Group } from '../types';

interface AutoGroupingProps {
  participants: Participant[];
  savedGroups: Group[];
  onSaveGroups: (groups: Group[]) => void;
}

const AutoGrouping: React.FC<AutoGroupingProps> = ({ participants, savedGroups, onSaveGroups }) => {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState(false);

  const performGrouping = async () => {
    if (participants.length === 0) return;
    setIsGenerating(true);

    // Simulate delay for "feeling" of processing
    await new Promise(resolve => setTimeout(resolve, 800));

    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const result: Group[] = [];
    const numGroups = Math.ceil(shuffled.length / groupSize);

    for (let i = 0; i < numGroups; i++) {
      result.push({
        id: `group-${i}`,
        name: `第 ${i + 1} 組`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
      });
    }

    onSaveGroups(result);
    setIsGenerating(false);
  };

  const downloadCSV = () => {
    if (savedGroups.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "組別名稱,成員姓名\n";

    savedGroups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <Users className="text-indigo-600" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">自動分組</h2>
            <p className="text-slate-500">立即將成員隨機分配到各組。</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-end">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">每組人數</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="number"
                min="2"
                max={participants.length || 100}
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
          </div>

          <button
            onClick={performGrouping}
            disabled={isGenerating || participants.length === 0}
            className="py-3.5 px-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                正在生成分組...
              </>
            ) : (
              <>
                <Shuffle size={20} />
                開始隨機分組
              </>
            )}
          </button>
        </div>
      </div>

      {savedGroups.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <LayoutGrid size={20} className="text-indigo-600" />
              分組結果
            </h3>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors font-semibold text-sm shadow-sm"
            >
              <Download size={18} /> 下載 CSV 紀錄
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedGroups.map((group, idx) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-indigo-300 transition-colors group animate-in zoom-in duration-300"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-indigo-900 truncate pr-4">{group.name}</h3>
                  <span className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-500">
                    {group.members.length} 位
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  {group.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 px-3 py-2 bg-slate-50/50 rounded-lg text-slate-700 hover:bg-indigo-50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span className="text-sm font-medium">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {participants.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
          <LayoutGrid className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-400 font-medium">請先在「設定名單」分頁中加入參加者。</p>
        </div>
      )}
    </div>
  );
};

export default AutoGrouping;
