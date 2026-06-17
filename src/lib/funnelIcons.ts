import type { IconType } from 'react-icons';
import {
  GiSprint,
  GiAmericanFootballHelmet,
  GiAmericanFootballBall,
  GiWhistle,
} from 'react-icons/gi';
import {
  FaHandsHelping,
  FaFlagCheckered,
  FaClipboardList,
  FaCamera,
} from 'react-icons/fa';
import type { IconName } from '@/data/funnel';

// Icônes thématiques (react-icons) plutôt que des pictos génériques.
export const FUNNEL_ICONS: Record<IconName, IconType> = {
  Zap: GiSprint, // Pratiquer
  HeartHandshake: FaHandsHelping, // Aider
  ShieldHalf: GiAmericanFootballHelmet, // Football américain
  Flag: GiAmericanFootballBall, // Flag football
  Megaphone: GiWhistle, // Coacher
  Scale: FaFlagCheckered, // Arbitrer
  Briefcase: FaClipboardList, // Gérer
  Sparkles: FaCamera, // Créer
};
