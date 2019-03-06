export { SerialArray, SerialTable, Repeat };

type RepeatCallbackType = (index?: number) => void | boolean;

const Repeat = (count: number, callback: RepeatCallbackType) => {
  for (let i = 0; i < count; i++) {
    const result = callback(i);
    if (result === false) break;
  }
};

function SerialArray(len: number, start: number = 0): Array<number> {
  let result = [...Array(len).keys()];
  if (start) {
    result.map(v => v + start);
  }
  return result;
}

function SerialTable(col: number, row: number, start: number = 0): Array<Array<number>> {
  return [...Array(row).keys()].map(rowIndex =>
    [...Array(col).keys()].map(colIndex => rowIndex * col + colIndex + start)
  );
}
