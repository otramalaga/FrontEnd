import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../context/AuthContext';
import HeaderLogged from '../HeaderLogged/HeaderLogged';
import Header from '../Header/Header';
import BookmarkPopup from './BookmarkPopup';
import LocationMarker from './LocationMarker';
import SearchControl from './SearchControl';
import MapFilters from '../MapFilters';
import MarkerForm from './Markerform';
import AddMarkerButton from './AddMarkerButton';
import { createCustomIcon } from './CustomMarkerIcon';
import { useMapFilters } from '../../hooks/useMapFilters';
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM } from '../../constants/mapConstants';
import { searchLocation } from '../../service/mapService';
import { getAllBookmarks, peekStaleBookmarks } from '../../service/apiService';
import { useNavigate } from 'react-router-dom';

const MAP_BOOKMARKS_POLL_MS = (() => {
  const n = Number(import.meta.env.VITE_MAP_BOOKMARKS_POLL_MS);
  return Number.isFinite(n) && n >= 15000 ? n : 45_000;
})();

function filterBookmarksWithCoords(bookmarksData) {
  if (!Array.isArray(bookmarksData)) return [];
  return bookmarksData.filter(
    (bookmark) =>
      bookmark.location &&
      bookmark.location.latitude &&
      bookmark.location.longitude
  );
}

