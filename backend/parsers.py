# from pydantic import BaseModel, Field
# from typing import List, Optional

# class Summary(BaseModel):
#     main_points: List[str] = Field(..., title="Main Points")
#     decisions: List[str] = Field(..., title="Decisions")
#     conclusions: str = Field(..., title="Conclusions")

# class Task(BaseModel):
#     task: str = Field(..., title="Task")
#     person: Optional[str] = Field(None, title="Person")
#     deadline: Optional[str] = Field(None, title="Deadline")

# class FollowupEmail(BaseModel):
#     email: str = Field(..., title="Email")