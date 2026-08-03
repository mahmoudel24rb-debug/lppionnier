import YardLine from './YardLine';
import StadeMap from './StadeMap';
import ContactForm from './ContactForm';

const HORAIRES = [
  { cat: 'Seniors · Foot US compétition', heures: 'Lun & Jeu · 20h30 à 22h30' },
  { cat: 'Flag mixte seniors', heures: 'Lun & Jeu · 20h30 à 22h30' },
  { cat: 'Juniors · Foot US & Flag', heures: 'Lun & Jeu · 19h00 à 20h30' },
  { cat: 'École de flag', heures: 'Samedi · 10h00 à 12h00' },
];

export default function InfosSection() {
  return (
    <section className="sc-sec" id="infos">
      <YardLine n="60" />
      <div className="sc-wrap">
        <div data-reveal>
          <p className="sc-eyebrow">Infos pratiques</p>
          <h2 className="sc-title">On t&apos;attend au stade.</h2>
        </div>
        <div className="sc-infos-grid" data-reveal>
          <StadeMap />
          <div className="sc-panel">
            <h3 className="sc-panel-title">Entraînements</h3>
            <div className="sc-horaires">
              {HORAIRES.map((h) => (
                <div key={h.cat} className="sc-horaire">
                  <span className="sc-horaire-cat">{h.cat}</span>
                  <span className="sc-horaire-time">{h.heures}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sc-contact-block" data-reveal>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
