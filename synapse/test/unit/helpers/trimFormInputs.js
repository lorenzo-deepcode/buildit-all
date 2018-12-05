import { trimFormInputs } from 'helpers/trimFormInputs';
import chai from 'chai';
chai.should();

describe('Form inputs trimmer', () => {
  it('For top level fields, it removes extra spaces from the end of an input string', () => {
    const rawProjectFromForm = {
      name: 'Jasper   ',
    };
    const trimmedInput = trimFormInputs(rawProjectFromForm);
    trimmedInput.name.should.equal('Jasper');
  });

  it('For demand header, it removes extra spaces from the end of an input string', () => {
    const rawProjectFromForm = {
      name: 'Jasper',
      demand: {
        source: 'The moon   ',
        other: [],
      },
    };
    const trimmedInput = trimFormInputs(rawProjectFromForm);
    trimmedInput.should.have.deep.property('demand.source', 'The moon');
  });

  it('For defect header, it removes extra spaces from the end of an input string', () => {
    const rawProjectFromForm = {
      name: 'Jasper',
      defect: {
        source: 'The sun   ',
        other: [],
      },
    };
    const trimmedInput = trimFormInputs(rawProjectFromForm);
    trimmedInput.should.have.deep.property('defect.source', 'The sun');
  });

  it('For effort header, it removes extra spaces from the end of an input string', () => {
    const rawProjectFromForm = {
      name: 'Jasper',
      effort: {
        source: 'The sun   ',
        other: [],
      },
    };
    const trimmedInput = trimFormInputs(rawProjectFromForm);
    trimmedInput.should.have.deep.property('effort.source', 'The sun');
  });
});
