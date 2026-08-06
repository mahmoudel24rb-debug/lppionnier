/**
 * Version anglaise du tunnel — structure et ids strictement identiques à funnel.ts.
 * Toute modification structurelle doit être faite dans les DEUX fichiers.
 *
 * Seuls les champs textuels (label, desc, question, titre, punchline, paragraphs,
 * sections, quote, tag) sont traduits. Les `id`, `icon` et `categorie` sont copiés
 * à l'identique : getAllOffers(TUNNEL_EN) doit produire exactement les mêmes ids
 * que getAllOffers(TUNNEL).
 */

import type { Node, Offer } from './funnel';

const sec = (heading: string, ...items: string[]) => ({ heading, items });

// ─────────────────────────────────────────────────────────────
// PLAY — Discovery / Join, Youth / Seniors
// ─────────────────────────────────────────────────────────────
const FA_DECOUVRIR: Node = {
  id: 'fa-decouvrir', label: 'Discover\nAmerican Football', icon: 'decouvrir',
  desc: 'Live the game for a week\nand find out whether this sport\nis made for you.',
  question: 'Who is it for?',
  children: [
    {
      id: 'fa-dec-jeunes', label: 'Youth', icon: 'jeunes',
      desc: 'One week to discover American football\nin a setting suited to your age.',
      offers: [{
        id: 'fa-dec-jeunes-o', titre: 'Trial week · Youth',
        punchline: 'One week to discover\nAmerican football.',
        paragraphs: [
          'Does your child want to try a different team sport? With our free trial week, they can join the training sessions of their age group, learn the basics of American football and get a first taste of life at the club.',
          'No prior experience is required.',
        ],
        sections: [sec('What to expect', 'Training sessions with the youth section', 'An introduction to the basics of the game', 'Guidance from our qualified coaches', 'A first immersion in club life')],
        tag: 'Free trial week', icon: 'foot-us',
      }],
    },
    {
      id: 'fa-dec-seniors', label: 'Seniors', icon: 'seniors',
      desc: 'One week to experience\nAmerican football alongside\nour senior team.',
      offers: [{
        id: 'fa-dec-seniors-o', titre: 'Trial week · Seniors',
        punchline: 'One week to discover a unique contact sport.',
        paragraphs: [
          'Join our senior section training sessions for a week and discover American football in real playing conditions.',
          'You will learn the fundamentals of the game, feel the team atmosphere and see what a sport built on strategy, commitment and collective spirit really demands.',
          'No prior experience is required.',
        ],
        sections: [sec('What to expect', 'Training sessions with the senior team', 'An introduction to the fundamentals of the game', 'Time with the coaches and the players', 'A first immersion in team life')],
        tag: 'Free trial week', icon: 'foot-us',
      }],
    },
  ],
};

const FA_REJOINDRE: Node = {
  id: 'fa-rejoindre', label: 'Join\na team', icon: 'rejoindre',
  desc: 'Become part of our roster and commit\nto an ambitious season.',
  question: 'Who is it for?',
  children: [
    {
      id: 'fa-rej-jeunes', label: 'Youth', icon: 'jeunes',
      desc: 'Grow, learn and thrive\nthrough sport.',
      offers: [{
        id: 'fa-rej-jeunes-o', titre: 'American Football Academy · Youth',
        punchline: 'Develop your potential in\na structured and supportive\nenvironment.',
        paragraphs: [
          'Our American football academy welcomes young players looking for a complete sport that builds self-confidence, respect, team spirit and the will to go further.',
          'Every player progresses at their own pace within an age-appropriate group, guided by coaches invested in their development as athletes and as people.',
        ],
        sections: [sec('What we offer', 'Coaching tailored to each age group', 'A step-by-step introduction to the game', 'Physical and technical development', 'Strong educational values', 'Games and competitions throughout the season')],
        tag: 'Youth annual license', icon: 'foot-us',
      }],
    },
    {
      id: 'fa-rej-seniors', label: 'Seniors', icon: 'seniors',
      desc: 'A demanding program open to anyone ready to give it their all.',
      offers: [{
        id: 'fa-rej-seniors-o', titre: 'Senior Team · American Football',
        punchline: 'Join a program built for those\nwho want to get better.',
        paragraphs: [
          'Our senior section welcomes motivated beginners and experienced players alike. No prior experience is required. What we do ask of every player is genuine commitment to their own progression.',
          'Our team trains within the PPP (Pionniers Programme Performance), a structured performance program designed to support every athlete physically, technically, tactically and mentally.',
        ],
        sections: [
          sec('What we are looking for', 'Consistent attendance at training', 'Involvement in the life of the group', 'A willingness to learn and improve', 'Respect for the framework and the team goals', 'A constant drive to push your limits'),
          sec('What we offer', 'Structured support', 'Progress tracking', 'A committed coaching staff', 'A performance culture open to everyone', 'An ambitious and tight-knit team'),
        ],
        quote: 'Talent can be built. Commitment is a choice.',
        tag: 'Senior annual license', icon: 'foot-us',
      }],
    },
  ],
};

