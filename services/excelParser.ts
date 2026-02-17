
import * as XLSX from 'xlsx';
import { Question } from '../types';

export const parseExcelFile = async (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const mappedQuestions: Question[] = jsonData.map((row: any) => {
          // Helper to get value from multiple possible header names
          const get = (names: string[]) => {
            for (const name of names) {
              if (row[name] !== undefined) return row[name];
            }
            return '';
          };

          return {
            no: Number(get(['No', 'no'])),
            tipe: String(get(['Tipe', 'tipe'])),
            level: String(get(['Level', 'level'])),
            materi: String(get(['Materi', 'materi'])),
            soal: String(get(['Butir Pertanyaan', 'Soal', 'soal'])),
            img: get(['Gambar Soal (URL)', 'Img', 'img']),
            
            a: String(get(['Opsi A', 'A', 'a'])),
            imgA: get(['Gambar Opsi A (URL)', 'ImgA']),
            
            b: String(get(['Opsi B', 'B', 'b'])),
            imgB: get(['Gambar Opsi B (URL)', 'ImgB']),
            
            c: String(get(['Opsi C', 'C', 'c'])),
            imgC: get(['Gambar Opsi C (URL)', 'ImgC']),
            
            d: String(get(['Opsi D', 'D', 'd'])),
            imgD: get(['Gambar Opsi D (URL)', 'ImgD']),
            
            e: String(get(['Opsi E', 'E', 'e'])),
            imgE: get(['Gambar Opsi E (URL)', 'ImgE']),
            
            kunci: String(get(['Kunci Jawaban', 'Kunci', 'kunci'])),
            pembahasan: String(get(['Pembahasan', 'pembahasan'])),
            token: String(get(['ID Soal', 'Token', 'token'])),
          };
        });

        resolve(mappedQuestions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
