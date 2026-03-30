#!/usr/bin/env python3
"""Seed database with African mental health and support resources."""

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models


models.Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()

try:
    
    helplines_data = [
        {
            "name": "Befrienders Kenya",
            "action": "Call +254 722 178 177",
            "description": "24/7 emotional support and crisis intervention for anyone in Kenya.",
            "resource_type": "Crisis",
            "countries": ["Kenya"],
            "available_24_7": "Yes",
        },
        {
            "name": "South African Depression and Anxiety Group (SADAG)",
            "action": "Call 011 714 4779",
            "description": "Free mental health support line in South Africa with trained counselors.",
            "resource_type": "Crisis",
            "countries": ["South Africa"],
            "available_24_7": "Yes",
        },
        {
            "name": "Nigerian Psychological Association Helpline",
            "action": "Call +234 903 456 7890",
            "description": "Mental health support and referrals for Nigerians.",
            "resource_type": "Information",
            "countries": ["Nigeria"],
            "available_24_7": "Weekdays 8am-5pm WAT",
        },
        {
            "name": "Uganda Health and Science Press",
            "action": "Call +256 414 231 006",
            "description": "Mental health information and support referrals in Uganda.",
            "resource_type": "Information",
            "countries": ["Uganda"],
            "available_24_7": "Weekdays 9am-5pm EAT",
        },
        {
            "name": "Headstrong Rwanda",
            "action": "Call +250 788 123 456",
            "description": "Mental health awareness and counseling services in Rwanda.",
            "resource_type": "Targeted",
            "countries": ["Rwanda"],
            "available_24_7": "By appointment",
        },
        {
            "name": "Lifeline Southern Africa",
            "action": "Call +27 861 322 322",
            "description": "24-hour emotional support hotline for Southern Africa region.",
            "resource_type": "Crisis",
            "countries": ["South Africa", "Botswana", "Namibia"],
            "available_24_7": "Yes",
        },
        
    ]

    for helpline_data in helplines_data:
        existing = (
            db.query(models.HelplineResource)
            .filter(models.HelplineResource.name == helpline_data["name"])
            .first()
        )
        if not existing:
            helpline = models.HelplineResource(**helpline_data)
            db.add(helpline)
    db.commit()
    print(" African helplines seeded")

    
    digital_resources_data = [
        
        {
            "title": "Insight Timer",
            "url": "https://insighttimer.com",
            "description": "Free meditation and mindfulness app with 100,000+ sessions. Works with slow internet.",
            "accessibility": ["Completely free", "Mobile app", "Low bandwidth"],
            "relevant_regions": ["Africa-wide"],
        },
        {
            "title": "Headspace Meditation",
            "url": "https://www.headspace.com",
            "description": "Meditation app. Free tier available; student discounts for African universities.",
            "accessibility": ["Free tier available", "Mobile app", "Student discounts"],
            "relevant_regions": ["Africa-wide"],
        },
        {
            "title": "7 Cups Emotional Support",
            "url": "https://www.7cups.com",
            "description": "Free emotional support chats with trained listeners. Community-based.",
            "accessibility": ["Completely free", "Web and mobile", "Chat-based"],
            "relevant_regions": ["Africa-wide"],
        },
        {
            "title": "StrongMinds (East & Southern Africa)",
            "url": "https://strongminds.org",
            "description": "Free mental health support groups for women in Uganda, Kenya, and Zambia.",
            "accessibility": ["Completely free", "In-person groups", "Community-based"],
            "relevant_regions": ["Uganda", "Kenya", "Zambia"],
        },
        {
            "title": "Mental Health Foundation UK - Resources",
            "url": "https://www.mentalhealth.org.uk",
            "description": "Free online resources, guides, and Self-care tools for mental health management.",
            "accessibility": ["Completely free", "Web-based", "Downloadable resources"],
            "relevant_regions": ["Africa-wide"],
        },
        
    ]

    for resource_data in digital_resources_data:
        existing = (
            db.query(models.DigitalResource)
            .filter(models.DigitalResource.title == resource_data["title"])
            .first()
        )
        if not existing:
            resource = models.DigitalResource(**resource_data)
            db.add(resource)
    db.commit()
    print(" Digital resources seeded")

    support_groups_data = [
        
        {
            "name": "The Circle Kigali",
            "url": "https://thecirclekigali.com/",
            "focus": "A wellness and healing space in Kigali, dedicated to mental health, community support and safe conversations.",
            "format": "In-person support groups and workshops",
            "countries": ["Rwanda"],
            "language": ["English", "Kinyarwanda"]

        },

       
        {
            "name": "SADAG Support Groups (South Africa)",
            "url": "https://www.sadag.org",
            "focus": "Support for depression, anxiety, bipolar disorder, and mental health conditions.",
            "format": "In-person groups and online",
            "countries": ["South Africa"],
            "language": ["English", "Afrikaans", "Zulu", "Xhosa"],
        },
       
        {
            "name": "African Students Online Community (ASOC)",
            "url": "https://www.africanstudents.online",
            "focus": "Mental health support community for African university students navigating education, family, and cultural pressures.",
            "format": "Online forums and peer mentoring",
            "countries": ["Kenya", "Nigeria", "South Africa", "Uganda", "Ghana", "Ethiopia"],
            "language": ["English"],
        },
        {
            "name": "Black Mental Wellness Initiative",
            "url": "https://blackmentalwellness.com",
            "focus": "Mental health resources and community support focused on Black and African diaspora.",
            "format": "Online community and resources",
            "countries": ["Across Africa and diaspora"],
            "language": ["English"],
        },
        
    ]

    for group_data in support_groups_data:
        existing = (
            db.query(models.SupportGroup)
            .filter(models.SupportGroup.name == group_data["name"])
            .first()
        )
        if not existing:
            group = models.SupportGroup(**group_data)
            db.add(group)
    db.commit()
    print(" Support groups seeded")

    print("\n African resources database seeding complete!")

finally:
    db.close()
