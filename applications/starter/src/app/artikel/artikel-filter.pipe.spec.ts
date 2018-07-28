/* tslint:disable:no-unused-variable */
import { Artikel } from '../../../../common/src/model';
import { ArtikelFilterPipe } from './artikel-filter.pipe';

describe('ArtikelFilterPipe', () => {

  it('create an instance', () => {
    const pipe = new ArtikelFilterPipe();
    expect(pipe).toBeTruthy();
  });

  describe('test of transform', () => {
    const pipe = new ArtikelFilterPipe();

    const maxArtikel = 20;
    const artikel: Artikel[] = [];

    for (let i = 1; i <= maxArtikel; i++) {
      const art = new Artikel();
      art.id = i;
      art.nummer = `Nummer-${i}`;
      art.name = `Artikel-${i}`;

      artikel.push(
        art
      );
    }

    const tests = [
      {
        filter: 'Artikel',
        expected: maxArtikel
      },
      {
        filter: 'Artikel-1',
        expected: (maxArtikel / 2) + 1
      }
    ];

    tests.forEach((test) => {
      const result = pipe.transform(artikel, test.filter);

      it(`filter by ${test.filter} should find ${test.expected} artikel`, () => {
        expect(result.length).toBe(test.expected);
      });
    });

  });
});
