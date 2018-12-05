import { ClientFunction } from 'testcafe';

export const getBaseUrl = ClientFunction(() => document.location.href.split('?')[0]);
export const getQueryString = ClientFunction((qsKey, qs) => {
    qs = qs || document.location.search.substring(1);
    const qsMap = qs.split('&').reduce((prev, curr) => {
        const [key, value] = curr.split('=');
        if (value !== undefined) {
            prev[key] = value;
        }
        return prev;
    }, {});
    if (typeof qsKey === 'string') {
        return qsMap[qsKey];
    } else {
        return qsMap;
    }
});