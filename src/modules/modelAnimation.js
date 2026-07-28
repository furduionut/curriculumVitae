import * as THREE from "three";

export class ModelAnimationController {
    constructor() {
        this.clock = new THREE.Clock();

        this.mixer = null;
        this.action = null;
        this.root = null;

        this.bec = null;
        this.lightSegments = [];

        this.currentSegment = null;

        this.becBox = new THREE.Box3();
        this.becCenter = new THREE.Vector3();
        this.segmentBox = new THREE.Box3();

        /*
         * Distance at which bec activates a segment.
         *
         * Reduce this if neighboring elements activate too early.
         * Increase it if bec does not activate some elements.
         */
        this.activationDistance = 0.55;

        /*
         * Emissive brightness.
         *
         * These values work with the lower Bloom threshold
         * previously added in scripts.js.
         */
        this.stableIntensity = 3;
        this.burnPeakIntensity = 4.2;

        /*
         * How long the currently reached element stays illuminated.
         */
        this.segmentHoldDuration = 1;

        /*
         * How long all already-triggered elements from the same
         * group remain visible together.
         *
         * archmov01 + archmov02
         * itizermov01 + itizermov02 + itizermov03
         */
        this.groupPatternDuration = 2.5;

        /*
         * Fade speed after a pattern expires.
         * Lower value means a longer fade.
         */
        this.fadeOutSpeed = 1.8;

        /*
         * Fade-in speed after startup flickering.
         */
        this.fadeInSpeed = 12;

        this.purpleColor = new THREE.Color(0xb57cff);
    }

    play(model, animations, clipIndex = 0) {
        this.stop();

        if (!model) {
            console.warn(
                "ModelAnimationController: no model was provided."
            );

            return;
        }

        this.root = model;

        this.collectModelParts(model);

        if (animations?.length) {
            const clip =
                animations[clipIndex] ??
                animations[0];

            if (!clip) {
                console.warn(
                    "ModelAnimationController: animation clip was not found."
                );

                return;
            }

            this.mixer =
                new THREE.AnimationMixer(model);

            this.action =
                this.mixer.clipAction(clip);

            this.action.reset();

            /*
             * Keep the GLTF animation repeating.
             */
            this.action.setLoop(
                THREE.LoopRepeat,
                Infinity
            );

            this.action.clampWhenFinished = false;
            this.action.enabled = true;
            this.action.play();
            // Animation speed
            this.action.timeScale = 0.7;    
        }

        this.clock.start();
    }

    collectModelParts(model) {
        this.bec = null;
        this.lightSegments = [];
        this.currentSegment = null;

        model.traverse((child) => {
            if (!child.isMesh) return;

            const name = child.name
                .trim()
                .toLowerCase();

            /*
             * Find the moving light object.
             */
            if (
                name === "bec" ||
                name.startsWith("bec.")
            ) {
                this.bec = child;

                console.log(
                    "BEC found:",
                    child.name
                );

                return;
            }

            /*
             * Matches your exported Blender objects:
             *
             * archmov01
             * archmov02
             * itizermov01
             * itizermov02
             * itizermov03
             */
            const isArchSegment =
                name.startsWith("archmov");

            const isItizerSegment =
                name.startsWith("itizermov");

            if (
                !isArchSegment &&
                !isItizerSegment
            ) {
                return;
            }

            /*
             * Each segment needs its own material instance.
             *
             * Otherwise multiple meshes that share one material
             * can change emissive intensity together.
             */
            if (Array.isArray(child.material)) {
                child.material =
                    child.material.map(
                        material =>
                            material.clone()
                    );
            } else if (child.material) {
                child.material =
                    child.material.clone();
            }

            this.prepareSegmentMaterials(child);

            const groupName =
                isArchSegment
                    ? "archmov"
                    : "itizermov";

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

            console.log(
                "Light segment found:",
                child.name,
                "| group:",
                groupName
            );
        });

        if (!this.bec) {
            console.warn(
                'ModelAnimationController: mesh "bec" was not found.'
            );
        }

        if (!this.lightSegments.length) {
            console.warn(
                "ModelAnimationController: no archmovXX or itizermovXX meshes were found."
            );
        }

        console.table(
            this.lightSegments.map(segment => ({
                name: segment.mesh.name,
                group: segment.groupName,

                materialId:
                    Array.isArray(
                        segment.mesh.material
                    )
                        ? segment.mesh.material
                            .map(material => material.id)
                            .join(", ")
                        : segment.mesh.material?.id
            }))
        );
    }

    prepareSegmentMaterials(mesh) {
        const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

        for (const material of materials) {
            if (!material?.color) continue;

            /*
            * Save the original flat purple color.
            */
            material.userData.baseColor =
                material.color.clone();

            material.transparent = true;
            material.depthWrite = false;
            material.toneMapped = false;
            material.needsUpdate = true;
        }

        mesh.castShadow = false;
        mesh.receiveShadow = false;
    }

    update() {
        const delta = this.clock.getDelta();

        /*
         * Move bec first.
         */
        if (this.mixer) {
            this.mixer.update(delta);
        }

        if (
            !this.root ||
            !this.bec ||
            this.lightSegments.length === 0
        ) {
            return;
        }

        /*
         * Recalculate world transforms after animation update.
         */
        this.root.updateMatrixWorld(true);

        this.becBox.setFromObject(this.bec);
        this.becBox.getCenter(this.becCenter);

        const elapsedTime =
            performance.now() * 0.001;

        const nearestSegment =
            this.findNearestLightSegment();

        this.updateActiveSegment(
            nearestSegment,
            elapsedTime
        );

        for (
            const segment of
            this.lightSegments
        ) {
            this.updateSegmentLight(
                segment,
                elapsedTime,
                delta
            );
        }
    }

    findNearestLightSegment() {
        let nearestSegment = null;
        let nearestDistance = Infinity;

        for (
            const segment of
            this.lightSegments
        ) {
            this.segmentBox.setFromObject(
                segment.mesh
            );

            /*
             * Returns zero while bec's centre is inside the
             * segment bounding box.
             */
            const distance =
                this.segmentBox.distanceToPoint(
                    this.becCenter
                );

            segment.distanceToBec = distance;

            if (
                distance <=
                    this.activationDistance &&
                distance < nearestDistance
            ) {
                nearestDistance = distance;
                nearestSegment = segment;
            }
        }

        return nearestSegment;
    }

    updateActiveSegment(
        nearestSegment,
        elapsedTime
    ) {
        /*
         * Bec is still touching the same segment.
         *
         * Extend its hold period slightly so the light does not
         * expire while bec is still passing through it.
         */
        if (
            nearestSegment &&
            nearestSegment ===
                this.currentSegment
        ) {
            nearestSegment.holdUntil =
                Math.max(
                    nearestSegment.holdUntil,
                    elapsedTime +
                        this.segmentHoldDuration
                );

            return;
        }

        /*
         * Bec either moved to another segment or left all segments.
         *
         * Do not switch the previous segment off immediately.
         * Its holdUntil time controls that.
         */
        this.currentSegment =
            nearestSegment;

        if (!nearestSegment) {
            return;
        }

        const wasInactive =
            !nearestSegment.isActive;

        nearestSegment.isActive = true;
        nearestSegment.hasBeenTriggered = true;

        nearestSegment.holdUntil =
            elapsedTime +
            this.segmentHoldDuration;

        /*
         * Restart the electrical startup effect whenever bec
         * reaches a segment that had already faded out.
         */
        if (wasInactive) {
            nearestSegment.isFlickering = true;

            nearestSegment.flickerStartTime =
                elapsedTime;
        }

        /*
         * Keep every already-triggered element from this same
         * family illuminated together.
         */
        this.extendGroupPattern(
            nearestSegment.groupName,
            elapsedTime
        );

        console.log(
            "Activated:",
            nearestSegment.mesh.name,
            "| group:",
            nearestSegment.groupName
        );
    }

    extendGroupPattern(
        groupName,
        elapsedTime
    ) {
        const groupHoldUntil =
            elapsedTime +
            this.groupPatternDuration;

        for (
            const segment of
            this.lightSegments
        ) {
            if (
                segment.groupName !==
                    groupName ||
                !segment.hasBeenTriggered
            ) {
                continue;
            }

            /*
             * Previously reached elements remain on, but they do
             * not repeat the startup flicker.
             */
            segment.isActive = true;

            segment.holdUntil =
                Math.max(
                    segment.holdUntil,
                    groupHoldUntil
                );
        }
    }

