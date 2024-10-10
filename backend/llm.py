from langchain.llms import OpenAI
import os
from dotenv import load_dotenv 

class LLMModels:
    @staticmethod
    def get_openai_model():
        load_dotenv()  
        api_key = os.getenv("OPEN_API_KEY")
        return OpenAI(api_key= api_key)