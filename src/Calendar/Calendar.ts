import { div } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/rxjs-typings';
import { format, getDate, getDaysInMonth, isMonday, setDate } from 'date-fns/esm';
import {ru} from 'date-fns/esm/locale';
import { compose, reduce, times } from 'lodash/fp';
import {  EMPTY } from 'rxjs';
import { exhaustMap, map, mapTo, scan, startWith, takeUntil } from 'rxjs/operators';

import { cx } from '../utils/cx';

import * as s from './Calendar.css';

const MS_IN_MONTH = 2592000000;

const extractDate = (event: Event) => parseInt((<HTMLElement>event.target).dataset.date, 10);

const getWeeksOfMonth = (monthTimestamp: number) => compose(
  reduce((weeks: Date[][], day: Date) => {
    if (isMonday(day) || weeks.length === 0) {
      weeks.push([]);
    }

    weeks[weeks.length - 1].push(day);
    return weeks;
  }, []),
  times((index) => setDate(monthTimestamp, index + 1))
)(getDaysInMonth(monthTimestamp));

export const Calendar = (sources: { DOM: DOMSource }) => {
  const dayClick$ = sources.DOM.select(cx(s.day)).events('click');
  const dayMouseEnter$ = sources.DOM.select(cx(s.day)).events('mouseenter');

  const monthTimestamp$ = EMPTY.pipe(
    mapTo(MS_IN_MONTH),
    startWith(Date.now()),
    scan((monthTimestamp, month) => monthTimestamp + month)
  );

  dayClick$.pipe(
    exhaustMap(clickEvent => {
      const startingDate = extractDate(clickEvent);

      return dayMouseEnter$.pipe(
        map(mouseEnterEvent => [startingDate, extractDate(mouseEnterEvent)].sort((a, b) => a - b)),
        startWith([startingDate, startingDate]),
        takeUntil(dayClick$)
      );
    })
  ).subscribe(console.log.bind(console));

  return {
    DOM: monthTimestamp$.pipe(map(monthTimestamp => {
      const monthName = format(monthTimestamp, 'LLLL', { locale: ru });
      const monthWeeks = getWeeksOfMonth(monthTimestamp);

      return div([
        div(cx(s.monthName), monthName),
        div(cx(s.calendar), [
          div(cx(s.month), monthWeeks.map(week =>
            div(cx(s.week), week.map((date) =>
              div(cx(s.day), {
                dataset: { date: date.valueOf() }
              }, getDate(date))
            ))
          ))
        ])
      ]);
    }))
  };
};
