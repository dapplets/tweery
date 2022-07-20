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

export async function waitProperty(object: any, property: string, timeout: number): Promise<boolean> {
    if (object[property]) {
        return true;
    } else {
        if (timeout === 0) return false;
        
        const interval = 500;
        const newTimeout = timeout - interval < 0 ? 0 : timeout - interval;
        await new Promise((res) => setTimeout(res, interval));
        return waitProperty(object, property, newTimeout);
    }
}