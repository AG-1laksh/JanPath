"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

let L: any;

// Only import Leaflet on the client side
if (typeof window !== "undefined") {
    L = require("leaflet");
    
    // Fix for default marker icons in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
}

// Custom marker icons
const createCustomIcon = (color: string) => {
    if (typeof window === "undefined" || !L) return null;
    
    return L.divIcon({
        className: "custom-marker",
        html: `
            <div style="
                background-color: ${color};
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            ">
                <div style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(45deg);
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                ">📍</div>
            </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42],
    });
};

const userLocationIcon = typeof window !== "undefined" && L ? L.divIcon({
    className: "user-marker",
    html: `
        <div style="
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3);
            animation: pulse 2s infinite;
        "></div>
        <style>
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
}) : null;

interface TaskLocation {
    id: string;
    title: string;
    area: string;
    lat: number;
    lng: number;
    priority: "High" | "Medium" | "Low";
    status: string;
}

interface LiveMapProps {
    tasks: TaskLocation[];
    liveTracking: boolean;
}

function MapController({ userLocation, liveTracking }: { userLocation: [number, number] | null; liveTracking: boolean }) {
    const map = useMap();

    useEffect(() => {
        if (userLocation && liveTracking) {
            map.setView(userLocation, map.getZoom(), {
                animate: true,
            });
        }
    }, [userLocation, liveTracking, map]);

    return null;
}

export default function LiveMap({ tasks, liveTracking }: LiveMapProps) {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!liveTracking || !isClient) return;

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
                setLocationError(null);
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationError(error.message);
                // Fallback to default location (New Delhi, India)
                setUserLocation([28.6139, 77.2090]);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [liveTracking, isClient]);

    if (!isClient) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                    <p>Initializing map...</p>
                </div>
            </div>
        );
    }

    // Default center (New Delhi, India) if no user location
    const center: [number, number] = userLocation || [28.6139, 77.2090];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "High":
                return "#ef4444";
            case "Medium":
                return "#f59e0b";
            case "Low":
                return "#3b82f6";
            default:
                return "#6366f1";
        }
    };

    return (
        <div className="relative h-full w-full rounded-2xl overflow-hidden">
            <MapContainer
                center={center}
                zoom={13}
                className="h-full w-full z-0"
                style={{ background: "#0a0a0a" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && userLocationIcon && (
                    <>
                        <Marker position={userLocation} icon={userLocationIcon}>
                            <Popup>
                                <div className="text-center">
                                    <strong>Your Location</strong>
                                    <br />
                                    <span className="text-xs text-green-600">Live Tracking Active</span>
                                </div>
                            </Popup>
                        </Marker>
                        <Circle
                            center={userLocation}
                            radius={100}
                            pathOptions={{
                                color: "#10b981",
                                fillColor: "#10b981",
                                fillOpacity: 0.1,
                                weight: 2,
                            }}
                        />
                    </>
                )}

                {tasks.map((task) => {
                    const customIcon = createCustomIcon(getPriorityColor(task.priority));
                    if (!customIcon) return null;
                    
                    return (
                        <Marker
                            key={task.id}
                            position={[task.lat, task.lng]}
                            icon={customIcon}
                        >
                            <Popup>
                                <div className="p-2">
                                    <strong className="text-sm">{task.title}</strong>
                                    <br />
                                    <span className="text-xs text-gray-600">{task.area}</span>
                                    <br />
                                    <span className={`text-xs font-semibold ${
                                        task.priority === "High" ? "text-red-600" :
                                        task.priority === "Medium" ? "text-orange-600" :
                                        "text-blue-600"
                                    }`}>
                                        {task.priority} Priority
                                    </span>
                                    <br />
                                    <span className="text-xs text-emerald-600">{task.status}</span>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                <MapController userLocation={userLocation} liveTracking={liveTracking} />
            </MapContainer>

            {locationError && (
                <div className="absolute top-4 left-4 right-4 bg-orange-500/90 text-white px-4 py-2 rounded-lg text-xs z-[1000]">
                    ⚠️ {locationError}
                </div>
            )}
        </div>
    );
}
