
import React, { useState, useMemo } from 'react';
import { Upload, UserPlus, Users, Trash2, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { Participant } from '../types';

interface ListManagerProps {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
}

const ListManager: React.FC<ListManagerProps> = ({ participants, onUpdate }) => {
  const [rawText, setRawText] = useState('');

  // 偵測重複姓名
  const duplicateNames = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return Object.keys(counts).filter(name => counts[name] > 1);
  }, [participants]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      const newList = lines.map((name, index) => ({
        id: `csv-${Date.now()}-${index}`,
        name: name.split(',')[0].replace(/"/g, '').trim()
      })).filter(p => p.name.length > 0);
      
      onUpdate([...participants, ...newList]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddFromText = () => {
    const names = rawText.split(/\r?\n/).filter(line => line.trim() !== '');
    const newList = names.map((name, index) => ({
      id: `text-${Date.now()}-${index}`,
      name: name.trim()
    }));
    onUpdate([...participants, ...newList]);
    setRawText('');
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniqueList);
  };

  const clearAll = () => {
    if (window.confirm('確定要清除所有參加者嗎？')) {
      onUpdate([]);
    }
  };

  const generateMockData = () => {
    const mockNames = [
      "陳小明", "林美惠", "張大為", "李宜芳", "王家豪", 
      "劉子軒", "蔡淑芬", "楊雅婷", "黃俊傑", "吳志強",
      "郭欣怡", "周杰倫", "徐若瑄", "林志玲", "彭于晏",
      "張惠妹", "蔡依林", "周星馳", "金城武", "梁朝偉",
      "陳小明", "林美惠" // 故意加入重複項測試
    ];
    const newList = mockNames.map((name, index) => ({
      id: `mock-${Date.now()}-${index}`,
      name
    }));
    onUpdate([...participants, ...newList]);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <UserPlus size={20} />
              <h2 className="font-semibold text-lg">手動輸入姓名</h2>
            </div>
            <button 
              onClick={generateMockData}
              className="text-xs flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md hover:bg-amber-100 transition-colors"
            >
              <Sparkles size={12} /> 產生模擬名單
            </button>
          </div>
          <textarea
            className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none mb-4 text-sm"
            placeholder="請輸入姓名（一行一個）..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <button
            onClick={handleAddFromText}
            disabled={!rawText.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            加入清單
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <Upload size={20} />
            <h2 className="font-semibold text-lg">上傳 CSV 檔案</h2>
          </div>
          <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 transition-colors cursor-pointer relative group">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="text-slate-400 mb-2 group-hover:text-indigo-500" size={32} />
            <p className="text-sm text-slate-500">點擊上傳或拖曳 CSV 檔案至此</p>
          </div>
          <p className="mt-4 text-xs text-slate-400">支援格式：.csv, .txt (第一欄為姓名，或一行一個姓名)</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Users size={20} />
            <h2 className="font-semibold text-lg">目前的清單 ({participants.length})</h2>
          </div>
          <div className="flex gap-4">
            {duplicateNames.length > 0 && (
              <button
                onClick={removeDuplicates}
                className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1 font-medium bg-amber-50 px-3 py-1 rounded-lg"
              >
                <AlertCircle size={16} /> 移除重複項 ({duplicateNames.length})
              </button>
            )}
            {participants.length > 0 && (
              <button
                onClick={clearAll}
                className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 font-medium"
              >
                <Trash2 size={16} /> 全部清除
              </button>
            )}
          </div>
        </div>
        
        {participants.length === 0 ? (
          <div className="text-center py-12 text-slate-400 italic">
            尚未加入任何名單。請由上方輸入或上傳檔案。
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto pr-2">
            {participants.map((p) => {
              const isDuplicate = duplicateNames.includes(p.name);
              return (
                <div 
                  key={p.id}
                  className={`flex items-center justify-between px-3 py-2 border rounded-lg group transition-colors ${
                    isDuplicate 
                    ? 'bg-red-50 border-red-200 hover:border-red-400' 
                    : 'bg-slate-50 border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="truncate text-sm text-slate-700 font-medium">{p.name}</span>
                    {isDuplicate && <AlertCircle size={12} className="text-red-400 shrink-0" title="重複姓名" />}
                  </div>
                  <button 
                    onClick={() => removeParticipant(p.id)}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListManager;
