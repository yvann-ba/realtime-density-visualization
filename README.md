# Paris Traffic Density Simulation

An interactive 3D web visualization simulating foot traffic in Paris. This project uses mathematical models to generate realistic movement patterns based on city points of interest.

Feel free to contact me on linkedin for help or if you just want to chat about cool geospatial/AI stuff : https://www.linkedin.com/in/yvann-barbot/

I'm working on this big planetary engine thing right now : https://terra-lab.ai/


https://github.com/user-attachments/assets/126584bd-428e-4492-986f-9e259a30aac1

## Process

Modeled the city's density. Instead of real-time GPS pings, I use a probabilistic engine for fun. Mapped 50+ hotspots across Paris (Eiffel Tower, Business districts, Train stations)

assigned them 168 unique temporal profiles, basically one for each hour of the week (24h x 7 days).

The math engine knows how a Monday morning at La Defense differs from a Sunday evening at Sacre-Coeur

2. Picked the spatial skeleton. Used Uber's H3 hexagonal indexing to pixelate Paris (cool tech btw thanks Uber).
Hexagons ensure every neighbor is at the exact same distance, unlike square grids.

It's seems a pretty precise and optimize way to handle spatial aggregation across the city's 105km2.

3. Created cool looking heatmaps. tried to implement Gaussian Interpolation to avoid blocky visuals.
Each hotspot acts as a source where influence decays exponentially.

This creates fluid, cloud-like gradients that kind of look like to me how population move (thought it's not accurate just estimation)

4. Mostly everything run on GPU (since I have a big one lol)

Node.js handles the complex probability math in the backend

DeckGL uses WebGL shaders to animate 17,000+ dynamic points in real-time

## Features

- **H3 Indexing**: Uses the H3 hexagonal grid system for high-performance spatial aggregation.
- **Granular Heatmap**: Generates a fluid density field with thousands of interpolated points.
- **Realistic Simulation**: Algorithms based on hotspots with temporal multipliers to simulate urban life cycles.
- **GPU Performance**: High-performance rendering using Deck.gl and Mapbox GL JS.
- **Temporal Interpolation**: Smooth transitions between hours for continuous traffic animation.

## Technologies

- **Frontend**: Mapbox GL JS, Deck.gl
- **Backend**: Node.js, Express
- **Spatial Indexing**: H3 (Uber)
- **Data**: Mathematical simulation based on Paris patterns.

## Installation

### Prerequisites

- Node.js v18+ 
- A Mapbox token

### Steps

1. **Clone the project**
```bash
git clone https://github.com/yvann-ba/realtime-paris-density-simulation.git
cd realtime-paris-density-simulation
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Mapbox token**
Create a `.env` file at the root:
```bash
MAPBOX_TOKEN=your_mapbox_token_here
```

4. **Start the server**
```bash
npm start
```

5. **Open in browser**
```
http://localhost:3000
```

## Simulation Logic

The simulation relies on several key concepts:

1. **Hotspots**: Over 50 points of interest each with an influence radius and base intensity.
2. **Temporal Profiles**: Each location type has its own 24h and day-of-week traffic curve.
3. **Gaussian Interpolation**: Heatmap points are calculated via a Gaussian falloff function to create natural gradients.
4. **Jittering**: Random variations added to simulate the organic nature of crowds.

