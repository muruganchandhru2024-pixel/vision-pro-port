import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Eye, EyeOff, Pause, Play, ChevronDown, ChevronUp, Camera } from 'lucide-react';

type CameraPreset = 'aerial' | 'corridor' | 'street';

const CAMERA_PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number]; label: string }> = {
  aerial: { pos: [19, 15.5, 21], target: [0, 0.5, 0], label: 'Aerial Angle' },
  corridor: { pos: [-22, 9.5, 16], target: [0, 0.6, 0], label: 'Corridor Sweep' },
  street: { pos: [11.5, 4.2, 13.5], target: [-1, 1.0, -1], label: 'Gantry View' },
};

// Reusable math objects at module scope (zero GC inside animation loop)
const _camGoal = new THREE.Vector3();
const _targetGoal = new THREE.Vector3();
const _curTarget = new THREE.Vector3(0, 0.5, 0);

interface VehicleAgent {
  group: THREE.Group;
  bbox: THREE.LineSegments;
  axis: 'x' | 'z';
  dir: 1 | -1;
  laneOffset: number;
  pos: number;
  speed: number;
  maxSpeed: number;
  length: number;
}

function createRoadTexture(maxAniso: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Obsidian asphalt base
  ctx.fillStyle = '#0e1118';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle asphalt grain
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const v = 16 + Math.floor(Math.random() * 18);
    ctx.fillStyle = `rgb(${v},${v + 2},${v + 6})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Roadway corridors (center cross: 362..662)
  ctx.fillStyle = '#141822';
  ctx.fillRect(352, 0, 320, 1024);
  ctx.fillRect(0, 352, 1024, 320);

  // Double yellow center lines
  ctx.fillStyle = '#c89b3c';
  ctx.fillRect(507, 0, 4, 330);
  ctx.fillRect(515, 0, 4, 330);
  ctx.fillRect(507, 694, 4, 330);
  ctx.fillRect(515, 694, 4, 330);

  ctx.fillRect(0, 507, 330, 4);
  ctx.fillRect(0, 515, 330, 4);
  ctx.fillRect(694, 507, 330, 4);
  ctx.fillRect(694, 515, 330, 4);

  // White dashed lane dividers
  ctx.fillStyle = 'rgba(244, 243, 239, 0.42)';
  for (let i = 20; i < 310; i += 44) {
    ctx.fillRect(432, i, 3, 22);
    ctx.fillRect(589, i, 3, 22);
    ctx.fillRect(432, 704 + i, 3, 22);
    ctx.fillRect(589, 704 + i, 3, 22);

    ctx.fillRect(i, 432, 22, 3);
    ctx.fillRect(i, 589, 22, 3);
    ctx.fillRect(704 + i, 432, 22, 3);
    ctx.fillRect(704 + i, 589, 22, 3);
  }

  // Crosswalk zebra markings
  ctx.fillStyle = 'rgba(244, 243, 239, 0.72)';
  for (let p = 368; p <= 640; p += 24) {
    ctx.fillRect(p, 326, 12, 28);
    ctx.fillRect(p, 670, 12, 28);
    ctx.fillRect(326, p, 28, 12);
    ctx.fillRect(670, p, 28, 12);
  }

  // Stop bars
  ctx.fillStyle = 'rgba(244, 243, 239, 0.85)';
  ctx.fillRect(356, 314, 148, 5);
  ctx.fillRect(520, 705, 148, 5);
  ctx.fillRect(314, 520, 5, 148);
  ctx.fillRect(705, 356, 5, 148);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}

function buildCompositeVehicle(
  kind: 'sedan' | 'suv' | 'bus' | 'truck',
  bodyColor: number
): { group: THREE.Group; bbox: THREE.LineSegments; length: number } {
  const group = new THREE.Group();

  const dims =
    kind === 'bus'
      ? { w: 1.55, h: 1.45, l: 4.9, cabinL: 4.5, cabinH: 0.9, cabinZ: 0 }
      : kind === 'truck'
      ? { w: 1.5, h: 1.35, l: 3.9, cabinL: 1.15, cabinH: 0.7, cabinZ: 1.25 }
      : kind === 'suv'
      ? { w: 1.32, h: 0.82, l: 2.75, cabinL: 1.6, cabinH: 0.52, cabinZ: -0.15 }
      : { w: 1.25, h: 0.62, l: 2.55, cabinL: 1.25, cabinH: 0.44, cabinZ: -0.12 };

  const paintMat = new THREE.MeshPhysicalMaterial({
    color: bodyColor,
    metalness: 0.65,
    roughness: 0.25,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x090d14,
    metalness: 0.25,
    roughness: 0.08,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x111318,
    metalness: 0.05,
    roughness: 0.88,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x9aa3b2,
    metalness: 0.85,
    roughness: 0.25,
  });

  const headMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0xfff3c4,
    emissiveIntensity: 1.6,
  });

  const tailMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xef4444,
    emissiveIntensity: 1.4,
  });

  // 1. Primary Chassis
  const chassisH = kind === 'bus' ? 1.25 : kind === 'truck' ? 0.55 : dims.h * 0.6;
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(dims.w, chassisH, dims.l), paintMat);
  chassis.position.y = 0.28 + chassisH / 2;
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  group.add(chassis);

  // 2. Secondary Silhouette (Cabin or Cargo Box)
  if (kind === 'truck') {
    const cargoMat = new THREE.MeshStandardMaterial({
      color: 0xd9dde6,
      metalness: 0.2,
      roughness: 0.55,
    });
    const cargo = new THREE.Mesh(new THREE.BoxGeometry(dims.w + 0.06, 1.35, 2.55), cargoMat);
    cargo.position.set(0, 0.85 + 0.675, -0.58);
    cargo.castShadow = true;
    group.add(cargo);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(dims.w * 0.92, 0.95, dims.cabinL), paintMat);
    cab.position.set(0, 0.72 + 0.475, dims.cabinZ);
    cab.castShadow = true;
    group.add(cab);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(dims.w * 0.82, 0.42, 0.08), glassMat);
    windshield.position.set(0, 1.25, dims.cabinZ + dims.cabinL / 2 - 0.01);
    group.add(windshield);
  } else if (kind === 'bus') {
    const windowBand = new THREE.Mesh(new THREE.BoxGeometry(dims.w + 0.03, 0.46, dims.l * 0.88), glassMat);
    windowBand.position.set(0, 1.15, 0.05);
    group.add(windowBand);

    const roofUnit = new THREE.Mesh(
      new THREE.BoxGeometry(dims.w * 0.65, 0.14, dims.l * 0.45),
      new THREE.MeshStandardMaterial({ color: 0x3b4254, metalness: 0.4, roughness: 0.5 })
    );
    roofUnit.position.set(0, 1.6, -0.2);
    group.add(roofUnit);
  } else {
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(dims.w * 0.86, dims.cabinH, dims.cabinL), glassMat);
    cabin.position.set(0, 0.28 + chassisH + dims.cabinH / 2 - 0.02, dims.cabinZ);
    cabin.castShadow = true;
    group.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(dims.w * 0.8, 0.06, dims.cabinL * 0.82), paintMat);
    roof.position.set(0, 0.28 + chassisH + dims.cabinH, dims.cabinZ - 0.03);
    group.add(roof);
  }

  // 3. Four Wheels (Tire + Alloy Rim)
  const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  const rimGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.17, 12);
  rimGeo.rotateZ(Math.PI / 2);

  const zFront = dims.l * 0.31;
  const zRear = -dims.l * 0.31;
  const xWheel = dims.w * 0.49;

  for (const [wx, wz] of [
    [-xWheel, zFront],
    [xWheel, zFront],
    [-xWheel, zRear],
    [xWheel, zRear],
  ]) {
    const tire = new THREE.Mesh(wheelGeo, tireMat);
    tire.position.set(wx, 0.24, wz);
    group.add(tire);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.set(wx, 0.24, wz);
    group.add(rim);
  }

  // 4. Headlights & Taillights
  const lightGeo = new THREE.BoxGeometry(0.22, 0.1, 0.06);
  const xLight = dims.w * 0.32;
  for (const lx of [-xLight, xLight]) {
    const head = new THREE.Mesh(lightGeo, headMat);
    head.position.set(lx, 0.48, dims.l / 2);
    group.add(head);

    const tail = new THREE.Mesh(lightGeo, tailMat);
    tail.position.set(lx, 0.5, -dims.l / 2);
    group.add(tail);
  }

  // 5. Computer Vision 3D Bounding Box Overlay
  const boxHeight = kind === 'bus' ? 1.72 : kind === 'truck' ? 1.9 : dims.h + 0.65;
  const boxGeo = new THREE.BoxGeometry(dims.w + 0.28, boxHeight, dims.l + 0.3);
  const edges = new THREE.EdgesGeometry(boxGeo);
  boxGeo.dispose();
  const boxColor = kind === 'bus' ? 0xa78bfa : kind === 'truck' ? 0xf59e0b : 0x22d3ee;
  const bbox = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({
      color: boxColor,
      transparent: true,
      opacity: 0.78,
    })
  );
  bbox.position.y = boxHeight / 2 + 0.05;
  group.add(bbox);

  return { group, bbox, length: dims.l };
}

export function TrafficIntersection3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [preset, setPreset] = useState<CameraPreset>('aerial');
  const [showCvOverlay, setShowCvOverlay] = useState(true);
  const [paused, setPaused] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const presetRef = useRef<CameraPreset>('aerial');
  const overlayRef = useRef<boolean>(true);
  const pausedRef = useRef<boolean>(false);

  useEffect(() => {
    presetRef.current = preset;
  }, [preset]);

  useEffect(() => {
    overlayRef.current = showCvOverlay;
  }, [showCvOverlay]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect software WebGL cleanly from GPU renderer string
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06070a);
    scene.fog = new THREE.FogExp2(0x06070a, 0.017);

    // Procedural studio environment for metallic & clearcoat reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 160);
    camera.position.set(...CAMERA_PRESETS.aerial.pos);
    camera.lookAt(...CAMERA_PRESETS.aerial.target);

    // Three-point lighting + cool/warm contrast
    const hemiLight = new THREE.HemisphereLight(0x6e85b7, 0x0c0e14, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffe9c8, 1.45);
    keyLight.position.set(16, 26, 14);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 65;
    keyLight.shadow.camera.left = -24;
    keyLight.shadow.camera.right = 24;
    keyLight.shadow.camera.top = 24;
    keyLight.shadow.camera.bottom = -24;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x22d3ee, 0.65);
    rimLight.position.set(-18, 12, -16);
    scene.add(rimLight);

    // Ground & Road Network
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const roadTex = createRoadTexture(maxAniso);
    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      roughness: 0.72,
      metalness: 0.08,
    });
    const roadPlane = new THREE.Mesh(new THREE.PlaneGeometry(52, 52), roadMat);
    roadPlane.rotation.x = -Math.PI / 2;
    roadPlane.receiveShadow = true;
    scene.add(roadPlane);

    // Extended infinite obsidian ground apron
    const apronMat = new THREE.MeshStandardMaterial({
      color: 0x07090e,
      roughness: 0.92,
      metalness: 0.05,
    });
    const apron = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), apronMat);
    apron.rotation.x = -Math.PI / 2;
    apron.position.y = -0.03;
    scene.add(apron);

    // Four Corner Sidewalk Quadrants + Architectural Blocks
    const sidewalkMat = new THREE.MeshStandardMaterial({
      color: 0x161a24,
      roughness: 0.85,
      metalness: 0.1,
    });
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0f131c,
      roughness: 0.45,
      metalness: 0.35,
    });
    const windowGlowMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x164e63,
      emissiveIntensity: 0.7,
      roughness: 0.3,
    });

    const quadrantCoords: [number, number][] = [
      [-17.2, -17.2],
      [17.2, -17.2],
      [-17.2, 17.2],
      [17.2, 17.2],
    ];

    for (const [qx, qz] of quadrantCoords) {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.22, 17.5), sidewalkMat);
      pad.position.set(qx, 0.11, qz);
      pad.receiveShadow = true;
      scene.add(pad);

      // Architectural tower massing in each corner
      const bH = 5.5 + (Math.abs(qx + qz) % 5);
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(11.5, bH, 11.5), buildingMat);
      bldg.position.set(qx * 1.05, 0.22 + bH / 2, qz * 1.05);
      bldg.castShadow = true;
      bldg.receiveShadow = true;
      scene.add(bldg);

      // Subtle architectural horizontal reveal strip
      const strip = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.08, 11.6), windowGlowMat);
      strip.position.set(qx * 1.05, 0.22 + bH * 0.72, qz * 1.05);
      scene.add(strip);
    }

    // Four Signal Mast Arms & Live Phase Lights
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x2a3140,
      metalness: 0.75,
      roughness: 0.35,
    });

    const nsSignalMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x22c55e,
      emissiveIntensity: 2.0,
    });
    const ewSignalMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 2.0,
    });

    const signalConfigs: { pos: [number, number, number]; rotY: number; mat: THREE.MeshStandardMaterial }[] = [
      { pos: [-8.8, 0, 8.8], rotY: 0, mat: nsSignalMat },
      { pos: [8.8, 0, -8.8], rotY: Math.PI, mat: nsSignalMat },
      { pos: [8.8, 0, 8.8], rotY: Math.PI / 2, mat: ewSignalMat },
      { pos: [-8.8, 0, -8.8], rotY: -Math.PI / 2, mat: ewSignalMat },
    ];

    for (const cfg of signalConfigs) {
      const gantry = new THREE.Group();
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 5.2, 10), poleMat);
      post.position.y = 2.6;
      gantry.add(post);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 5.2, 8), poleMat);
      arm.rotation.z = Math.PI / 2;
      arm.position.set(2.5, 4.9, 0);
      gantry.add(arm);

      const housing = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.9, 0.35), poleMat);
      housing.position.set(4.1, 4.65, 0);
      gantry.add(housing);

      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), cfg.mat);
      lamp.position.set(4.1, 4.65, 0.18);
      gantry.add(lamp);

      gantry.position.set(...cfg.pos);
      gantry.rotation.y = cfg.rotY;
      scene.add(gantry);
    }

    // Computer Vision Ground-Plane Radar Sweep Ring
    const scanRingGeo = new THREE.RingGeometry(0.1, 0.35, 64);
    scanRingGeo.rotateX(-Math.PI / 2);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.position.y = 0.04;
    scene.add(scanRing);

    // Intersection Detection Grid Ring
    const zoneRingGeo = new THREE.RingGeometry(8.6, 8.72, 64);
    zoneRingGeo.rotateX(-Math.PI / 2);
    const zoneRingMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });
    const zoneRing = new THREE.Mesh(zoneRingGeo, zoneRingMat);
    zoneRing.position.y = 0.03;
    scene.add(zoneRing);

    // Spawn 10 Multi-Part Vehicles across NS & EW Lanes
    const vehicleSpecs: {
      kind: 'sedan' | 'suv' | 'bus' | 'truck';
      color: number;
      axis: 'x' | 'z';
      dir: 1 | -1;
      laneOffset: number;
      startPos: number;
      maxSpeed: number;
    }[] = [
      { kind: 'sedan', color: 0xe2e8f0, axis: 'z', dir: 1, laneOffset: -2.1, startPos: -22, maxSpeed: 6.2 },
      { kind: 'suv', color: 0x334155, axis: 'z', dir: 1, laneOffset: -5.4, startPos: -12, maxSpeed: 5.8 },
      { kind: 'bus', color: 0x64748b, axis: 'z', dir: -1, laneOffset: 2.1, startPos: 19, maxSpeed: 4.5 },
      { kind: 'sedan', color: 0x1e293b, axis: 'z', dir: -1, laneOffset: 5.4, startPos: 7, maxSpeed: 6.4 },
      { kind: 'truck', color: 0x475569, axis: 'x', dir: 1, laneOffset: 2.1, startPos: -21, maxSpeed: 4.8 },
      { kind: 'sedan', color: 0xfacc15, axis: 'x', dir: 1, laneOffset: 5.4, startPos: -10, maxSpeed: 6.1 },
      { kind: 'suv', color: 0x0f172a, axis: 'x', dir: -1, laneOffset: -2.1, startPos: 18, maxSpeed: 5.9 },
      { kind: 'sedan', color: 0x94a3b8, axis: 'x', dir: -1, laneOffset: -5.4, startPos: 8, maxSpeed: 6.3 },
    ];

    const agents: VehicleAgent[] = vehicleSpecs.map((spec) => {
      const { group, bbox, length } = buildCompositeVehicle(spec.kind, spec.color);
      if (spec.axis === 'z') {
        group.position.set(spec.laneOffset, 0.02, spec.startPos);
        group.rotation.y = spec.dir === 1 ? 0 : Math.PI;
      } else {
        group.position.set(spec.startPos, 0.02, spec.laneOffset);
        group.rotation.y = spec.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      }
      scene.add(group);
      return {
        group,
        bbox,
        axis: spec.axis,
        dir: spec.dir,
        laneOffset: spec.laneOffset,
        pos: spec.startPos,
        speed: spec.maxSpeed,
        maxSpeed: spec.maxSpeed,
        length,
      };
    });

    // Cursor parallax interaction
    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', onResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    let simTime = 0;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function stepSimulation(dt: number) {
      if (!pausedRef.current && !prefersReducedMotion) {
        simTime += dt;
      }

      // 14s signal cycle: 0-5.5 NS Green, 5.5-7.0 NS Amber, 7.0-12.5 EW Green, 12.5-14.0 EW Amber
      const cycle = simTime % 14;
      const nsGreen = cycle < 5.5;
      const nsAmber = cycle >= 5.5 && cycle < 7.0;
      const ewGreen = cycle >= 7.0 && cycle < 12.5;
      const ewAmber = cycle >= 12.5;

      if (nsGreen) {
        nsSignalMat.color.setHex(0x22c55e);
        nsSignalMat.emissive.setHex(0x22c55e);
      } else if (nsAmber) {
        nsSignalMat.color.setHex(0xf59e0b);
        nsSignalMat.emissive.setHex(0xf59e0b);
      } else {
        nsSignalMat.color.setHex(0xef4444);
        nsSignalMat.emissive.setHex(0xef4444);
      }

      if (ewGreen) {
        ewSignalMat.color.setHex(0x22c55e);
        ewSignalMat.emissive.setHex(0x22c55e);
      } else if (ewAmber) {
        ewSignalMat.color.setHex(0xf59e0b);
        ewSignalMat.emissive.setHex(0xf59e0b);
      } else {
        ewSignalMat.color.setHex(0xef4444);
        ewSignalMat.emissive.setHex(0xef4444);
      }

      // Update CV scanning wave
      const showOverlay = overlayRef.current;
      scanRing.visible = showOverlay;
      zoneRing.visible = showOverlay;
      if (showOverlay) {
        const wave = (simTime * 0.32) % 1;
        const scale = 1 + wave * 34;
        scanRing.scale.set(scale, 1, scale);
        scanRingMat.opacity = (1 - wave) * 0.42;
      }

      // Move vehicles with realistic stop-bar deceleration & collision headway
      const activeDt = pausedRef.current || prefersReducedMotion ? 0 : dt;
      for (const agent of agents) {
        agent.bbox.visible = showOverlay;

        const isAxisGreen = agent.axis === 'z' ? nsGreen : ewGreen;
        const stopLine = -9.6; // approaching from negative toward 0 when dir === 1
        const signedPos = agent.pos * agent.dir; // negative = approaching intersection, positive = past center

        let targetSpeed = agent.maxSpeed;
        if (!isAxisGreen && signedPos < stopLine && signedPos > stopLine - 6.5) {
          targetSpeed = 0;
        }

        // Check vehicle ahead in same lane
        for (const other of agents) {
          if (other === agent || other.axis !== agent.axis || other.dir !== agent.dir) continue;
          if (Math.abs(other.laneOffset - agent.laneOffset) > 0.5) continue;
          const gap = (other.pos - agent.pos) * agent.dir;
          if (gap > 0 && gap < agent.length + 2.4) {
            targetSpeed = Math.min(targetSpeed, other.speed * 0.6);
          }
        }

        agent.speed = THREE.MathUtils.damp(agent.speed, targetSpeed, 5.5, Math.max(activeDt, 0.016));
        agent.pos += agent.dir * agent.speed * activeDt;

        if (agent.pos > 25) agent.pos = -25;
        if (agent.pos < -25) agent.pos = 25;

        if (agent.axis === 'z') {
          agent.group.position.z = agent.pos;
        } else {
          agent.group.position.x = agent.pos;
        }
      }

      // Smooth damped camera preset + subtle pointer parallax
      const cfg = CAMERA_PRESETS[presetRef.current];
      const swayX = pointerX * 1.4;
      const swayY = -pointerY * 0.7;
      _camGoal.set(cfg.pos[0] + swayX, cfg.pos[1] + swayY, cfg.pos[2] - swayX * 0.35);
      _targetGoal.set(...cfg.target);

      const camLambda = 3.2;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _camGoal.x, camLambda, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _camGoal.y, camLambda, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _camGoal.z, camLambda, dt);

      _curTarget.x = THREE.MathUtils.damp(_curTarget.x, _targetGoal.x, camLambda, dt);
      _curTarget.y = THREE.MathUtils.damp(_curTarget.y, _targetGoal.y, camLambda, dt);
      _curTarget.z = THREE.MathUtils.damp(_curTarget.z, _targetGoal.z, camLambda, dt);
      camera.lookAt(_curTarget);
    }

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      stepSimulation(dt);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('webglcontextlost', onContextLost);

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.LineSegments).isLineSegments) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material?.dispose();
          }
        }
      });
      roadTex.dispose();
      envTex.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#06070A]">
      {webglUnavailable ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55"
          style={{ backgroundImage: `url('/src/assets/images/traffic_intersection_raw_1795681945089.jpg')` }}
        />
      ) : (
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Subtle directional vignette scrim for editorial typography contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#06070A]/90 via-[#06070A]/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06070A] via-transparent to-[#06070A]/60"
      />

      {/* Unified Collapsible Bottom Control Dock (no backdrop-blur over WebGL) */}
      <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0D1017]/95 px-3 py-1.5 text-xs font-medium text-[#9BA1AE] hover:text-[#F4F3EF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{dockCollapsed ? 'Show 3D Controls' : 'Hide 3D Controls'}</span>
        </button>

        {!dockCollapsed && (
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-[#0D1017]/95 p-1.5 shadow-2xl">
            <div className="flex items-center gap-1 pr-2 border-r border-white/10">
              <Camera className="w-3.5 h-3.5 text-cyan-400 ml-1.5 mr-1" />
              {(['aerial', 'corridor', 'street'] as CameraPreset[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPreset(key)}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    preset === key
                      ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30'
                      : 'text-[#9BA1AE] hover:text-[#F4F3EF] border border-transparent'
                  }`}
                >
                  {CAMERA_PRESETS[key].label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowCvOverlay((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showCvOverlay
                  ? 'bg-white/10 text-[#F4F3EF]'
                  : 'text-[#9BA1AE] hover:text-[#F4F3EF]'
              }`}
            >
              {showCvOverlay ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>CV Boxes</span>
            </button>

            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-[#9BA1AE] hover:text-[#F4F3EF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {paused ? <Play className="w-3.5 h-3.5 text-cyan-400" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{paused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
