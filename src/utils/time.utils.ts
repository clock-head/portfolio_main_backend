import { DateTime } from 'luxon';

function isValidTimeZone(tz: string) {
  try {
    return DateTime.now().setZone(tz).isValid;
  } catch {
    return false;
  }
}
