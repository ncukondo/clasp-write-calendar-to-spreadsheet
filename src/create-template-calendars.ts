import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import { SerialArray, Repeat } from "./lib/array-util";
import {  CalendarWriter } from "./write-calendar-to-sheet";
import { getNotedRange } from "./sheet-utils";
export {createTemplateCalendars}


const TEMPLATE_SHEET_NAME = 'テンプレ'
const DATE_TARGET_NOTE = 'date'
const CALENDAR_TARGET_NOTE = 'calendar'

const createSpreadSheetToSameFolder =(name:string)=>{
  const folder = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId()).getParents().next();
  const rootfolder = DriveApp.getRootFolder();
  const newSpreadSheet = SpreadsheetApp.create(name);
  const newFile = DriveApp.getFileById(newSpreadSheet.getId());
  folder.addFile(newFile);
  if(folder.getId()!==rootfolder.getId()) rootfolder.removeFile(newFile);
  return newSpreadSheet;
}

const createTemplateCalendars =(year:number,startMonth:number,len=12) =>{
  const tmplSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TEMPLATE_SHEET_NAME);
  const newSpreadSheet = createSpreadSheetToSameFolder(`${year}年夏休み調整カレンダー`);
  const calRange = getNotedRange(CALENDAR_TARGET_NOTE,tmplSheet);
  let writer:CalendarWriter;
  if(calRange){
    writer = new CalendarWriter({columnOffset:calRange.getColumn()-1,rowOffset:calRange.getRow()-1});  
  }
  for (let offset=0;offset<len;offset++){
    const date = new Date(year,startMonth+offset-1,1);
    const sheet = tmplSheet.copyTo(newSpreadSheet);
    sheet.setName(`${date.getFullYear()}年${date.getMonth()+1}月`);
    const dateRange = getNotedRange(DATE_TARGET_NOTE,sheet);
    if(dateRange) dateRange.setValue(date);
    if(writer) writer.writeCalendarToSheet(sheet,year,date.getMonth()+1);
    sheet.activate();
    newSpreadSheet.moveActiveSheet(newSpreadSheet.getSheets().length);
  };
  newSpreadSheet.deleteSheet(newSpreadSheet.getSheets()[0]);
  newSpreadSheet.getSheets()[0].activate();
}



