import type { IconType } from 'react-icons';
import {
  GiAmericanFootballHelmet,
  GiAmericanFootballBall,
  GiWhistle,
  GiTrophy,
  GiGymBag,
  GiPodiumWinner,
  GiMining, // pioche — symbole Pionniers
  GiOldLantern, // lanterne de mineur — symbole Pionniers
} from 'react-icons/gi';
import {
  FaHandsHelping,
  FaHeart,
  FaFlag,
  FaRegEye,
  FaUsers,
  FaChartLine,
  FaRegClock,
  FaGraduationCap,
  FaBriefcase,
  FaRocket,
  FaCalendarAlt,
  FaTools,
  FaConciergeBell,
  FaFirstAid,
  FaFlagCheckered,
  FaBullhorn,
  FaLaptopCode,
  FaChartBar,
  FaMoneyBillWave,
  FaBalanceScale,
  FaCamera,
  FaBook,
  FaHandshake,
  FaGlobe,
  FaSchool,
  FaBullseye,
  FaLightbulb,
  FaGift,
  FaBuilding,
  FaBoxOpen,
  FaUserFriends,
} from 'react-icons/fa';
import type { IconName } from '@/data/funnel';

export const FUNNEL_ICONS: Record<IconName, IconType> = {
  // Étape 1
  Jouer: GiAmericanFootballBall,
  Investir: FaHandsHelping,
  Soutenir: FaHeart,
  // Pratique
  FootUS: GiAmericanFootballHelmet,
  Flag: FaFlag,
  // Objectifs
  Decouvrir: GiOldLantern,
  Loisir: GiGymBag,
  Competition: GiTrophy,
  Jeune: FaUsers,
  Senior: GiPodiumWinner,
  // Apport
  Temps: FaRegClock,
  Experience: FaGraduationCap,
  Competences: FaBriefcase,
  Reseau: FaRocket,
  // Temps & énergie
  Organiser: FaCalendarAlt,
  AiderTerrain: FaTools,
  Accueillir: FaConciergeBell,
  Accompagner: FaFirstAid,
  // Expérience sportive
  Coaching: GiWhistle,
  Arbitrage: FaFlagCheckered,
  Encadrement: FaUsers,
  DevSportif: FaChartLine,
  // Compétences pro
  Com: FaBullhorn,
  Numerique: FaLaptopCode,
  Gestion: FaChartBar,
  Finance: FaMoneyBillWave,
  Juridique: FaBalanceScale,
  Creation: FaCamera,
  Formation: FaBook,
  // Réseau & idées
  Partenariats: FaHandshake,
  DevClub: GiMining,
  Ecoles: FaSchool,
  Projets: FaBullseye,
  Innover: FaLightbulb,
  // Soutien
  Don: FaMoneyBillWave,
  Partenaire: FaBuilding,
  Ressources: FaBoxOpen,
  Ambassadeur: FaUserFriends,
};
