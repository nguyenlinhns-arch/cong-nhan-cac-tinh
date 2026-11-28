// The previous figure still exists in some generated locality input files.
// Match copy, not historic URLs, payroll quarters or the 10-month program.
export const oldMiningTrainingCopy = /(?<![\d.,])(?:khoảng[ \t]+)?2(?:[,.]5)?[ \t]*(?:[–—-]|đến|tới)[ \t]*3[ \t]*tháng|(?<![\d.,])2(?:(?:[–-]3)[ \t]*(?:\/|hoặc|hay)|[ \t]*\/)[ \t]*10[ \t]*tháng|\bhai (?:đến|tới) ba tháng\b/giu;

export function updateMiningTrainingCopy(text) {
  return text.replace(oldMiningTrainingCopy, (match) => {
    return /10[ \t]*tháng/iu.test(match) ? "2 hoặc 10 tháng" : match.endsWith("THÁNG") ? "2 THÁNG" : "2 tháng";
  });
}
