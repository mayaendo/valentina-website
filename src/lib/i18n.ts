export type Lang = "en" | "es";

export const translations = {
  en: {
    lang: "ES",
    nav: {
      home: "Home",
      credits: "Credits",
      contact: "Contact",
    },
    hero: {
      bio: "Valentina Caillaux is a recording engineer, producer, and songwriter with Peruvian and Italian roots. Currently working as Assistant Engineer at Sol de Sants Studios in Barcelona, under the mentorship of Alberto Perez. She honed her craft at Goldsmiths Music Studios in London alongside Mikko Gordon, Sean Woodlock, and Nick Powell, and as Assistant Engineer at Lightship95 Studios under Giles Barret and Dave Holmes. Her deep connection with Jazz recordings and her background as a classical and jazz flautist inform her approach to capturing the soul of live performances. She has collaborated internationally with artists including Rita Payés, Shai Maestro, Brisa, Maya Endo, Allexa Nava, Hohnen Ford, and aron!",
    },
    carousels: {
      engProd: "Engineer & production credits",
      eng: "Engineer credits",
      mix: "Mix engineer credits",
      sw: "Songwriter credits",
      ae: "Assistant engineer credits",
    },
    contact: {
      heading: "Get in touch",
    },
  },
  es: {
    lang: "EN",
    nav: {
      home: "Inicio",
      credits: "Créditos",
      contact: "Contacto",
    },
    hero: {
      bio: "Valentina Caillaux es ingeniera de grabación, productora y compositora con raíces peruanas e italianas. Actualmente trabaja como Ingeniera Asistente en Sol de Sants Studios en Barcelona, bajo la mentoría de Alberto Perez. Perfeccionó su oficio en Goldsmiths Music Studios en Londres junto a Mikko Gordon, Sean Woodlock y Nick Powell, y como Ingeniera Asistente en Lightship95 Studios bajo la dirección de Giles Barret y Dave Holmes. Su profunda conexión con las grabaciones de Jazz y su trayectoria como flautista clásica y de jazz informan su enfoque para capturar el alma de las actuaciones en vivo. Ha colaborado internacionalmente con artistas como Rita Payés, Shai Maestro, Brisa, Maya Endo, Allexa Nava, Hohnen Ford y aron!",
    },
    carousels: {
      engProd: "Créditos de ingeniería y producción",
      eng: "Créditos de ingeniería",
      mix: "Créditos de mezcla",
      sw: "Créditos de composición",
      ae: "Créditos de ingeniero/a asistente",
    },
    contact: {
      heading: "Escríbeme",
    },
  },
} as const;

export type CarouselTitleKey = keyof typeof translations.en.carousels;
