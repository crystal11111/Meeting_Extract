from langchain.llms import OpenAI
import os

def summarize_meeting(transcript):
    llm = OpenAI(api_key= os.getenv("OPEN_API_KEY"))
    prompt = f"Summarize the following meeting transcript and extract tasks:\n\n{transcript}"
    summary = llm(prompt)
    return summary
     