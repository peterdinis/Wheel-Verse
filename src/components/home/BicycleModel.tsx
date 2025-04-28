"use client";

import {
	AccumulativeShadows,
	ContactShadows,
	Environment,
	OrbitControls,
	PerspectiveCamera,
	RandomizedLight,
	SpotLight,
	useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const SimpleBike = ({ color = "#2196f3" }) => {
	const bikeGroup = useRef<THREE.Group>(null);

	const frameMaterial = new THREE.MeshPhysicalMaterial({
		color: color,
		metalness: 0.9,
		roughness: 0.1,
		clearcoat: 1.0,
		clearcoatRoughness: 0.1,
		envMapIntensity: 1.5,
	});

	const chromeMaterial = new THREE.MeshStandardMaterial({
		color: "#ffffff",
		metalness: 1,
		roughness: 0.1,
		envMapIntensity: 2,
	});

	const rubberMaterial = new THREE.MeshStandardMaterial({
		color: "#333333",
		metalness: 0.1,
		roughness: 0.8,
	});

	// Enhanced frame geometry with more detail
	const frame = new THREE.Group();

	// Top tube with better geometry
	const topTube = new THREE.Mesh(
		new THREE.CylinderGeometry(0.05, 0.05, 1.2, 32, 1, false),
		frameMaterial,
	);
	topTube.rotation.z = Math.PI / 2;
	topTube.position.set(0, 0.5, 0);
	frame.add(topTube);

	// Down tube with variable thickness and bend
	const downTube = new THREE.Mesh(
		new THREE.CylinderGeometry(0.06, 0.05, 1.5, 32),
		frameMaterial,
	);
	downTube.rotation.z = Math.PI / 4;
	downTube.position.set(0.4, 0.1, 0);
	frame.add(downTube);

	// Seat tube with support
	const seatTube = new THREE.Mesh(
		new THREE.CylinderGeometry(0.05, 0.06, 0.8, 32),
		frameMaterial,
	);
	seatTube.position.set(-0.5, 0.4, 0);
	frame.add(seatTube);

	// Chain stays (new detail)
	const chainStay = new THREE.Mesh(
		new THREE.CylinderGeometry(0.03, 0.03, 0.8, 16),
		frameMaterial,
	);
	chainStay.rotation.z = -Math.PI / 6;
	chainStay.position.set(-0.4, 0, 0);
	frame.add(chainStay);

	// Enhanced wheels with more realistic spokes
	const wheelGeometry = new THREE.TorusGeometry(0.4, 0.02, 16, 32);
	const spokesGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.38, 8);

	// Front wheel assembly with chrome hub
	const frontWheelGroup = new THREE.Group();
	const frontWheel = new THREE.Mesh(wheelGeometry, chromeMaterial);
	frontWheelGroup.add(frontWheel);

	// Hub caps
	const frontHub = new THREE.Mesh(
		new THREE.CylinderGeometry(0.05, 0.05, 0.1, 32),
		chromeMaterial,
	);
	frontHub.rotation.x = Math.PI / 2;
	frontWheelGroup.add(frontHub);

	// Add more realistic spokes
	for (let i = 0; i < 16; i++) {
		const spoke = new THREE.Mesh(spokesGeometry, chromeMaterial);
		spoke.rotation.z = (Math.PI / 8) * i;
		frontWheelGroup.add(spoke);
	}
	frontWheelGroup.position.set(0.9, 0, 0);
	frontWheelGroup.rotation.y = Math.PI / 2;

	// Back wheel with similar improvements
	const backWheelGroup = new THREE.Group();
	const backWheel = new THREE.Mesh(wheelGeometry, chromeMaterial);
	backWheelGroup.add(backWheel);

	const backHub = new THREE.Mesh(
		new THREE.CylinderGeometry(0.05, 0.05, 0.1, 32),
		chromeMaterial,
	);
	backHub.rotation.x = Math.PI / 2;
	backWheelGroup.add(backHub);

	for (let i = 0; i < 16; i++) {
		const spoke = new THREE.Mesh(spokesGeometry, chromeMaterial);
		spoke.rotation.z = (Math.PI / 8) * i;
		backWheelGroup.add(spoke);
	}
	backWheelGroup.position.set(-0.6, 0, 0);
	backWheelGroup.rotation.y = Math.PI / 2;

	// Enhanced seat with padding
	const seat = new THREE.Group();
	const seatBase = new THREE.Mesh(
		new THREE.BoxGeometry(0.3, 0.05, 0.2),
		rubberMaterial,
	);
	const seatPadding = new THREE.Mesh(
		new THREE.BoxGeometry(0.28, 0.04, 0.18),
		new THREE.MeshStandardMaterial({ color: "#222222", roughness: 0.9 }),
	);
	seatPadding.position.y = 0.03;
	seat.add(seatBase, seatPadding);
	seat.position.set(-0.5, 0.8, 0);

	// Enhanced handlebar with grips
	const handlebar = new THREE.Group();
	const mainBar = new THREE.Mesh(
		new THREE.CylinderGeometry(0.02, 0.02, 0.6, 16),
		chromeMaterial,
	);
	mainBar.rotation.z = Math.PI / 2;
	handlebar.add(mainBar);

	const leftGrip = new THREE.Mesh(
		new THREE.CylinderGeometry(0.03, 0.03, 0.1, 16),
		rubberMaterial,
	);
	leftGrip.rotation.z = Math.PI / 2;
	leftGrip.position.set(-0.3, 0, 0);
	handlebar.add(leftGrip);

	const rightGrip = new THREE.Mesh(
		new THREE.CylinderGeometry(0.03, 0.03, 0.1, 16),
		rubberMaterial,
	);
	rightGrip.rotation.z = Math.PI / 2;
	rightGrip.position.set(0.3, 0, 0);
	handlebar.add(rightGrip);

	handlebar.position.set(0.8, 0.7, 0);

	// Chain ring (new detail)
	const chainRing = new THREE.Mesh(
		new THREE.TorusGeometry(0.15, 0.02, 16, 32),
		chromeMaterial,
	);
	chainRing.position.set(-0.3, 0.3, 0.1);
	chainRing.rotation.y = Math.PI / 2;

	// Pedals (new detail)
	const pedalGeometry = new THREE.BoxGeometry(0.1, 0.02, 0.05);
	const leftPedal = new THREE.Mesh(pedalGeometry, chromeMaterial);
	leftPedal.position.set(-0.3, 0.3, -0.1);
	const rightPedal = new THREE.Mesh(pedalGeometry, chromeMaterial);
	rightPedal.position.set(-0.3, 0.3, 0.1);

	// Animation
	useFrame((state) => {
		if (bikeGroup.current) {
			bikeGroup.current.rotation.y =
				Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1 + Math.PI / 4;
			bikeGroup.current.position.y =
				Math.sin(state.clock.getElapsedTime()) * 0.05;
		}
	});

	return (
		<group ref={bikeGroup}>
			<primitive object={frame} />
			<primitive object={frontWheelGroup} />
			<primitive object={backWheelGroup} />
			<primitive object={seat} />
			<primitive object={handlebar} />
			<primitive object={chainRing} />
			<primitive object={leftPedal} />
			<primitive object={rightPedal} />
		</group>
	);
};

interface BicycleModelProps {
	autoRotate?: boolean;
	color?: string;
}

export const BicycleModel = ({
	autoRotate = true,
	color = "#2196f3",
}: BicycleModelProps) => {
	return (
		<div className="h-full w-full">
			<Canvas shadows>
				<Environment preset="sunset" />
				<ambientLight intensity={0.5} />
				<SpotLight
					position={[10, 10, 10]}
					angle={0.3}
					penumbra={1}
					intensity={2}
					castShadow
				/>
				<SpotLight
					position={[-10, 5, -10]}
					angle={0.3}
					penumbra={1}
					intensity={1}
					castShadow
				/>
				<ContactShadows
					position={[0, -1, 0]}
					opacity={0.4}
					scale={5}
					blur={2.4}
				/>
				<PerspectiveCamera makeDefault position={[0, 1, 5]} />
				<SimpleBike color={color} />
				<OrbitControls
					enablePan={false}
					enableZoom={true}
					autoRotate={autoRotate}
					autoRotateSpeed={1.5}
					minPolarAngle={Math.PI / 6}
					maxPolarAngle={Math.PI / 2}
				/>
			</Canvas>
		</div>
	);
};
