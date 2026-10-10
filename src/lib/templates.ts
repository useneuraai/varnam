export interface TemplateData {
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_venue: string;
  quote?: string;
  family_names?: string;
  rsvp_phone?: string;
  custom_message?: string;
  music_url?: string;
  // Standardized 9-section features
  bg_image_url?: string;
  slideshow_images?: string;
  reception_date?: string;
  reception_venue?: string;
  gmap_coordinates?: string;
  wedding_events?: string;
}

export interface TemplateConfigField {
  id: string;
  label: string;
  type: "text" | "textarea" | "datetime" | "toggle";
  placeholder?: string;
  required: boolean;
}

export const SHARED_LICENSE_FIELDS: TemplateConfigField[] = [
  {
    id: "bg_image_url",
    label: "Custom Background / Atmosphere",
    type: "text",
    placeholder: "/images/kovil/kovil_temple_entrance.jpg",
    required: false,
  },
  {
    id: "slideshow_images",
    label: "Photo Gallery Images (Comma-separated URLs)",
    type: "textarea",
    placeholder:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=900, https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900",
    required: false,
  },
  { id: "reception_date", label: "Reception Date & Time", type: "datetime", required: false },
  {
    id: "reception_venue",
    label: "Reception Venue Address",
    type: "textarea",
    placeholder: "Grand Ballroom, Sri Krishna Mahal, Chennai",
    required: false,
  },
  {
    id: "wedding_events",
    label: "Custom Timeline Events (Event | Date & Time | Venue per line)",
    type: "textarea",
    placeholder:
      "Nichayathartham | 18 Dec 2026, 06:00 PM | Sri Krishna Mahal\nVratham & Haldi | 19 Dec 2026, 09:00 AM | Sri Krishna Mahal\nKalyana Muhurtham | 20 Dec 2026, 07:30 AM | Sri Krishna Mahal\nReception Feast | 20 Dec 2026, 06:30 PM | Sri Krishna Mahal",
    required: false,
  },
  {
    id: "gmap_coordinates",
    label: "Google Maps Venue Location",
    type: "text",
    placeholder: "Sri Krishna Mahal Chromepet Chennai",
    required: false,
  },
];

