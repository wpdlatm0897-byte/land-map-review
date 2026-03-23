"use client";

import { useCallback, useEffect, useState } from "react";
import ParcelMap from "@/components/ParcelMap";
import ParcelInfoPanel from "@/components/ParcelInfoPanel";
import QueuePanel from "@/components/QueuePanel";
import { listParcels, type Parcel } from "@/lib/api";

export default function HomePage() {
  const [geojson, setGeojson] = useState<any>(null);
  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const [parcelStatuses, setParcelStatuses] = useState<Parcel[]>([]);

  const refresh = useCallback(async () => {
    const rows = await listParcels();
    setParcelStatuses(rows);

    if (selectedParcel) {
      const found = rows.find((r) => r.pnu === selectedParcel.pnu);
      if (found) {
        setSelectedParcel({
          ...selectedParcel,
          status: found.status,
        });
      }
    }
  }, [selectedParcel]);

  useEffect(() => {
    fetch("/sample-parcels.geojson")
      .then((res) => res.json())
      .then((data) => setGeojson(data));

    refresh().catch(console.error);
  }, [refresh]);

  if (!geojson) {
    return <main style={{ padding: 20 }}>지도 데이터 로딩 중...</main>;
  }

  return (
    <main>
      <div style={{ padding: 20, paddingBottom: 0 }}>
        <h1 style={{ margin: 0 }}>필지별 토지대장 발급 보조 시스템</h1>
        <p style={{ color: "#4b5563" }}>
          지도에서 필지를 선택하고, 대기목록 저장 또는 발급 진행을 할 수 있다.
        </p>
      </div>

      <div className="layout">
        <ParcelMap
          geojson={geojson}
          parcelStatuses={parcelStatuses}
          onParcelClick={(props) => {
            const found = parcelStatuses.find((x) => x.pnu === props.pnu);
            setSelectedParcel({
              ...props,
              status: found?.status ?? props.status ?? "not_issued",
            });
          }}
        />

        <div className="side-stack">
          <ParcelInfoPanel parcel={selectedParcel} onRefresh={refresh} />
          <QueuePanel items={parcelStatuses} onRefresh={refresh} />
        </div>
      </div>
    </main>
  );
}
