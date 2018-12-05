export function slug(str) {
    return str.replace(/[^\w\s]/gi, '');
}