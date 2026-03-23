from pydantic import BaseModel
from typing import Optional


class ParcelBase(BaseModel):
    pnu: str
    sido: str
    sigungu: str
    eupmyeondong: str
    jibun: str
    road_address: Optional[str] = None


class ParcelCreate(ParcelBase):
    pass


class ParcelUpdateStatus(BaseModel):
    status: str
    issue_document_url: Optional[str] = None


class ParcelRead(ParcelBase):
    id: int
    status: str
    issue_document_url: Optional[str] = None

    class Config:
        from_attributes = True


class LaunchIssueRequest(BaseModel):
    pnu: str
    address: str
    jibun: str
