import random


def _smoothstep(t):
    return t * t * (3 - 2 * t)


def _value_noise_1d(span, cell_size, amplitude, seed_offset=0.0):
    """Coarse, correlated undulation built from interpolated random control
    points (poor-man's Perlin noise). Gives the base tear a hand-drawn drift
    instead of independent point-to-point jitter."""
    n_cells = int(span // cell_size) + 2
    controls = [random.uniform(-amplitude, amplitude) for _ in range(n_cells)]

    def sample(x):
        pos = x / cell_size
        i = int(pos)
        frac = pos - i
        a = controls[min(i, n_cells - 1)]
        b = controls[min(i + 1, n_cells - 1)]
        return a + (b - a) * _smoothstep(frac)

    return sample


def generate_torn_path(width=1440, height=40, segments=140):
    """Irregular torn-paper silhouette.

    Layers three effects instead of one flat random band:
      1. a slow, correlated random-walk drift (the paper's general wave)
      2. fine independent jitter (fiber-level roughness)
      3. sparse, sharp outlier events -- deep gouges and thin whisker spikes
         -- scattered at irregular intervals, the way a real tear snags and
         releases unevenly rather than oscillating on a fixed rhythm.
    """
    base_y = height * 0.5
    drift = _value_noise_1d(width, cell_size=random.uniform(90, 140), amplitude=height * 0.22)

    # irregular x sampling: accumulate variable-width steps instead of a
    # fixed grid, so the tear doesn't fall into a visible rhythm
    xs = [width]
    avg_step = width / segments
    x = width
    while x > 0:
        x -= avg_step * random.uniform(0.35, 1.85)
        if x > 0:
            xs.append(x)
    xs.append(0)

    # pick sparse indices (never the first/last couple of points) for the
    # two kinds of dramatic outlier: gouges (deep, near the bottom) and
    # whiskers (thin, near the top)
    interior = range(2, len(xs) - 2)
    n_gouges = max(2, len(xs) // 22)
    n_whiskers = max(2, len(xs) // 26)
    gouge_idx = set(random.sample(list(interior), min(n_gouges, len(xs) - 4)))
    remaining = [i for i in interior if i not in gouge_idx]
    whisker_idx = set(random.sample(remaining, min(n_whiskers, len(remaining))))

    ys = []
    for i, px in enumerate(xs):
        y = base_y + drift(width - px if px <= width else 0)
        y += random.uniform(-2.6, 2.6)  # fine fiber jitter

        if i in gouge_idx:
            y = random.uniform(height - 6, height - 1.5)  # sharp deep tear
        elif i in whisker_idx:
            y = random.uniform(5, 9)  # thin sticking-up fiber

        y = max(4, min(height - 1, y))
        ys.append(y)

    # smooth neighbours of an outlier slightly toward it so the spike/gouge
    # reads as a snag rather than a single isolated pixel-wide glitch
    for i in list(gouge_idx) + list(whisker_idx):
        if 0 < i < len(ys) - 1:
            ys[i - 1] = (ys[i - 1] + ys[i]) / 2
            ys[i + 1] = (ys[i + 1] + ys[i]) / 2

    points = [f"M0 -10", f"L{width} -10", f"L{xs[0]:.1f} {ys[0]:.1f}"]
    for px, py in zip(xs[1:], ys[1:]):
        points.append(f"L{px:.1f} {py:.1f}")
    points.append("Z")

    return " ".join(points)


if __name__ == "__main__":
    print(generate_torn_path())
