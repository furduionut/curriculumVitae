import * as THREE from "three";

export class LogoAnimation {
    constructor() {
        // Temporal-based timing
        this.startInstant = null;
        this.lastInstant = null;

        this.mixer = null;
        this.action = null;
        this.root = null;

        this.bec = null;
        this.lightSegments = [];

        this.currentSegment = null;

        this.becBox = new THREE.Box3();
        this.becCenter = new THREE.Vector3();
        this.segmentBox = new THREE.Box3();

        this.activationDistance = 0.55;

        this.stableIntensity = 3;
        this.burnPeakIntensity = 4.2;

        this.segmentHoldDuration = 1;
        this.groupPatternDuration = 2.5;

        this.fadeOutSpeed = 1.8;
        this.fadeInSpeed = 12;

        this.purpleColor = new THREE.Color(0xb57cff);
    }

    computeDelta() {
        if (!this.lastInstant) {
            this.lastInstant = Temporal.Now.instant();
            return 0;
        }

        const now = Temporal.Now.instant();
        const delta = now.since(this.lastInstant).total('seconds');
        this.lastInstant = now;

        return delta;
    }

    computeElapsed() {
        if (!this.startInstant) return 0;
        return Temporal.Now.instant().since(this.startInstant).total('seconds');
    }

    play(model, animations, clipIndex = 0) {
        this.stop();

        if (!model) {
            console.warn("ModelAnimationController: no model was provided.");
            return;
        }

        this.root = model;

        this.collectModelParts(model);

        if (animations?.length) {
            const clip = animations[clipIndex] ?? animations[0];

            if (!clip) {
                console.warn("ModelAnimationController: animation clip was not found.");
                return;
            }

            this.mixer = new THREE.AnimationMixer(model);
            this.action = this.mixer.clipAction(clip);

            this.action.reset();
            this.action.setLoop(THREE.LoopRepeat, Infinity);
            this.action.clampWhenFinished = false;
            this.action.enabled = true;
            this.action.play();
            this.action.timeScale = 0.7;
        }

        // Start Temporal timing
        this.startInstant = Temporal.Now.instant();
        this.lastInstant = this.startInstant;
    }

    collectModelParts(model) {
        this.bec = null;
        this.lightSegments = [];
        this.currentSegment = null;

        model.traverse((child) => {
            if (!child.isMesh) return;

            const name = child.name.trim().toLowerCase();

            if (name === "bec" || name.startsWith("bec.")) {
                this.bec = child;
                // console.log("BEC found:", child.name);
                return;
            }

            const isArchSegment = name.startsWith("archmov");
            const isItizerSegment = name.startsWith("itizermov");

            if (!isArchSegment && !isItizerSegment) return;

            if (Array.isArray(child.material)) {
                child.material = child.material.map(mat => mat.clone());
            } else if (child.material) {
                child.material = child.material.clone();
            }

            this.prepareSegmentMaterials(child);

            const groupName = isArchSegment ? "archmov" : "itizermov";

            this.lightSegments.push({
                mesh: child,
                groupName,

                isActive: false,
                isFlickering: false,
                hasBeenTriggered: false,

                flickerStartTime: 0,
                holdUntil: 0,

                currentIntensity: 0,
                distanceToBec: Infinity
            });

            // console.log("Light segment found:", child.name, "| group:", groupName);
        });

        if (!this.bec) {
            console.warn('ModelAnimationController: mesh "bec" was not found.');
        }

        if (!this.lightSegments.length) {
            console.warn("ModelAnimationController: no archmovXX or itizermovXX meshes were found.");
        }

        // console.table(
        //     this.lightSegments.map(segment => ({
        //         name: segment.mesh.name,
        //         group: segment.groupName,
        //         materialId: Array.isArray(segment.mesh.material)
        //             ? segment.mesh.material.map(m => m.id).join(", ")
        //             : segment.mesh.material?.id
        //     }))
        // );
    }

    prepareSegmentMaterials(mesh) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        for (const material of materials) {
            if (!material?.color) continue;

            material.userData.baseColor = material.color.clone();

            material.transparent = true;
            material.depthWrite = false;
            material.toneMapped = false;
            material.needsUpdate = true;
        }

