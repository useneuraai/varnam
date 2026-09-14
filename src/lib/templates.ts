import { LazyExoticComponent, ComponentType } from "react";
import dynamic from "next/dynamic";

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
  // Licensed Event Features
  bg_image_url?: string;
  slideshow_images?: string;
  dress_code?: string;
  transport_info?: string;
  scratch_enabled?: string;
  sangeet_enabled?: string;
  sangeet_date?: string;
  sangeet_venue?: string;
  reception_date?: string;
  reception_venue?: string;
  gmap_coordinates?: string;
  music_enabled?: string;
  slideshow_enabled?: string;
  dress_code_enabled?: string;
  transport_enabled?: string;
  custom_sections?: string;
}

export interface TemplateConfigField {
  id: string;
  label: string;
  type: "text" | "textarea" | "datetime" | "toggle";
  placeholder?: string;
  required: boolean;
}

export const SHARED_LICENSE_FIELDS: TemplateConfigField[] = [
  { id: "bg_image_url", label: "Custom Background Image URL", type: "text", placeholder: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200", required: false },
  
  { id: "music_enabled", label: "Enable Background Music", type: "toggle", required: false },
  { id: "music_url", label: "Custom Background Music URL", type: "text", placeholder: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", required: false },
  
  { id: "slideshow_enabled", label: "Enable Photo Slideshow", type: "toggle", required: false },
  { id: "slideshow_images", label: "Photo Slideshow (Comma separated URLs)", type: "textarea", placeholder: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600, https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600", required: false },
  
  { id: "scratch_enabled", label: "Scratch-to-Reveal Date", type: "toggle", required: false },
  
  { id: "sangeet_enabled", label: "Include Sangeet Event?", type: "toggle", required: false },
  { id: "sangeet_date", label: "Sangeet Date & Time", type: "datetime", required: false },
  { id: "sangeet_venue", label: "Sangeet Venue", type: "textarea", placeholder: "Grand Ballroom, ITC Grand Chola", required: false },
  
  { id: "dress_code_enabled", label: "Enable Dress Code Guide", type: "toggle", required: false },
  { id: "dress_code", label: "Dress Code Guide", type: "text", placeholder: "Traditional Ethnic / Elegant Formal", required: false },
  
  { id: "transport_enabled", label: "Enable Transport Instructions", type: "toggle", required: false },
  { id: "transport_info", label: "Transport & Parking Instructions", type: "text", placeholder: "Valet parking available at entrance. Shuttle service from hotel.", required: false },
  
  { id: "reception_date", label: "Reception Date & Time", type: "datetime", required: true },
  { id: "reception_venue", label: "Reception Venue", type: "textarea", placeholder: "Grand Lawns, Leela Palace", required: true },
  { id: "gmap_coordinates", label: "Google Maps Coordinates (Lat,Lng)", type: "text", placeholder: "13.0827,80.2707", required: false },
  { id: "custom_sections", label: "Custom Info Sections", type: "textarea", required: false },
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
    slug: "thanjavur-heritage",
    name: "Thanjavur Heritage 🪷",
    description: "A royal, classical Tamil aesthetic inspired by 16th-century Thanjavur art and traditional South Indian culture. Deep burgundy, muted crimson, antique gold leaf, gem-studded ornamental frames, sacred invocations, and ceremonial typography.",
    category: "Tamil Wedding",
    religion: "Hindu",
    language: "Tamil/English",
    price: 799,
    thumbnailUrl: "/images/couples/thanjavur-heritage.jpg",
    previewMusicUrl: "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Arundhati Devi", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Sundaram Varma", required: true },
      { id: "wedding_date", label: "Muhurtham Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "Brihadeeswara Royal Mandapam, Thanjavur", required: true },
      { id: "quote", label: "Sacred Invocation", type: "text", placeholder: "Under the golden grace of the Almighty, two sacred lineages unite in eternal devotion.", required: false },
      { id: "family_names", label: "Welcoming Royal Houses", type: "text", placeholder: "The Royal Dynasties of Thanjavur & Pudukkottai", required: false },
      { id: "rsvp_phone", label: "RSVP Desk", type: "text", placeholder: "+91 98765 43210", required: true },
      { id: "custom_message", label: "Ceremonial Proclamation", type: "textarea", placeholder: "We request the honor of your gracious presence and divine blessings for the auspicious wedding.", required: false },
    ],
  },
  {
    slug: "chettinad-vintage",
    name: "Chettinad Vintage 🏛️",
    description: "A heritage-luxury aesthetic inspired by Chettinad architecture and interiors. Terracotta, burnt brown, cream, muted mustard, Athangudi tile geometry, carved teak doors, and vintage textured paper.",
    category: "Tamil Wedding",
    religion: "Hindu",
    language: "Tamil/English",
    price: 799,
    thumbnailUrl: "/images/couples/chettinad-vintage.jpg",
    previewMusicUrl: "https://archive.org/download/r-12356661-1632393571-2601/04.%20Kajri%20-%20Dadra%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Meenakshi Achi", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Chidambaram Chettiar", required: true },
      { id: "wedding_date", label: "Muhurtham Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "Saratha Vilas Heritage Mansion, Kadiapatti, Chettinad", required: true },
      { id: "quote", label: "Heritage Blessing", type: "text", placeholder: "In the timeless courtyards of our ancestors, our heritage becomes our future.", required: false },
      { id: "family_names", label: "Welcoming Families", type: "text", placeholder: "The Chettiar and Alagappa Dynasties", required: false },
      { id: "rsvp_phone", label: "RSVP Contact", type: "text", placeholder: "+91 98765 43211", required: true },
      { id: "custom_message", label: "Invitation Message", type: "textarea", placeholder: "Step into our family palace and celebrate this cherished heritage union.", required: false },
    ],
  },
  {
    slug: "jasmine-romance",
    name: "Jasmine Romance 🌸",
    description: "A soft, poetic South Indian wedding aesthetic centered around the feeling of fresh jasmine flowers and a beautiful evening wedding. Ivory, pearl white, soft blush, champagne, delicate cascading jasmine garlands, and romantic calligraphy.",
    category: "Tamil Wedding",
    religion: "Hindu",
    language: "Tamil/English",
    price: 799,
    thumbnailUrl: "/images/couples/jasmine-romance.jpg",
    previewMusicUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Ananya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Aditya", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "The Leela Palace Seaside Lawns, Adyar, Chennai", required: true },
      { id: "quote", label: "Love Poem", type: "text", placeholder: "Like the sweet morning fragrance of fresh Madurai jasmine, our love unfolds forever.", required: false },
      { id: "family_names", label: "Parents & Families", type: "text", placeholder: "The Krishnan and Raghavan Families", required: false },
      { id: "rsvp_phone", label: "RSVP Desk", type: "text", placeholder: "+91 90000 54321", required: true },
      { id: "custom_message", label: "Personal Note", type: "textarea", placeholder: "Join us beneath the blooming jasmine arches as we exchange our forever vows.", required: false },
    ],
  },
  {
    slug: "temple-grandeur",
    name: "Temple Grandeur 🛕",
    description: "A dramatic, luxurious temple-wedding aesthetic. Deep vermilion, dark maroon, aged bronze, genuine gold leaf, and rich emerald. Monolithic carved stone pillar arches, gopuram silhouettes, and majestic sacred symmetry.",
    category: "Tamil Wedding",
    religion: "Hindu",
    language: "Tamil/English",
    price: 799,
    thumbnailUrl: "/images/couples/temple-grandeur.jpg",
    previewMusicUrl: "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Samyuktha", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Vijay Karthik", required: true },
      { id: "wedding_date", label: "Muhurtham Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "Meenakshi Sundareswarar Temple Mandapam, Madurai", required: true },
      { id: "quote", label: "Sacred Chants", type: "text", placeholder: "Surrounded by sacred temple bells and timeless granite stone, we take our seven sacred steps.", required: false },
      { id: "family_names", label: "Invited by", type: "text", placeholder: "The Natarajan and Viswanathan Families", required: false },
      { id: "rsvp_phone", label: "RSVP Registry", type: "text", placeholder: "+91 99000 88888", required: true },
      { id: "custom_message", label: "Sacred Invitation", type: "textarea", placeholder: "With heartfelt devotion and joyous celebration, we seek your presence and blessings.", required: false },
    ],
  },
  {
    slug: "modern-tamil-minimal",
    name: "Modern Tamil Minimal ✨",
    description: "A high-end contemporary wedding editorial subtly incorporating Tamil culture. Clean ivory canvas, strong black typography, lots of negative space, delicate hairline Kolam geometry, and smooth cinematic reveals.",
    category: "Tamil Wedding",
    religion: "Secular",
    language: "English/Tamil",
    price: 799,
    thumbnailUrl: "/images/couples/modern-tamil-minimal.jpg",
    previewMusicUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Debussy_-_Clair_de_Lune.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Maya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Dev", required: true },
      { id: "wedding_date", label: "Celebration Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "The Glass House Pavilion, Bangalore", required: true },
      { id: "quote", label: "Editorial Verse", type: "text", placeholder: "Rooted in tradition, walking forward together into the modern world.", required: false },
      { id: "family_names", label: "Hosts", type: "text", placeholder: "The Sen and Ramanathan Families", required: false },
      { id: "rsvp_phone", label: "RSVP Direct", type: "text", placeholder: "+91 99887 76655", required: true },
      { id: "custom_message", label: "Celebration Note", type: "textarea", placeholder: "An intimate evening of love, culture, music, and quiet modern luxury.", required: false },
    ],
  },
  {
    slug: "temple-gold",
    name: "Temple Gold ✨",
    description: "A traditional Tamil wedding template with divine temple aesthetics. Featuring floating brass lamps, temple entrance drawing animations, stone plaque engraving, and Lord Ganesha's blessings.",
    category: "Tamil Wedding",
    religion: "Hindu",
    language: "Tamil/English",
    price: 799,
    thumbnailUrl: "/images/couples/temple-grandeur.jpg",
    previewMusicUrl: "https://archive.org/download/r-12356661-1632393571-2601/04.%20Kajri%20-%20Dadra%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Aishwarya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Karthik", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "Leela Palace, Chennai", required: true },
      { id: "quote", label: "Sacred Wedding Quote", type: "text", placeholder: "With the blessings of Lord Ganesha, together we begin a lifetime of love.", required: false },
      { id: "family_names", label: "Welcoming Family Names", type: "text", placeholder: "Mr. & Mrs. Sundaram and Family", required: false },
      { id: "rsvp_phone", label: "RSVP Contact Number", type: "text", placeholder: "+91 98765 43210", required: true },
      { id: "custom_message", label: "Blessings Message", type: "textarea", placeholder: "Please join us to bless the couple.", required: false },
    ],
  },
  {
    slug: "traditional-red",
    name: "Traditional Red ❤️",
    description: "Classic South Indian wedding invitation. Deep red silk texture backgrounds, self-drawing Kolams, falling jasmine flowers, gold border animations, and traditional nadaswaram notes.",
    category: "Tamil Wedding",
    religion: "Hindu",
    language: "Tamil/English",
    price: 799,
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    previewMusicUrl: "https://archive.org/download/r-12356661-1632393571-2601/04.%20Kajri%20-%20Dadra%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Devi", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Suresh", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "Mayor Ramanathan Hall, Chennai", required: true },
      { id: "quote", label: "Wedding Quote", type: "text", placeholder: "Joined in love, walking together in harmony.", required: false },
      { id: "family_names", label: "Inviting Families", type: "text", placeholder: "The Ramanathan and Krishnan Families", required: false },
      { id: "rsvp_phone", label: "RSVP Contact", type: "text", placeholder: "+91 98765 43211", required: true },
      { id: "custom_message", label: "Greeting Wording", type: "textarea", placeholder: "Your presence is our greatest blessing.", required: false },
    ],
  },
  {
    slug: "floral-luxury",
    name: "Floral Luxury 🌸",
    description: "An elegant luxury destination wedding template. Champagne gold and blush pink tones, blooming floral arrangements, piano soundscapes, and floating rose petals.",
    category: "Luxury Wedding",
    religion: "Secular",
    language: "English",
    price: 799,
    thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
    previewMusicUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Zara", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Kabir", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "Grand Hyatt Resort, Goa", required: true },
      { id: "quote", label: "Love Quote", type: "text", placeholder: "Love is a friendship set to music.", required: false },
      { id: "family_names", label: "Parents", type: "text", placeholder: "Kapoor and Mehta Families", required: false },
      { id: "rsvp_phone", label: "RSVP Desk", type: "text", placeholder: "+91 90000 54321", required: true },
      { id: "custom_message", label: "Invite Wording", type: "textarea", placeholder: "Please join us in paradise as we say our vows.", required: false },
    ],
  },
  {
    slug: "modern-minimal",
    name: "Modern Minimal ⚪",
    description: "A contemporary clean-cut wedding website. Matte white, charcoal black, and beige colors with editorial motion typography and cinematic page transitions.",
    category: "Modern Wedding",
    religion: "Secular",
    language: "English",
    price: 799,
    thumbnailUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=600",
    previewMusicUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Debussy_-_Clair_de_Lune.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Riya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Varun", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "The Glass House, Bangalore", required: true },
      { id: "quote", label: "Simple Verse", type: "text", placeholder: "Today, tomorrow, always.", required: false },
      { id: "family_names", label: "Hosts", type: "text", placeholder: "Sharma and Verma Families", required: false },
      { id: "rsvp_phone", label: "RSVP Direct", type: "text", placeholder: "+91 99887 76655", required: true },
      { id: "custom_message", label: "Message", type: "textarea", placeholder: "Share our special day with us.", required: false },
    ],
  },
  {
    slug: "royal-heritage",
    name: "Royal Heritage 👑",
    description: "Palace-inspired luxury Tamil wedding theme. Featuring opening palace doors, royal crests, unfolding royal scroll itineraries, sparkling chandeliers, and a fireworks grand finale.",
    category: "Royal Wedding",
    religion: "Secular",
    language: "English",
    price: 799,
    thumbnailUrl: "https://images.unsplash.com/photo-1618005198143-e528346d9a59?auto=format&fit=crop&q=80&w=600",
    previewMusicUrl: "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Arundhati", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Vikram", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "Amba Vilas Palace, Mysore", required: true },
      { id: "quote", label: "Royal Blessing", type: "text", placeholder: "By royal invitation, we welcome you to witness our sacred union.", required: false },
      { id: "family_names", label: "Royal Houses of", type: "text", placeholder: "The Varma and Dev Dynasties", required: false },
      { id: "rsvp_phone", label: "RSVP Registry", type: "text", placeholder: "+91 99000 88888", required: true },
      { id: "custom_message", label: "Proclamation", type: "textarea", placeholder: "Honour us with your presence on this auspicious royal celebration.", required: false },
    ],
  },
  {
    slug: "royal-tamil",
    name: "Royal Tamil Heritage",
    description: "A majestic template reflecting traditional Tamil heritage, mandapam visuals, jasmine flowers, and classical flute notes.",
    category: "Tamil Wedding",
    religion: "Hindu",
    language: "Tamil/English",
    price: 799,
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    previewMusicUrl: "https://archive.org/download/r-12356661-1632393571-2601/01.%20Raag%20Bhimpalasi%20-%20Teen%20Taal.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Aishwarya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Karthik", required: true },
      { id: "wedding_date", label: "Wedding Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Wedding Venue", type: "textarea", placeholder: "Leela Palace, Chennai", required: true },
      { id: "quote", label: "Sacred Wedding Quote", type: "text", placeholder: "Together we begin a lifetime of love and harmony.", required: false },
      { id: "family_names", label: "Welcoming Family Names", type: "text", placeholder: "Mr. & Mrs. Sundaram and Family", required: false },
      { id: "rsvp_phone", label: "RSVP Contact Number", type: "text", placeholder: "+91 98765 43210", required: true },
      { id: "custom_message", label: "Blessings Message", type: "textarea", placeholder: "Please join us to bless the couple.", required: false },
    ],
  },
  {
    slug: "elegant-muslim",
    name: "Elegant Islamic Nikaah",
    description: "A stunning Nikaah template using royal emerald green and glistening gold. Features Islamic calligraphy, geometric mandalas, glowing crescent animations, and Sufi backdrop.",
    category: "Muslim Wedding",
    religion: "Muslim",
    language: "English/Urdu",
    price: 799,
    thumbnailUrl: "https://images.unsplash.com/photo-1618005198143-e528346d9a59?auto=format&fit=crop&q=80&w=600",
    previewMusicUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Debussy_-_Clair_de_Lune.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Zara", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Faisal", required: true },
      { id: "wedding_date", label: "Nikaah Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Nikaah & Reception Venue", type: "textarea", placeholder: "Taj Coromandel, Chennai", required: true },
      { id: "quote", label: "Quranic Quote", type: "text", placeholder: "And We created you in pairs. (Quran 78:8)", required: false },
      { id: "family_names", label: "Invited By", type: "text", placeholder: "Khan & Syed Families", required: false },
      { id: "rsvp_phone", label: "RSVP Contact", type: "text", placeholder: "+91 91234 56789", required: true },
      { id: "custom_message", label: "Nikaah Ceremony Invitation", type: "textarea", placeholder: "Requesting the honor of your presence and prayers.", required: false },
    ],
  },
  {
    slug: "modern-christian",
    name: "Celestial Rose Christian",
    description: "An ultra-modern, minimalist Christian wedding template. Soft rose gold themes, pristine layouts, falling white rose petals, sliding cross transitions, and elegant string instrumentals.",
    category: "Christian Wedding",
    religion: "Christian",
    language: "English",
    price: 799,
    thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600",
    previewMusicUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Michelle", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "David", required: true },
      { id: "wedding_date", label: "Solemnization Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Church & Reception Venue", type: "textarea", placeholder: "St. Andrews Cathedral, Chennai", required: true },
      { id: "quote", label: "Holy Bible Verse", type: "text", placeholder: "So they are no longer two, but one flesh. (Matthew 19:6)", required: false },
      { id: "family_names", label: "Parents of the Bride & Groom", type: "text", placeholder: "D'Souza and Mathews Families", required: false },
      { id: "rsvp_phone", label: "RSVP Contact", type: "text", placeholder: "+91 99887 76655", required: true },
      { id: "custom_message", label: "Ceremony Invite", type: "textarea", placeholder: "Celebrate the union of our lives in Christ.", required: false },
    ],
  },
  {
    slug: "luxury-floral",
    name: "Royal Golden Foliage",
    description: "Universal premium luxury wedding template with rich gold leaf details, soft velvet transitions, falling glitter dust, and majestic orchestral music.",
    category: "Luxury Wedding",
    religion: "Secular",
    language: "English",
    price: 799,
    thumbnailUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600",
    previewMusicUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3",
    fields: [
      { id: "bride_name", label: "Bride Name", type: "text", placeholder: "Priya", required: true },
      { id: "groom_name", label: "Groom Name", type: "text", placeholder: "Rahul", required: true },
      { id: "wedding_date", label: "Celebration Date & Time", type: "datetime", required: true },
      { id: "wedding_venue", label: "Grand Ballroom, ITC Grand Chola", type: "textarea", placeholder: "ITC Grand Chola, Chennai", required: true },
      { id: "quote", label: "Love Quote", type: "text", placeholder: "Once in a while, right in the middle of an ordinary life, love gives us a fairy tale.", "required": false },
      { id: "family_names", label: "Host Families", type: "text", placeholder: "Sharma and Kapoor Families", required: false },
      { id: "rsvp_phone", label: "RSVP Desk", "type": "text", "placeholder": "+91 90000 12345", "required": true },
      { id: "custom_message", label: "Invitation Wording", "type": "textarea", "placeholder": "We invite you to share our joy as we exchange our wedding vows.", "required": false },
    ],
  },
];

