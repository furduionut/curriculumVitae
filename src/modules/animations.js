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
        this.litPurpleColor = new THREE.Color(0xffffff);
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





            if (
                name === "bec" ||
                name.startsWith("bec.") ||
                name === "lightbulbmesh.001"
            ) {
                this.bec = child;

                // White outer glow — always visible
                this.bulbGlow = this.createOuterGlow(
                    child,
                    0xffffff,
                    1
                );
                // Enlarge only the bulb's outer glow
                this.bulbGlow.scale.multiplyScalar(3);
                this.bulbGlow.renderOrder = 3;
                this.bulbGlow.material.depthTest = false;
                this.bulbGlow.material.depthWrite = false;

                // White bulb glow should visually cover purple glow
                this.bulbGlow.material.blending = THREE.NormalBlending;
                this.bulbGlow.material.needsUpdate = true;

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

            // Purple geometry renders above all glows
            child.renderOrder = 10;
            // Individual, distributed halos instead of one family-wide sprite.
            // Keep the original logo glow color.
            const glows = this.createSegmentGlows(child, 0x8e93f8);

            const reflectionLight = new THREE.PointLight(
                0x8e93f8, // Purple light
                0,        // Initially OFF
                2.5,      // Distance the light reaches
                2         // Light falloff
            );

            // Position light at the center of the segment
            child.geometry.computeBoundingBox();

            reflectionLight.position.copy(
                child.geometry.boundingBox.getCenter(
                    new THREE.Vector3()
                )
            );

            child.add(reflectionLight);



            const groupName = isArchSegment ? "archmov" : "itizermov";

            // this.lightSegments.push({
            //     mesh: child,
            //     groupName,

            //     isActive: false,
            //     isFlickering: false,
            //     hasBeenTriggered: false,

            //     flickerStartTime: 0,
            //     holdUntil: 0,

            //     currentIntensity: 0,
            //     distanceToBec: Infinity
            // });

            this.lightSegments.push({
                mesh: child,
                glows: glows,
                groupName,

                isActive: false,
                isFlickering: false,
                hasBeenTriggered: false,

                flickerStartTime: 0,
                holdUntil: 0,

                currentIntensity: 0,
                distanceToBec: Infinity,
                reflectionLight: reflectionLight,
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



    createOuterGlow(mesh, color, opacity = 0) {

        const isBulb = mesh === this.bec;

        const textureKey = isBulb
            ? "bulbGlowTexture"
            : "segmentGlowTexture";

        // Create a separate glow texture for bulb and segments
        if (!this[textureKey]) {
            const canvas = document.createElement("canvas");
            canvas.width = 128;
            canvas.height = 128;

            const ctx = canvas.getContext("2d");

            const gradient = ctx.createRadialGradient(
                64, 64, 0,
                64, 64, 64
            );

            if (isBulb) {
                // Strong white bulb glow
                gradient.addColorStop(0, "rgba(255,255,255,0.65)");
                gradient.addColorStop(0.1, "rgba(255,255,255,0.45)");
                gradient.addColorStop(0.4, "rgba(255,255,255,0.15)");
                gradient.addColorStop(1, "rgba(255,255,255,0)");
            } else {
                // Soft, diffused purple segment glow
                gradient.addColorStop(0, "rgba(255,255,255,0.18)");
                gradient.addColorStop(0.1, "rgba(255,255,255,0.14)");
                gradient.addColorStop(0.4, "rgba(255,255,255,0.09)");
                gradient.addColorStop(1, "rgba(255,255,255,0)");
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 128, 128);

            this[textureKey] = new THREE.CanvasTexture(canvas);
        }

        // Create the glow sprite
        const glow = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: this[textureKey],
                color: color,
                transparent: true,
                opacity: opacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                depthTest: true,
                toneMapped: false
            })
        );

        // Center the glow on the geometry
        mesh.geometry.computeBoundingBox();

        const box = mesh.geometry.boundingBox;
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const diameter = Math.max(size.x, size.y, size.z);

        glow.position.copy(center);

        // Initial glow size
        glow.scale.set(
            diameter * 2,
            diameter * 2,
            1
        );

        mesh.add(glow);

        return glow;
    }



