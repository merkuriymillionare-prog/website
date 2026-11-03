// ===== Страница «Установка» =====
// 1) Видео-туториал: вставь ссылку на YouTube (любую: youtu.be/..., youtube.com/watch?v=..., /shorts/...).
//    Пока строка пустая — на странице покажется заглушка «Видео скоро».
export const INSTALL_VIDEO = ''

// 2) Шаги. Тексты ПРИМЕРНЫЕ — поправь под свой реальный процесс установки.
//    img — необязательная картинка шага, например '/install/step-3.png' (положи файл в public/install/).
export type InstallStep = { title: string; text: string; img?: string }

export const INSTALL_STEPS: InstallStep[] = [
  {
    title: 'Скачай сборку',
    text: 'Открой нужную сборку в каталоге и нажми «Скачать». Файл придёт одним архивом.',
  },
  {
    title: 'Распакуй архив',
    text: 'Если это .rar — понадобится WinRAR или 7-Zip. Распакуй всё в любую удобную папку.',
  },
  {
    title: 'Закинь файлы в папку игры',
    text: 'Скопируй содержимое в папку, где лежит gta_sa.exe (корень игры RADMIR). Если система спросит про замену файлов — подтверди.',
  },
  {
    title: 'Запусти игру',
    text: 'Зайди в RADMIR как обычно — сборка подхватится сама.',
  },
  {
    title: 'Не получилось?',
    text: 'Напиши в Telegram и приложи скриншот ошибки — разберёмся.',
  },
]

/** Достаёт id ролика из ссылки YouTube (или возвращает null). */
export function youtubeId(url: string): string | null {
  const m = url.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}
