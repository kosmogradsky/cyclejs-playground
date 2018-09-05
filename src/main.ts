import { h1, makeDOMDriver, VNode } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/rxjs-typings';
import { makeHistoryDriver, Location } from '@cycle/history';
import { run } from '@cycle/rxjs-run';
import { of, EMPTY, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Calendar } from './Calendar/Calendar';
import { HsegChart } from './HsegChart/HsegChart';

import './styles.css';

type mainFunction = (sources: {
  DOM: DOMSource,
  history: Observable<Location>
}) => {
  DOM: Observable<VNode>,
  history: Observable<string>
};


const main: mainFunction = (sources) => {
  const vdom$ = sources.history.pipe(
    switchMap(location => {
      switch (location.pathname) {
        case '/calendar': return Calendar(sources).DOM;
        case '/hseg-chart': return HsegChart(sources).DOM;
        default: return of(h1('404'));
      }
    })
  );

  return {
    DOM: vdom$,
    history: EMPTY
  };
};

const drivers = {
  DOM: makeDOMDriver('#root'),
  history: makeHistoryDriver()
};

run(main, drivers);
