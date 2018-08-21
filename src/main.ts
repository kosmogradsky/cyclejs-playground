import { makeDOMDriver, div } from '@cycle/dom'
import { run } from '@cycle/rxjs-run'
import { Sources } from '@cycle/run';
import { of } from 'rxjs';
import * as range from 'ramda/src/range';
import * as getDaysInMonth from 'date-fns/getDaysInMonth'

declare module 'ramda';

const main = (sources: Sources) => {
  return {
    DOM: of(
      div([
        'Январь 2018',
        ...[1,2,3].map((date) => div([date]))
      ])
    )
  }
}

const drivers = {
  DOM: makeDOMDriver('#root')
}

run(main, drivers);