import * as THREE from 'three';

// Blender GLB: convert exported loose edges / LINE_STRIPs to real dashed lines.
// Unlike a face-edge outline, this follows only the explicitly modelled curves.
// Source objects may have generic names; a predicate can check their ancestors.
export function applyDashedTerrain(root, {
    matches = object => /^curbe[_-]/i.test(object.name),
    material = new THREE.LineDashedMaterial({ color: 0x45536b, dashSize: 3.5, gapSize: 2 }),
    precision = 5
} = {}) {
    const sources = [];
    root.traverse(object => {
        if ((object.isLineSegments || object.isLine) && matches(object)) sources.push(object);
    });

    const result = [];
    const pointKey = v => `${v.x.toFixed(precision)},${v.y.toFixed(precision)},${v.z.toFixed(precision)}`;

    for (const source of sources) {
        const positions = source.geometry.getAttribute('position');
        const index = source.geometry.getIndex();
        if (!positions || !source.parent) continue;
        const vertex = i => new THREE.Vector3().fromBufferAttribute(positions, index ? index.getX(i) : i);
        const count = index ? index.count : positions.count;
        const nodes = new Map();
        const edges = [];
        const used = new Set();

        function add(point) {
            const key = pointKey(point);
            if (!nodes.has(key)) nodes.set(key, { point, edges: [] });
            return key;
        }
        function connect(i, j) {
            const a = add(vertex(i));
            const b = add(vertex(j));
            if (a === b) return;
            const edgeIndex = edges.length;
            edges.push([a, b]);
            nodes.get(a).edges.push(edgeIndex);
            nodes.get(b).edges.push(edgeIndex);
        }

        if (source.isLineSegments) {
            for (let i = 0; i + 1 < count; i += 2) connect(i, i + 1);
        } else {
            for (let i = 0; i + 1 < count; i++) connect(i, i + 1);
        }

        function trace(start) {
            const path = [nodes.get(start).point.clone()];
            let at = start;
            for (;;) {
                const next = nodes.get(at).edges.find(id => !used.has(id));
                if (next === undefined) break;
                used.add(next);
                const [a, b] = edges[next];
                at = at === a ? b : a;
                path.push(nodes.get(at).point.clone());
            }
            if (path.length < 2) return;
            const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(path), material);
            line.name = `${source.name}_dashed`;
            line.position.copy(source.position);
            line.quaternion.copy(source.quaternion);
            line.scale.copy(source.scale);
            line.computeLineDistances();
            source.parent.add(line);
            result.push(line);
        }
        // Open contour paths, then loops; do not restart dashes at each Blender edge.
        for (const [key, node] of nodes) if (node.edges.length === 1) trace(key);
        for (let i = 0; i < edges.length; i++) if (!used.has(i)) trace(edges[i][0]);
        source.visible = false;
    }
    return result;
}
