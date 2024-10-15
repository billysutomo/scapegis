import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Draw } from 'ol/interaction';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';

export default class MapManager {
  private static instance: MapManager | null = null;
  private map: Map | null = null;
  private vectorSource: VectorSource | null = null;
  private vectorLayer: VectorLayer | null = null;
  private draw: Draw | null = null;

  private constructor(targetRef: React.MutableRefObject<HTMLDivElement | null>) {
    if (targetRef.current) {
      this.initMap(targetRef.current);
    } else {
      console.error("Map target element is not available.");
    }
  }

  public static getInstance(targetRef: React.MutableRefObject<HTMLDivElement | null>): MapManager {
    if (!MapManager.instance) {
      MapManager.instance = new MapManager(targetRef); // Create an instance if it doesn't exist
    }
    return MapManager.instance;
  }

  private initMap(target: HTMLElement) {
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });

    this.map = new Map({
      target,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        this.vectorLayer, // Add vector layer to the map
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });
  }

  public addDrawInteraction() {
    if (!this.map || !this.vectorSource) return;

    const draw = new Draw({
      source: this.vectorSource,
      type: 'Polygon',
    });

    this.map.addInteraction(draw);

    draw.on('drawend', (event) => {
      const feature = event.feature;
      console.log('Polygon drawn:', feature);
    });
    this.draw = draw;
  }

  public removeDrawInteraction() {
    if (this.draw) {
      this.map?.removeInteraction(this.draw);
    }
  }

  public setView(center: [number, number], zoom: number) {
    if (this.map) {
      this.map.setView(new View({
        center: fromLonLat(center),
        zoom,
      }));
    }
  }

  public getMap() {
    return this.map;
  }

  public addOverlay(overlay: Overlay) {
    if (this.map) {
      this.map.addOverlay(overlay);
    }
  }
}
