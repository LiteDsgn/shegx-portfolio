import random

def generate_torn_path(width=1440, height=40, variance=12, segments=60):
    points = [f"M0 0", f"L{width} 0"]
    
    # Start at the right edge, around middle height
    current_x = width
    points.append(f"L{width} {random.randint(height//4, height//2)}")
    
    # Generate jagged points going left
    step_x = width / segments
    
    for i in range(1, segments):
        x = width - (i * step_x) + random.uniform(-step_x/2, step_x/2)
        # y should be mostly between height*0.2 and height*0.8, with occasional spikes
        base_y = height * 0.4
        spike = random.uniform(-variance, variance)
        if random.random() > 0.8:
            spike *= 1.5  # occasional larger tear
            
        y = max(5, min(height - 5, base_y + spike))
        points.append(f"L{x:.1f} {y:.1f}")
        
    points.append(f"L0 {random.randint(height//4, height//2)}")
    points.append("Z")
    
    return " ".join(points)

path = generate_torn_path()
print(path)
