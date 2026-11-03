// Перевод интерфейса RU → EN без переписывания разметки.
// Словарь: ключ — русский текст целиком (как он стоит на странице), значение — английский.
// Если фразы нет в словаре, она остаётся по-русски. Чтобы перевести новую строку — допиши её сюда.
// Отзывы клиентов и описания сборок переведены частично (ключевые фразы), остальное остаётся как есть.

export const EN: Record<string, string> = {
  'Добавлено в избранное ♥': 'Added to favorites ♥', 'Убрано из избранного': 'Removed from favorites', 'Наверх': 'Back to top', 'VK': 'VK', 'Ничего не найдено.': 'Nothing found.',
  // избранное, просмотр, установка
  'Установка': 'Install', '♥ Избранное': '♥ Favorites', 'избранное': 'favorites', 'МОИ СБОРКИ': 'MY BUILDS',
  'Отмечай сердечком сборки в каталоге, и они соберутся здесь. Список хранится в твоём браузере.': 'Tap the heart on builds in the catalog and they will be collected here. The list is stored in your browser.',
  'Скачать все (': 'Download all (', 'Очистить': 'Clear', 'Пока пусто': 'Nothing here yet',
  'Нажми сердечко на карточке сборки, и она появится здесь.': 'Tap the heart on a build card and it will appear here.', 'Открыть каталог': 'Open catalog',
  '♡ В избранное': '♡ Add to favorites', '♥ В избранном': '♥ In favorites', 'В избранное': 'Add to favorites', 'Убрать из избранного': 'Remove from favorites',
  '🔍 Увеличить': '🔍 Zoom in', 'Увеличить': 'Zoom in',
  'У выбранных сборок пока нет прямых ссылок — открой нужную через «Подробнее».': 'The selected builds have no direct links yet. Open the one you need via “Details”.',
  'Браузер заблокировал часть вкладок. Разреши всплывающие окна для сайта или скачай по одной.': 'Your browser blocked some tabs. Allow pop-ups for this site or download them one by one.',
  'Несколько шагов, и сборка в игре. Если проще смотреть, рядом видео-туториал.': 'A few steps and the build is in the game. If it’s easier to watch, there’s a video tutorial next to it.',
  'Скачай сборку': 'Download the build', 'Открой нужную сборку в каталоге и нажми «Скачать». Файл придёт одним архивом.': 'Open the build you need in the catalog and press “Download”. The file comes as a single archive.',
  'Распакуй архив': 'Unpack the archive', 'Если это .rar — понадобится WinRAR или 7-Zip. Распакуй всё в любую удобную папку.': 'If it’s a .rar you’ll need WinRAR or 7-Zip. Unpack everything into any convenient folder.',
  'Закинь файлы в папку игры': 'Copy the files into the game folder', 'Скопируй содержимое в папку, где лежит gta_sa.exe (корень игры RADMIR). Если система спросит про замену файлов — подтверди.': 'Copy the contents into the folder that contains gta_sa.exe (the RADMIR game root). If the system asks about replacing files, confirm.',
  'Запусти игру': 'Launch the game', 'Зайди в RADMIR как обычно — сборка подхватится сама.': 'Join RADMIR as usual and the build will be picked up automatically.',
  'Не получилось?': 'Didn’t work?', 'Напиши в Telegram и приложи скриншот ошибки — разберёмся.': 'Message me on Telegram and attach a screenshot of the error, we’ll sort it out.',
  'Написать в Telegram →': 'Message on Telegram →', 'Видео-туториал': 'Video tutorial', 'Смотреть туториал': 'Watch the tutorial', 'Смотреть туториал на YouTube': 'Watch the tutorial on YouTube',
  'Видео-туториал скоро': 'Video tutorial coming soon', 'Пока смотри шаги слева. Что-то непонятно, напиши, подскажу.': 'For now, follow the steps on the left. Anything unclear, message me and I’ll help.',
  'Уменьшить': 'Zoom out', 'Приблизить': 'Zoom in', 'Вписать в экран': 'Fit to screen',
  'Колёсико или клик — приблизить · перетаскивай · ← → — другая сборка · Esc — закрыть': 'Scroll or click to zoom · drag to pan · ← → other build · Esc to close',
  // навигация и шапка
  'Главная': 'Home', 'Сборки': 'Builds', 'Цены': 'Prices', 'Портфолио': 'Portfolio', 'Отзывы': 'Reviews',
  'Контакты': 'Contacts', 'Почта': 'Email', 'Написать': 'Message', 'Контакты и настройки': 'Contacts and settings',
  'Настройки': 'Settings', 'Настройки сайта': 'Site settings', 'Закрыть': 'Close',
  'сообщество RADMIR RP': 'RADMIR RP community',

  // главная
  'МАСТЕРСКАЯ': 'WORKSHOP OF', "HUD'ов": 'HUDs', 'И СБОРОК ДЛЯ': 'AND BUILDS FOR',
  'Делаю HUD’ы и сборки для CRMP. RADMIR-HUDLoader снимает лимиты на создание HUD’ов, а «Сборки» — уже готовые конфиги: поставил и играешь.':
    'I make HUDs and builds for CRMP. RADMIR-HUDLoader removes the limits on creating HUDs, and “Builds” are ready-made configs: install and play.',
  'Готовые сборки и HUD’ы для CRMP. Поставил — и играешь.': 'Ready-made builds and HUDs for CRMP. Install and play.',
  'Смотреть сборки': 'Browse builds', 'О HUDLoader': 'About HUDLoader', 'Написать в Telegram': 'Message on Telegram',
  "Безлимитные HUD'ы": 'Unlimited HUDs', 'Приватные PNG / PSD': 'Private PNG / PSD', 'Обучение с нуля': 'Training from scratch',
  'Поддержка 24/7': '24/7 support', 'Разовая оплата 1200₽': 'One-time payment 1200₽', 'Готовые сборки': 'Ready-made builds',
  'Качественная работа': 'Quality work', 'Быстро. Качественно. Без лишних сложностей.': 'Fast. Quality. No unnecessary hassle.',
  'средний ответ в Telegram': 'average reply on Telegram', 'поддержка на связи': 'support online', "HUD'ов создано клиентами": 'HUDs created by clients',
  '<1 дня': '<1 day',

  // «Куда дальше»
  'навигация': 'navigation', 'Куда дальше': 'Where next',
  'Три раздела на выбор — готовые сборки, сам лоадер или что о нём говорят те, кто уже купил.': 'Three sections to choose from: ready-made builds, the loader itself, or what buyers say about it.',
  'готовые решения': 'ready-made', 'Скриншот, короткое описание и ссылка на скачивание. Ставишь и играешь, без лишней возни с настройкой.': 'A screenshot, a short description and a download link. Install and play, no fiddling with setup.',
  'Открыть каталог →': 'Open catalog →', 'продукт': 'product', 'Снимает лимиты на создание HUD’ов и даёт полный доступ к радару, интерфейсу и шрифтам — меняй как хочешь.': 'Removes the limit on creating HUDs and gives full access to the radar, interface and fonts. Change anything you like.',
  'Открыть страницу →': 'Open page →', 'от клиентов': 'from clients', 'Что пишут те, кто уже пользуется лоадером или ставил сборку — без прикрас.': 'What people who already use the loader or installed a build say, unvarnished.',
  'Читать отзывы →': 'Read reviews →',

  // цены / как купить
  'Как купить': 'How to buy', 'Стоимость': 'Pricing', 'Почему мы': 'Why us', 'инструкция': 'guide',
  'Сборка на заказ, готовая сборка из каталога, сам HUDLoader или приват-канал со всеми платными сборками сразу.': 'A custom build, a ready-made build from the catalog, HUDLoader itself, or the private channel with all paid builds at once.',
  'Сборка на заказ': 'Custom build', 'Пиши в Telegram, опиши стиль и цвета, которые нравятся — соберу под тебя.': 'Message me on Telegram, describe the style and colors you like, and I’ll build it for you.',
  'Готовая сборка': 'Ready-made build', 'Выбираешь в каталоге, оплачиваешь — получаешь ссылку на скачивание и всё, что нужно для установки.': 'Pick one in the catalog, pay, and get a download link with everything needed to install.',
  'Разовая оплата 1200₽ — выдаю лоадер, приватные PNG/PSD, обучаю с нуля и остаюсь на связи.': 'One-time payment of 1200₽: I give you the loader and private PNG/PSD, teach you from scratch and stay in touch.',
  'Приват-канал': 'Private channel', 'Доступ ко всем платным сборкам сразу, плюс новые HUD’ы по мере выхода.': 'Access to all paid builds at once, plus new HUDs as they come out.',
  'Написать →': 'Message →', 'прайс': 'pricing', 'Стоимость услуг': 'Service prices',
  'Вот расценки. По сборке на заказ финальная цена зависит от того, что именно нужно.': 'Here are the prices. For a custom build the final price depends on exactly what you need.',
  'популярно': 'popular', 'индивидуально под твой стиль': 'tailored to your style', "Сборка SAMP HUD's": "SAMP HUD's build",
  'готовый конфиг': 'ready config', 'HUD на заказ': 'Custom HUD', 'один HUD под задачу': 'one HUD for your task', 'Фикс PNG': 'PNG fix',
  'починка после обновления': 'repair after an update', 'по запросу': 'on request', 'все платные сборки сразу': 'all paid builds at once',
  'Принимаем оплату в Рублях / звёздах. Итоговая цена уточняется индивидуально.': 'We accept payment in rubles / stars. The final price is agreed individually.',
  'преимущества': 'advantages', 'Почему выбирают нас': 'Why choose us', 'Коротко о том, чем я реально могу помочь — без воды.': 'A short list of how I can really help, no fluff.',
  'Без лимитов': 'No limits', 'Свои исходники': 'Your own sources', 'Отдаю приватные PNG и PSD — редактируешь как хочешь, без привязки ко мне.': 'I give you private PNG and PSD files. Edit them however you like, no strings attached.',
  'На связи почти всегда': 'Almost always online', 'В Telegram обычно отвечаю в течение часа, вопросы по установке — не проблема.': 'I usually reply on Telegram within an hour, installation questions are no problem.',
  'Покажу весь процесс от установки до готового HUD’а, даже если раньше не работал с редакторами.': 'I’ll show the whole process from installation to a finished HUD, even if you’ve never used editors.',
  'Обновления': 'Updates', 'Слежу за обновлениями': 'I watch for updates', 'Если после патча клиента лоадер ломается — чиню и выкладываю фикс.': 'If the loader breaks after a client patch, I fix it and publish the update.',
  'Честная цена': 'Fair price', '1200₽ один раз — без подписок и доплат за "дополнительные" функции.': '1200₽ once, with no subscriptions or extra charges for “additional” features.',
  'Сколько угодно HUD’ов.': 'As many HUDs as you want.', 'Приватные PNG и PSD.': 'Private PNG and PSD.', 'Отвечаю в Telegram за час.': 'I reply on Telegram within an hour.',
  'Покажу весь процесс.': 'I’ll show the whole process.', 'Чиню после патчей.': 'I fix it after patches.', '1200₽ один раз.': '1200₽ once.',

  // каталог
  'каталог': 'catalog', 'СБОРКИ': 'BUILDS', 'Готовые HUD-сборки на базе RADMIR-HUDLoader: скриншот, описание и ссылка на скачивание. Нажми «Подробнее», чтобы увидеть всё.':
    'Ready-made HUD builds based on RADMIR-HUDLoader: a screenshot, a description and a download link. Press “Details” to see everything.',
  'Все': 'All', 'Бесплатные': 'Free', 'Платные': 'Paid', 'Поиск сборки…': 'Search builds…', 'Сортировка': 'Sort',
  'Как в каталоге': 'Catalog order', 'Сначала популярные': 'Most popular first', 'Сначала дешёвые': 'Cheapest first', 'По названию': 'By name',
  'Ничего не найдено.': 'Nothing found.', 'Подробнее': 'Details', 'Бесплатно': 'Free', 'Скачиваний': 'Downloads', 'скачиваний': 'downloads',
  'О сборке': 'About', 'Возможности': 'Features', 'Похожие': 'Similar', 'Скачать': 'Download', 'Скачать (через TG)': 'Download (via TG)',
  '▶ Обзор': '▶ Review', 'Вопрос': 'Ask', 'Похожих сборок пока нет.': 'No similar builds yet.',
  'Предыдущая сборка': 'Previous build', 'Следующая сборка': 'Next build',

  // HUDLoader
  'в продаже': 'on sale', 'Сравнение: с лоадером и без': 'Comparison: with and without the loader', 'Без лоадера': 'Without the loader',
  'Радар и интерфейс — фиксированные': 'Radar and interface are fixed', 'Разбираешься в редакторе сам, без обучения': 'You figure out the editor yourself, no training',
  'С RADMIR-HUDLoader': 'With RADMIR-HUDLoader', 'Радар, иконки, шрифты — под твой стиль': 'Radar, icons, fonts, all in your style', 'Обучение с нуля и поддержка 24/7': 'Training from scratch and 24/7 support',
  'Возможности лоадера': 'Loader features', 'Безлимитное создание': 'Unlimited creation', 'Полная кастомизация': 'Full customization',
  'Меняй радар, HUD и любые элементы интерфейса под свой стиль.': 'Change the radar, HUD and any interface elements to fit your style.',
  'Удобная разработка': 'Easy development', 'Быстрое редактирование и лёгкое освоение — не нужно быть дизайнером.': 'Quick editing and an easy start, no need to be a designer.',
  'Обучение и поддержка': 'Training and support', 'Полное обучение работе с лоадером плюс поддержка на связи 24/7.': 'Full training on the loader plus support online 24/7.',
  'Что входит в покупку': 'What’s included', 'Что входит': 'What’s included', 'стоимость': 'price', 'RADMIR-HUDLoader — полный доступ': 'RADMIR-HUDLoader: full access',
  'разовая оплата · без подписки': 'one-time payment · no subscription', 'Купить сейчас': 'Buy now', 'или написать перед покупкой →': 'or message before buying →',
  'Ответ в Telegram обычно в течение часа': 'Reply on Telegram usually within an hour', 'Помогаем с установкой и первым запуском': 'We help with installation and the first launch',
  'Доступ выдаётся после оплаты': 'Access is granted after payment', 'Приватные PNG': 'Private PNG', 'PSD-исходники': 'PSD sources', 'Полное обучение': 'Full training',
  'Создавай HUD’ы без ограничений — свой радар, свой интерфейс, свой стиль.': 'Create HUDs without limits: your own radar, your own interface, your own style.',
  'RADMIR-HUDLoader снимает лимит на количество HUD’ов и открывает полный доступ к кастомизации. Радар, шрифты, расположение элементов — всё меняется под твой стиль, а не только то, что разрешил оригинальный клиент.':
    'RADMIR-HUDLoader removes the limit on the number of HUDs and opens up full customization. Radar, fonts, element positions: everything changes to your style, not just what the original client allows.',
  'Один HUD «как у всех», без своих правок': 'One HUD “like everyone’s”, no edits of your own', "Сколько угодно своих HUD'ов без лимита": 'As many of your own HUDs as you like, no limit',
  "Создавай сколько угодно уникальных HUD'ов — без ограничений по количеству проектов.": 'Create as many unique HUDs as you want, with no limit on the number of projects.',
  "Безлимитное создание HUD'ов": 'Unlimited HUD creation',

  // портфолио / отзывы / соцсети / футер
  'галерея': 'gallery', 'ПОРТФОЛИО': 'PORTFOLIO', 'Скриншоты наших сборок и HUD’ов — то, что реально стоит в игре у клиентов.': 'Screenshots of our builds and HUDs, what clients actually have in the game.',
  'ОТЗЫВЫ': 'REVIEWS', 'Что говорят те, кто уже пользуется HUDLoader и ставил наши сборки.': 'What people who already use HUDLoader and installed our builds say.',
  'Пользователь Radmir-HudLoader': 'Radmir-HudLoader user', 'Покупатель сборки на заказ': 'Custom build customer',
  'сообщество': 'community', 'Наш Discord': 'Our Discord', 'Заходи, если хочешь быть в курсе новостей и пообщаться с другими игроками.': 'Join to stay up to date and chat with other players.',
  'RADMIR RP | Сборки • Плагины • Пиар': 'RADMIR RP | Builds • Plugins • PR', 'Ищешь топовые сборки и графику для Радмира, хочешь пропиарить свой мувик или просто пообщаться? Тебе сюда.': 'Looking for top builds and graphics for Radmir, want to promote your movie, or just chat? This is the place.',
  'Зайти в Discord': 'Join Discord', 'мы на связи': 'we’re online', 'Соцсети и каналы': 'Socials and channels', 'Подписывайся, чтобы не пропустить новости и обновления.': 'Subscribe so you don’t miss news and updates.',
  '© NELACOSTE WORK — создание игровых сборов RADMIR RP / HASSLE RP.': '© NELACOSTE WORK: game builds for RADMIR RP / HASSLE RP.',
  'NELACOSTE WORK не связана с RADMIR, коммерческая деятельность компании соответствует политике RADMIR RP.': 'NELACOSTE WORK is not affiliated with RADMIR; the company’s commercial activity complies with RADMIR RP policy.',
  'По всем вопросам обращаться в Telegram или на почту.': 'For any questions, contact us on Telegram or by email.',

  // карточка настроек
  'Подстрой сайт под себя. Выбор запоминается.': 'Make the site yours. Your choices are saved.', 'Язык': 'Language', 'Цвет сайта': 'Site color', 'Свой цвет': 'Custom color',
  'Размер карточек сборок': 'Build card size', 'Так будет выглядеть сетка на вкладке «Сборки».': 'This is how the grid will look on the “Builds” tab.',
  'Масштаб интерфейса': 'Interface scale', 'Скругление углов': 'Corner roundness', 'Фоновые значки': 'Background icons', 'Анимации и фон': 'Animations and background',
  'Анимации': 'Animations', 'Включены': 'On', 'Выключены': 'Off', 'Выкл': 'Off', 'Мало': 'Few', 'Норм': 'Normal', 'Много': 'Many',
  'Острые': 'Sharp', 'Обычные': 'Normal', 'Круглые': 'Round', 'Мелко': 'Small', 'Обычно': 'Normal', 'Крупно': 'Large',
  'Сбросить': 'Reset', 'Готово': 'Done',
  'Красный': 'Red', 'Фиолет': 'Violet', 'Синий': 'Blue', 'Зелёный': 'Green', 'Оранж': 'Orange', 'Розовый': 'Pink', 'Голубой': 'Cyan', 'Золото': 'Gold', 'Свой': 'Custom',

  // теги и описания сборок (повторяющиеся)
  'приятные тона': 'pleasant tones', 'смена радара': 'radar change', 'большой FPS': 'high FPS', 'тёмная тема': 'dark theme', 'огненные акценты': 'fiery accents',
  'фиолетовые тона': 'violet tones', 'красивая графика': 'beautiful graphics', 'крупный шрифт': 'large font', 'оригинальная графика': 'original graphics',
  'смена табла каптов': 'capture board change', 'смена радара и табла': 'radar and board change',
  'Приятные фиолетовые тона, подходит для слабых и средних ПК, не нагружает ваш компьютер, красивая графика.': 'Pleasant violet tones, suitable for low and mid-range PCs, light on your computer, beautiful graphics.',
  'Приятные тона, подходит для слабых и средних ПК, не нагружает ваш компьютер, красивая графика.': 'Pleasant tones, suitable for low and mid-range PCs, light on your computer, beautiful graphics.',
  'Приятные светло оранжевые тона, подходит для слабых и средних ПК, не нагружает ваш компьютер, красивая графика.': 'Pleasant light orange tones, suitable for low and mid-range PCs, light on your computer, beautiful graphics.',
  'Приятные серые тона, подходит для слабых и средних ПК, не нагружает ваш компьютер, красивая графика.': 'Pleasant gray tones, suitable for low and mid-range PCs, light on your computer, beautiful graphics.',
  'Приятные светлые тона худа, подходит для слабых и средних ПК, не нагружает ваш компьютер, красивая графика.': 'Pleasant light HUD tones, suitable for low and mid-range PCs, light on your computer, beautiful graphics.',
  'Приятные фиолетовые тона худа, подходит для слабых и средних ПК, не нагружает ваш компьютер, красивая графика.': 'Pleasant violet HUD tones, suitable for low and mid-range PCs, light on your computer, beautiful graphics.',
  'Приятные серые тона худа, подходит для слабых и средних ПК, не нагружает ваш компьютер, красивая графика.': 'Pleasant gray HUD tones, suitable for low and mid-range PCs, light on your computer, beautiful graphics.',
  'Очень приятная графика, подходит для слабых и средних ПК, не нагружает ваш компьютер, красивая графика.': 'Very pleasant graphics, suitable for low and mid-range PCs, light on your computer, beautiful graphics.',
  'Красивый HUD в оранжевых тонах. С приятной графикой.': 'A beautiful HUD in orange tones with pleasant graphics.',
  'Идеальная сборка для Radmir RP, повышает FPS.': 'The perfect build for Radmir RP, it raises FPS.',
  'Красивые фиолетовые тона, приятные звуки ганов': 'Beautiful violet tones, pleasant gun sounds',
  'Оригинальная графика, старые карточки бизов/домов.': 'Original graphics, old business/house cards.',
  'Красивая атмосферная сборка, подойдет для каптов, мувиков и для повседневной игры': 'A beautiful atmospheric build, great for captures, movies and everyday play',
  'очень атмосферная сборка, подойдет для каптов и мувиков, красивый оранжевый кулак на фисте.': 'A very atmospheric build, great for captures and movies, with a beautiful orange fist icon.',
  'Приятная графика сделана под HUD, обновляется вместе с патчами клиента': 'Pleasant graphics made for the HUD, updated together with client patches',
  'Можно поменять табло капта - /capture | Смена формы радара - /radar': 'You can change the capture board: /capture | Change radar shape: /radar',
  'Красивая оригинальная графика, которую можно менять /sw - смена погоды | /st - смена времени': 'Beautiful original graphics you can adjust: /sw changes weather | /st changes time',
  'Подходит для слабых и средних ПК, не нагружает ваш компьютер': 'Suitable for low and mid-range PCs, light on your computer',
  'Установлены старые карточки домов и бизнесов': 'Old house and business cards installed',
  'Приватная версия — не встречается в открытом доступе': 'Private version, not available publicly',
  'Крупный, легко читаемый шрифт лого-серверов': 'Large, easy-to-read server logo font',
  'Старое дефолтное лого, установлены старые карточки домов и бизнесов': 'Old default logo, old house and business cards installed',
  'Подходит для слабых и средних ПК, не нагружает ваш компьютер и установлены старые карточки домов и бизнесов': 'Suitable for low and mid-range PCs, light on your computer, old house and business cards installed',
  'Приятная оранжевая оригинальная графика, которую можно менять /sw - смена погоды | /st - смена времени': 'Pleasant orange original graphics you can adjust: /sw changes weather | /st changes time',
}