createSegmentGlows(mesh, color = 0x8e93f8) {
    const geometry = mesh.geometry;
    const positions = geometry.getAttribute("position");
    const indices = geometry.getIndex();

    if (!positions) return [];

    geometry.computeBoundingBox();

    const size = geometry.boundingBox.getSize(
        new THREE.Vector3()
    );

    const longest = Math.max(size.x, size.y, size.z);

    // GLOW CONTROLS
    const spacing = Math.max(longest / 36, 0.0001);
    const glowDiameter = 7.5;
    const maxGlows = 90;

    // Use the two main axes of the segment
    const axes = ["x", "y", "z"].sort(
        (a, b) => size[b] - size[a]
    );

    const axisA = axes[0];
    const axisB = axes[1];

    const cells = new Map();

    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const edge1 = new THREE.Vector3();
    const edge2 = new THREE.Vector3();

    const triangleCount = indices
        ? Math.floor(indices.count / 3)
        : Math.floor(positions.count / 3);

    // Sample points INSIDE the triangles,
    // not only at geometry vertices.
    for (let i = 0; i < triangleCount; i++) {
        const ia = indices ? indices.getX(i * 3) : i * 3;
        const ib = indices ? indices.getX(i * 3 + 1) : i * 3 + 1;
        const ic = indices ? indices.getX(i * 3 + 2) : i * 3 + 2;

        a.fromBufferAttribute(positions, ia);
        b.fromBufferAttribute(positions, ib);
        c.fromBufferAttribute(positions, ic);

        edge1.subVectors(b, a);
        edge2.subVectors(c, a);

        const area = edge1.clone()
            .cross(edge2)
            .length() * 0.5;

        if (area < 0.00000001) continue;

        // Larger triangles get more interior samples
        const samples = Math.min(
            100,
            Math.max(
                1,
                Math.ceil(area / (spacing * spacing) * 3)
            )
        );

        for (let j = 0; j < samples; j++) {
            // Evenly distributed triangle sampling
            const r1 = (j + 0.5) / samples;
            const r2 = (j * 0.61803398875) % 1;

            const sr = Math.sqrt(r1);

            const wa = 1 - sr;
            const wb = sr * (1 - r2);
            const wc = sr * r2;

            const point = new THREE.Vector3(
                a.x * wa + b.x * wb + c.x * wc,
                a.y * wa + b.y * wb + c.y * wc,
                a.z * wa + b.z * wb + c.z * wc
            );

            const key =
                Math.floor(point[axisA] / spacing) + "," +
                Math.floor(point[axisB] / spacing);

            if (!cells.has(key)) {
                cells.set(key, {
                    position: new THREE.Vector3(),
                    count: 0
                });
            }

            const cell = cells.get(key);
            cell.position.add(point);
            cell.count++;
        }
    }

    // Average the samples inside each cell
    const centers = Array.from(cells.values()).map(
        cell => cell.position.divideScalar(cell.count)
    );

    // Spread selected points across the entire segment
    centers.sort((p, q) =>
        p[axisA] - q[axisA] ||
        p[axisB] - q[axisB]
    );

    const glows = [];
    const count = Math.min(maxGlows, centers.length);

    for (let i = 0; i < count; i++) {
        const index = Math.floor(
            (i + 0.5) * centers.length / count
        );

        const center = centers[index];

        const glow = this.createOuterGlow(
            mesh,
            color,
            0
        );

        glow.position.copy(center);

        glow.scale.set(
            glowDiameter,
            glowDiameter,
            1
        );

        // Prevent extreme overlapping brightness
        glow.material.blending = THREE.AdditiveBlending;
        glow.material.depthTest = false;
        glow.material.depthWrite = false;
        glow.renderOrder = 6;

        glows.push(glow);
    }

    return glows;
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

        // Use only the bulb geometry: decorative sprites must not affect
        // which segment is considered close enough to illuminate.
        if (!this.bec.geometry.boundingBox) {
            this.bec.geometry.computeBoundingBox();
        }
        this.becBox.copy(this.bec.geometry.boundingBox)
            .applyMatrix4(this.bec.matrixWorld);
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
            // Ignore the attached glow sprites in activation detection.
            if (!segment.mesh.geometry.boundingBox) {
                segment.mesh.geometry.computeBoundingBox();
            }
            this.segmentBox.copy(segment.mesh.geometry.boundingBox)
                .applyMatrix4(segment.mesh.matrixWorld);

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
        // Purple reflections on the glass
        if (segment.reflectionLight) {
            segment.reflectionLight.intensity =
                THREE.MathUtils.clamp(
                    segment.currentIntensity / this.stableIntensity,
                    0,
                    1.4
                ) * 5;
        }

        // Every small halo follows this exact segment's existing flicker
        // and fades back to invisible when the purple segment is off.
        if (segment.glows) {
            const opacity = THREE.MathUtils.clamp(
                segment.currentIntensity / this.stableIntensity * 0.6,
                0,
                0.08
            );
            for (const glow of segment.glows) {
                glow.material.opacity = opacity;
            }
        }

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
        const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

        const glowStrength = THREE.MathUtils.clamp(
            intensity / this.burnPeakIntensity,
            0,
            1
        );

        for (const material of materials) {
            if (!material?.color) continue;

            const baseColor =
                material.userData.baseColor ?? this.purpleColor;

            // Brighten the whole surface uniformly
            material.color
                .copy(baseColor)
                .lerp(this.litPurpleColor, glowStrength * 2);
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

            // Reset segment material
            this.setMeshEmissiveIntensity(segment.mesh, 0);

            // Turn off purple outer glows
            for (const glow of segment.glows ?? []) {
                glow.material.opacity = 0;
            }

            // Turn off purple reflections on glass
            if (segment.reflectionLight) {
                segment.reflectionLight.intensity = 0;
            }
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

        // Remove bulb glow
        if (this.bulbGlow) {
            this.bulbGlow.removeFromParent();
            this.bulbGlow.material.dispose();
            this.bulbGlow = null;
        }

        // Remove purple glows and reflection lights
        for (const segment of this.lightSegments) {
            for (const glow of segment.glows ?? []) {
                glow.removeFromParent();
                glow.material.dispose();
            }

            if (segment.reflectionLight) {
                segment.reflectionLight.removeFromParent();
                segment.reflectionLight.dispose();
            }
        }

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