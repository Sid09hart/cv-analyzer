from fastapi import FastAPI, UploadFile, File,Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import spacy
from google import genai
import json
import os
from dotenv import load_dotenv
from typing import Optional
import requests
from bs4 import BeautifulSoup

load_dotenv()
# 1. Configuration & Initialization
app = FastAPI()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("FATAL ERROR: GEMINI_API_KEY is missing from the environment.")

client = genai.Client(api_key=GEMINI_API_KEY)
# Load the local NLP model
nlp = spacy.load("en_core_web_sm")

# Create a specific list of allowed origins
allowed_origins = [
    "http://localhost:3000",                  # For your local development
    "https://cv-analyzer-three-iota.vercel.app"   # Your actual live Vercel domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,            # Replaced ["*"] with the secure list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Python ML Backend is running successfully!"}
@app.post("/analyze")
async def analyze_cv(
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None)
):
    if not file and not url:
        raise HTTPException(status_code=400, detail="Please provide a PDF or a profile URL.")
    
    try:
        combined_text = ""
        nlp_summary = "None detected."

        # 1. Process PDF if provided
        if file and file.filename.endswith('.pdf'):
            with pdfplumber.open(file.file) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        combined_text += extracted + "\n"
            
            # Perform NLP strictly on the CV text
            doc = nlp(combined_text)
            entities = set([ent.text for ent in doc.ents if ent.label_ in ["ORG", "PRODUCT"]])
            nlp_summary = ", ".join(list(entities)[:20]) 
        
        # 2. Process URL if provided (GitHub, LinkedIn, Portfolio)
        if url:
            try:
                # Spoof a browser user-agent so websites don't block us
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
                web_response = requests.get(url, headers=headers, timeout=10)
                soup = BeautifulSoup(web_response.content, 'html.parser')
                
                # Extract raw text and strip out the HTML code
                url_text = soup.get_text(separator=' ', strip=True)
                
                # Append the first 5000 characters to avoid overloading the AI token limit
                combined_text += f"\n\n--- External Profile Data ({url}) ---\n"
                combined_text += url_text[:5000]
            except Exception as e:
                print(f"Warning: Failed to scrape URL: {e}")
                combined_text += f"\n\n(Note: Attempted to analyze {url} but the site blocked the scraper.)"

        # 3. Ask Gemini to analyze the combined profile using our strict rubric
        prompt = f"""
        You are an expert ATS (Applicant Tracking System) and a Senior Tech Recruiter evaluating a candidate for a modern Software Engineering role.
        Analyze the following combined profile text (which may include a CV and/or an external web profile) based on this strict rubric:

        1. Impact & Quantifiable Results (Impact Score): Look for numbers, percentages, and concrete outcomes.
        2. Brevity & Action Verbs (Brevity & Style Scores): Bullet points must start with strong action verbs.
        3. Project Depth (Factors into Impact & Skills): Heavily weight their projects. Reward full-stack implementations and real-world problem solving.
        4. Modern Tooling (Skills Match Score): Cross-reference their extracted skills against modern industry standards.
        
        Local NLP Entities Detected: {nlp_summary}
        
        Return ONLY a raw JSON object with no markdown formatting perfectly matching this structure:
        {{
            "overall_score": 85,
            "metrics": {{"impact": 78, "brevity": 85, "style": 80, "skills_match": 88}},
            "extracted_skills": ["React", "Node.js"],
            "insights": {{
                "strengths": ["Strong action verbs"],
                "gaps": ["Missing cloud deployment"],
                "action_plan": ["Add AWS keywords"]
            }}
        }}
        
        Candidate Profile Text:
        {combined_text}
        """
        
        response = client.models.generate_content(
            model='gemini-3.5-flash-lite', 
            contents=prompt
        )
        
        raw_text = response.text.strip()
        start_index = raw_text.find('{')
        end_index = raw_text.rfind('}') + 1
        
        if start_index == -1 or end_index == 0:
            raise ValueError("Gemini did not return a valid JSON object.")
            
        ai_analysis = json.loads(raw_text[start_index:end_index])
        return {"success": True, "analysis": ai_analysis}
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail="Failed to process the profile.")