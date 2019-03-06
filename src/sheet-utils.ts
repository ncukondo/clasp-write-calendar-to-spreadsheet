import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
export {sheetToMap, getNotedRange, getNotedRanges}

const sheetToMap = (sheet: Sheet) => {
  const dataRange = sheet.getDataRange();
  const result = new Map<string, string>();
  if (dataRange.getWidth() < 2)
    return result;
  const values = dataRange.getValues();
  for (let row of values) {
    result.set(row[0].toString(), row[1].toString());
  }
  return result;
};

// sheet内でnoteのメモがある範囲を配列として返す
const getNotedRanges=(note:string,sheet:Sheet)=>{
  try{
    const dataRange = sheet.getDataRange();
    const rowOffset = dataRange.getRow();
    const colOffset = dataRange.getColumn();
    const notes = dataRange.getNotes();

    return notes
    .map((notelist,row)=> notelist
      .map((value,col) => {return {note:value,range:sheet.getRange(rowOffset+row, colOffset+col)}})
      .filter(obj=> obj.note!='' && obj.note===note)
      .map(obj=> obj.range)).reduce((prev,curr)=>[...prev, ...curr]);
  }catch(err){
    Logger.log('エラー: '+err);
  }
}

const getNotedRange=(note:string,sheet:Sheet)=>{
  var ranges = getNotedRanges(note,sheet);
  if(ranges.length>0) return ranges[0];
  return null;
}

