import { isHoliday, getHolidayName, getHolidayDateList } from './lib/holiday-utils-gcal';
import { testSpreadSheetToExcelAttachment } from './spreadSheetToExcelAttachment';
import { CalendarWriter } from './write-calendar-to-sheet';
import { createTemplateCalendars } from './create-template-calendars';

declare var global: any;

global.isHoliday = isHoliday;
global.getHolidayName = getHolidayName;
global.getHolidayDateList = getHolidayDateList;
global.testCreateTemplateCalendars = ()=>{
  createTemplateCalendars(2019,7,5);
}

global.createTemplateCalendars = (): void => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const year = sheet.getRange('A1').getValue() as number;
  createTemplateCalendars(year,4);
};


global.testWriteCalendarToSheet = (): void => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
  sheet.clear();
  const writer = new CalendarWriter({ rowOffset: 1, columnOffset: 1 });
  writer.writeCalendarToSheet(sheet,2019,3);
};

global.testIsHoliday = (): void => {
  testSpreadSheetToExcelAttachment();
  if (isHoliday(2018, 5, 5)) {
    Logger.log('OK 2018_05_05 is Holiday');
  } else {
    Logger.log('NG testing 2018_05_05 is Holiday');
  }
  if (!isHoliday(2018, 12, 13)) {
    Logger.log('OK 2018_12_13 is not Holiday');
  } else {
    Logger.log('NG testing 2018_12_13 is not Holiday');
  }
};

global.testSpreadSheetToExcelAttachment = (): void => {
  testSpreadSheetToExcelAttachment();
};