export interface TemplateDefinition {
  slug: string;
  name: string;
  description: string;
  category: string;
  religion: string;
  language: string;
  price: number;
  thumbnailUrl: string;
  previewMusicUrl: string;
  fields: TemplateConfigField[];
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    slug: "mayura-classic",
    name: "Mayura Classic",
    description:
      "Regal peacock classic wedding invitation featuring carved palace jharokha archway, gold mandala sunburst timeline, and jewel-toned peacock plumes.",
    category: "Classic",
    religion: "",
    language: "",
    price: 999,
    thumbnailUrl: "/images/mayura-classic/hero_peacock_arch.jpg",
    previewMusicUrl:
      "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Ananya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Siddharth", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      {
        id: "wedding_venue",
        label: "Wedding Venue",
        type: "textarea",
        placeholder: "The Leela Palace Courtyard, Adyar Seaface, MRC Nagar, Chennai - 600028",
        required: true,
      },
      {
        id: "quote",
        label: "Wedding Verse / Quote",
        type: "text",
        placeholder: "Two souls united amidst royal gardens and serene blessings, embarking on an eternal sacred journey together.",
        required: false,
      },
      {
        id: "family_names",
        label: "Welcoming Families",
        type: "text",
        placeholder: "The Sundararajan & Ranganathan Families",
        required: false,
      },
      { id: "rsvp_phone", label: "RSVP Contact", type: "text", placeholder: "+91 98401 23456", required: true },
      {
        id: "custom_message",
        label: "Ceremonial Note",
        type: "textarea",
        placeholder: "We seek your gracious presence and heartfelt blessings on our special day.",
        required: false,
      },
    ],
  },
  {
    slug: "mayura-palace",
    name: "Palace Garden",
    description:
      "Regal palace garden wedding invitation featuring carved marble jharokha, blue hydrangeas, crystal chandelier, and royal peacock motifs.",
    category: "Classic",
    religion: "",
    language: "",
    price: 999,
    thumbnailUrl: "/images/mayura-palace/hero_peacock_arch.jpg",
    previewMusicUrl:
      "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Ananya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Siddharth", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      {
        id: "wedding_venue",
        label: "Wedding Venue",
        type: "textarea",
        placeholder: "The Leela Palace Courtyard, Adyar Seaface, MRC Nagar, Chennai - 600028",
        required: true,
      },
      {
        id: "quote",
        label: "Wedding Verse / Quote",
        type: "text",
        placeholder: "Two souls united amidst royal gardens and serene blessings, embarking on an eternal sacred journey together.",
        required: false,
      },
      {
        id: "family_names",
        label: "Welcoming Families",
        type: "text",
        placeholder: "The Sundararajan & Ranganathan Families",
        required: false,
      },
      { id: "rsvp_phone", label: "RSVP Contact", type: "text", placeholder: "+91 98401 23456", required: true },
      {
        id: "custom_message",
        label: "Ceremonial Note",
        type: "textarea",
        placeholder: "We seek your gracious presence and heartfelt blessings on our special day.",
        required: false,
      },
    ],
  },
  {
    slug: "kamalam-kalyanam",
    name: "Crimson Red",
    description:
      "Minimalist royal crimson wedding invitation framed with golden lotus archway, elegant typography, and smooth scroll motion.",
    category: "Classic",
    religion: "",
    language: "",
    price: 999,
    thumbnailUrl: "/images/kamalam-kalyanam/hero_lotus_arch.jpg",
    previewMusicUrl:
      "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Ananya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Siddharth", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      {
        id: "wedding_venue",
        label: "Wedding Venue",
        type: "textarea",
        placeholder: "The Leela Palace Courtyard, Adyar Seaface, MRC Nagar, Chennai - 600028",
        required: true,
      },
      {
        id: "quote",
        label: "Wedding Verse / Quote",
        type: "text",
        placeholder: "Two souls united amidst royal gardens and serene blessings, embarking on an eternal sacred journey together.",
        required: false,
      },
      {
        id: "family_names",
        label: "Welcoming Families",
        type: "text",
        placeholder: "The Sundararajan & Ranganathan Families",
        required: false,
      },
      { id: "rsvp_phone", label: "RSVP Contact", type: "text", placeholder: "+91 98401 23456", required: true },
      {
        id: "custom_message",
        label: "Ceremonial Note",
        type: "textarea",
        placeholder: "We seek your gracious presence and heartfelt blessings on our special day.",
        required: false,
      },
    ],
  },
  {
    slug: "theertha-mandapam",
    name: "Lotus & Swans",
    description:
      "Serene sacred water wedding invitation adorned with royal swans, floating lotus blossoms, and traditional hanging bells.",
    category: "Classic",
    religion: "",
    language: "",
    price: 999,
    thumbnailUrl: "/images/tamil-classic/swan_lotus_arch_bg.jpg",
    previewMusicUrl:
      "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Ananya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Siddharth", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      {
        id: "wedding_venue",
        label: "Wedding Venue",
        type: "textarea",
        placeholder: "The Leela Palace Courtyard, Adyar Seaface, MRC Nagar, Chennai - 600028",
        required: true,
      },
      {
        id: "quote",
        label: "Wedding Verse / Quote",
        type: "text",
        placeholder: "Two souls united amidst royal gardens and serene blessings, embarking on an eternal sacred journey together.",
        required: false,
      },
      {
        id: "family_names",
        label: "Welcoming Families",
        type: "text",
        placeholder: "The Sundararajan & Ranganathan Families",
        required: false,
      },
      { id: "rsvp_phone", label: "RSVP Contact Phone", type: "text", placeholder: "+91 98401 23456", required: true },
      {
        id: "custom_message",
        label: "Ceremonial Note",
        type: "textarea",
        placeholder: "We seek your gracious presence and heartfelt blessings on our special day.",
        required: false,
      },
    ],
  },
  {
    slug: "marigold-vizha",
    name: "Marigold Festive",
    description:
      "Joyous celebration adorned with cascading marigold garlands, peacock archway motifs, and glowing terracotta lamps.",
    category: "Classic",
    religion: "",
    language: "",
    price: 999,
    thumbnailUrl: "/images/tamil-classic/marigold_arch_bg.jpg",
    previewMusicUrl:
      "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Ananya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Siddharth", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      {
        id: "wedding_venue",
        label: "Wedding Venue",
        type: "textarea",
        placeholder: "The Leela Palace Courtyard, Adyar Seaface, MRC Nagar, Chennai - 600028",
        required: true,
      },
      {
        id: "quote",
        label: "Wedding Verse / Quote",
        type: "text",
        placeholder: "Two souls united amidst royal gardens and serene blessings, embarking on an eternal sacred journey together.",
        required: false,
      },
      {
        id: "family_names",
        label: "Welcoming Families",
        type: "text",
        placeholder: "The Sundararajan & Ranganathan Families",
        required: false,
      },
      { id: "rsvp_phone", label: "RSVP Contact Phone", type: "text", placeholder: "+91 98401 23456", required: true },
      {
        id: "custom_message",
        label: "Ceremonial Note",
        type: "textarea",
        placeholder: "We seek your gracious presence and heartfelt blessings on our special day.",
        required: false,
      },
    ],
  },
  {
    slug: "kadhal-editorial",
    name: "Classical Gold",
    description:
      "Graceful classical wedding invitation adorned with royal gold filigree archway, divine Veena and Mridangam melodies.",
    category: "Classic",
    religion: "",
    language: "",
    price: 999,
    thumbnailUrl: "/images/tamil-classic/gold_veena_arch_bg.jpg",
    previewMusicUrl:
      "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Ananya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Siddharth", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      {
        id: "wedding_venue",
        label: "Wedding Venue",
        type: "textarea",
        placeholder: "The Leela Palace Courtyard, Adyar Seaface, MRC Nagar, Chennai - 600028",
        required: true,
      },
      {
        id: "quote",
        label: "Wedding Verse / Quote",
        type: "text",
        placeholder: "Two souls united amidst royal gardens and serene blessings, embarking on an eternal sacred journey together.",
        required: false,
      },
      {
        id: "family_names",
        label: "Welcoming Families",
        type: "text",
        placeholder: "The Sundararajan & Ranganathan Families",
        required: false,
      },
      { id: "rsvp_phone", label: "RSVP Contact Phone", type: "text", placeholder: "+91 98401 23456", required: true },
      {
        id: "custom_message",
        label: "Ceremonial Note",
        type: "textarea",
        placeholder: "We seek your gracious presence and heartfelt blessings on our special day.",
        required: false,
      },
    ],
  },
  {
    slug: "kovil-thirumanam",
    name: "Temple Heritage",
    description:
      "Grand temple wedding invitation featuring carved stone architecture, sacred oil lamps, and cinematic gold foil reveal.",
    category: "Premium",
    religion: "",
    language: "",
    price: 1199,
    thumbnailUrl: "/images/kovil/kovil_temple_entrance.jpg",
    previewMusicUrl:
      "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Sriya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Karthik", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      {
        id: "wedding_venue",
        label: "Temple Mandapam Venue",
        type: "textarea",
        placeholder: "Sri Krishna Mahal, 123, GST Road, Chromepet, Chennai - 600044",
        required: true,
      },
      {
        id: "quote",
        label: "Love Verse / Quote",
        type: "text",
        placeholder: "A beautiful beginning to forever.",
        required: false,
      },
      {
        id: "family_names",
        label: "Welcoming Parents & Families",
        type: "text",
        placeholder: "The Krishnan and Natarajan Families",
        required: false,
      },
      { id: "rsvp_phone", label: "RSVP Contact Desk", type: "text", placeholder: "+91 98765 43210", required: true },
      {
        id: "custom_message",
        label: "Ceremonial Note",
        type: "textarea",
        placeholder: "We seek your gracious presence and heartfelt blessings for our sacred union.",
        required: false,
      },
    ],
  },
  {
    slug: "kalyana-mandapam",
    name: "Royal Palace",
    description:
      "Palace mandapam wedding invitation with carved heritage pillars, traditional scroll timeline, and gold filigree animations.",
    category: "Premium",
    religion: "",
    language: "",
    price: 1199,
    thumbnailUrl: "/images/kalyana-mandapam/mandapam_hall_hero.jpg",
    previewMusicUrl:
      "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Nila", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Aravind", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      {
        id: "wedding_venue",
        label: "Wedding Mandapam Venue",
        type: "textarea",
        placeholder: "Sri Krishna Mahal, 123, GST Road, Chromepet, Chennai - 600044",
        required: true,
      },
      {
        id: "quote",
        label: "Wedding Verse / Quote",
        type: "text",
        placeholder: "A beautiful beginning to forever.",
        required: false,
      },
      {
        id: "family_names",
        label: "Welcoming Parents & Families",
        type: "text",
        placeholder: "The Krishnan and Natarajan Families",
        required: false,
      },
      { id: "rsvp_phone", label: "RSVP Contact Desk", type: "text", placeholder: "+91 98765 43210", required: true },
      {
        id: "custom_message",
        label: "Ceremonial Note",
        type: "textarea",
        placeholder: "We seek your gracious presence and heartfelt blessings for our sacred union.",
        required: false,
      },
    ],
  },
  {
    slug: "konaseema-kalyanam",
    name: "Heritage Courtyard",
    description:
      "River heritage wedding invitation featuring ancestral wooden doorway reveal, brass deepams, and festive courtyard celebration.",
    category: "Premium",
    religion: "",
    language: "",
    price: 1199,
    thumbnailUrl: "/images/konaseema/konaseema_door_hero.jpg",
    previewMusicUrl:
      "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Tejaswi", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Aditya", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      {
        id: "wedding_venue",
        label: "Heritage Mandapam Venue",
        type: "textarea",
        placeholder: "Godavari Heritage House, Riverfront Road, Ravulapalem",
        required: true,
      },
      {
        id: "quote",
        label: "Wedding Verse / Quote",
        type: "text",
        placeholder: "Two souls united in love and blessed with lifelong joy.",
        required: false,
      },
      {
        id: "family_names",
        label: "Inviting Families",
        type: "text",
        placeholder: "The Alluri & Dandu Families",
        required: false,
      },
      { id: "rsvp_phone", label: "RSVP Contact Phone", type: "text", placeholder: "+91 98480 12345", required: true },
      {
        id: "custom_message",
        label: "Invitation Message",
        type: "textarea",
        placeholder: "We seek your gracious presence and heartfelt blessings for our wedding celebration.",
        required: false,
      },
    ],
  },
];

