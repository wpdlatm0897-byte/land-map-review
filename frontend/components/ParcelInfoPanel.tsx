"use client";

import { launchIssue, markPending, saveParcel } from "@/lib/api";

export default function ParcelInfoPanel({
  parcel,
  onRefresh,
}: {
  parcel: any;
  onRefresh: () => Promise<void>;
}) {
  if (!parcel) {
    return (
      <div className="panel">
        <h2>선택 필지</h2>
        <p>지도에서 필지를 클릭해라.</p>
      </div>
    );
  }

  const fullAddress =
    parcel.road_address ||
    `${parcel.sido} ${parcel.sigungu} ${parcel.eupmyeondong} ${parcel.jibun}`;

  const handleRegister = async () => {
    await saveParcel({
      pnu: parcel.pnu,
      sido: parcel.sido,
      sigungu: parcel.sigungu,
      eupmyeondong: parcel.eupmyeondong,
      jibun: parcel.jibun,
      road_address: fullAddress,
    });
    await onRefresh();
    alert("대기목록에 저장했다.");
  };

  const handleIssue = async () => {
    await saveParcel({
      pnu: parcel.pnu,
      sido: parcel.sido,
      sigungu: parcel.sigungu,
      eupmyeondong: parcel.eupmyeondong,
      jibun: parcel.jibun,
      road_address: fullAddress,
    });

    await markPending(parcel.pnu);

    await launchIssue({
      pnu: parcel.pnu,
      address: fullAddress,
      jibun: parcel.jibun,
    });

    await onRefresh();
    alert("정부24 자동화 창을 열었다. 로그인은 직접 하고 Enter 치면 자동 입력이 진행된다.");
  };

  return (
    <div className="panel">
      <h2 style={{ marginTop: 0 }}>선택 필지</h2>

      <div style={{ display: "grid", gap: 10 }}>
        <div><b>PNU</b>: {parcel.pnu}</div>
        <div><b>주소</b>: {fullAddress}</div>
        <div><b>지번</b>: {parcel.jibun}</div>
        <div>
          <b>상태</b>:{" "}
          <span className={`badge ${parcel.status || "not_issued"}`}>
            {parcel.status || "not_issued"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={handleRegister}>대기목록 저장</button>
        <button onClick={handleIssue}>발급 진행</button>
      </div>
    </div>
  );
}
