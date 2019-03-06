export { dateChecker, dateType, dateCheckerFunc, CalendarDateInfo, dateNameFunc };

type dateChecker = (year: number, month: number, date: number) => boolean;
type dateNameFunc = (year: number, month: number, date: number) => string;

enum dateType {
  WORKDAY,
  STATURDAY,
  SUNDAY,
  SKIPDAY,
  HOLIDAY,
  PREVMONTH,
  NEXTMONTH
}

type dateCheckerFunc = (year: number, month: number, date: number) => boolean;

class CalendarDateInfo {
  private _date: Date;
  private _calyear: number;
  private _calmonth: number;
  private _isHolidayFunc: dateCheckerFunc | null;
  private _isSkipdayFunc: dateCheckerFunc | null;
  private _holidayNameFunc: dateNameFunc | null;

  constructor(
    date: Date,
    calyear: number,
    calmonth: number,
    isHolidayFunc: dateCheckerFunc = null,
    isSkipdayFunc: dateCheckerFunc = null,
    holidayNameFunc: dateNameFunc = null
  ) {
    this._date = date;
    this._calyear = calyear;
    this._calmonth = calmonth;
    this._isHolidayFunc = isHolidayFunc;
    this._isSkipdayFunc = isSkipdayFunc;
    this._holidayNameFunc = holidayNameFunc;
  }

  private get last_date_of_month(): Date {
    return new Date(this.year, this.month, 0);
  }

  private get first_date_of_month(): Date {
    return new Date(this.year, this.month - 1, 1);
  }

  get dateType(): dateType {
    if (this.isSkipday) return dateType.SKIPDAY;
    if (this.isNext) return dateType.NEXTMONTH;
    if (this.isPrev) return dateType.PREVMONTH;
    if (this.isHoliday) return dateType.HOLIDAY;
    if (this.dayOfWeek == 0) return dateType.SUNDAY;
    if (this.dayOfWeek == 6) return dateType.STATURDAY;
    return dateType.WORKDAY;
  }

  get year(): number {
    return this._date.getFullYear();
  }

  get month(): number {
    return this._date.getMonth() + 1;
  }

  get date(): number {
    return this._date.getDate();
  }

  get dayOfWeek(): number {
    return this._date.getDay();
  }

  get dateObj(): Date {
    return this._date;
  }

  get isCurrent(): boolean {
    return this.year == this._calyear && this.month == this._calmonth;
  }

  get isNext(): boolean {
    return !this.isCurrent && this.dateObj > this.last_date_of_month;
  }

  get isPrev(): boolean {
    return !this.isCurrent && this.dateObj < this.first_date_of_month;
  }

  get isHoliday(): boolean {
    return this._isHolidayFunc && this._isHolidayFunc(this.year, this.month, this.date);
  }

  get holidayName(): string {
    return this._holidayNameFunc ? this._holidayNameFunc(this.year, this.month, this.date) : '';
  }

  get isSkipday(): boolean {
    return this._isSkipdayFunc && this._isSkipdayFunc(this.year, this.month, this.date);
  }
}
