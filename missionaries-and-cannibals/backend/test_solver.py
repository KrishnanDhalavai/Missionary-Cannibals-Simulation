from ai_solver import bfs_solve

path = bfs_solve(3, 3, 'L')
if path:
    print(f"Solved in {len(path)-1} moves!")
    for step in path:
        print(step)
else:
    print("No solution found.")
