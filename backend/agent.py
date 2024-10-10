from langchain.prompts import PromptTemplate
from langchain.output_parsers import OutputFixingParser, PydanticOutputParser
from llm import LLMModels

class Agent:
    def __init__(self, query):
        self.query = query
        self.llm = LLMModels.get_openai_model()
        self.chat_llm = LLMModels.get_openai_model()
        
    def get_summary_prompt(self):
        summary_template = '''
        Here is the meeting transcript: {query}.
        Please provide a summary following this format: 
        - Main points: 
        - Decisions:
        - Conclusions: 
        '''
        prompt = PromptTemplate(template=summary_template, input_variables=["query"])
        return prompt.format(query=self.query)
    
    def get_tasks_prompt(self):
        tasks_template = '''
        Given the meeting transcript: {query}, identify all tasks or action items. 
        List each action item and who is responsible for it. Format the response as:
        - Task: 
        - Person:
        - Deadline:
        '''
        prompt = PromptTemplate(template=tasks_template, input_variables=["query"])
        return prompt.format(query=self.query)

    def get_followup_email_prompt(self, summary, tasks):
        followup_template = '''
        Based on the following meeting summary:
        {summary}
        
        And the following tasks:
        {tasks}
        
        Please summarize the following meeting transcript into a follow-up email. Keep it professional, simple, and under 200 words. Ensure the email is complete and does not end mid-sentence.

        '''
        prompt = PromptTemplate(template=followup_template, input_variables=["summary", "tasks"])
        return prompt.format(summary=summary, tasks=tasks)

    # Call the LLM to generate a meeting summary
    def get_summary(self):
        prompt = self.get_summary_prompt()
        response = self.llm(prompt)
        return response

    # Call the LLM to extract tasks and action items.
    def get_tasks(self):
        prompt = self.get_tasks_prompt()
        response = self.llm(prompt)
        return response

    # Generate the follow-up email by combining summary and tasks.
    def generate_followup_email(self):
        summary = self.get_summary()
        tasks = self.get_tasks()
        prompt = self.get_followup_email_prompt(summary, tasks)
        response = self.llm(prompt)
        return response
