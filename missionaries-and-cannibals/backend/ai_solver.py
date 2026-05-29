from collections import deque
from models import StateDefinition

class State:
    def __init__(self, m_left, c_left, boat, parent=None):
        self.m_left = m_left
        self.c_left = c_left
        self.m_right = 3 - m_left
        self.c_right = 3 - c_left
        self.boat = boat # 1 for left, 0 for right
        self.parent = parent

    def is_valid(self):
        if self.m_left < 0 or self.m_right < 0 or self.c_left < 0 or self.c_right < 0:
            return False
        if self.m_left > 0 and self.m_left < self.c_left:
            return False
        if self.m_right > 0 and self.m_right < self.c_right:
            return False
        return True

    def is_goal(self):
        return self.m_left == 0 and self.c_left == 0 and self.boat == 0

    def get_successors(self):
        successors = []
        moves = [(1, 0), (0, 1), (1, 1), (2, 0), (0, 2)]
        for m, c in moves:
            if self.boat == 1: # Left to Right
                new_state = State(self.m_left - m, self.c_left - c, 0, self)
            else: # Right to Left
                new_state = State(self.m_left + m, self.c_left + c, 1, self)
            if new_state.is_valid():
                successors.append(new_state)
        return successors

    def to_dict(self):
        return StateDefinition(
            m_left=self.m_left,
            c_left=self.c_left,
            m_right=self.m_right,
            c_right=self.c_right,
            boat_pos='L' if self.boat == 1 else 'R'
        )

    def __eq__(self, other):
        if not isinstance(other, State):
            return False
        return (self.m_left == other.m_left and self.c_left == other.c_left and self.boat == other.boat)
    
    def __hash__(self):
        return hash((self.m_left, self.c_left, self.boat))

def bfs_solve(start_m_left, start_c_left, start_boat):
    start_state = State(start_m_left, start_c_left, 1 if start_boat == 'L' else 0)
    if not start_state.is_valid():
        return None
    
    queue = deque([start_state])
    visited = set([start_state])

    while queue:
        current = queue.popleft()
        if current.is_goal():
            path = []
            while current:
                path.append(current.to_dict())
                current = current.parent
            return path[::-1] # Reverse to get path from start to goal
        
        for next_state in current.get_successors():
            if next_state not in visited:
                visited.add(next_state)
                queue.append(next_state)
    
    return None
