from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base


class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(Integer, primary_key=True, index=True)
    pnu = Column(String(32), unique=True, index=True, nullable=False)
    sido = Column(String(100), nullable=False)
    sigungu = Column(String(100), nullable=False)
    eupmyeondong = Column(String(100), nullable=False)
    jibun = Column(String(100), nullable=False)
    road_address = Column(String(255), nullable=True)
    status = Column(String(20), nullable=False, default="not_issued")
    issue_document_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
