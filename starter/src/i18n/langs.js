export const locales = {
    en: {
        label: "English",
        dayjs: () => import('dayjs/locale/en'),
        flatpickr: null,
        i18n: () => import("./locales/en/translations.json"),
        flag: 'united-kingdom'
    },
    ar: {
        label: "Arabic",
        dayjs: () => import('dayjs/locale/ar'),
        flatpickr: () => import("flatpickr/dist/l10n/ar").then((module) => module.Arabic),
        i18n: () => import("./locales/ar/translations.json"),
        flag: 'saudi'
    },
    es: {
        label: "Español",
        dayjs: () => import('dayjs/locale/es-mx'),
        flatpickr: () => import("flatpickr/dist/l10n/es").then((module) => module.Spanish),
        i18n: () => import("./locales/es/translations.json"),
        flag: 'mexico'
    },
}