const FLAG_DECOUVRIR: Node = {
  id: 'flag-decouvrir', label: 'Discover\nFlag Football', icon: 'decouvrir',
  desc: 'Try a week for free: a non-contact\ndiscipline that is fast and dynamic,\naccessible and open to everyone.',
  question: 'Who is it for?',
  children: [
    {
      id: 'flag-dec-jeunes', label: 'Youth', icon: 'jeunes-flag',
      desc: 'One week to discover a non-contact sport that is fun, fast and accessible.',
      offers: [{
        id: 'flag-dec-jeunes-o', titre: 'Trial week · Youth',
        punchline: 'One week to try\nFlag Football.',
        paragraphs: ['With our free trial week, your child joins the training sessions of their age group and discovers a team sport built on evasion, speed and cooperation.'],
        sections: [sec('What to expect', 'Training sessions with the youth section', 'An introduction to the rules of Flag Football', 'Age-appropriate coaching', 'A first immersion in club life')],
        tag: 'Free trial week', icon: 'flag',
      }],
    },
    {
      id: 'flag-dec-seniors', label: 'Seniors', icon: 'seniors-flag',
      desc: 'One week to discover\nan Olympic sport:\nnon-contact, fast,\ntactical and accessible.',
      offers: [{
        id: 'flag-dec-seniors-o', titre: 'Trial week · Seniors',
        punchline: 'Try Flag Football in\nreal playing\nconditions.',
        paragraphs: [
          'Join our Flag Football section training sessions and discover a modern discipline that combines speed, game reading and collective spirit.',
          'Open to complete beginners and seasoned athletes alike.',
        ],
        sections: [sec('What to expect', 'Training sessions with the senior team', 'An introduction to the fundamentals', 'Time with the players and the coaches', 'A first immersion in the team')],
        tag: 'Free trial week', icon: 'flag',
      }],
    },
  ],
};

