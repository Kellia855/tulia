from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.database import engine, Base
from app.routes import auth, checkins, reflections, vocab, resources


load_dotenv()


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TULIA API",
    description="Emotional Literacy Platform for University Students",
    version="1.0.0"
)

# CORS configuration
default_origin = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
extra_origins = os.getenv("FRONTEND_URLS", "")
origins = {
    default_origin,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
}

if extra_origins:
    for origin in extra_origins.split(","):
        cleaned = origin.strip().rstrip("/")
        if cleaned:
            origins.add(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(origins),
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(checkins.router, prefix="/api/checkins", tags=["Check-ins"])
app.include_router(reflections.router, prefix="/api/reflections", tags=["Reflections"])
app.include_router(vocab.router, prefix="/api/vocab", tags=["Vocabulary"])
app.include_router(resources.router, prefix="/api/resources", tags=["Resources"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to TULIA API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/seed")
def seed_database():
    """Seed the database with vocabulary and resources data from original seed scripts"""
    try:
        from app.database import SessionLocal
        from app import models
        
        db = SessionLocal()
        
       
        learning_guides_data = [
            {
                "category": "Joyful",
                "body_signals": ["Lightness in the chest", "Smiling or energized posture", "Warmth and openness"],
                "likely_triggers": ["Achievement or progress", "Meaningful connection", "Positive feedback"],
                "signal_meaning": "Something valuable is present. Joy signals what to repeat and protect.",
                "underlying_needs": ["Celebration", "Connection", "Purpose"],
                "helpful_reactions": ["Savor the moment for 20 seconds", "Share gratitude with someone", "Use this energy on a meaningful task"],
                "unhelpful_reactions": ["Ignoring the moment completely", "Overcommitting from excitement", "Comparing your joy to others"],
                "healthy_next_step": "Write one sentence about what created this feeling so you can intentionally repeat it.",
                "reflection_prompt": "What helped this feeling grow today, and how can you repeat it this week?",
            },
            {
                "category": "Peaceful",
                "body_signals": ["Slow breathing", "Relaxed shoulders", "Steady attention"],
                "likely_triggers": ["Quiet environment", "Completion of tasks", "Emotional safety"],
                "signal_meaning": "Your system feels safe enough to rest and integrate.",
                "underlying_needs": ["Rest", "Stability", "Balance"],
                "helpful_reactions": ["Protect your boundaries", "Anchor with a short calming routine", "Use the calm window for planning"],
                "unhelpful_reactions": ["Filling all available time with tasks", "Dismissing rest as laziness", "Staying in avoidance mode"],
                "healthy_next_step": "Set one small boundary that protects your calm for the next 24 hours.",
                "reflection_prompt": "What conditions made this calm possible, and what boundary keeps it protected?",
            },
            {
                "category": "Powerful",
                "body_signals": ["Focused attention", "Strong posture", "Motivation to act"],
                "likely_triggers": ["Preparedness", "Supportive feedback", "Clear goals"],
                "signal_meaning": "You are ready to act. This emotion signals capacity and agency.",
                "underlying_needs": ["Autonomy", "Competence", "Momentum"],
                "helpful_reactions": ["Channel energy into one specific action", "Break goals into first steps", "Track and celebrate small wins"],
                "unhelpful_reactions": ["Overconfidence without planning", "Taking on everything at once", "Ignoring recovery needs"],
                "healthy_next_step": "Use this momentum on one high-priority task within the next hour.",
                "reflection_prompt": "Where can you direct this energy so it supports your priorities this week?",
            },
            {
                "category": "Sad",
                "body_signals": ["Low energy", "Tight throat or heavy chest", "Withdrawal from activities"],
                "likely_triggers": ["Loss or disappointment", "Disconnection", "Overload without support"],
                "signal_meaning": "Something meaningful feels lost or unmet; sadness signals a need for care and connection.",
                "underlying_needs": ["Comfort", "Validation", "Belonging"],
                "helpful_reactions": ["Name what hurts directly", "Seek gentle support", "Lower demands temporarily"],
                "unhelpful_reactions": ["Total isolation", "Harsh self-criticism", "Pretending you are fine when not"],
                "healthy_next_step": "Send one honest message to a trusted person about how you are feeling.",
                "reflection_prompt": "What are you grieving or missing right now, and what would feel supportive today?",
            },
            {
                "category": "Fearful",
                "body_signals": ["Racing thoughts", "Fast heartbeat", "Restlessness or avoidance"],
                "likely_triggers": ["Uncertainty", "Evaluation pressure", "Conflict or risk"],
                "signal_meaning": "Your system perceives possible threat and asks for safety and clarity.",
                "underlying_needs": ["Safety", "Predictability", "Reassurance"],
                "helpful_reactions": ["Separate facts from fears", "Choose one controllable action", "Regulate body before decisions"],
                "unhelpful_reactions": ["Catastrophizing", "Endless reassurance checking", "Avoiding all uncertainty"],
                "healthy_next_step": "Take a 2-minute breathing reset and write one controllable next action.",
                "reflection_prompt": "What part is uncertain, and what one concrete step can you control next?",
            },
            {
                "category": "Angry",
                "body_signals": ["Heat or tension", "Jaw or shoulder tightness", "Urge to react quickly"],
                "likely_triggers": ["Boundary violations", "Unfairness", "Blocked goals"],
                "signal_meaning": "A boundary, value, or expectation feels crossed. Anger signals protection and action needs.",
                "underlying_needs": ["Respect", "Fairness", "Agency"],
                "helpful_reactions": ["Pause before responding", "Name the boundary clearly", "Communicate assertively and specifically"],
                "unhelpful_reactions": ["Explosive reactions", "Passive-aggressive silence", "Rumination without action"],
                "healthy_next_step": 'Draft a calm boundary statement: "When X happens, I need Y."',
                "reflection_prompt": "Which boundary feels crossed, and how can you communicate it clearly without escalation?",
            },
        ]
        
        for guide_data in learning_guides_data:
            existing = db.query(models.LearningGuide).filter(models.LearningGuide.category == guide_data["category"]).first()
            if not existing:
                db.add(models.LearningGuide(**guide_data))
        db.commit()
        
        quiz_scenarios_data = [
            {"scenario_id": "deadline-1", "title": "Night Before Deadline", "situation": "You have two assignments due tomorrow. Your heart is racing and your thoughts keep jumping to worst-case outcomes.", "options": ["Excited", "Anxious", "Grateful", "Peaceful"], "correct_emotion": "Anxious", "explanation": "Anxiety often includes threat-focused thoughts and body activation. The signal here is uncertainty and a need for structure/safety."},
            {"scenario_id": "groupchat-1", "title": "Friends Made Plans Without You", "situation": "You saw pictures in the group chat from an outing you were not invited to. You feel a heavy ache and keep replaying it.", "options": ["Lonely", "Rejected", "Bored", "Proud"], "correct_emotion": "Rejected", "explanation": "Lonely is missing connection in general, while rejected includes feeling specifically excluded or not being chosen."},
            {"scenario_id": "exam-week-1", "title": "Week 10 Exhaustion", "situation": "For several weeks you have felt drained, detached from classes, and less effective despite trying harder.", "options": ["Overwhelmed", "Burned out", "Motivated", "Calm"], "correct_emotion": "Burned out", "explanation": "Overwhelm is usually acute and short-term. Burned out is a prolonged pattern of depletion, detachment, and reduced effectiveness."},
            {"scenario_id": "presentation-1", "title": "Nailed the Presentation", "situation": "You just finished presenting to the class and got positive feedback. You feel a sense of relief mixed with pride.", "options": ["Grateful", "Confident", "Relieved", "All of these"], "correct_emotion": "All of these", "explanation": "Complex emotions often blend. Relief (uncertainty resolved), confidence (capability), and gratitude (positive reception) can coexist in one moment."},
            {"scenario_id": "project-failure-1", "title": "Group Project Disaster", "situation": "A teammate didn't finish their part of the group project. Everyone's grades are affected because of their unreliability. You feel your face getting hot and clenched fists.", "options": ["Frustrated", "Angry", "Disappointed", "Betrayed"], "correct_emotion": "Angry", "explanation": "Anger specifically signals a boundary violation or unfairness. Here, you feel disrespected and let down by broken commitments."},
            {"scenario_id": "breakup-1", "title": "After the Breakup", "situation": "Three months after breaking up, you still feel empty most days. You see your ex around campus and the sadness comes rushing back.", "options": ["Grief", "Sadness", "Loneliness", "All of these"], "correct_emotion": "All of these", "explanation": "Loss activates grief (something valued is gone), sadness (the emotional weight), and loneliness (missing that person specifically)."},
            {"scenario_id": "social-event-1", "title": "Walked into the Wrong Room", "situation": "You confidently walked into what you thought was your study group meeting, but it was a group of people you don't know. Now you're embarrassed and want to leave immediately.", "options": ["Ashamed", "Embarrassed", "Anxious", "Confident"], "correct_emotion": "Embarrassed", "explanation": "Embarrassment is about a social misstep affecting how others see you. Shame is deeper (about who you are), and anxiety is about threat."},
            {"scenario_id": "good-grade-1", "title": "Got an Unexpected A", "situation": "You studied hard but weren't sure about the exam. When your grade came back as an A, you felt light, celebrated with friends, and the whole day felt brighter.", "options": ["Pride", "Joy", "Relief", "All of these"], "correct_emotion": "All of these", "explanation": "Success triggers pride (your effort paid off), joy (positive energy), and relief (the uncertainty is resolved)."},
            {"scenario_id": "family-conflict-1", "title": "Parent Disappointed in Your Major", "situation": "Your parent just said they are disappointed with your major choice and questioned if you'll have a 'real career.' You feel the sting of that judgment.", "options": ["Hurt", "Defensive", "Misunderstood", "Disappointed"], "correct_emotion": "Hurt", "explanation": "Hurt signals emotional pain from someone whose opinion matters. It combines disappointment with the sting of judgment."},
            {"scenario_id": "triumph-1", "title": "Made the Team", "situation": "You made the sports team after trying out for the first time. You feel strong, capable, and ready to tackle the season ahead.", "options": ["Empowered", "Confident", "Determined", "All of these"], "correct_emotion": "All of these", "explanation": "Being chosen activates empowerment (proving capability), confidence (belief in yourself), and determination (motivation to succeed)."},
            {"scenario_id": "lost-item-1", "title": "Lost Your Wallet", "situation": "You can't find your wallet anywhere and your important documents are in it. Your mind keeps jumping to what ifs and catastrophes.", "options": ["Stressed", "Panicked", "Worried", "Anxious"], "correct_emotion": "Anxious", "explanation": "Anxiety is characterized by elevated threat perception and racing thoughts. Panic is more acute terror; stress is general overwhelm."},
        ]
        
        for scenario_data in quiz_scenarios_data:
            existing = db.query(models.QuizScenario).filter(models.QuizScenario.scenario_id == scenario_data["scenario_id"]).first()
            if not existing:
                db.add(models.QuizScenario(**scenario_data))
        db.commit()
        
     
        discrimination_exercises_data = [
            {"left_emotion": "Anxious", "right_emotion": "Excited", "key_difference": "Both feel high energy. Anxiety predicts threat; excitement predicts opportunity.", "quick_check": 'Ask: "Am I expecting danger, or possibility?"'},
            {"left_emotion": "Lonely", "right_emotion": "Rejected", "key_difference": "Lonely is absence of connection. Rejected adds a sense of personal exclusion or not being wanted.", "quick_check": 'Ask: "Do I need more connection, or am I processing a specific exclusion?"'},
            {"left_emotion": "Overwhelmed", "right_emotion": "Burned out", "key_difference": "Overwhelmed is acute overload right now. Burned out is chronic depletion over time.", "quick_check": 'Ask: "Is this a temporary spike, or have I felt drained for weeks?"'},
        ]
        
        for exercise_data in discrimination_exercises_data:
            existing = db.query(models.DiscriminationExercise).filter(models.DiscriminationExercise.left_emotion == exercise_data["left_emotion"]).first()
            if not existing:
                db.add(models.DiscriminationExercise(**exercise_data))
        db.commit()
        
       
        body_signal_activities_data = [
            {"signal": "Your chest feels tight; thoughts race to worst outcomes", "correct_emotions": ["Anxious", "Fearful", "Overwhelmed"], "incorrect_emotions": ["Joyful", "Peaceful", "Grateful"]},
            {"signal": "Warmth in your chest, smiling without effort, lightness in your shoulders", "correct_emotions": ["Joyful", "Grateful", "Hopeful"], "incorrect_emotions": ["Sad", "Angry", "Fearful"]},
            {"signal": "Heat rising, jaw clenched, urge to defend or respond", "correct_emotions": ["Angry", "Frustrated", "Irritated"], "incorrect_emotions": ["Peaceful", "Calm", "Content"]},
            {"signal": "Heaviness in your chest, slow movements, withdrawal from activity", "correct_emotions": ["Sad", "Melancholy", "Disheartened"], "incorrect_emotions": ["Empowered", "Determined", "Confident"]},
        ]
        
        for activity_data in body_signal_activities_data:
            existing = db.query(models.BodySignalActivity).filter(models.BodySignalActivity.signal == activity_data["signal"]).first()
            if not existing:
                db.add(models.BodySignalActivity(**activity_data))
        db.commit()
        
      
        reflection_prompt_activities_data = [
            {"prompt": "When do you feel most peaceful?", "hints": ["Think about a time when your body felt calm", "What were you doing, and who was around?", "What boundaries or conditions made that possible?"], "key_points": ["Identify your peace triggers", "Recognize patterns", "Protect those conditions"]},
            {"prompt": "What does frustrated feel like in your body?", "hints": ["Notice the physical sensations", "What happened right before?", "What boundary or need was crossed?"], "key_points": ["Body awareness improves emotional clarity", "Frustration signals needs", "Action often helps"]},
        ]
        
        for prompt_data in reflection_prompt_activities_data:
            existing = db.query(models.ReflectionPromptActivity).filter(models.ReflectionPromptActivity.prompt == prompt_data["prompt"]).first()
            if not existing:
                db.add(models.ReflectionPromptActivity(**prompt_data))
        db.commit()
        
       
        helplines_data = [
            {"name": "Befrienders Kenya", "action": "Call +254 722 178 177", "description": "24/7 emotional support and crisis intervention for anyone in Kenya.", "resource_type": "Crisis", "countries": ["Kenya"], "available_24_7": "Yes"},
            {"name": "South African Depression and Anxiety Group (SADAG)", "action": "Call 011 714 4779", "description": "Free mental health support line in South Africa with trained counselors.", "resource_type": "Crisis", "countries": ["South Africa"], "available_24_7": "Yes"},
            {"name": "Nigerian Psychological Association Helpline", "action": "Call +234 903 456 7890", "description": "Mental health support and referrals for Nigerians.", "resource_type": "Information", "countries": ["Nigeria"], "available_24_7": "Weekdays 8am-5pm WAT"},
            {"name": "Uganda Health and Science Press", "action": "Call +256 414 231 006", "description": "Mental health information and support referrals in Uganda.", "resource_type": "Information", "countries": ["Uganda"], "available_24_7": "Weekdays 9am-5pm EAT"},
            {"name": "Headstrong Rwanda", "action": "Call +250 788 123 456", "description": "Mental health awareness and counseling services in Rwanda.", "resource_type": "Targeted", "countries": ["Rwanda"], "available_24_7": "By appointment"},
            {"name": "Lifeline Southern Africa", "action": "Call +27 861 322 322", "description": "24-hour emotional support hotline for Southern Africa region.", "resource_type": "Crisis", "countries": ["South Africa", "Botswana", "Namibia"], "available_24_7": "Yes"},
        ]
        
        for helpline_data in helplines_data:
            existing = db.query(models.HelplineResource).filter(models.HelplineResource.name == helpline_data["name"]).first()
            if not existing:
                db.add(models.HelplineResource(**helpline_data))
        db.commit()
        
       
        digital_resources_data = [
            {"title": "Insight Timer", "url": "https://insighttimer.com", "description": "Free meditation and mindfulness app with 100,000+ sessions. Works with slow internet.", "accessibility": ["Completely free", "Mobile app", "Low bandwidth"], "relevant_regions": ["Africa-wide"]},
            {"title": "Headspace Meditation", "url": "https://www.headspace.com", "description": "Meditation app. Free tier available; student discounts for African universities.", "accessibility": ["Free tier available", "Mobile app", "Student discounts"], "relevant_regions": ["Africa-wide"]},
            {"title": "7 Cups Emotional Support", "url": "https://www.7cups.com", "description": "Free emotional support chats with trained listeners. Community-based.", "accessibility": ["Completely free", "Web and mobile", "Chat-based"], "relevant_regions": ["Africa-wide"]},
            {"title": "StrongMinds (East & Southern Africa)", "url": "https://strongminds.org", "description": "Free mental health support groups for women in Uganda, Kenya, and Zambia.", "accessibility": ["Completely free", "In-person groups", "Community-based"], "relevant_regions": ["Uganda", "Kenya", "Zambia"]},
            {"title": "Mental Health Foundation UK - Resources", "url": "https://www.mentalhealth.org.uk", "description": "Free online resources, guides, and Self-care tools for mental health management.", "accessibility": ["Completely free", "Web-based", "Downloadable resources"], "relevant_regions": ["Africa-wide"]},
        ]
        
        for resource_data in digital_resources_data:
            existing = db.query(models.DigitalResource).filter(models.DigitalResource.title == resource_data["title"]).first()
            if not existing:
                db.add(models.DigitalResource(**resource_data))
        db.commit()
      
        support_groups_data = [
            {"name": "The Circle Kigali", "url": "https://thecirclekigali.com/", "focus": "A wellness and healing space in Kigali, dedicated to mental health, community support and safe conversations.", "format": "In-person support groups and workshops", "countries": ["Rwanda"], "language": ["English", "Kinyarwanda"]},
            {"name": "SADAG Support Groups (South Africa)", "url": "https://www.sadag.org", "focus": "Support for depression, anxiety, bipolar disorder, and mental health conditions.", "format": "In-person groups and online", "countries": ["South Africa"], "language": ["English", "Afrikaans", "Zulu", "Xhosa"]},
            {"name": "African Students Online Community (ASOC)", "url": "https://www.africanstudents.online", "focus": "Mental health support community for African university students navigating education, family, and cultural pressures.", "format": "Online forums and peer mentoring", "countries": ["Kenya", "Nigeria", "South Africa", "Uganda", "Ghana", "Ethiopia"], "language": ["English"]},
            {"name": "Black Mental Wellness Initiative", "url": "https://blackmentalwellness.com", "focus": "Mental health resources and community support focused on Black and African diaspora.", "format": "Online community and resources", "countries": ["Across Africa and diaspora"], "language": ["English"]},
        ]
        
        for group_data in support_groups_data:
            existing = db.query(models.SupportGroup).filter(models.SupportGroup.name == group_data["name"]).first()
            if not existing:
                db.add(models.SupportGroup(**group_data))
        db.commit()
        
        db.close()
        return {
            "status": "success",
            "message": "Database seeded successfully!",
            "learning_guides": len(learning_guides_data),
            "quiz_scenarios": len(quiz_scenarios_data),
            "discrimination_exercises": len(discrimination_exercises_data),
            "body_signal_activities": len(body_signal_activities_data),
            "reflection_prompts": len(reflection_prompt_activities_data),
            "helplines": len(helplines_data),
            "digital_resources": len(digital_resources_data),
            "support_groups": len(support_groups_data),
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/debug/schema")
def get_schema():
    
    try:
        from sqlalchemy import inspect
        inspector = inspect(engine)
        
        users_columns = inspector.get_columns('users')
        column_names = [col['name'] for col in users_columns]
        
        return {
            "table": "users",
            "columns": column_names,
            "has_created_at": "created_at" in column_names,
            "has_last_login": "last_login" in column_names
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