        mesh.castShadow = false;
        mesh.receiveShadow = false;
    }

    update() {
        const delta = this.computeDelta();
        const elapsedTime = this.computeElapsed();

        if (this.mixer) {
            this.mixer.update(delta);
        }

        if (!this.root || !this.bec || this.lightSegments.length === 0) {
            return;
        }

        this.root.updateMatrixWorld(true);

        this.becBox.setFromObject(this.bec);
        this.becBox.getCenter(this.becCenter);

        const nearestSegment = this.findNearestLightSegment();

        this.updateActiveSegment(nearestSegment, elapsedTime);

        for (const segment of this.lightSegments) {
            this.updateSegmentLight(segment, elapsedTime, delta);
        }
    }

    findNearestLightSegment() {
        let nearestSegment = null;
        let nearestDistance = Infinity;

        for (const segment of this.lightSegments) {
            this.segmentBox.setFromObject(segment.mesh);

            const distance = this.segmentBox.distanceToPoint(this.becCenter);
            segment.distanceToBec = distance;

            if (distance <= this.activationDistance && distance < nearestDistance) {
                nearestDistance = distance;
                nearestSegment = segment;
            }
        }

        return nearestSegment;
    }

    updateActiveSegment(nearestSegment, elapsedTime) {
        if (nearestSegment && nearestSegment === this.currentSegment) {
            nearestSegment.holdUntil = Math.max(
                nearestSegment.holdUntil,
                elapsedTime + this.segmentHoldDuration
            );
            return;
        }

        this.currentSegment = nearestSegment;

        if (!nearestSegment) return;

        const wasInactive = !nearestSegment.isActive;

        nearestSegment.isActive = true;
        nearestSegment.hasBeenTriggered = true;

        nearestSegment.holdUntil = elapsedTime + this.segmentHoldDuration;

        if (wasInactive) {
            nearestSegment.isFlickering = true;
            nearestSegment.flickerStartTime = elapsedTime;
        }

        this.extendGroupPattern(nearestSegment.groupName, elapsedTime);

        // console.log("Activated:", nearestSegment.mesh.name, "| group:", nearestSegment.groupName);
    }

    extendGroupPattern(groupName, elapsedTime) {
        const groupHoldUntil = elapsedTime + this.groupPatternDuration;

        for (const segment of this.lightSegments) {
            if (segment.groupName !== groupName || !segment.hasBeenTriggered) continue;

            segment.isActive = true;
            segment.holdUntil = Math.max(segment.holdUntil, groupHoldUntil);
        }
    }

    updateSegmentLight(segment, elapsedTime, delta) {
        if (segment.isActive && elapsedTime >= segment.holdUntil) {
            segment.isActive = false;
            segment.isFlickering = false;
        }

        let desiredIntensity = 0;

        if (segment.isActive) {
            if (segment.isFlickering) {
                desiredIntensity = this.getBurningFlickerIntensity(segment, elapsedTime);
            } else {
                desiredIntensity = this.getStableBurningIntensity(elapsedTime, segment);
            }
        }

        if (segment.isFlickering) {
            segment.currentIntensity = desiredIntensity;
        } else {
            const transitionSpeed = segment.isActive ? this.fadeInSpeed : this.fadeOutSpeed;

            segment.currentIntensity = THREE.MathUtils.damp(
                segment.currentIntensity,
                desiredIntensity,
                transitionSpeed,
                delta
            );
        }

        if (!segment.isActive && segment.currentIntensity < 0.01) {
            segment.currentIntensity = 0;
        }

        this.setMeshEmissiveIntensity(segment.mesh, segment.currentIntensity);
    }

    getBurningFlickerIntensity(segment, elapsedTime) {
        const time = elapsedTime - segment.flickerStartTime;

        const sequence = [
            { time: 0.000, intensity: 0 },
            { time: 0.035, intensity: 3.6 },
            { time: 0.075, intensity: 0.15 },
            { time: 0.115, intensity: 2.7 },
            { time: 0.155, intensity: 0.6 },
            { time: 0.200, intensity: 4.1 },
            { time: 0.245, intensity: 1.4 },
            { time: 0.290, intensity: 3.3 },
            { time: 0.345, intensity: 2.1 },
            { time: 0.410, intensity: this.burnPeakIntensity },
            { time: 0.480, intensity: 2.6 },
            { time: 0.560, intensity: this.stableIntensity }
        ];

        for (let i = 0; i < sequence.length - 1; i++) {
            const current = sequence[i];
            const next = sequence[i + 1];

            if (time >= current.time && time < next.time) {
                const noise = (Math.random() - 0.5) * 0.12;
                return Math.max(0, current.intensity + noise);
            }
        }

        segment.isFlickering = false;
        return this.stableIntensity;
    }

    getStableBurningIntensity(elapsedTime, segment) {
        const meshOffset = segment.mesh.id * 0.37;

        const slowPulse = Math.sin(elapsedTime * 8 + meshOffset) * 0.15;
        const fastPulse = Math.sin(elapsedTime * 21 + meshOffset) * 0.07;
        const randomNoise = (Math.random() - 0.5) * 0.05;

        return THREE.MathUtils.clamp(
            this.stableIntensity + slowPulse + fastPulse + randomNoise,
            2.55,
            3.35
        );
    }

    setMeshEmissiveIntensity(mesh, intensity) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        for (const material of materials) {
            if (!material?.color) continue;

            const baseColor = material.userData.baseColor ?? this.purpleColor;

            const brightness = intensity <= 0 ? 1 : 1 + intensity * 1;

            material.color.copy(baseColor).multiplyScalar(brightness);
            material.needsUpdate = true;
        }
    }

    turnOffAllSegments() {
        for (const segment of this.lightSegments) {
            segment.isActive = false;
            segment.isFlickering = false;
            segment.hasBeenTriggered = false;

            segment.flickerStartTime = 0;
            segment.holdUntil = 0;
            segment.currentIntensity = 0;
            segment.distanceToBec = Infinity;

            this.setMeshEmissiveIntensity(segment.mesh, 0);
        }

        this.currentSegment = null;
    }

    stop() {
        if (this.mixer) {
            this.mixer.stopAllAction();

            if (this.root) {
                this.mixer.uncacheRoot(this.root);
            }
        }

        this.turnOffAllSegments();

        this.mixer = null;
        this.action = null;
        this.root = null;

        this.bec = null;
        this.lightSegments = [];
        this.currentSegment = null;

        this.startInstant = null;
        this.lastInstant = null;
    }
}