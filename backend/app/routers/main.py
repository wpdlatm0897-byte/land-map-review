from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, SessionLocal
from app.models import Base, Parcel
from app.seed_data import SAMPLE_PARCELS
from app.routers import parcels, issued, automation

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Parcel Ledger API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def seed_if_empty():
    db: Session = SessionLocal()
    try:
        count = db.query(Parcel).count()
        if count == 0:
            for item in SAMPLE_PARCELS:
                db.add(Parcel(**item))
            db.commit()
    finally:
        db.close()


seed_if_empty()

app.include_router(parcels.router, prefix="/api/parcels", tags=["parcels"])
app.include_router(issued.router, prefix="/api/issued", tags=["issued"])
app.include_router(automation.router, prefix="/api/automation", tags=["automation"])


@app.get("/")
def root():
    return {"message": "Parcel Ledger API is running"}
