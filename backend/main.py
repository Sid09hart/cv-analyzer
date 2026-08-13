from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import spacy
from google import genai
import json
import os
from dotenv import load_dotenv

load_dotenv()
# 1. Configuration & Initialization
app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("FATAL ERROR: GEMINI_API_KEY is missing from the environment.")

client = genai.Client(api_key=GEMINI_API_KEY)
# Load the local NLP model
nlp = spacy.load("en_core_web_sm")

# Allow the frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Python ML Backend is running successfully!"}

@app.post("/analyze")
async def analyze_cv(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Currently, only PDF files are supported.")
    
    try:
        # 2. Extract Text using pdfplumber
        text = ""
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        
        # 3. Perform NLP Analysis using spaCy
        doc = nlp(text)
        entities = set([ent.text for ent in doc.ents if ent.label_ in ["ORG", "PRODUCT"]])
        nlp_summary = ", ".join(list(entities)[:20]) 
        
        # 4. Ask Gemini to analyze the profile using a strict Senior Recruiter Rubric
        prompt = f"""
        You are an expert ATS (Applicant Tracking System) and a Senior Tech Recruiter evaluating a candidate for a modern Software Engineering role.
        Analyze the following CV text based on this strict rubric:

        1. Impact & Quantifiable Results (Impact Score): Look for numbers, percentages, and concrete outcomes. Penalize bullet points that only list passive duties.
        2. Brevity & Action Verbs (Brevity & Style Scores): Bullet points must start with strong action verbs (e.g., Engineered, Architected, Developed, Optimized). Penalize passive voice, paragraphs, or overly long descriptions.
        3. Project Depth (Factors into Impact & Skills): For candidates with less corporate experience, heavily weight their projects. Reward full-stack implementations, real-world problem solving, and end-to-end applications over basic UI tutorials.
        4. Modern Tooling (Skills Match Score): Cross-reference their extracted skills against modern industry standards (e.g., React, Next.js, Node.js, MongoDB, Tailwind CSS).
        
        We have also performed local NLP and identified these key entities: {nlp_summary}
        
        Return ONLY a raw JSON object with no markdown formatting. 
        The JSON must perfectly match this structure:
        {{
            "overall_score": 85,
            "metrics": {{
                "impact": 78,
                "brevity": 85,
                "style": 80,
                "skills_match": 88
            }},
            "extracted_skills": ["React", "Node.js", "MongoDB", "Tailwind CSS"],
            "insights": {{
                "strengths": ["Strong use of action verbs", "Clear project outcomes"],
                "gaps": ["Missing cloud deployment metrics", "Lacks testing framework experience"],
                "action_plan": ["Add AWS/Docker keywords", "Include % improvements in project bullets"]
            }}
        }}
        
        CV Text:
        {text}
        """
        
        # 5. Call Gemini using the current stable model
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt
        )
        
        # Clean the response more aggressively
        raw_text = response.text.strip()
        
        # Find the first '{{' and the last '}}' to extract only the JSON part
        start_index = raw_text.find('{')
        end_index = raw_text.rfind('}') + 1
        
        if start_index == -1 or end_index == 0:
            raise ValueError("Gemini did not return a valid JSON object.")
            
        clean_json_string = raw_text[start_index:end_index]
        ai_analysis = json.loads(clean_json_string)
        
        return {"success": True, "analysis": ai_analysis}
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail="Failed to process the CV.")


