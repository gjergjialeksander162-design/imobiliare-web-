import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");

const img = (n) => `/images/prona-${n}.svg`;

const seed = [
  {
    title: "Apartament 2+1 me pamje nga deti, Vlorë",
    description:
      "Apartament i mobiluar plotësisht në Lungomare, kati 6 me ballkon 12 m² dhe pamje të drejtpërdrejtë nga deti. Ndërtesë e vitit 2019 me ashensor, parkim nëntokësor dhe siguri 24/7.",
    price: 145000,
    deal: "shitje",
    kind: "apartament",
    city: "Vlorë",
    address: "Rruga Murat Terbaçi, Lungomare",
    rooms: 3,
    baths: 2,
    area: 92,
    floor: 6,
    year: 2019,
    features: ["Pamje deti", "Ashensor", "Parkim", "Mobiluar", "Ballkon"],
    images: [img(1), img(5), img(2)],
    lat: 40.4483,
    lng: 19.4869,
    featured: true,
  },
  {
    title: "Apartament 1+1 në Bllok, Tiranë",
    description:
      "Apartament i rinovuar në zemrën e Bllokut, ideal për çift ose investim me qira afatshkurtër. Ngrohje-ftohje me kondicionerë, kuzhinë e pajisur, kati 3 me ashensor.",
    price: 620,
    deal: "qira",
    kind: "apartament",
    city: "Tiranë",
    address: "Rruga Pjetër Bogdani",
    rooms: 2,
    baths: 1,
    area: 58,
    floor: 3,
    year: 2015,
    features: ["Rinovuar", "Ashensor", "Mobiluar", "Internet fiber"],
    images: [img(2), img(6)],
    lat: 41.3183,
    lng: 19.8187,
    featured: true,
  },
  {
    title: "Vilë 3-katëshe me oborr, Prishtinë",
    description:
      "Vilë individuale në lagjen Arbëri, 320 m² sipërfaqe banimi dhe 450 m² oborr me kopsht. Garazh i dyfishtë, bodrum, sistem ngrohjeje me dysheme dhe panele solare.",
    price: 395000,
    deal: "shitje",
    kind: "vile",
    city: "Prishtinë",
    address: "Lagjja Arbëri, rr. Muharrem Fejza",
    rooms: 6,
    baths: 4,
    area: 320,
    floor: null,
    year: 2021,
    features: ["Oborr", "Garazh", "Panele solare", "Ngrohje nën dysheme"],
    images: [img(3), img(7), img(1)],
    lat: 42.6489,
    lng: 21.1387,
    featured: true,
  },
  {
    title: "Zyrë 120 m² në kullë biznesi, Tiranë",
    description:
      "Ambient zyre open-space në katin e 9-të të një kulle biznesi pranë Sheshit Skënderbej. Recepsion i përbashkët, 2 salla mbledhjeje, parkim për 3 automjete.",
    price: 1450,
    deal: "qira",
    kind: "zyre",
    city: "Tiranë",
    address: "Bulevardi Zogu I",
    rooms: 4,
    baths: 2,
    area: 120,
    floor: 9,
    year: 2018,
    features: ["Open space", "Parkim", "Recepsion", "Ashensor"],
    images: [img(4), img(8)],
    lat: 41.3317,
    lng: 19.8203,
    featured: false,
  },
  {
    title: "Shtëpi 4+1 me kopsht, Shkodër",
    description:
      "Shtëpi private dy kate në zonën e Dobraçit, me kopsht 300 m², pemë frutore dhe puse artezian. E përshtatshme për familje të madhe ose bujtinë.",
    price: 128000,
    deal: "shitje",
    kind: "shtepi",
    city: "Shkodër",
    address: "Rruga e Dobraçit",
    rooms: 5,
    baths: 2,
    area: 180,
    floor: null,
    year: 2008,
    features: ["Kopsht", "Puse artezian", "Verandë", "Bodrum"],
    images: [img(5), img(3)],
    lat: 42.0693,
    lng: 19.5033,
    featured: false,
  },
  {
    title: "Lokal 85 m² në rrugë kryesore, Durrës",
    description:
      "Lokal me vitrinë të gjerë 12 metra në rrugën Taulantia, pranë promenadës. Ideal për kafe-bar ose dyqan retail. Bashkë me tualet dhe magazinë 15 m².",
    price: 900,
    deal: "qira",
    kind: "lokal",
    city: "Durrës",
    address: "Rruga Taulantia",
    rooms: 2,
    baths: 1,
    area: 85,
    floor: 0,
    year: 2012,
    features: ["Vitrinë e gjerë", "Magazinë", "Rrugë kryesore"],
    images: [img(6), img(4)],
    lat: 41.3126,
    lng: 19.4478,
    featured: false,
  },
  {
    title: "Truall 1200 m² për ndërtim, Tiranë (Farkë)",
    description:
      "Truall i rrafshtë me dokumentacion të plotë hipotekor, leje ndërtimi për 2 vila. Infrastrukturë e plotë: rrugë asfalt, ujë, energji, kanalizim.",
    price: 210000,
    deal: "shitje",
    kind: "truall",
    city: "Tiranë",
    address: "Farkë e Madhe",
    rooms: 0,
    baths: 0,
    area: 1200,
    floor: null,
    year: null,
    features: ["Dokumentacion i plotë", "Leje ndërtimi", "Infrastrukturë"],
    images: [img(7)],
    lat: 41.2967,
    lng: 19.8631,
    featured: false,
  },
  {
    title: "Apartament 3+1 duplex, Prishtinë",
    description:
      "Duplex në dy nivele te Bregu i Diellit, 145 m² neto me tarracë 30 m². Ndërtesë e re, dorëzim me çelës në dorë, mundësi financimi bankar.",
    price: 168000,
    deal: "shitje",
    kind: "apartament",
    city: "Prishtinë",
    address: "Bregu i Diellit, rr. Mark Isaku",
    rooms: 4,
    baths: 2,
    area: 145,
    floor: 7,
    year: 2024,
    features: ["Duplex", "Tarracë", "Ndërtesë e re", "Ashensor"],
    images: [img(8), img(2), img(6)],
    lat: 42.6486,
    lng: 21.1782,
    featured: true,
  },
];

function slugify(value) {
  return value
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

const now = Date.now();
const properties = seed.map((property, index) => ({
  id: randomUUID(),
  slug: slugify(property.title),
  ...property,
  createdAt: new Date(now - index * 36e5 * 12).toISOString(),
}));

await mkdir(dataDir, { recursive: true });
await writeFile(
  path.join(dataDir, "properties.json"),
  `${JSON.stringify(properties, null, 2)}\n`,
  "utf8",
);
await writeFile(path.join(dataDir, "inquiries.json"), "[]\n", "utf8");
console.log(`Seeded ${properties.length} properties in ${dataDir}`);
