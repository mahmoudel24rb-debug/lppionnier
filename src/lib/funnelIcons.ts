import type { IconType } from 'react-icons';
import {
  GiAmericanFootballHelmet,
  GiAmericanFootballBall,
  GiWhistle,
  GiOldLantern,
} from 'react-icons/gi';
import {
  FaHandsHelping,
  FaHeart,
  FaHandHoldingHeart,
  FaFlag,
  FaFlagCheckered,
  FaUsers,
  FaChild,
  FaUserAlt,
  FaRegClock,
  FaGraduationCap,
  FaBriefcase,
  FaCalendarAlt,
  FaTools,
  FaBullhorn,
  FaClipboardList,
  FaMoneyBillWave,
  FaHeartbeat,
  FaBuilding,
  FaBoxOpen,
  FaUserFriends,
  FaStar,
} from 'react-icons/fa';

const MAP: Record<string, IconType> = {
  // Étape 1
  jouer: GiAmericanFootballBall,
  investir: FaHandsHelping,
  soutenir: FaHeart,
  // Pratique
  'foot-us': GiAmericanFootballHelmet,
  flag: GiAmericanFootballBall,
  // Sous-branches joueur
  decouvrir: GiOldLantern,
  rejoindre: FaUsers,
  jeunes: FaChild,
  seniors: FaUserAlt,
  // Investissement
  temps: FaRegClock,
  experience: FaGraduationCap,
  competences: FaBriefcase,
  organiser: FaCalendarAlt,
  materiel: FaTools,
  coaching: GiWhistle,
  arbitrage: FaFlagCheckered,
  com: FaBullhorn,
  gestion: FaClipboardList,
  finance: FaMoneyBillWave,
  sante: FaHeartbeat,
  // Soutien
  don: FaHandHoldingHeart,
  partenaire: FaBuilding,
  ressources: FaBoxOpen,
  ambassadeur: FaUserFriends,
};

export const getIcon = (key: string): IconType => MAP[key] ?? FaStar;
