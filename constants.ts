import { CarouselItem, Movie, Profile, Channel } from './types';

const VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const VIDEO_URL_2 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
const VIDEO_URL_3 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';


// --- BUNDLED IMAGE ASSETS (BASE64) ---
// This technique ensures critical images are available immediately offline.
const ideaOfYouPoster = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIbGNtcwIQAABtbnRyUkdCIFhZWiAH4gADABQACQAOAB1hY3NwTVNGVAAAAABzYXJhY3Vyc2UBYRZmZgAAAAAAAAAAAAAAAPbWAAEAAAAA0y1zYXJhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARZGVzYwAAAVAAAABiZHNjbQAAAbQAAAGOY3BydAAAA2wAAABQd3RwdAAAA4QAAAAUclhZWgAAA4wAAAAUZ1hZWgAAA5QAAAAUYlhZWgAAA6AAAAAUclRSQwAAA6wAAAgMYWFyZwAADcwAAAAgdmNndAAADcwAAAAwbmRpbgAADcwAAAAYY2hhZAAADfgAAAAsbW1vZDMMCCs3AAAAAHRleHQAAAAAQ0opyRgAAAAATi5tAEoAAAAAUENSRQAAAAABAAAAAAAAAAAAh90aEDcrAAAAAAAAAAAAAAAAAAAzMy4wOTgzIDY0LjM0NDMgMTEuNDk0NQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAA0AAAAAEAHQAEAAEAAgADAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAQQBCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwBgAGEAYgBjAGQAZQBmAGcAaABpAGoAawBsAG0AbgBvAHAAcQByAHMAdAB1AGAAggCBAIIAgwCEAIUAhgCHAIgAiQCKAIsAjACNAI4AjwCQAJEAkğAI/8A/8sAhAACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAQACAAIAAgAEABIAAAD/wAARCAE0AkoDASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAECBwQDBQb/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAECAwT/xgABAQEBAQAAAAAAAAAAAAAAAAABEQP/2gAMAwEAAhEDEQA/AN4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPHOeMc+gD0DwznnHPoN6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHPGOfQenjnPHh6B6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxzjjn0B55xxz6VegAAAAAAAAAAAAAABg3gDeMG8Abxg3gDeMG8Abxg3gDeMG8Abxg3gDeMG8Abxg3gDeMG8Abxg3gDeMG8Abxg3gDeMG8Abx45xxxz6A884459CvSAAAAAAAAAAAAAAwGjQBoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgABoAAaAAGgAB-AABAAElFTkSuQmCC';

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
    title: 'RIYOBOX ORIGINAL',
    subtitle: 'THE BOYS',
    showBrand: true,
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/reacher/800/450',
    title: 'RIYOBOX ORIGINAL',
    subtitle: 'REACHER',
    showBrand: true,
  },
  {
    id: 28,
    imageUrl: 'https://picsum.photos/seed/terminal/800/450',
    title: 'RIYOBOX ORIGINAL',
    subtitle: 'THE TERMINAL LIST',
    showBrand: true,
  },
  {
    id: 29,
    imageUrl: 'https://picsum.photos/seed/maisel/800/450',
    title: 'RIYOBOX ORIGINAL',
    subtitle: 'THE MARVELOUS MRS. MAISEL',
    showBrand: true,
  },
];

