import React, { useEffect, useRef, useCallback } from 'react';
import { Question } from '../types';

interface QuestionRendererProps {
  question: Question;
  showExplanation: boolean;
  fontSize: number;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, showExplanation, fontSize }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderLock = useRef(false);

  const renderMath = useCallback(() => {
    if (renderLock.current) return;
    if (containerRef.current && (window as any).renderMathInElement) {
      renderLock.current = true;
      try {
        (window as any).renderMathInElement(containerRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true },
          ],
          throwOnError: false,
          errorColor: '#cc0000'
        });
      } catch (err) {
      } finally {
        setTimeout(() => { renderLock.current = false; }, 300);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(renderMath, 400);
    return () => clearTimeout(timer);
  }, [question, showExplanation, fontSize, renderMath]);

  const renderOptions = () => {
    const optionsKeys = ['a', 'b', 'c', 'd', 'e'] as const;
    const type = question.tipe?.toLowerCase() || '';

    // Tipe: Benar/Salah atau Sesuai/Tidak Sesuai (Render TABEL)
    if (type.includes('benar') || type.includes('sesuai')) {
      const isBS = type.includes('benar');
      const headerRight1 = isBS ? 'B' : 'Sesuai';
      const headerRight2 = isBS ? 'S' : 'Tidak';

      return (
        <table className="soal-table">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-8">No</th>
              <th>Pernyataan</th>
              <th className="w-12">{headerRight1}</th>
              <th className="w-12">{headerRight2}</th>
            </tr>
          </thead>
          <tbody>
            {optionsKeys.map((key, idx) => {
              const val = (question as any)[key];
              if (!val || val.trim() === '') return null;
              return (
                <tr key={key}>
                  <td>{idx + 1}</td>
                  <td contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: val }} />
                  <td></td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    // Tipe: Pilihan Jamak (Render KOTAK CENTANG)
    if (type.includes('jamak') || type.includes('mcma')) {
      return (
        <div className="mt-1.5 space-y-1">
          {optionsKeys.map((key) => {
            const val = (question as any)[key];
            if (!val || val.trim() === '') return null;
            return (
              <div key={key} className="flex items-start">
                <span className="check-box mt-1 shrink-0"></span>
                <div 
                  contentEditable 
                  suppressContentEditableWarning 
                  className="flex-1 outline-none focus:bg-blue-50/50 px-0.5 rounded overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: val }}
                />
              </div>
            );
          })}
        </div>
      );
    }

    // Default: Pilihan Ganda (Render ABCD)
    return (
      <div className="mt-1.5 space-y-0.5">
        {optionsKeys.map((key, idx) => {
          const val = (question as any)[key];
          if (!val || val.trim() === '') return null;
          return (
            <div key={key} className="flex items-start">
              <span className="font-bold mr-1.5 shrink-0 w-4">{String.fromCharCode(65 + idx)}.</span>
              <div 
                contentEditable 
                suppressContentEditableWarning 
                className="flex-1 outline-none focus:bg-blue-50/50 px-0.5 rounded overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: val }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef} 
      className="question-item mb-5 text-black leading-tight text-justify pb-1"
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className="flex items-start">
        <span className="font-bold mr-1.5 shrink-0 w-5">{question.no}.</span>
        <div className="flex-1 w-full overflow-hidden">
          <div 
            contentEditable 
            suppressContentEditableWarning 
            className="mb-1.5 outline-none focus:bg-blue-50/50 px-0.5 rounded w-full overflow-x-auto font-medium"
            dangerouslySetInnerHTML={{ __html: question.soal }}
          />

          {question.img && (
            <div className="my-2 text-center">
              <img src={question.img} alt="" className="max-w-[80%] mx-auto h-auto border border-gray-100 rounded shadow-sm" />
            </div>
          )}

          {renderOptions()}

          {showExplanation && (
            <div className="mt-2 p-2 bg-slate-50 border-l-2 border-blue-400 text-[0.85em] italic shadow-sm no-print">
              <div className="font-bold not-italic text-blue-800">Kunci: {question.kunci}</div>
              <div 
                contentEditable 
                suppressContentEditableWarning 
                className="outline-none mt-1"
                dangerouslySetInnerHTML={{ __html: question.pembahasan }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionRenderer;