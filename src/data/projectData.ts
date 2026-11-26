export const ASSETS = {
  intersectionRaw: '/src/assets/images/traffic_intersection_raw_1795681945089.jpg',
  highwayCorridor: '/src/assets/images/urban_highway_corridor_1795681945191.jpg',
  edgeHardware: '/src/assets/images/edge_compute_hardware_1795681945374.jpg',
  engineerPortrait: '/src/assets/images/engineer_portrait_1795681945518.jpg',
} as const;

/**
 * Pixel-aligned annotations mapped directly onto traffic_intersection_raw_1795681945089.jpg
 * Normalized coordinates (0 - 100 percentage scale) for the Before/After interactive showcase.
 */
export interface AnnotatedTarget {
  id: string;
  label: 'bus' | 'truck' | 'car' | 'suv' | 'pedestrian' | 'signal';
  x: number;
  y: number;
  w: number;
  h: number;
  vector?: { dx: number; dy: number };
  lane: string;
}

export const COMPARISON_TARGETS: AnnotatedTarget[] = [
  { id: 'TRK-041', label: 'bus', x: 43.2, y: 17.5, w: 16.2, h: 22.8, vector: { dx: -5.5, dy: 2.8 }, lane: 'WB Transit Turn' },
  { id: 'TRK-032', label: 'truck', x: 16.0, y: 19.5, w: 15.2, h: 16.2, vector: { dx: 4.5, dy: 2.2 }, lane: 'EB Approach' },
  { id: 'TRK-018', label: 'car', x: 70.6, y: 47.0, w: 14.5, h: 11.4, vector: { dx: -5.8, dy: -1.4 }, lane: 'WB Clear Lane' },
  { id: 'TRK-024', label: 'suv', x: 82.0, y: 57.5, w: 15.6, h: 12.6, vector: { dx: -4.2, dy: -1.6 }, lane: 'WB Lane 2' },
  { id: 'TRK-025', label: 'suv', x: 85.2, y: 44.2, w: 13.0, h: 11.0, vector: { dx: -3.5, dy: -1.0 }, lane: 'WB Lane 1' },
  { id: 'TRK-007', label: 'suv', x: 26.0, y: 71.0, w: 14.8, h: 17.5, vector: { dx: 1.4, dy: -4.0 }, lane: 'NB Left Turn' },
  { id: 'TRK-011', label: 'car', x: 39.2, y: 70.2, w: 14.2, h: 17.0, vector: { dx: 1.5, dy: -4.2 }, lane: 'NB Through 1' },
  { id: 'TRK-014', label: 'suv', x: 52.0, y: 72.0, w: 12.2, h: 17.0, vector: { dx: 1.2, dy: -3.8 }, lane: 'NB Through 2' },
  { id: 'TRK-019', label: 'car', x: 62.2, y: 75.0, w: 13.0, h: 18.2, vector: { dx: 1.8, dy: -3.0 }, lane: 'NB Right Turn' },
  { id: 'TRK-009', label: 'pedestrian', x: 34.4, y: 51.2, w: 3.0, h: 9.8, vector: { dx: 2.0, dy: 0.4 }, lane: 'South Crosswalk' },
  { id: 'TRK-010', label: 'pedestrian', x: 38.8, y: 53.8, w: 3.4, h: 10.2, vector: { dx: 2.1, dy: 0.5 }, lane: 'South Crosswalk' },
  { id: 'TRK-012', label: 'pedestrian', x: 47.0, y: 55.0, w: 3.2, h: 10.0, vector: { dx: 2.0, dy: 0.3 }, lane: 'South Crosswalk' },
  { id: 'SIG-N1', label: 'signal', x: 72.8, y: 10.2, w: 2.2, h: 5.2, lane: 'North Mast Arm' },
  { id: 'SIG-N2', label: 'signal', x: 80.2, y: 11.4, w: 2.2, h: 5.2, lane: 'North Mast Arm' },
];

export const PIPELINE_STAGES = [
  {
    step: '01',
    title: 'OpenCV Frame Ingestion & Calibration',
    subtitle: 'Decoding video streams and normalizing camera perspective',
    description:
      'Traffic camera streams and recorded street footage are ingested through OpenCV. A perspective homography calibration maps oblique camera angles onto a consistent ground-plane coordinate system.',
    tensorNote: 'OpenCV BGR Frame -> Resize & Normalization -> Ground-Plane Homography',
  },
  {
    step: '02',
    title: 'YOLO Multi-Class Object Detection',
    subtitle: 'Separating passenger vehicles, transit, freight, and pedestrians',
    description:
      'Unlike inductive pavement loops that only sense metal mass, YOLO localizes individual cars, SUVs, buses, trucks, motorcycles, and vulnerable pedestrians within each frame in a single inference pass.',
    tensorNote: 'YOLO Forward Pass -> Bounding Boxes [x1, y1, x2, y2] + Class Labels',
  },
  {
    step: '03',
    title: 'Persistent Multi-Object Tracking',
    subtitle: 'Maintaining consistent vehicle IDs across consecutive frames',
    description:
      'Bounding boxes are linked frame-to-frame using spatial association and motion prediction so a moving bus or sedan retains a continuous identity rather than being re-counted on every frame.',
    tensorNote: 'Frame-to-Frame IoU & Motion State -> Persistent Tracking ID',
  },
  {
    step: '04',
    title: 'Spatial Zone & Flow Counting',
    subtitle: 'Virtual approach polygons, crosswalks, and directional lines',
    description:
      'Tracked object centroids are evaluated against software-defined lane polygons and crosswalk regions inside Python, producing directional counts, queue estimates, and spatial density heatmaps.',
    tensorNote: 'Centroid-in-Polygon Check -> Directional Approach & Dwell Counters',
  },
  {
    step: '05',
    title: 'FastAPI Telemetry & Smart Signal Logic',
    subtitle: 'Streaming structured state to the Next.js operational interface',
    description:
      'Python FastAPI endpoints publish annotated video frames, vehicle counts, congestion trends, and adaptive phase recommendations to the Next.js frontend and reporting workflows.',
    tensorNote: 'FastAPI REST / Stream Endpoints -> Next.js Operational Workspace',
  },
] as const;

