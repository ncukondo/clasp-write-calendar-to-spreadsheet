import {
  dateChecker,
  dateType,
  dateCheckerFunc,
  CalendarDateInfo,
  dateNameFunc
} from './calendar-date-info';
export { CalendarMonthInfo, dateChecker, dateType, dateCheckerFunc, CalendarDateInfo };

type forEachDateFunc = (
  info: CalendarDateInfo,
  row?: number,
  col?: number,
  parent?: CalendarMonthInfo
) => void;

class CalendarMonthInfo {
  private _year: number;
  private _month: number;
  private _isHolidayFunc: dateCheckerFunc | null;
  private _isSkipdayFunc: dateCheckerFunc | null;
  private _holidayNameFunc: dateNameFunc | null;
  private _shift: number;
  private dateInfoTable: CalendarDateInfo[][];
  private WEEK_LENGTH = 7;
  private dateInfoDict = new Map<number, CalendarDateInfo>();

  constructor(
    year: number,
    month: number,
    shift = 0,
    isHolidayFunc: dateCheckerFunc = null,
    isSkipdayFunc: dateCheckerFunc = null,
    holidayNameFunc: dateNameFunc = null
  ) {
    this._year = year;
    this._month = month;
    this._shift = shift;
    this._isHolidayFunc = isHolidayFunc;
    this._isSkipdayFunc = isSkipdayFunc;
    this._holidayNameFunc = holidayNameFunc;
    this.dateInfoTable = this.createDateInfoArray();
  }

  forEach(func: forEachDateFunc) {
    this.dateInfoTable.forEach((week, row) =>
      week.forEach((info, col) => func(info, row, col, this))
    );
  }

  generateDatenumberArray(showNotCurrentAsMinus = false): number[][] {
    const result = this.dateInfoTable.map(week =>
      week.map(info => {
        if (!info.isCurrent) {
          return showNotCurrentAsMinus ? -info.date : 0;
        } else if (info.isSkipday) return 0;
        return info.date;
      })
    );
    return result;
  }

  get(date: number): CalendarDateInfo;
  get(row: number, col: number): CalendarDateInfo;
  get(i: number, col?: number): CalendarDateInfo {
    let result: CalendarDateInfo;
    if (col == undefined) {
      result = this.dateInfoDict.get(i);
      if (!result) {
        result = new CalendarDateInfo(
          new Date(this.year, this.month - 1, i),
          this.year,
          this.month,
          this._isHolidayFunc,
          this._isSkipdayFunc,
          this._holidayNameFunc
        );
        this.dateInfoDict.set(i, result);
      }
    } else {
      result = this.dateInfoTable[i][col];
    }
    return result;
  }

  generateDateStringArray(): string[][] {
    return this.dateInfoTable.map(week =>
      week.map(info => {
        if (!info.isCurrent) return '';
        if (info.isSkipday) return '';
        return info.date.toString();
      })
    );
  }

  get weekCount(): number {
    return Math.ceil((this.startShift + this.length) / this.WEEK_LENGTH);
  }

  private get startShift(): number {
    return (this.WEEK_LENGTH + this.firstDayOfTheWeek - this._shift) % this.WEEK_LENGTH;
  }

  get lastDateOfMonth(): Date {
    return new Date(this.year, this.month, 0);
  }

  get length(): number {
    return this.lastDateOfMonth.getDate();
  }

  get firstDateOfMonth(): Date {
    return new Date(this.year, this.month - 1, 1);
  }

  get firstDayOfTheWeek(): number {
    return this.firstDateOfMonth.getDay();
  }

  get year(): number {
    return this._year;
  }

  get month(): number {
    return this._month;
  }

  private createDateInfoArray(): CalendarDateInfo[][] {
    let result = [...Array(this.weekCount).keys()].map((value, row) =>
      [...Array(this.WEEK_LENGTH).keys()].map((value, col) =>
        this.get(col + 1 + row * this.WEEK_LENGTH - this.startShift)
      )
    );
    return result;
  }
}