export const getTemplateBySlug = (slug: string): TemplateDefinition | undefined => {
  let t = TEMPLATES.find((tpl) => tpl.slug === slug);
  if (!t) {
    const legacyAliases: Record<string, string> = {
      "royal-tamil": "thanjavur-heritage",
      "temple-gold": "temple-grandeur",
      "traditional-red": "thanjavur-heritage",
      "modern-minimal": "modern-tamil-minimal",
      "floral-luxury": "jasmine-romance",
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
      bride_name: "Priya",
      groom_name: "Rahul",
      wedding_date: new Date().toISOString(),
      wedding_venue: "Grand Palace Hotel, Chennai",
    };
  }

  const defaultData: Record<string, string> = {};
  template.fields.forEach((field) => {
    defaultData[field.id] = field.placeholder || "";
  });

  // Override datetime placeholders with valid date strings
  defaultData["wedding_date"] = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  defaultData["sangeet_date"] = new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString();
  defaultData["reception_date"] = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();
  defaultData["gmap_coordinates"] = "13.0827,80.2707";
  defaultData["sangeet_enabled"] = "yes";
  defaultData["scratch_enabled"] = "no";
  defaultData["music_enabled"] = "yes";
  defaultData["slideshow_enabled"] = "yes";
  defaultData["dress_code_enabled"] = "yes";
  defaultData["transport_enabled"] = "yes";
  defaultData["custom_sections"] = "";

  return defaultData as unknown as TemplateData;
};

export interface CustomSection {
  title: string;
  content: string;
}

export function parseCustomSections(jsonStr?: string): CustomSection[] {
  if (!jsonStr) return [];
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Error parsing custom sections:", e);
    return [];
  }
}