    updateSegmentLight(
        segment,
        elapsedTime,
        delta
    ) {
        /*
         * Stop holding the light after the group display period.
         */
        if (
            segment.isActive &&
            elapsedTime >=
                segment.holdUntil
        ) {
            segment.isActive = false;
            segment.isFlickering = false;
        }

        let desiredIntensity = 0;

        if (segment.isActive) {
            if (segment.isFlickering) {
                desiredIntensity =
                    this.getBurningFlickerIntensity(
                        segment,
                        elapsedTime
                    );
            } else {
                desiredIntensity =
                    this.getStableBurningIntensity(
                        elapsedTime,
                        segment
                    );
            }
        }

        /*
         * Flicker needs immediate brightness changes.
         */
        if (segment.isFlickering) {
            segment.currentIntensity =
                desiredIntensity;
        } else {
            const transitionSpeed =
                segment.isActive
                    ? this.fadeInSpeed
                    : this.fadeOutSpeed;

            segment.currentIntensity =
                THREE.MathUtils.damp(
                    segment.currentIntensity,
                    desiredIntensity,
                    transitionSpeed,
                    delta
                );
        }

        /*
         * Remove tiny residual values after fading out.
         */
        if (
            !segment.isActive &&
            segment.currentIntensity < 0.01
        ) {
            segment.currentIntensity = 0;
        }

        this.setMeshEmissiveIntensity(
            segment.mesh,
            segment.currentIntensity
        );
    }

    getBurningFlickerIntensity(
        segment,
        elapsedTime
    ) {
        const time =
            elapsedTime -
            segment.flickerStartTime;

        /*
         * Electrical / burning LED startup.
         *
         * Values remain controlled so the purple does not
         * become strongly white.
         */
        const sequence = [
            {
                time: 0.000,
                intensity: 0
            },
            {
                time: 0.035,
                intensity: 3.6
            },
            {
                time: 0.075,
                intensity: 0.15
            },
            {
                time: 0.115,
                intensity: 2.7
            },
            {
                time: 0.155,
                intensity: 0.6
            },
            {
                time: 0.200,
                intensity: 4.1
            },
            {
                time: 0.245,
                intensity: 1.4
            },
            {
                time: 0.290,
                intensity: 3.3
            },
            {
                time: 0.345,
                intensity: 2.1
            },
            {
                time: 0.410,
                intensity:
                    this.burnPeakIntensity
            },
            {
                time: 0.480,
                intensity: 2.6
            },
            {
                time: 0.560,
                intensity:
                    this.stableIntensity
            }
        ];

        for (
            let index = 0;
            index <
                sequence.length - 1;
            index++
        ) {
            const current =
                sequence[index];

            const next =
                sequence[index + 1];

            if (
                time >= current.time &&
                time < next.time
            ) {
                const noise =
                    (Math.random() - 0.5) *
                    0.12;

                return Math.max(
                    0,
                    current.intensity +
                        noise
                );
            }
        }

        segment.isFlickering = false;

        return this.stableIntensity;
    }

    getStableBurningIntensity(
        elapsedTime,
        segment
    ) {
        const meshOffset =
            segment.mesh.id * 0.37;

        /*
         * Slow pulse produces the breathing glow.
         */
        const slowPulse =
            Math.sin(
                elapsedTime * 8 +
                meshOffset
            ) * 0.15;

        /*
         * Faster pulse produces a small electrical instability.
         */
        const fastPulse =
            Math.sin(
                elapsedTime * 21 +
                meshOffset
            ) * 0.07;

        const randomNoise =
            (Math.random() - 0.5) *
            0.05;

        return THREE.MathUtils.clamp(
            this.stableIntensity +
                slowPulse +
                fastPulse +
                randomNoise,

            2.55,
            3.35
        );
    }

    setMeshEmissiveIntensity(mesh, intensity) {
        const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

        for (const material of materials) {
            if (!material?.color) continue;

            const baseColor =
                material.userData.baseColor ??
                this.purpleColor;

            /*
            * Normal state:
            * original purple, no HDR boost.
            *
            * Active state:
            * increase the same purple above 1,
            * which triggers UnrealBloomPass.
            */
            const brightness =
                intensity <= 0
                    ? 1
                    : 1 + intensity * 1;

            material.color
                .copy(baseColor)
                .multiplyScalar(brightness);

            material.needsUpdate = true;
        }
    }

    turnOffAllSegments() {
        for (
            const segment of
            this.lightSegments
        ) {
            segment.isActive = false;
            segment.isFlickering = false;
            segment.hasBeenTriggered = false;

            segment.flickerStartTime = 0;
            segment.holdUntil = 0;
            segment.currentIntensity = 0;
            segment.distanceToBec =
                Infinity;

            this.setMeshEmissiveIntensity(
                segment.mesh,
                0
            );
        }

        this.currentSegment = null;
    }

    stop() {
        if (this.mixer) {
            this.mixer.stopAllAction();

            if (this.root) {
                this.mixer.uncacheRoot(
                    this.root
                );
            }
        }

        this.turnOffAllSegments();

        this.mixer = null;
        this.action = null;
        this.root = null;

        this.bec = null;
        this.lightSegments = [];
        this.currentSegment = null;

        this.clock.stop();
    }
}