// ---------------------------------------------------------------------------
// Переводчик: проходит по тексту страницы и подменяет его по словарю.
// При смене языка обратно на RU возвращает оригинал. Следит за изменениями DOM.
// ---------------------------------------------------------------------------

const ATTRS = ['placeholder', 'aria-label', 'title', 'alt']
const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

const textOrig = new WeakMap<Text, string>()
const textApplied = new WeakMap<Text, string>()
const attrOrig = new WeakMap<Element, Record<string, string>>()
const attrApplied = new WeakMap<Element, Record<string, string>>()

function translateText(node: Text) {
  const applied = textApplied.get(node)
  if (applied !== undefined && node.data === applied) return
  const src = node.data
  const en = EN[norm(src)]
  if (!en) return
  const lead = src.match(/^\s*/)?.[0] ?? ''
  const trail = src.match(/\s*$/)?.[0] ?? ''
  const out = lead + en + trail
  textOrig.set(node, src)
  textApplied.set(node, out)
  node.data = out
}

function translateAttrs(el: Element) {
  for (const a of ATTRS) {
    const v = el.getAttribute(a)
    if (!v) continue
    const done = attrApplied.get(el)?.[a]
    if (done !== undefined && v === done) continue
    const en = EN[norm(v)]
    if (!en) continue
    const o = attrOrig.get(el) ?? {}
    const ap = attrApplied.get(el) ?? {}
    o[a] = v
    ap[a] = en
    attrOrig.set(el, o)
    attrApplied.set(el, ap)
    el.setAttribute(a, en)
  }
}

