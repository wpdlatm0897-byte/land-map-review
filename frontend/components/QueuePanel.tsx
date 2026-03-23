"use client";

import { markFailed, markIssued, type Parcel } from "@/lib/api";

export default function QueuePanel({
  items,
  onRefresh,
}: {
  items: Parcel[];
  onRefresh: () => Promise<void>;
}) {
  return (
    <div className="panel">
      <h2 style={{ marginTop: 0 }}>발급 대기 / 결과 목록</h2>

      <div className="list">
        {items.length === 0 && <div>저장된 필지가 없다.</div>}

        {items.map((item) => (
          <div key={item.pnu} className="list-item">
            <div style={{ fontWeight: 700 }}>{item.road_address || `${item.sido} ${item.sigungu} ${item.eupmyeondong} ${item.jibun}`}</div>
            <div style={{ fontSize: 13, color: "#4b5563", marginTop: 6 }}>
              PNU: {item.pnu}
            </div>
            <div style={{ marginTop: 8 }}>
              <span className={`badge ${item.status}`}>{item.status}</span>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                onClick={async () => {
                  await markIssued(item.pnu);
                  await onRefresh();
                }}
              >
                발급 완료 처리
              </button>

              <button
                onClick={async () => {
                  await markFailed(item.pnu);
                  await onRefresh();
                }}
              >
                실패 처리
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
