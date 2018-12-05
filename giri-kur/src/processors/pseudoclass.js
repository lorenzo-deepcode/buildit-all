const processPseudoClass = pseudoclassNode => (`:${pseudoclassNode.value[0].value}`);

export default processPseudoClass;
