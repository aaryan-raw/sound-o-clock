// All editable content lives here. Items marked CONFIRM need owner sign-off before launch.
export const site = {
  name: "Sound O'Clock",
  phone: "+91 97469 23339",
  tel: "+919746923339",
  whatsapp: "919746923339", // CONFIRM: same number as phone?
  address: ["TC 16/951-2, Mythri Nagar", "Jagathy, Thiruvananthapuram", "Kerala 695014"],
  plusCode: "FXW9+G5",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=FXW9%2BG5%20Thiruvananthapuram%20Kerala",
  rating: { score: "4.9", count: 45 }, // CONFIRM: re-check on Google before launch
  engineer: "Shaji Joosa Jacob",
};

// Every service is PROVISIONAL until the owner confirms it (set confirmed:true).
// "basis: review" = a customer review mentions it; "none" = suggested, no evidence yet.
export const services = [
  { slug: "vocal-recording", name: "Vocal recording", confirmed: false, basis: "review",
    text: "Record vocals with a sound engineer on hand to run the session.",
    suits: "Singers, songwriters and artists recording a song.",
    ask: ["Recording vocals for a song you have written", "What to bring to a first session", "How a session would be run"] },
  { slug: "song-recording", name: "Song recording", confirmed: false, basis: "none",
    text: "Bringing a song together from recording through to a finished track.",
    suits: "Artists and bands with a song ready to record.",
    ask: ["Whether your song and line-up can be recorded here", "What you would need to prepare", "Combining recording with mixing and mastering"] },
  { slug: "dubbing", name: "Dubbing", confirmed: false, basis: "review",
    text: "Voice dubbing for video, film and other media projects.",
    suits: "Video, film and media projects that need dubbed voices.",
    ask: ["The type of project and language", "How you will share the video or script", "The file format you need back"] },
  { slug: "voice-over", name: "Voice-over", confirmed: false, basis: "none",
    text: "Voice recording for narration, adverts and online content.",
    suits: "Creators, businesses and voice artists.",
    ask: ["Whether your script suits a studio recording", "Recording your own voice or hiring a voice artist", "The format you need the audio in"] },
  { slug: "mixing", name: "Mixing", confirmed: false, basis: "review",
    text: "Balance, shape and polish your tracks so every part is heard.",
    suits: "Anyone with finished recordings, from this studio or elsewhere.",
    ask: ["Mixing recordings made elsewhere", "How to send your files", "Reference tracks you like"] },
  { slug: "mastering", name: "Mastering", confirmed: false, basis: "review",
    text: "The final polish on a finished mix, ready for release.",
    suits: "Artists with a finished mix ready for release.",
    ask: ["Mastering a single song or a full release", "What you need to send", "Where the music will be released"] },
];

// Paraphrased themes from customer reviews. Not quotes.
export const reviewThemes = [
  "A comfortable place to work",
  "An experienced sound engineer",
  "Professional equipment",
  "Work delivered on time",
];

// Add real, permitted quotes here: { quote, author, url? }. url = link to the original review. Section shows only when filled.
export const testimonials = [];

// Add approved projects here. Section stays hidden while this list is empty.
// { title, artist (only with permission), kind, description?, src (audio in /public/audio/...),
//   artwork? (file in src/assets/work/), artworkAlt (required with artwork),
//   video? (embed URL for an approved video) }

export const work = [];

// Gallery images live in src/assets/studio/. An image is shown ONLY if it has alt text here.
// Optional focal point keeps the important part visible when cropped, e.g. "50% 30%".
/** @type {Record<string, { alt: string, focus?: string }>} */
export const gallery = {
  // "control-room.jpg": { alt: "Describe what the photo shows", focus: "50% 50%" },
};

export const waLink = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
export const waGeneral = waLink("Hi Sound O'Clock, I'd like to ask about recording a project.");
export const SERVICE_NAMES_NOTE = "Provisional services are shown to the owner for review and removed or confirmed before launch.";

// ---- Launch gate ----
// PUBLIC_OWNER_REVIEW=1 (set automatically on Netlify deploy previews) shows owner-review markers:
// provisional tags, photo placeholders and draft notes. Production builds never show them.
export const REVIEW = import.meta.env.PUBLIC_OWNER_REVIEW === "1";
export const hasGallery = Object.keys(gallery).length > 0;
// Public builds list a service only if the owner confirmed it OR customer reviews mention it.
// To publish ONLY owner-confirmed services, change this filter to `s.confirmed`.
export const publicServices = REVIEW ? services : services.filter((s) => s.confirmed || s.basis === "review");
