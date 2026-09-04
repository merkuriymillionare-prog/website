// Скриншоты для раздела «Портфолио» — отдельный список, не привязанный к сборкам.
//
// Чтобы добавить свой скриншот:
// 1) Киньте PNG/JPG в папку public/screenshots/
// 2) Добавьте в массив ниже новую строку:
//    { src: '/screenshots/имя-файла.png', caption: 'Подпись под скриншотом' },
//
// Чтобы заменить существующий — просто поменяйте src и/или caption у нужной строки.
// Чтобы удалить — удалите строку целиком.
// Порядок в массиве = порядок в бегущей ленте.

export type PortfolioItem = {
  src?: string // путь к скриншоту в public/, например '/screenshots/invicta-01.png'
  caption: string
  fallback?: string // CSS-градиент, который показывается, если src не указан     fallback: 'linear-gradient(180deg,#1a0808 0%,#2a1111 45%,#e0767a 100%)',
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    src: '/screenshots/invicta-01.png',
    caption: 'invicta own crmp!',
  },
  { 
   src: '/screenshots/solaigetr_strong.png',
    caption: 'Solaigetr strong mafia!',
  },
  {
    src: '/screenshots/hatoyama_orng.png',
    caption: 'hatoyama let`s take out all the opps',
  },
  {
    src: '/screenshots/onsmshit_fiol.png',
    caption: 'Onsomeshit the way to space',
  },
  {
    src: '/screenshots/babochka_gta.png',
    caption: 'Incide your bastards',
    fallback: 'linear-gradient(180deg,#1a0808 0%,#2a1111 45%,#e0767a 100%)',
  },
  {
    src: '/screenshots/exuberant_thecolest.png',
    caption: 'Onsomeshit the way to space',
  },
  {
    src: '/screenshots/exshade_mpav.png',
    caption: 'Onsomeshit the way to space',
  },
  {
    src: '/screenshots/Radmir_oldgta.png',
    caption: 'Onsomeshit the way to space',
  },
  {
    src: '/screenshots/onsmshit_legendremain.png',
    caption: 'Onsomeshit the way to space',
  },
  {
    src: '/screenshots/nelacoste_ww.png',
    caption: 'Onsomeshit the way to space',
  },
  {
    src: '/screenshots/external_the.png',
    caption: 'Onsomeshit the way to space',
  },
]
