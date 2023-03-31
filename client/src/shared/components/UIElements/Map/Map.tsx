import { useRef, useEffect } from 'react';

import './Map.css';

type Props = {
  center: { lat: number; lng: number };
  zoom?: number;
  className?: string;
};

const Map: React.FC<Props> = ({ className, center, zoom }) => {
  const mapRef = useRef<any>();

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return <div ref={mapRef} className={`map ${className}`}></div>;
};

export default Map;
