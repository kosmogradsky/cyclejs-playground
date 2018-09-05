import { svg } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/rxjs-typings';
import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { compose, map, slice, sum } from 'lodash/fp';
import { of } from 'rxjs';
import { map as map$ } from 'rxjs/operators';

const style = {
  barHeight: 14,
  barPaddingBottom: 38,
  barPaddingRight: 5,
  barLeftOffset: 200
};

const data$ = of({
  brands: [
    {
      name: 'Nissan',
      color: '#8CC45A',
    },
    {
      name: 'Ford',
      color: '#FCCB46',
    },
    {
      name: 'Opel',
      color: '#F94732',
    },
  ],
  players: [
    {
      name: 'player1',
      values: [12, 45, 47],
    },
    {
      name: 'player2',
      values: [30, 11, 45],
    },
    {
      name: 'player3',
      values: [40, 15, 21],
    },
    {
      name: 'player4',
      values: [31, 45, 15],
    },
    {
      name: 'player5',
      values: [16, 12, 89],
    },
  ],
});

export const HsegChart = (_sources: { DOM: DOMSource }) => {
  const vdom$ = data$.pipe(map$((data) => {
    const scale = scaleLinear()
      .domain([0, max(data.players, (player) => sum(player.values))])
      .range([0, 400]);

    return svg({
        attrs: {
          width: 700,
          height: 500
        }
      }, data.players.map((player, playerIndex) => (
        svg.g({
          attrs: {
            transform: `translate(0, ${(style.barHeight + style.barPaddingBottom) * playerIndex})`
          }
        }, [
          svg.text({
            attrs: {
              dy: '.8em'
            }
          }, player.name),
          svg.g({
            attrs: {
              transform: 'translate(200, 0)'
            }
          }, data.brands.map((brand, brandIndex) => (
            svg.rect({
              attrs: {
                x: compose(
                  sum,
                  map((value: number) => scale(value) + style.barPaddingRight),
                  slice(0, brandIndex)
                )(player.values),
                width: scale(player.values[brandIndex]),
                height: style.barHeight,
                fill: brand.color
              }
            })
          )))
        ])
      ))
    );
  }));

  return {
    DOM: vdom$,
  };
};
