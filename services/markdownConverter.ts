
export const formatContent = (text: string): string => {
  if (!text) return "";

  let processed = text;

  // 1. Handle Bold: **teks**
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 2. Handle Italic: *teks*
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 3. Handle Markdown Tables
  // Mencari pola yang diawali dengan | dan mengandung baris pemisah |---|
  const tableRegex = /((?:\|.*\|(?:\n|$))+)/g;
  processed = processed.replace(tableRegex, (match) => {
    const rows = match.trim().split('\n');
    if (rows.length < 2) return match;

    // Cek apakah ada baris pemisah (misal: |---|---|)
    const hasSeparator = rows.some(r => /\|?\s*:?-+:?\s*\|/.test(r));
    if (!hasSeparator) return match;

    let html = '<table class="content-table">';
    rows.forEach((row, index) => {
      // Lewati baris pemisah |---|
      if (/\|?\s*:?-+:?\s*\|/.test(row)) return;

      const cells = row.split('|').filter((cell, i, arr) => {
        if (i === 0 && cell.trim() === '') return false;
        if (i === arr.length - 1 && cell.trim() === '') return false;
        return true;
      });

      html += '<tr>';
      cells.forEach(cell => {
        const tag = index === 0 ? 'th' : 'td';
        html += `<${tag}>${cell.trim()}</${tag}>`;
      });
      html += '</tr>';
    });
    html += '</table>';
    return html;
  });

  // 4. Ubah newline menjadi <br> (kecuali di dalam tag tabel agar tidak berantakan)
  // Kita lakukan ini di akhir untuk teks biasa
  processed = processed.replace(/\n/g, '<br>');

  return processed;
};
