export { isHoliday, getHolidayName, getHolidayDateList };

const isHoliday = (year: number, month: number, date: number): boolean => {
  return getHolidayName(year, month, date) !== '';
};

const getHolidayName = (year: number, month: number, date: number): string => {
  let events = _getEventList(year, month).filter(item =>
    _isSameDate(item.getStartTime(), year, month, date)
  );
  return events && events.length > 0 ? events[0].getTitle() : '';
};

const getHolidayDateList = (year: number, month: number): Date[] => {
  return _getEventList(year, month).map<Date>(
    eventItem => eventItem.getStartTime() || eventItem.getAllDayStartDate()
  );
};

const _cache = new Map<string, GoogleAppsScript.Calendar.CalendarEvent[]>();
const HOLIDAY_GCAL_ID = 'ja.japanese#holiday@group.v.calendar.google.com';
const calendarObject = CalendarApp.getCalendarById(HOLIDAY_GCAL_ID);

const _getEventList = (year: number, month: number): GoogleAppsScript.Calendar.CalendarEvent[] => {
  const key = year + '_' + month;
  let result = _cache.get(key);
  if (!result) {
    let startDate = new Date(year, month - 1, 1); //取得開始日
    let endDate = new Date(year, month, 1);
    result = calendarObject.getEvents(startDate, endDate);
    _cache.set(key, result);
  }
  return result;
};

const _isSameDate = (date: Date, year: number, month: number, numdate: number): boolean => {
  return date.getFullYear() == year && date.getMonth() + 1 == month && date.getDate() == numdate;
};
