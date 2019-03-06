import {
  CalendarMonthInfo,
  dateChecker,
  dateType,
  dateCheckerFunc,
  CalendarDateInfo
} from './lib/calendar-month-info';
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import { isHoliday, getHolidayName, getHolidayDateList } from './lib/holiday-utils-gcal';
export { CalendarWriter, writeCalendarToSheetOption };
import { SerialArray } from './lib/array-util';

const dayNameOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

interface writeCalendarToSheetOption {
  rowOffset?: number;
  columnOffset?: number;
  defaultColor?: string;
  sunColor?: string;
  satColor?: string;
  holColor?: string;

  cellWidth?: number;
  cellHeight?: number;
  descriptWidth?: number;

  shift?: number;
}

class CalendarWriter{
  private option: writeCalendarToSheetOption;
  private infoColorMap=new Map<dateType,string>();
  private default_option: writeCalendarToSheetOption = {
    rowOffset: 0,
    columnOffset: 0,
    defaultColor: '#000000',
    sunColor: '#ff0000',
    satColor: '#0063a4',
    holColor: '#ff0000',
  
    cellWidth: 38,
    cellHeight: 17,
    descriptWidth: 104,
  
    shift: 1,
  };

  constructor(opt?:writeCalendarToSheetOption){
    this.option = opt ? {...this.default_option, ...opt} : this.default_option;
    this.infoColorMap.set( dateType.HOLIDAY,this.option.holColor);
    this.infoColorMap.set(dateType.STATURDAY,this.option.satColor);
    this.infoColorMap.set(dateType.SUNDAY,this.option.sunColor); 
  }

  private drawADay(sheet: Sheet,info: CalendarDateInfo,row: number,col: number,){
    const { holColor } = this.option;
    sheet
      .getRange(row, col, 6, 2)
      .setBorder(true, true, true, true, false, false)
      .setFontSize(8);
  
    if (info.isCurrent) sheet.getRange(row, col, 1, 1).setValue(info.date);
    sheet
      .getRange(row, col, 2, 1)
      .merge()
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle')
      .setFontSize(14);
    if (info.isCurrent && info.holidayName) {
      sheet
        .getRange(row, col + 1, 1, 1)
        .setValue(info.holidayName)
        .setFontColor(holColor);
    }
    const color = this.infoColorMap.get(info.dateType);
    if (color) sheet.getRange(row, col, 1, 1).setFontColor(color);
    SerialArray(4).forEach((v, i) => {
      sheet.getRange(row + 2 + i, col, 1, 2).merge();
    });
  }

  writeCalendarToSheet(sheet:Sheet,year: number,month: number): void{
    const { rowOffset, columnOffset, cellWidth, cellHeight, descriptWidth,shift} = this.option;
  
    const cal = new CalendarMonthInfo(year, month, shift, isHoliday, null, getHolidayName);
  
    sheet.setRowHeights(rowOffset, cal.weekCount * 6+1, cellHeight);
    sheet.setColumnWidths(columnOffset, 7 * 2, cellWidth);
    SerialArray(7).forEach((v, i) => {
      sheet.setColumnWidth(columnOffset + (i +1)* 2, descriptWidth);
    });
    this.drawHeader(sheet);
    cal.forEach((info, row, col) => {
      this.drawADay(sheet, info, 2 + rowOffset + row * 6, 1 + columnOffset + col * 2);
    });
  }
    
  private drawHeader(sheet:Sheet){
    const {rowOffset, columnOffset, shift} = this.option;
    let days = dayNameOfWeek.map((dayName,index)=>{
      let color = '';
      if(index==0) color = this.option.sunColor;
      if(index==6) color = this.option.satColor;
      return {name:dayName,color:color};
    });
    for(let i=0;i<shift;i++){
      const [first,...rest] = days;
      days = [...rest,first];
    }
    for(let [index, day] of days.entries()){
      const range = sheet
        .getRange(rowOffset+1, columnOffset+1+index*2, 1, 2)
        .setValue(day.name)
        .merge()
        .setHorizontalAlignment('center');
      if (day.color) range.setFontColor(day.color);
    }
  }

}
