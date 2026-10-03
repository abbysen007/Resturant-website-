import React, { useEffect, useState, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import { RESTAURANT_LOCATION } from '../data/menuData';
import { Utensils, MapPin, Bike, Navigation, AlertCircle } from 'lucide-react';

interface DeliveryRadiusCircleProps {
  center: { lat: number; lng: number };
  radiusMeters: number;
}

/**
 * Renders the 25 km delivery radius circle on the Google Map
 */
function DeliveryRadiusCircle({ center, radiusMeters }: DeliveryRadiusCircleProps) {
  const map = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle({
        strokeColor: '#C85A17',
        strokeOpacity: 0.85,
        strokeWeight: 2,
        fillColor: '#C85A17',
        fillOpacity: 0.12,
        map,
        center,
        radius: radiusMeters,
        clickable: false
      });
    } else {
      circleRef.current.setCenter(center);
      circleRef.current.setRadius(radiusMeters);
      circleRef.current.setMap(map);
    }

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }
    };
  }, [map, center.lat, center.lng, radiusMeters]);

  return null;
}

/**
 * Route polyline renderer connecting Restaurant -> Rider -> Customer
 */
function RoutePolyline({
  origin,
  destination,
  riderPos
}: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  riderPos?: { lat: number; lng: number };
}) {
  const map = useMap();
  const lineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    const path = riderPos ? [origin, riderPos, destination] : [origin, destination];

    if (!lineRef.current) {
      lineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#1E3A8A',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        map
      });
    } else {
      lineRef.current.setPath(path);
      lineRef.current.setMap(map);
    }

    return () => {
      if (lineRef.current) {
        lineRef.current.setMap(null);
      }
    };
  }, [map, origin, destination, riderPos]);

  return null;
}

/**
 * Camera bounds updater to keep both restaurant & customer in view
 */
function AutoFitBounds({
  points
}: {
  points: { lat: number; lng: number }[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;
    try {
      const bounds = new google.maps.LatLngBounds();
      points.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    } catch {
      // safe fallback
    }
  }, [map, points]);

  return null;
}

export interface InteractiveLocationMapProps {
  customerLat: number;
  customerLng: number;
  onLocationSelect: (lat: number, lng: number) => void;
  isWithin25Km: boolean;
  distanceKm: number;
}

/**
 * Interactive map for the Location Modal with 25 km delivery radius visualizer
 */