export interface ArchitectureNode {
  id: string;
  layer: string;
  title: string;
  tech: string;
  summary: string;
  tradeoff: string;
  challenge: string;
}

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'capture',
    layer: '01 · Ingestion',
    title: 'OpenCV Video Pipeline',
    tech: 'Python · OpenCV',
    summary:
      'Reads traffic video files or live camera feeds, normalizes frame dimensions, and renders annotated bounding boxes, IDs, and zone overlays.',
    tradeoff:
      'Selected OpenCV for deterministic frame-by-frame control and direct compatibility with NumPy arrays before inference.',
    challenge:
      'Handling variable input framerates and oblique camera mounting angles without distorting zone boundaries.',
  },
  {
    id: 'detector',
    layer: '02 · Detection',
    title: 'YOLO Inference Engine',
    tech: 'Python · YOLO',
    summary:
      'Performs real-time multi-class object detection to classify cars, buses, trucks, two-wheelers, and pedestrians across intersection lanes.',
    tradeoff:
      'Chose single-stage YOLO architecture to keep per-frame inference responsive on local workstations without two-stage detector overhead.',
    challenge:
      'Partial vehicle occlusion behind large transit buses and headlight bloom during dusk or wet-asphalt conditions.',
  },
  {
    id: 'tracker',
    layer: '03 · Spatial Logic',
    title: 'Tracking & Signal Engine',
    tech: 'Python · Geometry & Phase Logic',
    summary:
      'Associates detections across frames into persistent trajectories, evaluates virtual lane polygons, and computes adaptive green-phase timing.',
    tradeoff:
      'Used lightweight geometric association and polygon checks rather than heavy appearance embeddings to preserve frame throughput.',
    challenge:
      'Manual polygon recalibration is required whenever a physical camera mount shifts perspective.',
  },
  {
    id: 'api',
    layer: '04 · Backend API',
    title: 'FastAPI Service Layer',
    tech: 'Python · FastAPI',
    summary:
      'Exposes inference triggers, live camera telemetry, heatmap aggregations, signal timing endpoints, and structured report exports.',
    tradeoff:
      'Adopted FastAPI for clean asynchronous request handling, typed Pydantic schemas, and effortless Python ML ecosystem integration.',
    challenge:
      'Coordinating continuous video stream processing alongside concurrent API requests for analytics and reporting.',
  },
  {
    id: 'frontend',
    layer: '05 · Application UI',
    title: 'Next.js Mobility Suite',
    tech: 'Next.js · TypeScript · Tailwind CSS',
    summary:
      'Provides dedicated operational views for live detection, multi-camera monitoring, congestion heatmaps, smart signal control, and reporting.',
    tradeoff:
      'Kept heavy computer vision execution strictly inside the Python backend while letting Next.js focus on responsive visualization and workflow clarity.',
    challenge:
      'Maintaining smooth browser rendering while displaying continuous camera feeds and updating intersection telemetry.',
  },
];

export const TECH_STACK = [
  { name: 'Next.js', category: 'Application Framework', role: 'Multi-route operational web application and App Router architecture.' },
  { name: 'TypeScript', category: 'Frontend Language', role: 'Strict typed contracts across telemetry views and UI controls.' },
  { name: 'Tailwind CSS', category: 'Design System', role: 'Utility-first layout architecture and consistent obsidian surface tokens.' },
  { name: 'Python', category: 'Core Runtime', role: 'Primary runtime orchestrating video decoding, tracking, and spatial math.' },
  { name: 'FastAPI', category: 'Backend API', role: 'High-throughput REST and streaming interface connecting Python ML to the frontend.' },
  { name: 'YOLO', category: 'Object Detection', role: 'Single-stage neural detector isolating vehicles, transit, freight, and pedestrians.' },
  { name: 'OpenCV', category: 'Computer Vision', role: 'Frame ingestion, perspective geometry, zone polygons, and visual annotation.' },
  { name: 'Three.js', category: 'Interactive 3D', role: 'Real-time WebGL traffic intersection simulation powering this portfolio showcase.' },
] as const;

export const DEVELOPMENT_JOURNEY = [
  {
    phase: 'Phase 01',
    title: 'Problem Research & Camera Geometry',
    detail:
      'Studied how fixed municipal traffic intersections rely on buried inductive loops and rigid signal timers, then mapped how elevated camera angles could be translated into software-defined lane zones.',
  },
  {
    phase: 'Phase 02',
    title: 'YOLO + OpenCV Detection Prototype',
    detail:
      'Built the initial Python pipeline to ingest street footage through OpenCV, run YOLO multi-class detection, and filter raw bounding boxes by confidence and vehicle category.',
  },
  {
    phase: 'Phase 03',
    title: 'Tracking, Heatmaps & FastAPI Service',
    detail:
      'Added persistent object tracking, directional zone counters, dwell-time heatmaps, and adaptive signal logic, wrapping the engine in a structured FastAPI backend.',
  },
  {
    phase: 'Phase 04',
    title: 'Next.js Operational Suite & Portfolio',
    detail:
      'Designed the six-module Next.js application for real-world traffic workflows, followed by this standalone 3D storytelling portfolio explaining the engineering end to end.',
  },
] as const;
