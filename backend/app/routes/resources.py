from fastapi import APIRouter, Depends, Query
from typing import Optional, List
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter()


@router.get("/helplines")
def list_helplines(
    country: Optional[str] = Query(None),
    resource_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
   
    query = db.query(models.HelplineResource)
    
    if country:
        
        query = query.filter(models.HelplineResource.countries.contains([country]))
    
    if resource_type:
        query = query.filter(models.HelplineResource.resource_type == resource_type)
    
    helplines = query.all()
    return [schemas.HelplineResourceResponse.model_validate(h) for h in helplines]


@router.get("/digital-resources")
def list_digital_resources(
    region: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
   
    query = db.query(models.DigitalResource)
    
    if region:
        query = query.filter(models.DigitalResource.relevant_regions.contains([region]))
    
    resources = query.all()
    return [schemas.DigitalResourceResponse.model_validate(r) for r in resources]


@router.get("/support-groups")
def list_support_groups(
    country: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    
    query = db.query(models.SupportGroup)
    
    if country:
        query = query.filter(models.SupportGroup.countries.contains([country]))
    
    if language:
        query = query.filter(models.SupportGroup.language.contains([language]))
    
    groups = query.all()
    return [schemas.SupportGroupResponse.model_validate(g) for g in groups]