function walk(root: Node, fn: (n: Text) => void, fa: (e: Element) => void) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
  let n: Node | null = w.currentNode
  while (n) {
    if (n.nodeType === 3) fn(n as Text)
    else if (n.nodeType === 1) {
      const tag = (n as Element).tagName
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CANVAS') {
        n = w.nextSibling() ?? w.nextNode()
        continue
      }
      fa(n as Element)
    }
    n = w.nextNode()
  }
}

function restore(root: Node) {
  walk(
    root,
    (t) => {
      const ap = textApplied.get(t)
      if (ap !== undefined && t.data === ap) t.data = textOrig.get(t) ?? t.data
      textApplied.delete(t)
      textOrig.delete(t)
    },
    (e) => {
      const ap = attrApplied.get(e)
      const o = attrOrig.get(e)
      if (ap && o) for (const a of Object.keys(ap)) if (e.getAttribute(a) === ap[a]) e.setAttribute(a, o[a])
      attrApplied.delete(e)
      attrOrig.delete(e)
    },
  )
}

/** Включает перевод для lang='en'. Возвращает функцию остановки. Для 'ru' просто возвращает оригинал. */
export function startTranslator(root: HTMLElement, lang: 'ru' | 'en'): () => void {
  if (lang === 'ru') {
    restore(root)
    return () => {}
  }
  const run = () => walk(root, translateText, translateAttrs)
  run()
  let raf = 0
  const obs = new MutationObserver(() => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(run)
  })
  obs.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS })
  return () => {
    cancelAnimationFrame(raf)
    obs.disconnect()
  }
}
