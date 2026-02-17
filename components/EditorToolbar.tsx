
import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Undo, Redo, RemoveFormatting, List, ListOrdered, MousePointer2, Globe
} from 'lucide-react';

interface EditorToolbarProps {
  onGlobalAlign: (align: 'left' | 'center' | 'right' | 'justify') => void;
  currentGlobalAlign: string;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onGlobalAlign, currentGlobalAlign }) => {
  const [isGlobalMode, setIsGlobalMode] = useState(false);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    if (isGlobalMode) {
      onGlobalAlign(align);
    } else {
      // Map 'justify' to 'justifyFull' for execCommand
      const cmd = align === 'justify' ? 'justifyFull' : 
                  align === 'center' ? 'justifyCenter' : 
                  align === 'right' ? 'justifyRight' : 'justifyLeft';
      exec(cmd);
    }
  };

  return (
    <div className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-2 mb-4 flex flex-wrap items-center gap-1 shadow-md rounded-t-xl transition-all duration-300">
      {/* Mode Switcher */}
      <div className="flex items-center gap-1 pr-3 mr-2 border-r border-gray-300">
        <button 
          onClick={() => setIsGlobalMode(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!isGlobalMode ? 'bg-indigo-600 text-white shadow-inner' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          title="Format hanya teks yang diblok/dipilih"
        >
          <MousePointer2 size={14} /> LOKAL
        </button>
        <button 
          onClick={() => setIsGlobalMode(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isGlobalMode ? 'bg-orange-600 text-white shadow-inner' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          title="Format seluruh soal (Global)"
        >
          <Globe size={14} /> GLOBAL
        </button>
      </div>

      <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
        <button onClick={() => exec('undo')} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700" title="Urungkan (Ctrl+Z)"><Undo size={18} /></button>
        <button onClick={() => exec('redo')} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700" title="Ulangi (Ctrl+Y)"><Redo size={18} /></button>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-gray-200">
        <button onClick={() => exec('bold')} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700 font-bold" title="Tebal (Ctrl+B)"><Bold size={18} /></button>
        <button onClick={() => exec('italic')} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700 italic" title="Miring (Ctrl+I)"><Italic size={18} /></button>
        <button onClick={() => exec('underline')} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700 underline" title="Garis Bawah (Ctrl+U)"><Underline size={18} /></button>
      </div>

      <div className={`flex items-center gap-1 px-2 border-r border-gray-200 transition-all rounded-md py-0.5 ${isGlobalMode ? 'bg-orange-50' : 'bg-indigo-50'}`}>
        <button 
          onClick={() => handleAlign('left')} 
          className={`p-1.5 rounded transition-all ${(!isGlobalMode || currentGlobalAlign === 'left') ? 'text-gray-900' : 'text-gray-400 opacity-50'} hover:bg-white hover:shadow-sm`}
          title={isGlobalMode ? "Rata Kiri (Global)" : "Rata Kiri (Pilihan)"}
        >
          <AlignLeft size={18} />
        </button>
        <button 
          onClick={() => handleAlign('center')} 
          className={`p-1.5 rounded transition-all ${(!isGlobalMode || currentGlobalAlign === 'center') ? 'text-gray-900' : 'text-gray-400 opacity-50'} hover:bg-white hover:shadow-sm`}
          title={isGlobalMode ? "Rata Tengah (Global)" : "Rata Tengah (Pilihan)"}
        >
          <AlignCenter size={18} />
        </button>
        <button 
          onClick={() => handleAlign('right')} 
          className={`p-1.5 rounded transition-all ${(!isGlobalMode || currentGlobalAlign === 'right') ? 'text-gray-900' : 'text-gray-400 opacity-50'} hover:bg-white hover:shadow-sm`}
          title={isGlobalMode ? "Rata Kanan (Global)" : "Rata Kanan (Pilihan)"}
        >
          <AlignRight size={18} />
        </button>
        <button 
          onClick={() => handleAlign('justify')} 
          className={`p-1.5 rounded transition-all ${(!isGlobalMode || currentGlobalAlign === 'justify') ? 'text-gray-900' : 'text-gray-400 opacity-50'} hover:bg-white hover:shadow-sm`}
          title={isGlobalMode ? "Rata Kanan Kiri (Global)" : "Rata Kanan Kiri (Pilihan)"}
        >
          <AlignJustify size={18} />
        </button>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-gray-200">
        <button onClick={() => exec('insertUnorderedList')} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700" title="Daftar Simbol"><List size={18} /></button>
        <button onClick={() => exec('insertOrderedList')} className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700" title="Daftar Angka"><ListOrdered size={18} /></button>
      </div>

      <div className="flex items-center gap-1 pl-2">
        <button onClick={() => exec('removeFormat')} className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors" title="Hapus Format"><RemoveFormatting size={18} /></button>
      </div>
      
      <div className="ml-auto flex flex-col items-end">
        <span className={`text-[9px] font-black tracking-tighter uppercase ${isGlobalMode ? 'text-orange-600' : 'text-indigo-600'}`}>
          {isGlobalMode ? 'Mode Edit Semua Soal' : 'Mode Edit Teks Terpilih'}
        </span>
        <span className="text-[8px] text-gray-400 italic leading-none">Blok teks untuk modifikasi lokal</span>
      </div>
    </div>
  );
};

export default EditorToolbar;
