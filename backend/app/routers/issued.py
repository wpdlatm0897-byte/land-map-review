from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Parcel

router = APIRouter()


@router.post("/{pnu}/mark-issued")
def mark_issued(
    pnu: str,
    document_url: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    row = db.query(Parcel).filter(Parcel.pnu == pnu).first()
    if not row:
        raise HTTPException(status_code=404, detail="Parcel not found")

    row.status = "issued"
    row.issue_document_url = document_url
    db.commit()

    return {"ok": True, "pnu": pnu, "status": row.status}


@router.post("/{pnu}/mark-pending")
def mark_pending(pnu: str, db: Session = Depends(get_db)):
    row = db.query(Parcel).filter(Parcel.pnu == pnu).first()
    if not row:
        raise HTTPException(status_code=404, detail="Parcel not found")

    row.status = "pending"
    db.commit()

    return {"ok": True, "pnu": pnu, "status": row.status}


@router.post("/{pnu}/mark-failed")
def mark_failed(pnu: str, db: Session = Depends(get_db)):
    row = db.query(Parcel).filter(Parcel.pnu == pnu).first()
    if not row:
        raise HTTPException(status_code=404, detail="Parcel not found")

    row.status = "failed"
    db.commit()

    return {"ok": True, "pnu": pnu, "status": row.status}
