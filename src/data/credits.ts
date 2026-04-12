import type { CarouselTitleKey } from "@/lib/i18n";

export type CreditItem = {
  artist: string;
  releaseLine: string;
  label: string;
  artworkUrl?: string;
  musicUrl?: string;
};

export type CarouselBlock = {
  id: string;
  titleKey: CarouselTitleKey;
  items: CreditItem[];
};

export const carousels: CarouselBlock[] = [
  {
    id: "eng-prod",
    titleKey: "engProd",
    items: [
      { artist: "Brisa", releaseLine: "Single “Soy La Música” (E, P)", label: "—" },
      { artist: "Brisa", releaseLine: "EP “Del mar y sus recuerdos” (E, P)", label: "—" },
      { artist: "Brisa", releaseLine: "“Sabor a Mí” (E, P)", label: "—" },
      { artist: "Brisa", releaseLine: "“Laberintos” (SW, E)", label: "—" },
      { artist: "Brisa", releaseLine: "“Melancolía” (E, P)", label: "—" },
    ],
  },
  {
    id: "eng",
    titleKey: "eng",
    items: [
      { artist: "aron! + Hohnen Ford", releaseLine: "“cozy you (christmas)” (E)", label: "—" },
      { artist: "Allexa Nava", releaseLine: "EP “No Language” (E)", label: "—" },
      { artist: "Louis Gardner", releaseLine: "EP “Music for Bellywash” (E)", label: "—" },
      { artist: "Sophya", releaseLine: "Single “Aboard” (E)", label: "—" },
      { artist: "Blofish", releaseLine: "“Ceramics” (E)", label: "—" },
      { artist: "Lilaac", releaseLine: "“The Bitch” (E)", label: "GMS Sessions" },
      { artist: "Lilaac", releaseLine: "“Nostalgia” (E)", label: "GMS Sessions" },
      { artist: "Maya Endo", releaseLine: "“Mala Suerte” (E)", label: "—" },
      { artist: "Marcel Caillaux", releaseLine: "“Cuando no me quede nada” (E)", label: "—" },
    ],
  },
  {
    id: "mix",
    titleKey: "mix",
    items: [
      { artist: "Brisa", releaseLine: "EP “Del mar y sus recuerdos” (M)", label: "—" },
      { artist: "Brisa", releaseLine: "Single “Soy La Música” (M)", label: "—" },
    ],
  },
  {
    id: "sw",
    titleKey: "sw",
    items: [
      { artist: "Brisa", releaseLine: "“Laberintos” (SW)", label: "—" },
      { artist: "Brisa", releaseLine: "“Melancolía” (SW)", label: "—" },
      { artist: "Maya Endo", releaseLine: "“Vino en Taza” (SW)", label: "—" },
      { artist: "Maya Endo", releaseLine: "“Efecto Mariposa” (SW)", label: "—" },
      { artist: "Maya Endo", releaseLine: "“respirar” (SW)", label: "—" },
      { artist: "Maya Endo", releaseLine: "“Té verde” (SW)", label: "—" },
      { artist: "Maya Endo", releaseLine: "“Mala Suerte” (SW)", label: "—" },
    ],
  },
  {
    id: "ae",
    titleKey: "ae",
    items: [
      {
        artist: "Mared",
        releaseLine: "EP “Mared & Friends (Live at Lightship 95)” (AE)",
        label: "Lightship95",
      },
      { artist: "oreglo", releaseLine: "EP “Not Real People” (AE)", label: "—" },
      { artist: "PARASOL", releaseLine: "EP “In Focus” (AE)", label: "—" },
      { artist: "Alia Lowers", releaseLine: "“Bloom” (AE)", label: "—" },
      { artist: "Harry Diplock", releaseLine: "“Trio & Friends” (AE)", label: "—" },
      { artist: "Silent Sadie", releaseLine: "Game Soundtrack (AE)", label: "—" },
    ],
  },
];
