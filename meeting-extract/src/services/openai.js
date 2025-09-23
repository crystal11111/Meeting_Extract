// Direct OpenAI API integration - no backend needed!
export class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
  }

  async callOpenAI(prompt) {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async getSummary(transcript) {
    const prompt = `Here is the meeting transcript: ${transcript}. Please provide a summary following this format: - Main points: - Decisions: - Conclusions:`;
    return await this.callOpenAI(prompt);
  }

  async getTasks(transcript) {
    const prompt = `Given the meeting transcript: ${transcript}, identify all tasks or action items. Format as: ✓ Task description ✓ Person: [name] ✓ Deadline: [date]`;
    return await this.callOpenAI(prompt);
  }

  async getFollowupEmail(transcript) {
    const prompt = `Based on this meeting transcript: ${transcript}. Create a professional follow-up email under 200 words with key points, action items, and next steps.`;
    return await this.callOpenAI(prompt);
  }
}