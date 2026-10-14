import React from "react";
import {
  Baby,
  BedDouble,
  Beer,
  Bike,
  Briefcase,
  Bus,
  Cake,
  Car,
  CircleHelp,
  Coffee,
  Dog,
  Dumbbell,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  House,
  Laptop,
  type LucideIcon,
  MapPin,
  Mountain,
  Music,
  PartyPopper,
  Plane,
  Ship,
  Snowflake,
  Star,
  Stethoscope,
  Sun,
  Tent,
  Ticket,
  TrainFront,
  TreePine,
  Umbrella,
  Utensils,
  Wine,
} from "lucide-react";

import { loadAllIcons } from "../../_utils/all-icons";
import { isCuratedIcon, LUCIDE_PREFIX, type TStampIconName } from "../../_utils/stamps";

/** drawing + words people might type when looking for it (English and Polish) */
/**
 * The hand-picked set: bundled with the page (instant), searchable in English and Polish.
 * `lucide` is the icon's own name, so search results from the full set don't show it twice.
 */
export const STAMP_ICONS: Record<
  TStampIconName,
  { Icon: LucideIcon; keywords: string; lucide: string }
> = {
  help: { Icon: CircleHelp, keywords: "unknown maybe question nie wiem", lucide: "circle-help" },
  plane: {
    Icon: Plane,
    keywords: "flight trip travel airport lot samolot podróż",
    lucide: "plane",
  },
  train: { Icon: TrainFront, keywords: "rail travel pociąg kolej", lucide: "train-front" },
  car: { Icon: Car, keywords: "drive road trip auto samochód", lucide: "car" },
  bus: { Icon: Bus, keywords: "coach autobus", lucide: "bus" },
  bike: { Icon: Bike, keywords: "cycling bicycle rower", lucide: "bike" },
  ship: { Icon: Ship, keywords: "boat ferry cruise statek prom", lucide: "ship" },
  home: { Icon: House, keywords: "house dom w domu", lucide: "house" },
  bed: { Icon: BedDouble, keywords: "sleep hotel stay nocleg spanie", lucide: "bed-double" },
  work: { Icon: Briefcase, keywords: "office job praca biuro", lucide: "briefcase" },
  laptop: { Icon: Laptop, keywords: "remote computer zdalnie komputer", lucide: "laptop" },
  school: {
    Icon: GraduationCap,
    keywords: "university study szkoła studia uczelnia",
    lucide: "graduation-cap",
  },
  mountain: { Icon: Mountain, keywords: "hiking góry wędrówka", lucide: "mountain" },
  trees: { Icon: TreePine, keywords: "forest nature las natura", lucide: "tree-pine" },
  tent: { Icon: Tent, keywords: "camping festival namiot kemping", lucide: "tent" },
  beach: {
    Icon: Umbrella,
    keywords: "sea vacation holiday plaża morze wakacje",
    lucide: "umbrella",
  },
  sun: { Icon: Sun, keywords: "summer weather lato słońce", lucide: "sun" },
  snow: { Icon: Snowflake, keywords: "ski winter narty zima śnieg", lucide: "snowflake" },
  party: {
    Icon: PartyPopper,
    keywords: "celebration birthday impreza urodziny",
    lucide: "party-popper",
  },
  beer: { Icon: Beer, keywords: "pub drinks piwo", lucide: "beer" },
  wine: { Icon: Wine, keywords: "drinks wino", lucide: "wine" },
  coffee: { Icon: Coffee, keywords: "cafe kawa kawiarnia", lucide: "coffee" },
  food: {
    Icon: Utensils,
    keywords: "dinner restaurant eat jedzenie obiad kolacja restauracja",
    lucide: "utensils",
  },
  cake: { Icon: Cake, keywords: "birthday tort urodziny", lucide: "cake" },
  gift: { Icon: Gift, keywords: "present christmas prezent święta", lucide: "gift" },
  music: { Icon: Music, keywords: "concert gig koncert muzyka", lucide: "music" },
  ticket: { Icon: Ticket, keywords: "event cinema theatre bilet kino teatr", lucide: "ticket" },
  game: { Icon: Gamepad2, keywords: "games board gry planszówki", lucide: "gamepad-2" },
  sport: { Icon: Dumbbell, keywords: "gym training siłownia trening", lucide: "dumbbell" },
  heart: { Icon: Heart, keywords: "date love randka", lucide: "heart" },
  baby: { Icon: Baby, keywords: "kids family dzieci rodzina", lucide: "baby" },
  dog: { Icon: Dog, keywords: "pet walk pies zwierzę", lucide: "dog" },
  doctor: {
    Icon: Stethoscope,
    keywords: "sick health lekarz choroba zdrowie",
    lucide: "stethoscope",
  },
  star: { Icon: Star, keywords: "important special ważne", lucide: "star" },
  pin: { Icon: MapPin, keywords: "place location miejsce", lucide: "map-pin" },
};

export const CURATED_LUCIDE_NAMES = new Set(Object.values(STAMP_ICONS).map((i) => i.lucide));

const LucideByName = ({ name, className }: { name: string; className?: string }) => {
  const [Icon, setIcon] = React.useState<LucideIcon | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    loadAllIcons()
      .then((all) => !cancelled && setIcon(() => all.get(name) ?? null))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [name]);

  return Icon ? (
    <Icon className={className} aria-hidden="true" strokeWidth={2.5} />
  ) : (
    <span className={className} />
  );
};

export const StampIcon = ({ name, className }: { name?: string; className?: string }) => {
  if (!name) return null;

  if (isCuratedIcon(name)) {
    const { Icon } = STAMP_ICONS[name];
    return <Icon className={className} aria-hidden="true" strokeWidth={2.5} />;
  }

  if (name.startsWith(LUCIDE_PREFIX)) {
    return <LucideByName name={name.slice(LUCIDE_PREFIX.length)} className={className} />;
  }

  return null;
};
