
import React, { useState } from 'react';
import { parseExcelFile } from './services/excelParser';
import { Question, HeaderInfo, AppSettings } from './types';
import QuestionRenderer from './components/QuestionRenderer';
import EditorToolbar from './components/EditorToolbar';
import { FileUp, Printer, Eye, EyeOff, Building2 } from 'lucide-react';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [header, setHeader] = useState<HeaderInfo>({
    schoolName: 'NAMA SEKOLAH ANDA',
    subject: 'MATA PELAJARAN',
    grade: 'KELAS / SEMESTER',
    academicYear: '2023/2024',
    timeLimit: '90 Menit'
  });
  const [settings, setSettings] = useState<AppSettings>({
    columns: 2,
    showKop: true,
    showExplanation: false,
    fontSize: 11,
    globalAlign: 'justify'
  });
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = await parseExcelFile(file);
      setQuestions(data);
    } catch (error) {
      alert("Gagal membaca file Excel.");
    } finally {
      setLoading(false);
    }
  };

  const setGlobalAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    setSettings(prev => ({ ...prev, globalAlign: align }));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100">
      <aside className="no-print w-full md:w-80 bg-slate-900 text-white p-6 sticky top-0 md:h-screen overflow-y-auto z-50 shadow-2xl">
        <h1 className="text-xl font-bold mb-8 flex items-center gap-2">
          <Printer className="text-blue-400" /> HTML Print Pro
        </h1>

        <div className="space-y-6">
          <section>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Impor Data Excel</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 bg-slate-800 transition-all">
              <FileUp className="w-6 h-6 mb-1 text-slate-400" />
              <p className="text-xs text-slate-400">Pilih File (.xlsx)</p>
              <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </label>
          </section>

          <section>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Kolom Cetak</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setSettings(s => ({ ...s, columns: num as 1|2|3 }))}
                  className={`py-2 rounded-lg text-sm transition-colors ${settings.columns === num ? 'bg-blue-600 font-bold' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  {num} Kol
                </button>
              ))}
            </div>
          </section>

          <section className="flex gap-2">
            <button
              onClick={() => setSettings(s => ({ ...s, showKop: !s.showKop }))}
              className={`flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors ${settings.showKop ? 'bg-green-700 font-bold' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              <Building2 size={14} /> KOP Surat
            </button>
            <button
              onClick={() => setSettings(s => ({ ...s, showExplanation: !s.showExplanation }))}
              className={`flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors ${settings.showExplanation ? 'bg-orange-700 font-bold' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              {settings.showExplanation ? <EyeOff size={14} /> : <Eye size={14} />} Kunci
            </button>
          </section>

          <section>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Ukuran Teks ({settings.fontSize}px)</label>
            <input 
              type="range" min="8" max="14" step="0.5"
              value={settings.fontSize}
              onChange={(e) => setSettings(s => ({ ...s, fontSize: parseFloat(e.target.value) }))}
              className="w-full accent-blue-500 bg-slate-800 rounded-lg"
            />
          </section>

          <button
            onClick={() => window.print()}
            disabled={questions.length === 0}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <Printer size={20} /> CETAK SEKARANG
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-0 md:p-8 bg-slate-200">
        <div className="mx-auto max-w-[210mm] min-h-screen">
          <EditorToolbar onGlobalAlign={setGlobalAlign} currentGlobalAlign={settings.globalAlign} />
          
          <div className="page-container bg-white shadow-2xl p-[12mm] md:p-[15mm] preview-area">
            {settings.showKop && (
              <header className="mb-6 border-b-4 border-double border-black pb-4 text-center no-print-align" style={{ textAlign: 'center' }}>
                <h2 className="text-2xl font-bold uppercase mb-1 outline-none" contentEditable suppressContentEditableWarning 
                  onBlur={(e) => setHeader(h => ({...h, schoolName: e.currentTarget.innerText}))}>
                  {header.schoolName}
                </h2>
                <div className="grid grid-cols-2 gap-x-8 text-left mt-4 text-[12px] font-bold">
                  {[
                    ['Mata Pelajaran', 'subject'],
                    ['Kelas/Semester', 'grade'],
                    ['Tahun Ajaran', 'academicYear'],
                    ['Alokasi Waktu', 'timeLimit']
                  ].map(([label, key]) => (
                    <div key={key} className="flex border-b border-black py-0.5">
                      <span className="whitespace-nowrap w-32">{label}:</span>
                      <span contentEditable suppressContentEditableWarning className="flex-1 outline-none px-1" 
                        onBlur={(e) => setHeader(h => ({...h, [key]: e.currentTarget.innerText}))}>
                        {(header as any)[key]}
                      </span>
                    </div>
                  ))}
                </div>
              </header>
            )}

            {loading ? (
              <div className="py-20 text-center text-slate-400 italic">Memproses data...</div>
            ) : questions.length > 0 ? (
              <div 
                className="transition-all duration-300"
                style={{ 
                  columnCount: settings.columns,
                  columnGap: '1.25rem',
                  columnFill: 'balance',
                  widows: 2,
                  orphans: 2,
                  textAlign: settings.globalAlign as any
                }}
              >
                {questions.map((q) => (
                  <QuestionRenderer 
                    key={q.no} 
                    question={q} 
                    showExplanation={settings.showExplanation} 
                    fontSize={settings.fontSize} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-40 text-center text-slate-400 bg-white/50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-xl font-bold opacity-50">Silakan Impor File Excel</p>
                <p className="text-sm">Gunakan tombol di sidebar kiri untuk memulai</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
