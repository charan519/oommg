import { useState } from 'react';
import * as turf from '@turf/turf';

export function useMapZoom() {
  const [isGlobeView, setIsGlobeView] = useState(false);

  const zoomToLocation = (location: [number, number], map: any) => {
    map.setView(location, 13, {
      animate: true,
      duration: 1
    });
  };

  const zoomToFitRoute = (coordinates: [number, number][], map: any) => {
    if (coordinates.length < 2) return;

    const line = turf.lineString(coordinates);
    const bbox = turf.bbox(line);
    const corner1 = [bbox[1], bbox[0]];
    const corner2 = [bbox[3], bbox[2]];
    
    map.fitBounds([corner1, corner2], {
      padding: [50, 50],
      animate: true,
      duration: 1
    });
  };

  return { isGlobeView, setIsGlobeView, zoomToLocation, zoomToFitRoute };
}