export const InteractiveLocationMap: React.FC<InteractiveLocationMapProps> = ({
  customerLat,
  customerLng,
  onLocationSelect,
  isWithin25Km,
  distanceKm
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const restaurantPos = { lat: RESTAURANT_LOCATION.lat, lng: RESTAURANT_LOCATION.lng };
  const customerPos = { lat: customerLat, lng: customerLng };

  const handleMapClick = (e: any) => {
    if (e.detail?.latLng) {
      onLocationSelect(e.detail.latLng.lat, e.detail.latLng.lng);
    }
  };

  return (
    <div className="w-full h-72 sm:h-80 rounded-xl overflow-hidden shadow-inner border border-amber-200/80 relative bg-amber-50">
      <APIProvider apiKey={apiKey} solutionChannel="gmp_mcp_codeassist_v1_aistudio">
        <Map
          defaultCenter={customerPos}
          defaultZoom={11}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          onClick={handleMapClick}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {/* 25 km Delivery Radius Zone */}
          <DeliveryRadiusCircle center={restaurantPos} radiusMeters={25000} />

          {/* Restaurant Flagship Pin */}
          <AdvancedMarker position={restaurantPos} title="Roshoi Ghor Kitchen">
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="bg-amber-700 text-white p-2 rounded-full shadow-lg border-2 border-white ring-2 ring-amber-700/50 flex items-center justify-center animate-pulse">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="bg-white/95 backdrop-blur-xs text-amber-950 font-bold text-[10px] px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap border border-amber-200">
                Roshoi Ghor (HQ)
              </span>
            </div>
          </AdvancedMarker>

          {/* Customer Location Pin */}
          <AdvancedMarker
            position={customerPos}
            title="Your Location"
            draggable={true}
            onDragEnd={(e: any) => {
              if (e.latLng) {
                const lat = typeof e.latLng.lat === 'function' ? e.latLng.lat() : e.latLng.lat;
                const lng = typeof e.latLng.lng === 'function' ? e.latLng.lng() : e.latLng.lng;
                onLocationSelect(lat, lng);
              }
            }}
          >
            <div className="flex flex-col items-center cursor-grab active:cursor-grabbing">
              <div
                className={`p-2 rounded-full shadow-xl border-2 border-white flex items-center justify-center ${
                  isWithin25Km ? 'bg-emerald-600 ring-2 ring-emerald-400' : 'bg-rose-600 ring-2 ring-rose-400'
                }`}
              >
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow mt-1 text-white ${
                  isWithin25Km ? 'bg-emerald-700' : 'bg-rose-700'
                }`}
              >
                {isWithin25Km ? `Delivery OK (${distanceKm} km)` : `Outside 25km (${distanceKm} km)`}
              </span>
            </div>
          </AdvancedMarker>

          <AutoFitBounds points={[restaurantPos, customerPos]} />
        </Map>
      </APIProvider>

      {/* Floating Info Overlay */}
      <div className="absolute top-2 left-2 right-2 sm:right-auto bg-white/95 backdrop-blur-md rounded-lg p-2.5 shadow-md border border-amber-200 text-xs flex items-center gap-2 z-10">
        <div
          className={`w-3 h-3 rounded-full shrink-0 ${
            isWithin25Km ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
          }`}
        />
        <div className="leading-tight">
          <span className="font-semibold text-slate-800">
            {isWithin25Km ? 'Within Delivery Zone' : 'Beyond Delivery Radius'}
          </span>
          <p className="text-[11px] text-slate-500">
            {distanceKm} km from Park Street Kitchen (Radius: 25 km)
          </p>
        </div>
      </div>
    </div>
  );
};

export interface LiveTrackingMapProps {
  restaurantLat: number;
  restaurantLng: number;
  customerLat: number;
  customerLng: number;
  riderLat?: number;
  riderLng?: number;
  orderStatus: string;
}

/**
 * Live Tracking Map for Customer Tracking Screen with animated route and rider
 */
export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  restaurantLat,
  restaurantLng,
  customerLat,
  customerLng,
  riderLat,
  riderLng,
  orderStatus
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const restaurantPos = { lat: restaurantLat, lng: restaurantLng };
  const customerPos = { lat: customerLat, lng: customerLng };
  const riderPos = riderLat && riderLng ? { lat: riderLat, lng: riderLng } : undefined;

  const pointsToFit = [restaurantPos, customerPos];
  if (riderPos) pointsToFit.push(riderPos);

  return (
    <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-amber-200/90 relative bg-amber-50">
      <APIProvider apiKey={apiKey} solutionChannel="gmp_mcp_codeassist_v1_aistudio">
        <Map
          defaultCenter={restaurantPos}
          defaultZoom={12}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {/* Connecting Route */}
          <RoutePolyline origin={restaurantPos} destination={customerPos} riderPos={riderPos} />

          {/* Restaurant Marker */}
          <AdvancedMarker position={restaurantPos} title="Roshoi Ghor Central Kitchen">
            <div className="flex flex-col items-center">
              <div className="bg-amber-800 text-white p-2.5 rounded-full shadow-xl border-2 border-white ring-2 ring-amber-600 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="bg-white/95 text-amber-950 font-bold text-[11px] px-2 py-0.5 rounded shadow mt-1 border border-amber-200">
                Roshoi Ghor (Park St)
              </span>
            </div>
          </AdvancedMarker>

          {/* Customer Destination Marker */}
          <AdvancedMarker position={customerPos} title="Delivery Destination">
            <div className="flex flex-col items-center">
              <div className="bg-emerald-600 text-white p-2 rounded-full shadow-xl border-2 border-white ring-2 ring-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="bg-white/95 text-emerald-950 font-bold text-[11px] px-2 py-0.5 rounded shadow mt-1 border border-emerald-200">
                Your Delivery Address
              </span>
            </div>
          </AdvancedMarker>

          {/* Rider Marker (if out for delivery) */}
          {riderPos && orderStatus === 'out_for_delivery' && (
            <AdvancedMarker position={riderPos} title="Delivery Partner Bikash">
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 text-white p-2.5 rounded-full shadow-2xl border-2 border-white ring-4 ring-blue-300 animate-bounce flex items-center justify-center">
                  <Bike className="w-6 h-6" />
                </div>
                <span className="bg-blue-900 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow mt-1">
                  Rider on the way 🛵
                </span>
              </div>
            </AdvancedMarker>
          )}

          <AutoFitBounds points={pointsToFit} />
        </Map>
      </APIProvider>
    </div>
  );
};