function formatSyncedTime(date) {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function MapClickHandler({ onClick, isPreview, showLoginPrompt }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useMapEvents({
    click(e) {
      if (isPreview) {
        navigate('/MapView');
      } else if (!user) {
        showLoginPrompt();
      } else {
        onClick([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

export default function MapInteractive({ 
  showHeader = true, 
  showFilters = true,
  height = '100%',
  initialCenter = null,
  initialZoom = null,
  focusedBookmarkId = null,
  isPreview = false
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formPosition, setFormPosition] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const [bookmarksRefreshing, setBookmarksRefreshing] = useState(false);
  const [bookmarksError, setBookmarksError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [temporaryMarker, setTemporaryMarker] = useState(null);
  const [isPositionConfirmed, setIsPositionConfirmed] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const markerRefs = useRef({});
  const mapFetchReadyRef = useRef(false);

  const {
    selectedCategories,
    selectedTags,
    handleCategoryChange,
    handleTagChange,
    filterMarkers
  } = useMapFilters();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const stale = peekStaleBookmarks();
      const validStale = stale ? filterBookmarksWithCoords(stale) : [];
      const hasStale = validStale.length > 0;

      if (hasStale) {
        setMarkers(validStale);
        setBookmarksLoading(false);
        setBookmarksRefreshing(true);
      } else {
        setBookmarksLoading(true);
        setBookmarksRefreshing(false);
      }

      try {
        setBookmarksError(null);
        const bookmarksData = await getAllBookmarks();
        if (cancelled) return;
        setMarkers(filterBookmarksWithCoords(bookmarksData));
        setLastSyncedAt(new Date());
      } catch {
        if (!cancelled && !hasStale) {
          setBookmarksError('Error al cargar los marcadores');
        }
      } finally {
        if (!cancelled) {
          setBookmarksLoading(false);
          setBookmarksRefreshing(false);
          mapFetchReadyRef.current = true;
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isPreview) return undefined;

    const syncFromServer = () => {
      getAllBookmarks()
        .then((data) => {
          setMarkers(filterBookmarksWithCoords(data));
          setLastSyncedAt(new Date());
        })
        .catch(() => {});
    };

    const intervalId = setInterval(() => {
      if (document.visibilityState !== 'visible' || !mapFetchReadyRef.current) return;
      syncFromServer();
    }, MAP_BOOKMARKS_POLL_MS);

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && mapFetchReadyRef.current) {
        syncFromServer();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isPreview]);

  useEffect(() => {
    if (focusedBookmarkId && markers.length > 0 && mapInstance) {
      const focusedMarker = markers.find(m => m.id === focusedBookmarkId);
      if (focusedMarker) {
        const markerLatLng = [focusedMarker.location.latitude, focusedMarker.location.longitude];
        
        const popupOffset = mapInstance.getSize().x * 0.15;
        const adjustedCenter = mapInstance.layerPointToLatLng(
          mapInstance.latLngToLayerPoint(markerLatLng).add([popupOffset, 0])
        );
        
        mapInstance.setView(adjustedCenter, 15, {
          animate: true,
          duration: 1
        });

        setTimeout(() => {
          const markerRef = markerRefs.current[focusedBookmarkId];
          if (markerRef) {
            markerRef.openPopup();
          }
        }, 100);
      }
    }
  }, [focusedBookmarkId, markers, mapInstance]);

  const handleMapClick = (position) => {
    if (!user) {
      return;
    }
    setTemporaryMarker(position);
    setIsPositionConfirmed(false);
  };

  const handleMarkerDrag = (e) => {
    const newPosition = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    setTemporaryMarker(newPosition);
    setIsPositionConfirmed(false);
  };

  const handlePositionConfirm = () => {
    setFormPosition(temporaryMarker);
    setIsPositionConfirmed(true);
  };

  const handleFormSubmit = async () => {
    setFormPosition(null);
    setTemporaryMarker(null);
    setIsPositionConfirmed(false);
    try {
      const bookmarksData = await getAllBookmarks();
      setMarkers(filterBookmarksWithCoords(bookmarksData));
      setLastSyncedAt(new Date());
    } catch (err) {
    }
  };

  const handleFormCancel = () => {
    setFormPosition(null);
    setTemporaryMarker(null);
    setIsPositionConfirmed(false);
  };

  const handleSearch = async (searchValue) => {
    try {
      const coordinates = await searchLocation(searchValue);
      if (coordinates && mapInstance) {
        mapInstance.setView([coordinates.lat, coordinates.lon], 16);
      }
    } catch (error) {
    }
  };

  const handleAddMarkerClick = () => {
    if (!user) {
      showLoginPrompt();
      return;
    }
    
    if (mapInstance) {
      const center = mapInstance.getCenter();
      const position = [center.lat, center.lng];
      setTemporaryMarker(position);
      setFormPosition(position);
      setIsPositionConfirmed(true);
    }
  };

  const filteredMarkers = filterMarkers(markers);

  const showLoginPrompt = () => {
    setShowLoginAlert(true);
    setTimeout(() => setShowLoginAlert(false), 3000);
  };

  return (
    <div className="flex flex-col h-screen relative">
      {showHeader && (
        <div className="z-50">
          {user ? <HeaderLogged /> : <Header />}
        </div>
      )}
      
      <div className="flex-grow relative">
        {bookmarksError && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] alert alert-error shadow-lg max-w-md">
            <span>{bookmarksError}</span>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() => {
                setBookmarksError(null);
                setBookmarksLoading(true);
                setBookmarksRefreshing(false);
                getAllBookmarks()
                  .then((bookmarksData) => {
                    setMarkers(filterBookmarksWithCoords(bookmarksData));
                    setLastSyncedAt(new Date());
                  })
                  .catch(() => setBookmarksError('Error al cargar los marcadores'))
                  .finally(() => {
                    setBookmarksLoading(false);
                    setBookmarksRefreshing(false);
                  });
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {showLoginAlert && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] alert alert-info shadow-lg w-auto">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <span className="font-medium">Necesitas iniciar sesión para crear marcadores. </span>
                <button 
                  className="btn btn-link btn-sm pl-1 normal-case"
                  onClick={() => navigate('/login')}
                >
                  Iniciar sesión
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 z-0">
          {!user && !isPreview && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-base-100 p-4 rounded-lg shadow-lg text-center">
              <p className="text-sm mb-2">Para crear nuevos marcadores necesitas iniciar sesión</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </button>
            </div>
          )}
          
          {showFilters && (
            <>
              <SearchControl onSearch={handleSearch} />
              <MapFilters
                categories={Array.from(new Set(markers.map(m => m.category))).map(c => ({ id: c, name: c }))}
                tags={Array.from(new Set(markers.map(m => m.tag))).map(t => ({ id: t, name: t }))}
                selectedCategories={selectedCategories}
                selectedTags={selectedTags}
                onCategoryChange={handleCategoryChange}
                onTagChange={handleTagChange}
              />
              <AddMarkerButton onClick={handleAddMarkerClick} />
            </>
          )}
          <MapContainer
            center={initialCenter || DEFAULT_MAP_CENTER}
            zoom={initialZoom || DEFAULT_ZOOM}
            style={{ height: '100%', width: '100%' }}
            ref={setMapInstance}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <LocationMarker />
            <MapClickHandler 
              onClick={handleMapClick} 
              isPreview={isPreview} 
              showLoginPrompt={showLoginPrompt}
            />
            {temporaryMarker && !isPositionConfirmed && (
              <Marker
                position={temporaryMarker}
                icon={createCustomIcon('temp', 'temp')}
                draggable={true}
                eventHandlers={{
                  dragend: handleMarkerDrag
                }}
              >
                <Popup closeButton={false}>
                  <div className="flex flex-col items-center gap-2 p-2">
                    <p className="text-sm">Arrastra el marcador para ajustar la posición</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePositionConfirm();
                      }}
                      className="btn btn-primary btn-sm normal-case"
                    >
                      Confirmar ubicación
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}
            {filteredMarkers.map((marker) => (
              <Marker 
                key={marker.id} 
                position={[marker.location.latitude, marker.location.longitude]}
                icon={createCustomIcon(marker.category, marker.tag)}
                ref={(ref) => {
                  if (ref) {
                    markerRefs.current[marker.id] = ref;
                  }
                }}
              >
                <BookmarkPopup marker={marker} />
              </Marker>
            ))}
          </MapContainer>

          {bookmarksLoading && (
            <div
              className="pointer-events-none absolute bottom-20 left-1/2 z-[450] w-[min(22rem,calc(100vw-1.5rem))] -translate-x-1/2 md:bottom-24"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <div className="overflow-hidden rounded-2xl border border-base-content/10 bg-base-100/92 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md dark:border-base-content/15 dark:bg-base-100/88 dark:shadow-black/40">
                <div className="h-0.5 w-full overflow-hidden bg-primary/20">
                  <div className="h-full w-2/5 animate-bookmark-load-bar rounded-full bg-primary" />
                </div>
                <div className="flex gap-3 px-4 py-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 ring-1 ring-primary/25">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 animate-pulse text-primary"
                      aria-hidden
                    >
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-semibold tracking-tight text-base-content">
                      Cargando marcadores
                    </p>
                    <p className="mt-1 text-xs leading-snug text-base-content/65">
                      Puedes mover el mapa. Si tarda, el servidor puede estar arrancando; las visitas siguientes suelen ir más rápido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(bookmarksRefreshing || lastSyncedAt) && !bookmarksLoading && (
            <div className="pointer-events-none absolute bottom-6 right-14 z-[450] flex max-w-[min(11rem,calc(100vw-2rem))] flex-col items-stretch gap-2 md:bottom-8 md:right-16">
              {bookmarksRefreshing && (
                <div role="status" aria-live="polite">
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-base-content/10 bg-base-100/90 px-3 py-2 text-center text-xs font-medium text-base-content/80 shadow-lg backdrop-blur-md">
                    <span className="loading loading-spinner loading-xs shrink-0 text-primary" />
                    <span>Sincronizando datos…</span>
                  </div>
                </div>
              )}
              {lastSyncedAt && (
                <div
                  className="rounded-lg border border-base-content/10 bg-base-100/85 px-2.5 py-1.5 text-center shadow-md backdrop-blur-sm"
                  title="Hora de la última respuesta correcta del servidor. El mapa se vuelve a consultar en segundo plano mientras la pestaña está visible."
                >
                  <p className="text-[10px] font-medium uppercase tracking-wide text-base-content/45">
                    Datos actualizados
                  </p>
                  <p className="text-xs font-semibold tabular-nums text-base-content/80">
                    {formatSyncedTime(lastSyncedAt)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-base-content/50">
                    Auto cada {Math.round(MAP_BOOKMARKS_POLL_MS / 1000)}s
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {isPositionConfirmed && formPosition && (
          <MarkerForm
            position={formPosition}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </div>
  );
}