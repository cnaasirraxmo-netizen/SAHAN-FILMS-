import { CarouselItem, Movie, Profile } from './types';

export const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/rings/800/450',
    title: 'THE LORD OF THE RINGS',
    subtitle: 'THE RINGS OF POWER',
    showBrand: true,
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/seed/boys/800/450',
    title: 'AMAZON ORIGINAL',
    subtitle: 'THE BOYS',
    showBrand: true,
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/reacher/800/450',
    title: 'AMAZON ORIGINAL',
    subtitle: 'REACHER',
    showBrand: true,
  },
];

export const PRIME_MOVIES: Movie[] = [
  { id: 1, posterUrl: 'https://picsum.photos/seed/idea/400/225', title: 'The Idea of You', year: 2024, duration: '1h 55m', rating: 'R', description: 'A 40-year-old single mom begins an unexpected romance with a 24-year-old boy band singer.', backdropUrl: 'https://picsum.photos/seed/idea-backdrop/800/450' },
  { id: 2, posterUrl: 'https://picsum.photos/seed/roadhouse/400/225', title: 'Road House', year: 2024, duration: '2h 1m', rating: 'R', description: 'A former UFC fighter takes a job as a bouncer at a rough-and-tumble roadhouse in the Florida Keys, but soon discovers that not everything is as it seems in this tropical paradise.', backdropUrl: 'https://picsum.photos/seed/roadhouse-backdrop/800/450' },
  { id: 3, posterUrl: 'https://picsum.photos/seed/fallout/400/225', title: 'Fallout', year: 2024, duration: '1 Season', rating: 'TV-MA', description: 'In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves from radiation, mutants and bandits.', backdropUrl: 'https://picsum.photos/seed/fallout-backdrop/800/450' },
];

export const PRIME_ORIGINALS: Movie[] = [
  { id: 4, posterUrl: 'https://picsum.photos/seed/invincible/300/450', title: 'Invincible', year: 2021, duration: '2 Seasons', rating: 'TV-MA', description: 'An adult animated series based on the Skybound/Image comic about a teenager whose father is the most powerful superhero on the planet.', backdropUrl: 'https://picsum.photos/seed/invincible-backdrop/800/450' },
  { id: 5, posterUrl: 'https://picsum.photos/seed/federer/300/450', title: 'Federer: Twelve Final Days', year: 2024, duration: '1h 40m', rating: 'PG-13', description: 'A documentary following tennis legend Roger Federer during the last 12 days of his professional career.', backdropUrl: 'https://picsum.photos/seed/federer-backdrop/800/450' },
  { id: 6, posterUrl: 'https://picsum.photos/seed/maxton/300/450', title: 'Maxton Hall', year: 2024, duration: '1 Season', rating: '16+', description: 'A quick-witted scholarship student discovers a secret at a private school and is drawn into the world of a super-rich and arrogant heir.', backdropUrl: 'https://picsum.photos/seed/maxton-backdrop/800/450' },
  { id: 7, posterUrl: 'https://picsum.photos/seed/genv/300/450', title: 'Gen V', year: 2023, duration: '1 Season', rating: 'TV-MA', description: 'From the world of "The Boys" comes "Gen V," which explores the first generation of superheroes to know that their superpowers are from Compound V.', backdropUrl: 'https://picsum.photos/seed/genv-backdrop/800/450' },
];

export const CONTINUE_WATCHING: Movie[] = [
    { id: 8, posterUrl: 'https://picsum.photos/seed/cw1/400/225', progress: 75, title: 'Reacher', year: 2022, duration: '2 Seasons', rating: 'TV-14', description: 'Jack Reacher was arrested for murder and now the police need his help.', backdropUrl: 'https://picsum.photos/seed/reacher-backdrop/800/450' },
    { id: 9, posterUrl: 'https://picsum.photos/seed/cw2/400/225', progress: 20, title: 'The Office', year: 2005, duration: '9 Seasons', rating: 'TV-14', description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.', backdropUrl: 'https://picsum.photos/seed/office-backdrop/800/450' },
    { id: 10, posterUrl: 'https://picsum.photos/seed/cw3/400/225', progress: 50, title: 'Oppenheimer', year: 2023, duration: '3h 0m', rating: 'R', description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', backdropUrl: 'https://picsum.photos/seed/oppenheimer-backdrop/800/450' },
    { id: 11, posterUrl: 'https://picsum.photos/seed/cw4/400/225', progress: 90, title: 'Poor Things', year: 2023, duration: '2h 21m', rating: 'R', description: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.', backdropUrl: 'https://picsum.photos/seed/poor-things-backdrop/800/450' },
    { id: 12, posterUrl: 'https://picsum.photos/seed/cw5/400/225', progress: 15, title: 'The Terminal List', year: 2022, duration: '1 Season', rating: 'TV-MA', description: 'A former Navy SEAL officer investigates why his entire platoon was ambushed during a high-stakes covert mission.', backdropUrl: 'https://picsum.photos/seed/terminal-list-backdrop/800/450' },
    { id: 13, posterUrl: 'https://picsum.photos/seed/cw6/400/225', progress: 65, title: 'The Summer I Turned Pretty', year: 2022, duration: '2 Seasons', rating: 'TV-14', description: 'A love triangle between one girl and two brothers. A story about first love, first heartbreak, and the magic of that one perfect summer.', backdropUrl: 'https://picsum.photos/seed/summer-pretty-backdrop/800/450' },
    { id: 14, posterUrl: 'https://picsum.photos/seed/cw7/400/225', progress: 30, title: 'The Wheel of Time', year: 2021, duration: '2 Seasons', rating: 'TV-14', description: 'Set in a high fantasy world where magic exists, but only some can access it, a woman named Moiraine crosses paths with five young men and women.', backdropUrl: 'https://picsum.photos/seed/wot-backdrop/800/450' },
];

export const PROFILES: Profile[] = [
    { id: 1, name: 'Sahan', avatarUrl: 'https://picsum.photos/seed/sahan/200' },
    { id: 2, name: 'Jessica', avatarUrl: 'https://picsum.photos/seed/jessica/200' },
    { id: 3, name: 'Mike', avatarUrl: 'https://picsum.photos/seed/mike/200' },
    { id: 4, name: 'Kids', avatarUrl: 'https://picsum.photos/seed/kids/200', isKid: true },
];