export const PRIME_MOVIES: Movie[] = [
  { id: 1, posterUrl: ideaOfYouPoster, title: 'The Idea of You', year: 2024, duration: '1h 55m', rating: 'R', description: 'A 40-year-old single mom begins an unexpected romance with a 24-year-old boy band singer.', backdropUrl: 'https://picsum.photos/seed/idea-backdrop/800/450', baseSize: 1.1, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
  { id: 2, posterUrl: 'https://picsum.photos/seed/roadhouse/400/225', title: 'Road House', year: 2024, duration: '2h 1m', rating: 'R', description: 'A former UFC fighter takes a job as a bouncer at a rough-and-tumble roadhouse in the Florida Keys, but soon discovers that not everything is as it seems in this tropical paradise.', backdropUrl: 'https://picsum.photos/seed/roadhouse-backdrop/800/450', baseSize: 1.2, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
  { id: 22, posterUrl: 'https://picsum.photos/seed/beekeeper/400/225', title: 'The Beekeeper', year: 2024, duration: '1h 45m', rating: 'R', description: 'One man\'s brutal campaign for vengeance takes on national stakes after he is revealed to be a former operative of a powerful and clandestine organization known as "Beekeepers".', backdropUrl: 'https://picsum.photos/seed/beekeeper-backdrop/800/450', baseSize: 1.3, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
  { id: 23, posterUrl: 'https://picsum.photos/seed/dune2/400/225', title: 'Dune: Part Two', year: 2024, duration: '2h 46m', rating: 'PG-13', description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', backdropUrl: 'https://picsum.photos/seed/dune2-backdrop/800/450', baseSize: 2.1, videoUrl_480p: VIDEO_URL_3, videoUrl_720p: VIDEO_URL_3, videoUrl_1080p: VIDEO_URL_3 },
  { id: 30, posterUrl: 'https://picsum.photos/seed/oppenheimer-poster/400/225', title: 'Oppenheimer', year: 2023, duration: '3h 0m', rating: 'R', description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', backdropUrl: 'https://picsum.photos/seed/oppenheimer-backdrop/800/450', baseSize: 1.8, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
  { id: 31, posterUrl: 'https://picsum.photos/seed/poorthings-poster/400/225', title: 'Poor Things', year: 2023, duration: '2h 21m', rating: 'R', description: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.', backdropUrl: 'https://picsum.photos/seed/poor-things-backdrop/800/450', baseSize: 1.4, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
];

export const PRIME_ORIGINALS: Movie[] = [
  { id: 4, posterUrl: 'https://picsum.photos/seed/invincible/300/450', title: 'Invincible', year: 2021, duration: '2 Seasons', rating: 'TV-MA', description: 'An adult animated series based on the Skybound/Image comic about a teenager whose father is the most powerful superhero on the planet.', backdropUrl: 'https://picsum.photos/seed/invincible-backdrop/800/450', baseSize: 15.0, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
  { id: 5, posterUrl: 'https://picsum.photos/seed/federer/300/450', title: 'Federer: Twelve Final Days', year: 2024, duration: '1h 40m', rating: 'PG-13', description: 'A documentary following tennis legend Roger Federer during the last 12 days of his professional career.', backdropUrl: 'https://picsum.photos/seed/federer-backdrop/800/450', baseSize: 1.0, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
  { id: 3, posterUrl: 'https://picsum.photos/seed/fallout/400/225', title: 'Fallout', year: 2024, duration: '1 Season', rating: 'TV-MA', description: 'In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves from radiation, mutants and bandits.', backdropUrl: 'https://picsum.photos/seed/fallout-backdrop/800/450', baseSize: 8.5, videoUrl_480p: VIDEO_URL_3, videoUrl_720p: VIDEO_URL_3, videoUrl_1080p: VIDEO_URL_3 },
  { id: 6, posterUrl: 'https://picsum.photos/seed/maxton/300/450', title: 'Maxton Hall', year: 2024, duration: '1 Season', rating: '16+', description: 'A quick-witted scholarship student discovers a secret at a private school and is drawn into the world of a super-rich and arrogant heir.', backdropUrl: 'https://picsum.photos/seed/maxton-backdrop/800/450', baseSize: 7.0, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
  { id: 7, posterUrl: 'https://picsum.photos/seed/genv/300/450', title: 'Gen V', year: 2023, duration: '1 Season', rating: 'TV-MA', description: 'From the world of "The Boys" comes "Gen V," which explores the first generation of superheroes to know that their superpowers are from Compound V.', backdropUrl: 'https://picsum.photos/seed/genv-backdrop/800/450', baseSize: 7.5, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
  { id: 24, posterUrl: 'https://picsum.photos/seed/upland/300/450', title: 'Upland', year: 2023, duration: '1h 29m', rating: 'PG-13', description: 'A group of friends discover a mysterious object that gives them superpowers.', backdropUrl: 'https://picsum.photos/seed/upland-backdrop/800/450', baseSize: 0.9, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
  { id: 25, posterUrl: 'https://picsum.photos/seed/saltburn/300/450', title: 'Saltburn', year: 2023, duration: '2h 11m', rating: 'R', description: 'A student at Oxford University finds himself drawn into the world of a charming and aristocratic classmate, who invites him to his eccentric family\'s sprawling estate for a summer never to be forgotten.', backdropUrl: 'https://picsum.photos/seed/saltburn-backdrop/800/450', baseSize: 1.5, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
];

export const CONTINUE_WATCHING: Movie[] = [
    { id: 8, posterUrl: 'https://picsum.photos/seed/cw1/400/225', progress: 75, title: 'Reacher', year: 2022, duration: '2 Seasons', rating: 'TV-14', description: 'Jack Reacher was arrested for murder and now the police need his help.', backdropUrl: 'https://picsum.photos/seed/reacher-backdrop/800/450', baseSize: 16.0, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
    { id: 9, posterUrl: 'https://picsum.photos/seed/cw2/400/225', progress: 20, title: 'The Office', year: 2005, duration: '9 Seasons', rating: 'TV-14', description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.', backdropUrl: 'https://picsum.photos/seed/office-backdrop/800/450', baseSize: 50.0, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
    { id: 10, posterUrl: 'https://picsum.photos/seed/cw3/400/225', progress: 50, title: 'Oppenheimer', year: 2023, duration: '3h 0m', rating: 'R', description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', backdropUrl: 'https://picsum.photos/seed/oppenheimer-backdrop/800/450', baseSize: 1.8, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
    { id: 11, posterUrl: 'https://picsum.photos/seed/cw4/400/225', progress: 98, title: 'Poor Things', year: 2023, duration: '2h 21m', rating: 'R', description: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.', backdropUrl: 'https://picsum.photos/seed/poor-things-backdrop/800/450', baseSize: 1.4, videoUrl_480p: VIDEO_URL_3, videoUrl_720p: VIDEO_URL_3, videoUrl_1080p: VIDEO_URL_3 },
    { id: 12, posterUrl: 'https://picsum.photos/seed/cw5/400/225', progress: 15, title: 'The Terminal List', year: 2022, duration: '1 Season', rating: 'TV-MA', description: 'A former Navy SEAL officer investigates why his entire platoon was ambushed during a high-stakes covert mission.', backdropUrl: 'https://picsum.photos/seed/terminal-list-backdrop/800/450', baseSize: 8.0, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
    { id: 13, posterUrl: 'https://picsum.photos/seed/cw6/400/225', progress: 65, title: 'The Summer I Turned Pretty', year: 2022, duration: '2 Seasons', rating: 'TV-14', description: 'A love triangle between one girl and two brothers. A story about first love, first heartbreak, and the magic of that one perfect summer.', backdropUrl: 'https://picsum.photos/seed/summer-pretty-backdrop/800/450', baseSize: 14.0, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
    { id: 14, posterUrl: 'https://picsum.photos/seed/cw7/400/225', progress: 30, title: 'The Wheel of Time', year: 2021, duration: '2 Seasons', rating: 'TV-14', description: 'Set in a high fantasy world where magic exists, but only some can access it, a woman named Moiraine crosses paths with five young men and women.', backdropUrl: 'https://picsum.photos/seed/wot-backdrop/800/450', baseSize: 15.5, videoUrl_480p: VIDEO_URL_3, videoUrl_720p: VIDEO_URL_3, videoUrl_1080p: VIDEO_URL_3 },
    { id: 26, posterUrl: 'https://picsum.photos/seed/cw8/400/225', progress: 80, title: 'Blade Runner 2049', year: 2017, duration: '2h 44m', rating: 'R', description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.', backdropUrl: 'https://picsum.photos/seed/br2049-backdrop/800/450', baseSize: 2.0, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
    { id: 27, posterUrl: 'https://picsum.photos/seed/cw9/400/225', progress: 45, title: 'The Marvelous Mrs. Maisel', year: 2017, duration: '5 Seasons', rating: 'TV-MA', description: 'A housewife in 1958 decides to become a stand-up comic.', backdropUrl: 'https://picsum.photos/seed/maisel-backdrop/800/450', baseSize: 45.0, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
    { id: 32, posterUrl: 'https://picsum.photos/seed/cw10/400/225', progress: 5, title: 'Fleabag', year: 2016, duration: '2 Seasons', rating: 'TV-MA', description: 'A dry-witted woman, known only as Fleabag, has no filter as she navigates life and love in London while trying to cope with tragedy.', backdropUrl: 'https://picsum.photos/seed/fleabag-backdrop/800/450', baseSize: 12.0, videoUrl_480p: VIDEO_URL_3, videoUrl_720p: VIDEO_URL_3, videoUrl_1080p: VIDEO_URL_3 },
];

export const PROFILES: Profile[] = [
    { id: 1, name: 'Sahan', avatarUrl: 'https://picsum.photos/seed/sahan/200' },
    { id: 2, name: 'Jessica', avatarUrl: 'https://picsum.photos/seed/jessica/200' },
    { id: 3, name: 'Mike', avatarUrl: 'https://picsum.photos/seed/mike/200' },
    { id: 4, name: 'Kids', avatarUrl: 'https://picsum.photos/seed/kids/200', isKid: true },
];

export const CATEGORIES = ['All', 'Movies', 'TV shows', 'Anime', 'Kids', 'Subscriptions'];

// New Carousel for Films Page
export const FILMS_CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 4,
    imageUrl: 'https://picsum.photos/seed/dune/800/450',
    title: 'NOW STREAMING',
    subtitle: 'DUNE: PART TWO',
    showBrand: false,
  },
  {
    id: 5,
    imageUrl: 'https://picsum.photos/seed/godzilla/800/450',
    title: 'NEW RELEASE',
    subtitle: 'GODZILLA X KONG',
    showBrand: false,
  },
  {
    id: 33,
    imageUrl: 'https://picsum.photos/seed/fallguy/800/450',
    title: 'ACTION PACKED',
    subtitle: 'THE FALL GUY',
    showBrand: false,
  },
];

// New Movie categories for Films Page
export const ACTION_MOVIES: Movie[] = [
  PRIME_MOVIES[1], // Road House
  CONTINUE_WATCHING[0], // Reacher
  CONTINUE_WATCHING[4], // The Terminal List
  PRIME_ORIGINALS[2], // Fallout
  PRIME_MOVIES[2], // The Beekeeper
  PRIME_MOVIES[3], // Dune: Part Two
  CONTINUE_WATCHING[7], // Blade Runner 2049
  { id: 34, posterUrl: 'https://picsum.photos/seed/johnwick4/400/225', title: 'John Wick: Chapter 4', year: 2023, duration: '2h 49m', rating: 'R', description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.', backdropUrl: 'https://picsum.photos/seed/johnwick4-backdrop/800/450', baseSize: 2.2, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
];

export const DRAMA_MOVIES: Movie[] = [
  PRIME_MOVIES[0], // The Idea of You
  CONTINUE_WATCHING[2], // Oppenheimer
  CONTINUE_WATCHING[3], // Poor Things
  PRIME_ORIGINALS[1], // Federer
  PRIME_ORIGINALS[6], // Saltburn
  { id: 35, posterUrl: 'https://picsum.photos/seed/pastlives/400/225', title: 'Past Lives', year: 2023, duration: '1h 46m', rating: 'PG-13', description: 'Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after Nora\'s family emigrates from South Korea. 20 years later, they are reunited for one fateful week.', backdropUrl: 'https://picsum.photos/seed/pastlives-backdrop/800/450', baseSize: 1.1, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
];

// New data for Subscriptions Page
export const CHANNELS: Channel[] = [
    { id: 1, name: 'Max', logoUrl: 'https://picsum.photos/seed/max/200', description: 'Stream all of HBO, plus hit series, movies, and Max Originals.', price: '$15.99/mo' },
    { id: 2, name: 'Paramount+', logoUrl: 'https://picsum.photos/seed/paramount/200', description: 'Live sports, breaking news, and a mountain of entertainment.', price: '$5.99/mo', subscribed: true },
    { id: 3, name: 'STARZ', logoUrl: 'https://picsum.photos/seed/starz/200', description: 'Obsessable series and hit movies.', price: '$8.99/mo' },
    { id: 4, name: 'AMC+', logoUrl: 'https://picsum.photos/seed/amc/200', description: 'The best of AMC, IFC, Sundance, and more.', price: '$8.99/mo' },
    { id: 5, name: 'Showtime', logoUrl: 'https://picsum.photos/seed/showtime/200', description: 'Critically acclaimed original series, hit movies, and more.', price: '$10.99/mo', subscribed: true },
    { id: 6, name: 'BritBox', logoUrl: 'https://picsum.photos/seed/britbox/200', description: 'The biggest streaming collection of British TV.', price: '$7.99/mo' },
    { id: 7, name: 'Discovery+', logoUrl: 'https://picsum.photos/seed/discovery/200', description: 'Real-life entertainment from your favorite TV brands.', price: '$4.99/mo' },
    { id: 8, name: 'MGM+', logoUrl: 'https://picsum.photos/seed/mgm/200', description: 'MGM\'s legacy of iconic movies, series, and originals.', price: '$6.99/mo' },
];

// New data for Kids Page
export const ANIMATED_MOVIES: Movie[] = [
  { id: 15, posterUrl: 'https://picsum.photos/seed/animated1/300/450', title: 'Leo the Lion', year: 2023, duration: '1h 32m', rating: 'G', description: 'A young lion cub learns about courage and friendship in the African savanna.', backdropUrl: 'https://picsum.photos/seed/animated1-backdrop/800/450', baseSize: 1.1, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
  { id: 16, posterUrl: 'https://picsum.photos/seed/animated2/300/450', title: 'Space Cadets', year: 2024, duration: '1h 45m', rating: 'PG', description: 'A group of friends build a rocket and accidentally launch themselves into an adventure across the galaxy.', backdropUrl: 'https://picsum.photos/seed/animated2-backdrop/800/450', baseSize: 1.3, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
  { id: 17, posterUrl: 'https://picsum.photos/seed/animated3/300/450', title: 'The Magical Forest', year: 2022, duration: '1h 28m', rating: 'G', description: 'Two siblings discover a hidden world of magical creatures right in their own backyard.', backdropUrl: 'https://picsum.photos/seed/animated3-backdrop/800/450', baseSize: 1.0, videoUrl_480p: VIDEO_URL_3, videoUrl_720p: VIDEO_URL_3, videoUrl_1080p: VIDEO_URL_3 },
  { id: 18, posterUrl: 'https://picsum.photos/seed/animated4/300/450', title: 'Robot Pals', year: 2024, duration: '1h 35m', rating: 'PG', description: 'A lonely boy befriends a quirky, outdated robot, and together they try to win the school science fair.', backdropUrl: 'https://picsum.photos/seed/animated4-backdrop/800/450', baseSize: 1.2, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
  { id: 36, posterUrl: 'https://picsum.photos/seed/animated5/300/450', title: 'Dragon\'s Peak', year: 2023, duration: '1h 50m', rating: 'PG', description: 'A brave young girl must climb a treacherous mountain to return a lost dragon egg to its mother.', backdropUrl: 'https://picsum.photos/seed/animated5-backdrop/800/450', baseSize: 1.4, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
];

export const FAMILY_FAVORITES: Movie[] = [
  { id: 19, posterUrl: 'https://picsum.photos/seed/family1/400/225', title: 'The Great Dog Race', year: 2023, duration: '1h 41m', rating: 'G', description: 'A family enters their mischievous but lovable golden retriever into a national dog competition.', backdropUrl: 'https://picsum.photos/seed/family1-backdrop/800/450', baseSize: 1.4, videoUrl_480p: VIDEO_URL_3, videoUrl_720p: VIDEO_URL_3, videoUrl_1080p: VIDEO_URL_3 },
  { id: 20, posterUrl: 'https://picsum.photos/seed/family2/400/225', title: 'Island Adventure', year: 2022, duration: '1h 55m', rating: 'PG', description: 'A family vacation goes awry when they get shipwrecked on a deserted island full of secrets.', backdropUrl: 'https://picsum.photos/seed/family2-backdrop/800/450', baseSize: 1.6, videoUrl_480p: VIDEO_URL_2, videoUrl_720p: VIDEO_URL_2, videoUrl_1080p: VIDEO_URL_2 },
  { id: 21, posterUrl: 'https://picsum.photos/seed/family3/400/225', title: 'Mystery at the Museum', year: 2024, duration: '1h 38m', rating: 'PG', description: 'A group of kids on a school trip must solve the mystery of a missing artifact before morning.', backdropUrl: 'https://picsum.photos/seed/family3-backdrop/800/450', baseSize: 1.3, videoUrl_480p: VIDEO_URL_3, videoUrl_720p: VIDEO_URL_3, videoUrl_1080p: VIDEO_URL_3 },
  { id: 37, posterUrl: 'https://picsum.photos/seed/family4/400/225', title: 'A Week with Grandpa', year: 2022, duration: '1h 30m', rating: 'G', description: 'Two kids spend a week with their eccentric inventor grandfather, leading to hilarious and heartwarming adventures.', backdropUrl: 'https://picsum.photos/seed/family4-backdrop/800/450', baseSize: 1.1, videoUrl_480p: VIDEO_URL, videoUrl_720p: VIDEO_URL, videoUrl_1080p: VIDEO_URL },
];