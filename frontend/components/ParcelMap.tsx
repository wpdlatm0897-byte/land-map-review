"use client";

import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import type { Parcel } from "@/lib/api";

type ParcelFeatureProperties = {
  pnu: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  jibun: string;
  road_address?: string;
  status?: "not_issued" | "pending" | "issued" | "failed";
};

function getFillColor(status: string) {
  if (status === "issued") return "rgba(34,197,94,0.45)";
  if (status === "pending") return "rgba(234,179,8,0.45)";
  if (status === "failed") return "rgba(239,68,68,0.45)";
  return "rgba(59,130,246,0.20)";
}

export default function ParcelMap({
  geojson,
  parcelStatuses,
  onParcelClick,
}: {
  geojson: any;
  parcelStatuses: Parcel[];
  onParcelClick: (props: ParcelFeatureProperties) => void;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const sourceGeojson = JSON.parse(JSON.stringify(geojson));

    const statusMap = new Map(parcelStatuses.map((p) => [p.pnu, p.status]));
    sourceGeojson.features = sourceGeojson.features.map((feature: any) => ({
      ...feature,
      properties: {
        ...feature.properties,
        status: statusMap.get(feature.properties.pnu) ?? feature.properties.status ?? "not_issued",
      },
    }));

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(sourceGeojson, {
        featureProjection: "EPSG:3857",
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) =>
        new Style({
          fill: new Fill({
            color: getFillColor(feature.get("status") || "not_issued"),
          }),
          stroke: new Stroke({
            color: "#111827",
            width: 1,
          }),
        }),
    });

    const olMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([126.978, 37.5665]),
        zoom: 17,
      }),
    });

    olMap.on("singleclick", (evt) => {
      let clicked = false;
      olMap.forEachFeatureAtPixel(evt.pixel, (feature) => {
        clicked = true;
        onParcelClick({
          pnu: feature.get("pnu"),
          sido: feature.get("sido"),
          sigungu: feature.get("sigungu"),
          eupmyeondong: feature.get("eupmyeondong"),
          jibun: feature.get("jibun"),
          road_address: feature.get("road_address"),
          status: feature.get("status"),
        });
      });

      if (!clicked) {
        // no-op
      }
    });

    return () => {
      olMap.setTarget(undefined);
    };
  }, [geojson, parcelStatuses, onParcelClick]);

  return <div className="panel" ref={mapRef} style={{ width: "100%", height: "80vh" }} />;
}
