import { LocaleSettings } from 'primeng/primeng';

export class PrimeNgCalendarLocale {
    public static de: LocaleSettings = {
        firstDayOfWeek: 0,
        dayNames: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
        dayNamesShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
        dayNamesMin: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
        monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August',
            'September', 'Oktober', 'November', 'Dezember'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    };

    public static en: LocaleSettings = {
        firstDayOfWeek: 0,
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };

}