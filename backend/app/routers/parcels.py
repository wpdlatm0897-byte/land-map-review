from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Parcel
from app.schemas import ParcelCreate, ParcelRead

router = APIRouter()


@router.get("", response_model=list[ParcelRead])
def list_parcels(db: Session = Depends(get_db)):
    rows = db.query(Parcel).order_by(Parcel.id.desc()).all()
    return rows


@router.get("/{pnu}", response_model=ParcelRead)
def get_parcel(pnu: str, db: Session = Depends(get_db)):
    row = db.query(Parcel).filter(Parcel.pnu == pnu).first()
    if not row:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return row


@router.post("", response_model=ParcelRead)
def upsert_parcel(payload: ParcelCreate, db: Session = Depends(get_db)):
    row = db.query(Parcel).filter(Parcel.pnu == payload.pnu).first()

    if row:
        row.sido = payload.sido
        row.sigungu = payload.sigungu
        row.eupmyeondong = payload.eupmyeondong
        row.jibun = payload.jibun
        row.road_address = payload.road_address
    else:
        row = Parcel(**payload.model_dump())
        db.add(row)

    db.commit()
    db.refresh(row)
    return row