const FLAG_REJOINDRE: Node = {
  id: 'flag-rejoindre', label: 'Join\na team', icon: 'rejoindre-flag',
  desc: 'Join a fast-growing sport where\nspeed, strategy and team spirit\nsit at the heart of the game.',
  question: 'Who is it for?',
  children: [
    {
      id: 'flag-rej-jeunes', label: 'Youth', icon: 'jeunes-flag',
      desc: 'Build your athletic qualities\nand team skills in a non-contact\ndiscipline — modern, accessible\nand NFL Flag.',
      offers: [{
        id: 'flag-rej-jeunes-o', titre: 'Youth Section · Flag Football',
        punchline: 'Join our Flag Football\nyouth section.',
        paragraphs: ['Your child will grow in an environment built around progression, the joy of playing and the values of team sport.'],
        sections: [sec('What we offer', 'Coaching tailored to each player', 'Athletic development', 'Learning the team game', 'Games and competitions throughout the season')],
        tag: 'Youth annual license', icon: 'flag',
      }],
    },
    {
      id: 'flag-rej-seniors', label: 'Seniors', icon: 'seniors-flag',
      desc: 'Join a fast-growing\nOlympic discipline,\nopen to every kind of player.',
      offers: [{
        id: 'flag-rej-seniors-o', titre: 'Senior Team · Flag Football',
        punchline: 'Join our Flag Football team.',
        paragraphs: ['Whether you are a beginner or an experienced athlete, Flag Football offers an accessible, fast and tactical game where everyone can find their place.'],
        sections: [sec('What we offer', 'Regular training sessions', 'Structured coaching', 'Technical and tactical development', 'Competitive games throughout the season', 'A friendly and ambitious atmosphere')],
        tag: 'Senior annual license', icon: 'flag',
      }],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// GETTING INVOLVED — detailed role descriptions
// ─────────────────────────────────────────────────────────────
const ORGANISER: Offer = {
  id: 'org-events', titre: 'Events & Operations Team',
  punchline: 'Create the moments that bring the club to life.',
  paragraphs: [
    'Behind every game, every tournament and every event there is a team that plans, coordinates and makes those shared moments happen.',
    'By joining the Events & Operations team, you directly shape the experience of our players, families, partners and supporters.',
  ],
  sections: [
    sec('Your missions', 'Help organize games and fixtures', 'Contribute to preparing tournaments and events', 'Welcome participants and visitors on site', 'Help coordinate the volunteer teams', 'Bring ideas to improve the club experience'),
    sec('Who we are looking for', 'You enjoy organizing and coordinating', 'You like working as part of a team', 'You are energetic and willing', 'No prior experience is required'),
    sec('What you will gain', 'Hands-on experience running sporting events', 'A front-row seat in the life of the club', 'New connections and a collective adventure'),
  ],
  quote: 'Every great event starts with a committed team behind the scenes.',
  tag: 'Volunteering',
};

const MATERIEL: Offer = {
  id: 'materiel-logistique', titre: 'Equipment & Logistics Team',
  punchline: 'Set up the conditions\nfor the club to succeed.',
  paragraphs: [
    'Every practice, every game and every event rests on work nobody sees but everybody needs: gear available, equipment ready, needs anticipated.',
    'By joining the Equipment & Logistics team, you keep the club running and make life easier for players, coaches and volunteers.',
  ],
  sections: [
    sec('Your missions', 'Help prepare and pack away the equipment', 'Keep track of the club gear', 'Help set up everything the logistics require', 'Get training days and game days ready'),
    sec('Who we are looking for', 'A practical mind and a team spirit', 'Organization and reliability', 'A desire to help in concrete ways'),
    sec('What you will gain', 'A look behind the scenes of the club', 'An essential place in the collective effort', 'A team of committed volunteers'),
  ],
  quote: 'Every sporting success starts with good preparation.',
  tag: 'Volunteering',
};

const COACH: Offer = {
  id: 'coach', titre: 'Coach',
  punchline: 'Pass on your passion\nand guide the players\nas they progress.',
  paragraphs: [
    'The coach sits at the heart of the club sporting project. They support players as they progress, teach the fundamentals of the game and help build a strong, united team.',
    'Experience in the sport is an asset, but it is not a prerequisite: every coach is supported through our internal training pathway.',
  ],
  sections: [
    sec('Your missions', 'Plan and run training sessions', 'Teach the technical and tactical fundamentals', 'Support the individual progression of each player', 'Take part in building the sporting project', 'Work alongside the rest of the staff'),
    sec('Who we are looking for', 'A passion for sport and for teaching it', 'The ability to lead a group', 'A team spirit and a desire to learn'),
    sec('What we offer', 'Support and step-by-step training', 'A place within a structured staff', 'A rewarding experience in sports coaching'),
  ],
  quote: 'A good coach does not just pass on technique, they help people grow.',
  tag: 'Volunteering', categorie: 'sportif',
};

const ASSISTANT_COACH: Offer = {
  id: 'assistant-coach', titre: 'Assistant Coach',
  punchline: 'Help the staff prepare, analyze\nand improve the team.',
  paragraphs: [
    'The assistant coach plays a key role behind the scenes of performance. Supporting the coaching staff, you help organize training, follow the players and analyze the work done on the field.',
    'Previous experience in sport is appreciated, but your motivation and your ability to learn matter most.',
  ],
  sections: [
    sec('Your missions', 'Film training sessions and games', 'Take part in video analysis', 'Help prepare the sessions', 'Contribute to player follow-up'),
    sec('Who we are looking for', 'An interest in sports analysis', 'A sharp eye for detail', 'Rigor and organization'),
  ],
  quote: 'Behind every strong team there is a staff that prepares, analyzes and supports.',
  tag: 'Volunteering', categorie: 'sportif',
};

const PREPA_PHYSIQUE: Offer = {
  id: 'prepa-physique', titre: 'Strength & Conditioning Coach',
  punchline: 'Unlock the potential of our athletes\nand guide their progression.',
  paragraphs: [
    'Sporting performance is not built on the field alone. It also rests on physical preparation, injury prevention and athletic development.',
    'By joining the staff, you help our athletes progress physically within a structured and ambitious framework.',
  ],
  sections: [
    sec('Your missions', 'Help design the strength and conditioning programs', 'Work on strength, speed, explosiveness and endurance', 'Lead warm-ups and movement routines', 'Contribute to injury prevention'),
    sec('Who we are looking for', 'Training or experience in strength and conditioning appreciated', 'An interest in sporting performance', 'Knowledge of athletic development'),
  ],
  quote: 'Developing an athlete means building the capacities that let them push their limits.',
  tag: 'Volunteering', categorie: 'sportif',
};

const ARBITRE: Offer = {
  id: 'arbitre', titre: 'Referee',
  punchline: 'Become an essential part of the game\nand help the sport thrive.',
  paragraphs: [
    'Without referees, there are no games. Officiating is central to the growth of American football and flag football: it guarantees that the rules are respected, that players are safe and that games are worth watching.',
    'A sports fan, a former player or simply curious: we support you through your training so you can grow into the role.',
  ],
  sections: [
    sec('Your missions', 'Learn and apply the rules of the game', 'Officiate club games and events', 'Make sure games run smoothly', 'Keep the game safe and fair'),
    sec('Who we are looking for', 'An interest in sport and the team game', 'A sense of fairness and responsibility', 'The ability to make decisions'),
    sec('What we offer', 'Support and full referee training', 'A step-by-step path to higher levels', 'Match fees depending on the assignments you take on'),
  ],
  quote: 'The referee does not watch the game. The referee makes the game possible.',
  tag: 'Match fees', categorie: 'sportif',
};

const GRAPHISTE: Offer = {
  id: 'graphiste', titre: 'Graphic Designer',
  punchline: 'Give our project a strong\nvisual identity.',
  paragraphs: ['A club is also built through its image. We are looking for a creative mind able to translate our identity, our values and our ambitions into striking visuals.'],
  sections: [
    sec('Your missions', 'Create communication materials', 'Design visuals for social media and events', 'Help the club graphic identity evolve'),
    sec('Who we are looking for', 'Command of graphic design tools', 'A feel for visual identity and branding', 'A portfolio or past work appreciated'),
  ],
  tag: 'Volunteering',
};

const PHOTOGRAPHE: Offer = {
  id: 'photographe', titre: 'Photographer',
  punchline: 'Capture the moments that tell our story.',
  paragraphs: ['Every game, every win and every shared moment builds the history of the club. We are looking for a photographer able to showcase the energy, the emotion and the behind-the-scenes of our project.'],
  sections: [
    sec('Your missions', 'Shoot games and events', 'Capture club life and its highlights', 'Build a usable image library', 'Showcase our players, teams and partners'),
    sec('Who we are looking for', 'Command of photography techniques', 'A feel for framing and visual storytelling', 'Experience or a portfolio appreciated'),
  ],
  tag: 'Volunteering',
};

const CM: Offer = {
  id: 'cm', titre: 'Community Manager',
  punchline: 'Grow our community\nand build our digital presence.',
  paragraphs: ['Social media is an essential window into the club: it spreads the word, attracts new players and showcases our adventure. We are looking for someone able to build a consistent and engaging digital presence.'],
  sections: [
    sec('Your missions', 'Define and drive the editorial line', 'Plan and publish content', 'Grow engagement within the community', 'Showcase games, events and club news'),
    sec('Who we are looking for', 'Experience managing social media accounts', 'A command of each platform and its codes', 'A feel for communication and storytelling'),
  ],
  tag: 'Volunteering',
};

const VIDEASTE: Offer = {
  id: 'videaste', titre: 'Videographer / Editor',
  punchline: 'Bring the intensity of the club to life\nthrough video.',
  paragraphs: ['Sport is also lived through images. We are looking for someone able to turn our biggest moments into content that grabs our community.'],
  sections: [
    sec('Your missions', 'Film games, training sessions and events', 'Produce immersive videos', 'Edit content for social media', 'Help build our video identity'),
    sec('Who we are looking for', 'Command of video capture and editing', 'A feel for pacing and storytelling', 'A portfolio or past work appreciated'),
  ],
  tag: 'Volunteering',
};

const WEB: Offer = {
  id: 'web', titre: 'Digital & Web Lead',
  punchline: 'Grow the digital front door\nof the club.',
  paragraphs: ['The website is often the first contact people have with our project. We are looking for someone able to keep it alive, improve it and optimize our online presence as the club grows.'],
  sections: [
    sec('Your missions', 'Update the website and help it evolve', 'Publish news, events and content', 'Optimize the discovery and sign-up journeys'),
    sec('Who we are looking for', 'Experience in website management or development', 'A feel for user experience', 'Autonomy and initiative'),
  ],
  tag: 'Volunteering',
};

const MERCH: Offer = {
  id: 'merch', titre: 'Merchandising & Brand Identity Lead',
  punchline: 'Build the world of the club\nbeyond the field.',
  paragraphs: ['A club is recognized not only for its results, but also for its identity, its colors and its symbols. We are looking for someone able to develop and structure the club merchandising world.'],
  sections: [
    sec('Your missions', 'Define a consistent merchandising vision', 'Develop the club apparel and product lines', 'Help create the player and supporter collections'),
    sec('Who we are looking for', 'Experience in merchandising, apparel or marketing', 'A strong feel for visual identity', 'A creative and strategic mind'),
  ],
  tag: 'Volunteering',
};

const GESTION: Offer = {
  id: 'gestion', titre: 'Management & Administration Team',
  punchline: 'Structure how the club runs\nso it can keep\ngrowing.',
  paragraphs: ['Behind an ambitious sporting project there is a solid organization. We are looking for people able to bring their rigor and their skills to help structure the association.'],
  sections: [
    sec('Your missions', 'Help with the administrative follow-up of the club', 'Help structure internal processes and tools', 'Support the board in their missions'),
    sec('Who we are looking for', 'Experience in management, administration or organization', 'A rigorous and methodical approach', 'Autonomy and a team spirit'),
  ],
  tag: 'Volunteering',
};

const PARTENARIATS_PRIVES: Offer = {
  id: 'partenariats-prives', titre: 'Corporate Partnerships Team',
  punchline: 'Build the relationships that let\nthe project grow.',
  paragraphs: ['A club also grows thanks to the companies that choose to stand alongside it. You help develop relationships with businesses and build lasting collaborations.'],
  sections: [
    sec('Your missions', 'Identify and reach out to new partner companies', 'Build and nurture a relationship of trust', 'Help showcase our partners'),
    sec('Who we are looking for', 'You enjoy meeting people', 'You have a commercial or entrepreneurial mindset', 'You want to represent an ambitious project'),
  ],
  quote: 'Every partnership starts with a conversation.',
  tag: 'Volunteering',
};

const TERRITOIRE: Offer = {
  id: 'territoire', titre: 'Community & Education Team',
  punchline: 'Grow the impact of the club\nbeyond the field.',
  paragraphs: ['A sports club is also a local player. You help build relationships with local authorities, schools and community organizations to develop new projects around sport.'],
  sections: [
    sec('Your missions', 'Develop relationships with local authorities', 'Build links with schools and institutions', 'Represent the club with partner organizations'),
    sec('Who we are looking for', 'Strong people skills', 'An interest in community and sporting projects', 'The ability to create connections'),
  ],
  quote: 'A club does not only live in its facilities, it lives in its community.',
  tag: 'Volunteering',
};

const PILOTAGE_FIN: Offer = {
  id: 'pilotage-financier', titre: 'Financial Steering Team',
  punchline: 'Give the club the means\nto build its ambition.',
  paragraphs: ['A growing sporting project needs a clear view of its resources. You help structure the financial tracking of the club and support strategic decisions.'],
  sections: [
    sec('Your missions', 'Help build and monitor the budgets', 'Put financial steering tools in place', 'Take part in the economic analysis of our projects'),
    sec('Who we are looking for', 'Experience in financial management or accounting', 'Comfortable with numbers and analysis', 'Rigor and the ability to anticipate'),
  ],
  quote: 'Ambitions are built on a clear view of the means needed to reach them.',
  tag: 'Volunteering',
};

const SANTE_PARTENAIRE: Offer = {
  id: 'sante-partenaire', titre: 'Health & Performance Partner',
  punchline: 'Support our athletes in their practice\nand their progression.',
  paragraphs: ['Sporting performance is also built around prevention and athlete follow-up. We want to build a network of partner health professionals.'],
  sections: [
    sec('Who we are looking for', 'Physiotherapists', 'Osteopaths', 'Nutritionists', 'Sports physicians', 'Professionals who work with athletes'),
    sec('What you could do', 'Support athletes in prevention and recovery', 'Bring your expertise to our sporting practice', 'Build a lasting relationship with the club'),
  ],
  quote: 'Performance starts with well-supported athletes.',
  tag: 'Professional partnership',
};

const SANTE_SECOURS: Offer = {
  id: 'sante-secours', titre: 'First Aid & Athlete Care Team',
  punchline: 'Contribute to the safety\nand well-being of our players.',
  paragraphs: ['In a physical sport like American football, player safety is a priority. We are looking for people who want to support our athletes during training sessions, games and events.'],
  sections: [
    sec('Who we are looking for', 'Holders of a first aid certificate (PSC1 or equivalent)', 'Nurses', 'First responders', 'Anyone passionate about health and prevention'),
    sec('Who we are looking for', 'A sense of responsibility', 'Calm and quick thinking', 'A team spirit'),
  ],
  quote: 'Protecting players is also part of helping them progress.',
  tag: 'Volunteering',
};

// ─────────────────────────────────────────────────────────────
// SUPPORT
// ─────────────────────────────────────────────────────────────
const DON: Offer = {
  id: 'don-o', titre: 'Make a donation to the club',
  punchline: 'Support the growth\nof our project directly.',
  paragraphs: [
    'Every contribution helps the club keep growing, develop its teams, improve playing conditions and build a lasting sporting project.',
    'Your support gives our ambitions the means to become real.',
  ],
  sections: [
    sec('Your contribution can help us', 'Develop our sporting activities', 'Support our players', 'Improve our equipment', 'Fund training and coaching'),
    sec('How to support us', 'A one-off donation', 'Regular support', 'Backing a specific initiative'),
  ],
  quote: 'Behind every ambitious project there is a community that chooses to support it.',
  tag: 'Project support',
};

const PARTENAIRE: Offer = {
  id: 'partenaire-o', titre: 'Become a club\npartner',
  punchline: 'Tie your brand to a sporting and human adventure.',
  paragraphs: ['A partnership lets companies join a growing project, back local momentum and build a win-win relationship with our community.'],
  sections: [
    sec('Becoming a partner means you can', 'Showcase your brand to our community', 'Support a local sporting project', 'Grow your visibility around the club', 'Build lasting relationships'),
  ],
  quote: 'A successful partnership creates value for both sides.',
  tag: 'Partnership',
};

const RESSOURCES: Offer = {
  id: 'ressources-o', titre: 'Bring resources to the club',
  punchline: 'Help the project in other ways than\ntime or money.',
  paragraphs: ['A club grows thanks to the people and the resources around it. Your contribution can take many forms and meet very concrete needs.'],
  sections: [
    sec('You can support us with', 'Equipment', 'Gear', 'Services', 'Skills'),
    sec('Your help can allow us to', 'Improve playing conditions', 'Make running the club easier', 'Move certain projects forward faster'),
  ],
  quote: 'Sometimes the best way to help is simply to bring what the project needs.',
  tag: 'Project support',
};

const AMBASSADEUR: Offer = {
  id: 'ambassadeur-o', titre: 'Become a club\nambassador',
  punchline: 'Spread the word about\nthe project around you.',
  paragraphs: ['A club also grows thanks to the people who talk about it, share its story and open doors. As an ambassador, you help the club shine through your own network.'],
  sections: [
    sec('Your missions', 'Talk about the project around you', 'Share our news and events', 'Connect the club with interested people', 'Represent the values of the club'),
    sec('Who we are looking for', 'Pride in belonging to the project', 'A desire to share a collective adventure', 'A taste for meeting people and networking'),
  ],
  quote: 'Every great community starts with people who choose to tell its story.',
  tag: 'Ambassador',
};

// ─────────────────────────────────────────────────────────────
// FULL TREE
// ─────────────────────────────────────────────────────────────
export const TUNNEL_EN: Node = {
  id: 'root', label: 'Journey', icon: 'jouer',
  question: 'Which adventure appeals to you?',
  children: [
    {
      id: 'jouer', label: 'I want to compete', icon: 'jouer',
      desc: 'Find the sport\nthat fits you\nand join the adventure\non the field.',
      question: 'Which sport appeals to you?',
      children: [
        {
          id: 'foot-us', label: 'American Football', icon: 'foot-us',
          desc: 'An intense contact sport where strategy,\ncommitment and team spirit are one.',
          question: 'What would you like to do?',
          children: [FA_DECOUVRIR, FA_REJOINDRE],
        },
        {
          id: 'flag', label: 'Flag Football', icon: 'flag',
          desc: 'A non-contact game that is fast\nand spectacular. An Olympic sport at the\n2028 Los Angeles Olympics,\nopen to every profile.',
          question: 'What would you like to do?',
          children: [FLAG_DECOUVRIR, FLAG_REJOINDRE],
        },
      ],
    },
    {
      id: 'investir', label: 'I want to get involved\nin the club', icon: 'investir',
      desc: 'Put your time,\nyour energy\nor your skills\nat the service of the team.',
      question: 'What would you like to bring?',
      children: [
        {
          id: 'temps', label: 'Time and\nenergy', icon: 'temps',
          desc: 'I like being there and lending\na hand.',
          question: 'How would you like to help?',
          children: [
            { id: 'organiser', label: 'Organizing', icon: 'organiser', desc: 'Create the events that bring players, families and supporters together.', offers: [ORGANISER] },
            { id: 'materiel', label: 'Helping on the field', icon: 'materiel', desc: 'Make sure everything runs before, during and after the games.', offers: [MATERIEL] },
          ],
        },
        {
          id: 'experience', label: 'My sporting experience', icon: 'experience',
          desc: 'I like teaching, leading\nand helping others improve.',
          question: 'In which area?',
          children: [
            { id: 'coaching', label: 'Coaching', icon: 'coaching', desc: 'Pass on your passion and help\nour players progress.', offers: [COACH, ASSISTANT_COACH, PREPA_PHYSIQUE] },
            { id: 'arbitrage', label: 'Officiating', icon: 'arbitrage', desc: 'Keep the game fair and help grow\nthe sport.', offers: [ARBITRE] },
          ],
        },
        {
          id: 'competences', label: 'My professional skills', icon: 'competences',
          desc: 'I can put my expertise\nat the service of the club.',
          question: 'What expertise would you like to bring?',
          children: [
            { id: 'com-creation', label: 'Communication & Creative', icon: 'com', desc: 'Put the club on the map with\nthe public and our future\nplayers.', offers: [GRAPHISTE, PHOTOGRAPHE, CM, VIDEASTE, WEB, MERCH] },
            { id: 'gestion', label: 'Management & Administration', icon: 'gestion', desc: 'Structure the organization and\nprepare the future of the club.', offers: [GESTION] },
            { id: 'finance', label: 'Network, Business & Funding', icon: 'finance', desc: 'Find the resources that will\nlet the project keep\ngrowing.', offers: [PARTENARIATS_PRIVES, TERRITOIRE, PILOTAGE_FIN] },
            { id: 'sante', label: 'Health & well-being', icon: 'sante', desc: 'Contribute to the safety and\ncare of our players.', offers: [SANTE_PARTENAIRE, SANTE_SECOURS] },
          ],
        },
      ],
    },
    {
      id: 'soutenir', label: 'I want to support\nthe project', icon: 'soutenir',
      desc: 'Contribute\nto the growth of the club\nand to its impact\nin the region.',
      question: 'How would you like to support the project?',
      children: [
        { id: 'don', label: 'Make a donation', icon: 'don', desc: 'Contribute directly\nto the growth\nof the club activities.', offers: [DON] },
        { id: 'partenaire', label: 'Become a partner', icon: 'partenaire', desc: 'Tie your brand\nto an ambitious sporting\nand human project.', offers: [PARTENAIRE] },
        { id: 'ressources', label: 'Bring resources', icon: 'ressources', desc: 'Provide equipment,\nservices or\nskills.', offers: [RESSOURCES] },
        { id: 'ambassadeur', label: 'Become an ambassador', icon: 'ambassadeur', desc: 'Spread the word about the club\nand open up your network.', offers: [AMBASSADEUR] },
      ],
    },
  ],
};

// Open application (« Get involved » journey)
export const SPONTANE_EN: Offer = {
  id: 'spontane',
  titre: 'Open application',
  punchline: 'Not sure yet where you fit in? Tell us how you would like to help.',
  paragraphs: [
    'Tell us what you enjoy doing, what you are good at and when you are available: we will point you toward the role that fits you best.',
    'You do not need a specific role in mind: your motivation is enough.',
  ],
  tag: 'Volunteering', categorie: 'associatif', icon: 'investir',
};
