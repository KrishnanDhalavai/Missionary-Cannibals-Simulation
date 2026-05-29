from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import StateDefinition, SolutionResponse
from ai_solver import bfs_solve

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/solve", response_model=SolutionResponse)
def solve(initial_state: StateDefinition):
    path = bfs_solve(initial_state.m_left, initial_state.c_left, initial_state.boat_pos)
    if path:
        return SolutionResponse(is_solvable=True, path=path)
    else:
        return SolutionResponse(is_solvable=False, path=[])

@app.get("/api/ping")
def ping():
    return {"status": "ok"}
