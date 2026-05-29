from pydantic import BaseModel
from typing import List, Optional

class StateDefinition(BaseModel):
    m_left: int
    c_left: int
    m_right: int
    c_right: int
    boat_pos: str # 'L' or 'R'

class Move(BaseModel):
    m: int
    c: int

class SolutionResponse(BaseModel):
    is_solvable: bool
    path: List[StateDefinition]
