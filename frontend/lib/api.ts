const API_BASE = "http://localhost:8000/api";

export type Parcel = {
  id?: number;
  pnu: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  jibun: string;
  road_address?: string | null;
  status: "not_issued" | "pending" | "issued" | "failed";
  issue_document_url?: string | null;
};

export async function listParcels(): Promise<Parcel[]> {
  const res = await fetch(`${API_BASE}/parcels`, { cache: "no-store" });
  if (!res.ok) throw new Error("필지 목록 조회 실패");
  return res.json();
}

export async function saveParcel(payload: Omit<Parcel, "id" | "status" | "issue_document_url">) {
  const res = await fetch(`${API_BASE}/parcels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("필지 저장 실패");
  return res.json();
}

export async function markPending(pnu: string) {
  const res = await fetch(`${API_BASE}/issued/${pnu}/mark-pending`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("상태 변경 실패");
  return res.json();
}

export async function markIssued(pnu: string) {
  const res = await fetch(`${API_BASE}/issued/${pnu}/mark-issued`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("발급 완료 처리 실패");
  return res.json();
}

export async function markFailed(pnu: string) {
  const res = await fetch(`${API_BASE}/issued/${pnu}/mark-failed`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("실패 처리 실패");
  return res.json();
}

export async function launchIssue(payload: {
  pnu: string;
  address: string;
  jibun: string;
}) {
  const res = await fetch(`${API_BASE}/automation/launch-issue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("자동화 실행 실패");
  return res.json();
}
