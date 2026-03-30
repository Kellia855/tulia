#!/usr/bin/env python3
"""Seed database with hardcoded vocabulary content data."""

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models


models.Base.metadata.create_all(bind=engine)

db: Session = SessionLocal()

try:
    # Learning Guides
    learning_guides_data = [
        {
            "category": "Joyful",
            "body_signals": [
                "Lightness in the chest",
                "Smiling or energized posture",
                "Warmth and openness",
            ],
            "likely_triggers": [
                "Achievement or progress",
                "Meaningful connection",
                "Positive feedback",
            ],
            "signal_meaning": "Something valuable is present. Joy signals what to repeat and protect.",
            "underlying_needs": ["Celebration", "Connection", "Purpose"],
            "helpful_reactions": [
                "Savor the moment for 20 seconds",
                "Share gratitude with someone",
                "Use this energy on a meaningful task",
            ],
            "unhelpful_reactions": [
                "Ignoring the moment completely",
                "Overcommitting from excitement",
                "Comparing your joy to others",
            ],
            "healthy_next_step": "Write one sentence about what created this feeling so you can intentionally repeat it.",
            "reflection_prompt": "What helped this feeling grow today, and how can you repeat it this week?",
        },
        {
            "category": "Peaceful",
            "body_signals": [
                "Slow breathing",
                "Relaxed shoulders",
                "Steady attention",
            ],
            "likely_triggers": [
                "Quiet environment",
                "Completion of tasks",
                "Emotional safety",
            ],
            "signal_meaning": "Your system feels safe enough to rest and integrate.",
            "underlying_needs": ["Rest", "Stability", "Balance"],
            "helpful_reactions": [
                "Protect your boundaries",
                "Anchor with a short calming routine",
                "Use the calm window for planning",
            ],
            "unhelpful_reactions": [
                "Filling all available time with tasks",
                "Dismissing rest as laziness",
                "Staying in avoidance mode",
            ],
            "healthy_next_step": "Set one small boundary that protects your calm for the next 24 hours.",
            "reflection_prompt": "What conditions made this calm possible, and what boundary keeps it protected?",
        },
        {
            "category": "Powerful",
            "body_signals": [
                "Focused attention",
                "Strong posture",
                "Motivation to act",
            ],
            "likely_triggers": [
                "Preparedness",
                "Supportive feedback",
                "Clear goals",
            ],
            "signal_meaning": "You are ready to act. This emotion signals capacity and agency.",
            "underlying_needs": ["Autonomy", "Competence", "Momentum"],
            "helpful_reactions": [
                "Channel energy into one specific action",
                "Break goals into first steps",
                "Track and celebrate small wins",
            ],
            "unhelpful_reactions": [
                "Overconfidence without planning",
                "Taking on everything at once",
                "Ignoring recovery needs",
            ],
            "healthy_next_step": "Use this momentum on one high-priority task within the next hour.",
            "reflection_prompt": "Where can you direct this energy so it supports your priorities this week?",
        },
        {
            "category": "Sad",
            "body_signals": [
                "Low energy",
                "Tight throat or heavy chest",
                "Withdrawal from activities",
            ],
            "likely_triggers": [
                "Loss or disappointment",
                "Disconnection",
                "Overload without support",
            ],
            "signal_meaning": "Something meaningful feels lost or unmet; sadness signals a need for care and connection.",
            "underlying_needs": ["Comfort", "Validation", "Belonging"],
            "helpful_reactions": [
                "Name what hurts directly",
                "Seek gentle support",
                "Lower demands temporarily",
            ],
            "unhelpful_reactions": [
                "Total isolation",
                "Harsh self-criticism",
                "Pretending you are fine when not",
            ],
            "healthy_next_step": "Send one honest message to a trusted person about how you are feeling.",
            "reflection_prompt": "What are you grieving or missing right now, and what would feel supportive today?",
        },
        {
            "category": "Fearful",
            "body_signals": [
                "Racing thoughts",
                "Fast heartbeat",
                "Restlessness or avoidance",
            ],
            "likely_triggers": [
                "Uncertainty",
                "Evaluation pressure",
                "Conflict or risk",
            ],
            "signal_meaning": "Your system perceives possible threat and asks for safety and clarity.",
            "underlying_needs": ["Safety", "Predictability", "Reassurance"],
            "helpful_reactions": [
                "Separate facts from fears",
                "Choose one controllable action",
                "Regulate body before decisions",
            ],
            "unhelpful_reactions": [
                "Catastrophizing",
                "Endless reassurance checking",
                "Avoiding all uncertainty",
            ],
            "healthy_next_step": "Take a 2-minute breathing reset and write one controllable next action.",
            "reflection_prompt": "What part is uncertain, and what one concrete step can you control next?",
        },
        {
            "category": "Angry",
            "body_signals": [
                "Heat or tension",
                "Jaw or shoulder tightness",
                "Urge to react quickly",
            ],
            "likely_triggers": [
                "Boundary violations",
                "Unfairness",
                "Blocked goals",
            ],
            "signal_meaning": "A boundary, value, or expectation feels crossed. Anger signals protection and action needs.",
            "underlying_needs": ["Respect", "Fairness", "Agency"],
            "helpful_reactions": [
                "Pause before responding",
                "Name the boundary clearly",
                "Communicate assertively and specifically",
            ],
            "unhelpful_reactions": [
                "Explosive reactions",
                "Passive-aggressive silence",
                "Rumination without action",
            ],
            "healthy_next_step": 'Draft a calm boundary statement: "When X happens, I need Y."',
            "reflection_prompt": "Which boundary feels crossed, and how can you communicate it clearly without escalation?",
        },
    ]

    for guide_data in learning_guides_data:
        existing = (
            db.query(models.LearningGuide)
            .filter(models.LearningGuide.category == guide_data["category"])
            .first()
        )
        if not existing:
            guide = models.LearningGuide(**guide_data)
            db.add(guide)
    db.commit()
    print(" Learning guides seeded")

    
    quiz_scenarios_data = [
        {
            "scenario_id": "deadline-1",
            "title": "Night Before Deadline",
            "situation": "You have two assignments due tomorrow. Your heart is racing and your thoughts keep jumping to worst-case outcomes.",
            "options": ["Excited", "Anxious", "Grateful", "Peaceful"],
            "correct_emotion": "Anxious",
            "explanation": "Anxiety often includes threat-focused thoughts and body activation. The signal here is uncertainty and a need for structure/safety.",
        },
        {
            "scenario_id": "groupchat-1",
            "title": "Friends Made Plans Without You",
            "situation": "You saw pictures in the group chat from an outing you were not invited to. You feel a heavy ache and keep replaying it.",
            "options": ["Lonely", "Rejected", "Bored", "Proud"],
            "correct_emotion": "Rejected",
            "explanation": "Lonely is missing connection in general, while rejected includes feeling specifically excluded or not chosen.",
        },
        {
            "scenario_id": "exam-week-1",
            "title": "Week 10 Exhaustion",
            "situation": "For several weeks you have felt drained, detached from classes, and less effective despite trying harder.",
            "options": ["Overwhelmed", "Burned out", "Motivated", "Calm"],
            "correct_emotion": "Burned out",
            "explanation": "Overwhelm is usually acute and short-term. Burnout is a prolonged pattern of depletion, detachment, and reduced effectiveness.",
        },
        {
            "scenario_id": "presentation-1",
            "title": "Nailed the Presentation",
            "situation": "You just finished presenting to the class and got positive feedback. You feel a sense of relief mixed with pride.",
            "options": ["Grateful", "Confident", "Relieved", "All of these"],
            "correct_emotion": "All of these",
            "explanation": "Complex emotions often blend. Relief (uncertainty resolved), confidence (capability), and gratitude (positive reception) can coexist in one moment.",
        },
        {
            "scenario_id": "project-failure-1",
            "title": "Group Project Disaster",
            "situation": "A teammate didn't finish their part of the group project. Everyone's grades are affected because of their unreliability. You feel your face getting hot and clenched fists.",
            "options": ["Frustrated", "Angry", "Disappointed", "Betrayed"],
            "correct_emotion": "Angry",
            "explanation": "Anger specifically signals a boundary violation or unfairness. Here, you feel disrespected and let down by broken commitments.",
        },
        {
            "scenario_id": "breakup-1",
            "title": "After the Breakup",
            "situation": "Three months after breaking up, you still feel empty most days. You see your ex around campus and the sadness comes rushing back.",
            "options": ["Grief", "Sadness", "Loneliness", "All of these"],
            "correct_emotion": "All of these",
            "explanation": "Loss activates grief (something valued is gone), sadness (the emotional weight), and loneliness (missing that person specifically).",
        },
        {
            "scenario_id": "social-event-1",
            "title": "Walked into the Wrong Room",
            "situation": "You confidently walked into what you thought was your study group meeting, but it was a group of people you don't know. Now you're embarrassed and want to leave immediately.",
            "options": ["Ashamed", "Embarrassed", "Anxious", "Confident"],
            "correct_emotion": "Embarrassed",
            "explanation": "Embarrassment is about a social misstep affecting how others see you. Shame is deeper (about who you are), and anxiety is about threat.",
        },
        {
            "scenario_id": "good-grade-1",
            "title": "Got an Unexpected A",
            "situation": "You studied hard but weren't sure about the exam. When your grade came back as an A, you felt light, celebrated with friends, and the whole day felt brighter.",
            "options": ["Pride", "Joy", "Relief", "All of these"],
            "correct_emotion": "All of these",
            "explanation": "Success triggers pride (your effort paid off), joy (positive energy), and relief (the uncertainty is resolved).",
        },
        {
            "scenario_id": "family-conflict-1",
            "title": "Parent Disappointed in Your Major",
            "situation": "Your parent just said they are disappointed with your major choice and questioned if you'll have a 'real career.' You feel the sting of that judgment.",
            "options": ["Hurt", "Defensive", "Misunderstood", "Disappointed"],
            "correct_emotion": "Hurt",
            "explanation": "Hurt signals emotional pain from someone whose opinion matters. It combines disappointment with the sting of judgment.",
        },
        {
            "scenario_id": "triumph-1",
            "title": "Made the Team",
            "situation": "You made the sports team after trying out for the first time. You feel strong, capable, and ready to tackle the season ahead.",
            "options": ["Empowered", "Confident", "Determined", "All of these"],
            "correct_emotion": "All of these",
            "explanation": "Being chosen activates empowerment (proving capability), confidence (belief in yourself), and determination (motivation to succeed).",
        },
        {
            "scenario_id": "lost-item-1",
            "title": "Lost Your Wallet",
            "situation": "You can't find your wallet anywhere and your important documents are in it. Your mind keeps jumping to what ifs and catastrophes.",
            "options": ["Stressed", "Panicked", "Worried", "Anxious"],
            "correct_emotion": "Anxious",
            "explanation": "Anxiety is characterized by elevated threat perception and racing thoughts. Panic is more acute terror; stress is general overwhelm.",
        },
    ]

    for scenario_data in quiz_scenarios_data:
        existing = (
            db.query(models.QuizScenario)
            .filter(models.QuizScenario.scenario_id == scenario_data["scenario_id"])
            .first()
        )
        if not existing:
            scenario = models.QuizScenario(**scenario_data)
            db.add(scenario)
    db.commit()
    print(" Quiz scenarios seeded")

    
    discrimination_exercises_data = [
        {
            "left_emotion": "Anxious",
            "right_emotion": "Excited",
            "key_difference": "Both feel high energy. Anxiety predicts threat; excitement predicts opportunity.",
            "quick_check": 'Ask: "Am I expecting danger, or possibility?"',
        },
        {
            "left_emotion": "Lonely",
            "right_emotion": "Rejected",
            "key_difference": "Lonely is absence of connection. Rejected adds a sense of personal exclusion or not being wanted.",
            "quick_check": 'Ask: "Do I need more connection, or am I processing a specific exclusion?"',
        },
        {
            "left_emotion": "Overwhelmed",
            "right_emotion": "Burned out",
            "key_difference": "Overwhelmed is acute overload right now. Burned out is chronic depletion over time.",
            "quick_check": 'Ask: "Is this a temporary spike, or have I felt drained for weeks?"',
        },
    ]

    for exercise_data in discrimination_exercises_data:
        existing = (
            db.query(models.DiscriminationExercise)
            .filter(
                models.DiscriminationExercise.left_emotion == exercise_data["left_emotion"],
                models.DiscriminationExercise.right_emotion == exercise_data["right_emotion"],
            )
            .first()
        )
        if not existing:
            exercise = models.DiscriminationExercise(**exercise_data)
            db.add(exercise)
    db.commit()
    print(" Discrimination exercises seeded")

   
    body_signal_activities_data = [
        {
            "signal": "Your chest feels tight; thoughts race to worst outcomes",
            "correct_emotions": ["Anxious", "Fearful", "Overwhelmed"],
            "incorrect_emotions": ["Joyful", "Peaceful", "Grateful"],
        },
        {
            "signal": "Warmth in your chest, smiling without effort, lightness in your shoulders",
            "correct_emotions": ["Joyful", "Grateful", "Hopeful"],
            "incorrect_emotions": ["Sad", "Angry", "Fearful"],
        },
        {
            "signal": "Heat rising, jaw clenched, urge to defend or respond",
            "correct_emotions": ["Angry", "Frustrated", "Irritated"],
            "incorrect_emotions": ["Peaceful", "Calm", "Content"],
        },
        {
            "signal": "Heaviness in your chest, slow movements, withdrawal from activity",
            "correct_emotions": ["Sad", "Melancholy", "Disheartened"],
            "incorrect_emotions": ["Empowered", "Determined", "Confident"],
        },
    ]

    for activity_data in body_signal_activities_data:
        existing = (
            db.query(models.BodySignalActivity)
            .filter(models.BodySignalActivity.signal == activity_data["signal"])
            .first()
        )
        if not existing:
            activity = models.BodySignalActivity(**activity_data)
            db.add(activity)
    db.commit()
    print("✓ Body signal activities seeded")

    
    reflection_prompt_activities_data = [
        {
            "prompt": "When do you feel most peaceful?",
            "hints": [
                "Think about a time when your body felt calm",
                "What were you doing, and who was around?",
                "What boundaries or conditions made that possible?",
            ],
            "key_points": [
                "Identify your peace triggers",
                "Recognize patterns",
                "Protect those conditions",
            ],
        },
        {
            "prompt": "What does frustrated feel like in your body?",
            "hints": [
                "Notice the physical sensations",
                "What happened right before?",
                "What boundary or need was crossed?",
            ],
            "key_points": [
                "Body awareness improves emotional clarity",
                "Frustration signals needs",
                "Action often helps",
            ],
        },
    ]

    for prompt_data in reflection_prompt_activities_data:
        existing = (
            db.query(models.ReflectionPromptActivity)
            .filter(models.ReflectionPromptActivity.prompt == prompt_data["prompt"])
            .first()
        )
        if not existing:
            prompt = models.ReflectionPromptActivity(**prompt_data)
            db.add(prompt)
    db.commit()
    print(" Reflection prompts seeded")

    print("\n Database seeding complete!")

finally:
    db.close()
