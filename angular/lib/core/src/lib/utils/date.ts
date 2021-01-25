export function dateToIso(v: any) {
  if (v == null || v === undefined) {
    return v;
  }
  let date: Date = null;
  if (typeof v == 'string' || typeof v == 'number') {
    try {
      date = new Date(v);
    } catch (error) {
      return v;
    }
  } else if (v.toDate != null) {
    date = v.toDate();
  } else {
    date = v;
  }
  if (date.toISOString) {
    return date.toISOString();
  }
  return date;
}
