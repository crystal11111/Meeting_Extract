from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/summarize")
async def summarize_meeting(request: Request):
    data = await request.json()
    transcript = data.get('transcript')
    summary = summarize_meeting(transcript)
    return {"summary": summary}