export const getTemplateBySlug = (slug: string): TemplateDefinition | undefined => {
  let t = TEMPLATES.find((tpl) => tpl.slug === slug);
  if (!t) {
    const legacyAliases: Record<string, string> = {
      "palace-garden": "mayura-palace",
      "royal-garden": "mayura-palace",
      "mayura-mandapam": "mayura-palace",
      "peacock-classic": "mayura-classic",
      "crimson-red": "kamalam-kalyanam",
      "temple-heritage": "kovil-thirumanam",
      "royal-palace": "kalyana-mandapam",
      "heritage-courtyard": "konaseema-kalyanam",
      "lotus-swans": "theertha-mandapam",
      "marigold-festive": "marigold-vizha",
      "classical-gold": "kadhal-editorial",
      thiruvizha: "marigold-vizha",
      vizha: "marigold-vizha",
      kamalam: "kamalam-kalyanam",
      padmam: "kamalam-kalyanam",
      "padma-kalyanam": "kamalam-kalyanam",
      "radha-krishna": "kamalam-kalyanam",
      manamagan: "theertha-mandapam",
      "malligai-manam": "theertha-mandapam",
      mangalam: "kovil-thirumanam",
      kadhal: "kadhal-editorial",
      "thanjavur-heritage": "kadhal-editorial",
      "chettinad-rajamaligai": "marigold-vizha",
      "chettinad-vintage": "marigold-vizha",
      "jasmine-romance": "theertha-mandapam",
      "temple-grandeur": "kovil-thirumanam",
      "modern-tamil-minimal": "kadhal-editorial",
      gopuram: "kadhal-editorial",
      koyil: "kovil-thirumanam",
      "royal-tamil": "kovil-thirumanam",
      "temple-gold": "kovil-thirumanam",
      "traditional-red": "kalyana-mandapam",
      "floral-luxury": "theertha-mandapam",
      "modern-minimal": "kadhal-editorial",
      "royal-heritage": "marigold-vizha",
      "elegant-muslim": "kalyana-mandapam",
      "modern-christian": "kalyana-mandapam",
      "luxury-floral": "theertha-mandapam",
    };
    const targetSlug = legacyAliases[slug];
    if (targetSlug) {
      t = TEMPLATES.find((tpl) => tpl.slug === targetSlug);
    }
  }
  if (!t) return undefined;
  return {
    ...t,
    fields: [...t.fields, ...SHARED_LICENSE_FIELDS],
  };
};

export const getDefaultTemplateData = (slug: string): TemplateData => {
  const template = getTemplateBySlug(slug);
  if (!template) {
    return {
      bride_name: "Sriya",
      groom_name: "Karthik",
      wedding_date: new Date(Date.now() + 95 * 24 * 60 * 60 * 1000).toISOString(),
      wedding_venue: "Sri Krishna Mahal, 123, GST Road, Chromepet, Chennai - 600044",
    };
  }

  const defaultData: Record<string, string> = {};
  template.fields.forEach((field) => {
    defaultData[field.id] = field.placeholder || "";
  });

  // Default dates and coordinates
  defaultData["wedding_date"] = new Date(Date.now() + 95 * 24 * 60 * 60 * 1000).toISOString();
  defaultData["reception_date"] = new Date(Date.now() + 95 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString();
  defaultData["gmap_coordinates"] = "Sri Krishna Mahal Chromepet Chennai";
  defaultData["slideshow_images"] =
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=900, https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900, https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&q=80&w=900";

  return defaultData as unknown as TemplateData;
};
