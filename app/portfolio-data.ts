// Скриншоты для раздела «Портфолио» — отдельный список, не привязанный к сборкам.
//
// Чтобы добавить свой скриншот:
// 1) Киньте PNG/JPG в папку public/screenshots/
// 2) Добавьте в массив ниже новую строку:
//    { src: '/screenshots/build.webp', caption: 'Подпись под скриншотом' },
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
    src: '/screenshots/invicta-own-crmp.webp',
    caption: 'invicta own crmp!',
  },
  { 
   src: '/screenshots/hatoyama-let-s-take-out-all-the-opps.webp',
    caption: 'hatoyama let`s take out all the opps',
  },
  {
    src: '/screenshots/onsomeshit-the-way-to-space.webp',
    caption: 'Onsomeshit the way to space',
  },
  {
    src: '/screenshots/catrage-legendary-players.webp',
    caption: 'ATRAGE Legendary players',
  },
  {
    src: '/screenshots/onsomeshit-the-cult-generation.webp',
    caption: 'Onsomeshit the cult generation!',
    fallback: 'linear-gradient(180deg,#1a0808 0%,#2a1111 45%,#e0767a 100%)',
  },
  {
    src: '/screenshots/external-the-scariets-dark-streets.webp',
    caption: 'External the scariets dark streets!',
  },
  {
    src: '/screenshots/nelacoste-the-coolest-modification.webp',
    caption: 'nelacoste the coolest modification',
  },
  {
    src: '/screenshots/whiterz-gta.webp',
    caption: 'Whiterz gta',
  },
  {
    src: '/screenshots/exshade-own-the-night.webp',
    caption: 'Exshade own the night!',
  },
  {
    src: '/screenshots/juyitsu-world-champion.webp',
    caption: 'Juyitsu world champion',
  },
  {
    src: '/screenshots/beige-gta.webp',
    caption: 'Beige gta',
  },
   {
    src: '/screenshots/juyitsu-brawl-stars.webp',
    caption: 'Juyitsu brawl stars',
  },
   {
    src: '/screenshots/samp-style-gta.webp',
    caption: 'SAMP Style gta',
  },
   {
    src: '/screenshots/juyitsu-gta-h-ch.webp',
    caption: 'Juyitsu gta H@ch',
  },
  {
    src: '/screenshots/culture-soulrage-gta.webp',
    caption: 'Culture soulrage gta',
  },
    {
    src: '/screenshots/blue-gta-333-fps.webp',
    caption: 'Blue gta +333 FPS',
  },
    {
    src: '/screenshots/invicta-purple-gta.webp',
    caption: 'nvicta purple gta',
  },
]
