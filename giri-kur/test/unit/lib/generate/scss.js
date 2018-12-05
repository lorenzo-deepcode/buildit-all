import { expect } from 'chai';
import generateScss from 'lib/generate/scss';

describe('SCSS output generator', () => {
  const globals = [{ '$link-color': 'white' }, { '$other-variable': 'black' }];
  const rules = {
    a: {
      '*': [{ 'text-decoration': 'underline' }],
    },
    '[type=number]': {
      '::-webkit-inner-spin-button': [{ height: 'auto' }],
      '::-webkit-outer-spin-button': [{ height: 'auto' }],
    },
  };

  it('generates correctly with full data', () => {
    const correct = {
      '_variables.scss': '$link-color: white;\n$other-variable: black;',
      'components/1-Atoms/_[type=number].scss': '[type=number] {\n   &::-webkit-inner-spin-button {\n     height: auto;\n  }\n   &::-webkit-outer-spin-button {\n     height: auto;\n  }\n}\n',
      'components/1-Atoms/_a.scss': 'a {\n   text-decoration: underline;\n}\n',
      'main.scss': '@import "_variables.scss";\n@import "components/1-Atoms/_a.scss";\n@import "components/1-Atoms/_[type=number].scss";',
    };

    expect(generateScss(globals, rules)).to.deep.equal(correct);
  });

  it('generates correctly with no globals', () => {
    const correct = {
      'components/1-Atoms/_[type=number].scss': '[type=number] {\n   &::-webkit-inner-spin-button {\n     height: auto;\n  }\n   &::-webkit-outer-spin-button {\n     height: auto;\n  }\n}\n',
      'components/1-Atoms/_a.scss': 'a {\n   text-decoration: underline;\n}\n',
      'main.scss': '@import "components/1-Atoms/_a.scss";\n@import "components/1-Atoms/_[type=number].scss";',
    };
    expect(generateScss([], rules)).to.deep.equal(correct);
  });

  it('generates correctly with no rules', () => {
    const correct = {
      '_variables.scss': '$link-color: white;\n$other-variable: black;',
      'main.scss': '@import "_variables.scss";',
    };
    expect(generateScss(globals, [])).to.deep.equal(correct);
  });

  it('generates correctly with nothing', () => {
    const correct = { 'main.scss': '' };
    expect(generateScss([], [])).to.deep.equal(correct);
  });
});
