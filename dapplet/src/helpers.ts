export function formatIsoToDate(iso: string): string {
  if (!iso) return null;
  
  function addLeadZero(val) {
    if (+val < 10) return '0' + val;
    return val;
  }

  const newTime = new Date(iso);

  const date = [
    addLeadZero(newTime.getDate()),
    addLeadZero(newTime.getMonth() + 1),
    newTime.getFullYear(),
  ].join('.');

  return date;
}
