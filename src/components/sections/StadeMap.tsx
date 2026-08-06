'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { asset } from '@/lib/asset';
import { useLang } from '@/lib/i18n';

/**
 * Carte interactive du stade (Leaflet + OpenStreetMap, zoom/dézoom),
 * teintée aux couleurs de la charte via un filtre CSS sur les tuiles.
 * Initialisée à l'approche du viewport ; marqueur = ballon Pionniers.
 */
const STADE: [number, number] = [47.417, 0.7104]; // centre du complexe (OSM)
/** Terrain d'entraînement actuel des Pionniers : pitch sud du complexe. */
const TERRAIN: [number, number] = [47.416252, 0.710804];

const GOOGLE_MAPS =
  'https://www.google.com/maps/search/?api=1&query=Stade+de+la+Chambrerie+Rue+Tartifume+37100+Tours';

export default function StadeMap() {
  const { lang } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || mapRef.current) continue;
          io.disconnect();
          // Import dynamique : Leaflet manipule `window`, jamais côté serveur.
          import('leaflet').then((L) => {
            if (mapRef.current || !containerRef.current) return;
            const map = L.map(containerRef.current, {
              center: STADE,
              zoom: 16,
              scrollWheelZoom: true,
              attributionControl: true,
              zoomControl: false,
            });
            // en bas à droite : l'overlay adresse occupe le haut-gauche
            L.control.zoom({ position: 'bottomright' }).addTo(map);
            mapRef.current = map;
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);
            const ballon = L.icon({
              iconUrl: asset('/assets/refonte/ballon-pionniers.png'),
              iconSize: [58, 54],
              iconAnchor: [29, 27],
              popupAnchor: [0, -30],
            });
            L.marker(TERRAIN, { icon: ballon, alt: 'Stade de la Chambrerie' })
              .addTo(map)
              .bindPopup(
                `<strong>Stade de la Chambrerie</strong><br>2-4 Rue de Tartifume, 37100 Tours<br><a href="${GOOGLE_MAPS}" target="_blank" rel="noopener noreferrer">${document.documentElement.lang === "en" ? "Directions" : "Itinéraire"} →</a>`,
              );
          });
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="sc-map">
      <div ref={containerRef} className="sc-map-canvas" />
      <span className="sc-map-address">
        <strong>Stade de la Chambrerie</strong>
        <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer">
          2-4 Rue de Tartifume, 37100 Tours
        </a>
      </span>
    </div>
  );
}
