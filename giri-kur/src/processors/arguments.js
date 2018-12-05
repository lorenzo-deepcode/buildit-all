import process from './index';

const processArguments = args => (args.value.reduce((t, v) => `${t}${process(v)}`, ''));

export default processArguments;
