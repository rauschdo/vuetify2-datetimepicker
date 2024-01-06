import {formatInTimeZone} from 'date-fns-tz'
import {de} from 'date-fns/locale'

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export const formatDateToString = (
    date: Date | number | null | undefined,
    pattern: string,
): string => {
    if (date) {
        return formatInTimeZone(date, timeZone, pattern, {locale: de});
    }
    return ''
}