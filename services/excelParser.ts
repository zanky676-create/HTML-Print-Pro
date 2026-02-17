
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

        const mappedQuestions: Question[] = jsonData.map((row: any) => ({
          no: Number(row.No || row.no),
          tipe: String(row.Tipe || row.tipe || ''),
          level: String(row.Level || row.level || ''),
          materi: String(row.Materi || row.materi || ''),
          soal: String(row.Soal || row.soal || ''),
          img: row.Img || row.img,
          a: String(row.A || row.a || ''),
          b: String(row.B || row.b || ''),
          c: String(row.C || row.c || ''),
          d: String(row.D || row.d || ''),
          e: row.E || row.e ? String(row.E || row.e) : undefined,
          kunci: String(row.Kunci || row.kunci || ''),
          pembahasan: String(row.Pembahasan || row.pembahasan || ''),
          token: String(row.Token || row.token || ''),
        }));

        resolve(mappedQuestions);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
