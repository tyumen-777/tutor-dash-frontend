export type TimezoneOption = { value: string; label: string }

/**
 * Один пункт на каждое смещение от UTC. Бэкенд принимает IANA-зону, поэтому
 * у каждого пункта есть представительная зона — для России берём российский
 * город. Смещение в подписи — стандартное, без учёта летнего времени.
 */
export const TIMEZONE_OPTIONS: TimezoneOption[] = [
	{ value: 'Etc/GMT+12', label: 'UTC−12 — Линия перемены дат' },
	{ value: 'Pacific/Pago_Pago', label: 'UTC−11 — Американское Самоа' },
	{ value: 'Pacific/Honolulu', label: 'UTC−10 — Гавайи' },
	{ value: 'Pacific/Marquesas', label: 'UTC−9:30 — Маркизские острова' },
	{ value: 'America/Anchorage', label: 'UTC−9 — Аляска' },
	{
		value: 'America/Los_Angeles',
		label: 'UTC−8 — Лос-Анджелес, Ванкувер'
	},
	{ value: 'America/Denver', label: 'UTC−7 — Денвер, Финикс' },
	{ value: 'America/Chicago', label: 'UTC−6 — Чикаго, Мехико' },
	{ value: 'America/New_York', label: 'UTC−5 — Нью-Йорк, Торонто' },
	{ value: 'America/Halifax', label: 'UTC−4 — Галифакс, Каракас' },
	{ value: 'America/St_Johns', label: 'UTC−3:30 — Ньюфаундленд' },
	{
		value: 'America/Sao_Paulo',
		label: 'UTC−3 — Сан-Паулу, Буэнос-Айрес'
	},
	{ value: 'America/Noronha', label: 'UTC−2 — Фернанду-ди-Норонья' },
	{ value: 'Atlantic/Azores', label: 'UTC−1 — Азорские острова' },
	{ value: 'Europe/London', label: 'UTC+0 — Лондон, Лиссабон' },
	{ value: 'Europe/Berlin', label: 'UTC+1 — Берлин, Париж, Варшава' },
	{
		value: 'Europe/Kaliningrad',
		label: 'UTC+2 — Калининград, Хельсинки, Каир'
	},
	{
		value: 'Europe/Moscow',
		label: 'UTC+3 — Москва, Санкт-Петербург, Минск, Стамбул'
	},
	{ value: 'Asia/Tehran', label: 'UTC+3:30 — Тегеран' },
	{ value: 'Europe/Samara', label: 'UTC+4 — Самара, Баку, Дубай' },
	{ value: 'Asia/Kabul', label: 'UTC+4:30 — Кабул' },
	{
		value: 'Asia/Yekaterinburg',
		label: 'UTC+5 — Екатеринбург, Ташкент, Алматы'
	},
	{ value: 'Asia/Kolkata', label: 'UTC+5:30 — Индия' },
	{ value: 'Asia/Kathmandu', label: 'UTC+5:45 — Непал' },
	{ value: 'Asia/Omsk', label: 'UTC+6 — Омск, Бишкек' },
	{ value: 'Asia/Yangon', label: 'UTC+6:30 — Мьянма' },
	{
		value: 'Asia/Novosibirsk',
		label: 'UTC+7 — Новосибирск, Красноярск, Бангкок'
	},
	{ value: 'Asia/Irkutsk', label: 'UTC+8 — Иркутск, Пекин, Сингапур' },
	{ value: 'Australia/Eucla', label: 'UTC+8:45 — Юкла' },
	{ value: 'Asia/Yakutsk', label: 'UTC+9 — Якутск, Токио, Сеул' },
	{ value: 'Australia/Adelaide', label: 'UTC+9:30 — Аделаида, Дарвин' },
	{ value: 'Asia/Vladivostok', label: 'UTC+10 — Владивосток, Сидней' },
	{ value: 'Australia/Lord_Howe', label: 'UTC+10:30 — Остров Лорд-Хау' },
	{ value: 'Asia/Magadan', label: 'UTC+11 — Магадан, Сахалин' },
	{ value: 'Asia/Kamchatka', label: 'UTC+12 — Камчатка, Окленд' },
	{ value: 'Pacific/Chatham', label: 'UTC+12:45 — Острова Чатем' },
	{ value: 'Pacific/Tongatapu', label: 'UTC+13 — Тонга, Самоа' },
	{ value: 'Pacific/Kiritimati', label: 'UTC+14 — Остров Рождества' }
]
