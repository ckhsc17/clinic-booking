from pydantic import BaseModel
from typing import Optional

class PushRequest(BaseModel):
    user_id: str
    message: str

