export const padLeadingZeros = (num, size) => {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
export const truncateMidString = (str, num) => {
    if (str.length <= num) {
        return str
    }
    let mi = (num/2);
    return str.slice(0, mi) + '...' + str.slice(str.length-3, str.length);
}