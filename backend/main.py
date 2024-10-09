from fastapi import FastAPI, Request
from llm import summarize_meeting

app = FastAPI()

@app.post("/summarize")
async def summarize_meeting_api(request: Request):
    data = await request.json()
    transcript = data.get('transcript')
    summary = summarize_meeting(transcript)
    return {"summary": summary}
