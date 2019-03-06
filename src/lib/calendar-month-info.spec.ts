import {
  CalendarMonthInfo,
  dateChecker,
  dateType,
  dateCheckerFunc,
  CalendarDateInfo
} from './calendar-month-info';
import { getHolidayName } from './holiday-utils-gcal';
jest.unmock('./calendar-month-info');

function formatCalendar(input: number[][]): String {
  let row_strings = new Array<string>();
  input.forEach(row => row_strings.push(row.join(', ')));
  return row_strings.join('\n');
}

const CAL_2018_12 = `-25, -26, -27, -28, -29, -30, 1
2, 3, 4, 5, 6, 7, 8
9, 10, 11, 12, 13, 14, 15
16, 17, 18, 19, 20, 21, 22
23, 24, 25, 26, 27, 28, 29
30, 31, -1, -2, -3, -4, -5`;

const CAL_2019_02_SHIFT1 = `-28, -29, -30, -31, 1, 2, 3
4, 5, 6, 7, 8, 9, 10
11, 12, 13, 14, 15, 16, 17
18, 19, 20, 21, 22, 23, 24
25, 26, 27, 28, -1, -2, -3`;

describe('calendar-month-info', () => {
  describe('calendarDateArray()', () => {
    it('2018-12 calendar', () => {
      const cal = formatCalendar(new CalendarMonthInfo(2018, 12).generateDatenumberArray(true));
      expect(cal).toBe(CAL_2018_12);
    });
  });
  describe('calendarDateArray()', () => {
    it('2019-02 and shift 1 calendar', () => {
      const cal = formatCalendar(new CalendarMonthInfo(2019, 2, 1).generateDatenumberArray(true));
      expect(cal).toBe(CAL_2019_02_SHIFT1);
    });
  });
  describe('getDateType()', () => {
    it('2019-12-01 is Sunday', () => {
      const cal = new CalendarMonthInfo(2019, 12);
      expect(cal.get(1).dateType).toBe(dateType.SUNDAY);
    });
  });
  describe('getDateType()', () => {
    it('2019-1-5 is Saturday', () => {
      const cal = new CalendarMonthInfo(2019, 1);
      expect(cal.get(5).dateType).toBe(dateType.STATURDAY);
    });
  });
  describe('getDateType()', () => {
    it('2018-12-13 is Workday', () => {
      const cal = new CalendarMonthInfo(2018, 12);
      expect(cal.get(13).dateType).toBe(dateType.WORKDAY);
    });
  });
  describe('getDateType()', () => {
    it('2018-5-5 is Holiday', () => {
      const getHoliDayFunc = (year: number, month: number, date: number) => true;
      const cal = new CalendarMonthInfo(2018, 5, 0, getHoliDayFunc);
      expect(cal.get(5).dateType).toBe(dateType.HOLIDAY);
    });
  });
  describe('getDateType()', () => {
    it('2018-12-31 is Skipday', () => {
      const getSkipDayFunc = (year: number, month: number, date: number) => true;
      const cal = new CalendarMonthInfo(2018, 5, 0, null, getSkipDayFunc);
      expect(cal.get(31).dateType).toBe(dateType.SKIPDAY);
    });
  });
  describe('holidayName', () => {
    it('2019-3-21 is 春分の日', () => {
      const getHoliDayNameFunc = (year: number, month: number, date: number) => '春分の日';
      const cal = new CalendarMonthInfo(2019, 3, 0, null, null, getHoliDayNameFunc);
      expect(cal.get(21).holidayName).toBe('春分の日');
    });
  });
});
