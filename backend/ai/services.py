import os
import openai
from django.conf import settings

# Configure OpenAI API key
openai.api_key = settings.OPENAI_API_KEY

def match_lawyers_to_bounty(bounty, lawyers):
    """
    Use AI to match lawyers to a legal bounty based on expertise and requirements
    """
    # Format the bounty data
    bounty_data = {
        "title": bounty.title,
        "description": bounty.description,
        "category": bounty.category,
        "location": bounty.location,
    }
    
    # Format the lawyers data
    lawyers_data = []
    for lawyer in lawyers:
        lawyers_data.append({
            "id": lawyer.id,
            "specialization": lawyer.specialization,
            "experience": lawyer.years_of_experience,
            "location": lawyer.location,
            "bio": lawyer.bio,
        })
    
    # Create the prompt
    prompt = f"""
    Match the following lawyers to this legal bounty based on expertise, experience, and location.
    
    Bounty:
    Title: {bounty_data['title']}
    Description: {bounty_data['description']}
    Category: {bounty_data['category']}
    Location: {bounty_data['location']}
    
    Lawyers:
    {lawyers_data}
    
    Return a JSON array of lawyer IDs ranked from best match to worst match.
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI assistant that matches lawyers to legal bounties."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
        )
        
        # Parse the response
        ranked_ids = eval(response.choices[0].message.content)
        
        # Return lawyers in the ranked order
        return [lawyer for lawyer_id in ranked_ids 
                for lawyer in lawyers if str(lawyer.id) == str(lawyer_id)]
    
    except Exception as e:
        print(f"Error matching lawyers: {e}")
        # Fall back to simple matching
        return lawyers

def analyze_legal_document(document_text):
    """
    Analyze a legal document using AI
    """
    prompt = f"""
    Analyze the following legal document and provide:
    1. A concise summary (max 3 sentences)
    2. Key points (bullet points)
    3. Potential legal issues identified
    4. Recommended actions
    
    Document:
    {document_text}
    
    Format your response as JSON with the following structure:
    {{
      "summary": "string",
      "keyPoints": ["string"],
      "legalIssues": ["string"],
      "recommendedActions": ["string"]
    }}
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a legal assistant that analyzes documents."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
        )
        
        # Parse the response
        return eval(response.choices[0].message.content)
    
    except Exception as e:
        print(f"Error analyzing document: {e}")
        return {
            "summary": "Error analyzing document",
            "keyPoints": ["Error occurred during analysis"],
            "legalIssues": ["Unable to identify issues due to error"],
            "recommendedActions": ["Please try again or consult a legal professional"]
        }

