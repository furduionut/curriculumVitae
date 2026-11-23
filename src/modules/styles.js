
import { domain as dom } from "./domain.js";

const styles = {
    color1: getComputedStyle(dom.root)
        .getPropertyValue("--first-background-color").trim(),

    color2: getComputedStyle(dom.root)
        .getPropertyValue("--second-background-color").trim(),

    color3: getComputedStyle(dom.root)
        .getPropertyValue("--third-background-color").trim()
};


/* SVG CUTOUT — LIQUID GLASS */

export function updateGlassCutouts() {

    const cards = document.querySelectorAll(
        ".navItem , #abilities .btn,  #contacts .btn, #projects .btn, #skills .btn"
    );

    cards.forEach(item => {

        // Support inline SVG and linked SVG images
        const svg = item.querySelector("svg");
        const img = item.querySelector('img[src*=".svg"]');

        const icon = svg || img;
        if (!icon) return;

        let svgURL;

        if (svg) {
            // Clone inline SVG
            const clone = svg.cloneNode(true);

            clone.setAttribute(
                "xmlns",
                "http://www.w3.org/2000/svg"
            );

            clone.setAttribute("width", "100%");
            clone.setAttribute("height", "100%");

            const originalNodes = [
                svg,
                ...svg.querySelectorAll("*")
            ];

            const clonedNodes = [
                clone,
                ...clone.querySelectorAll("*")
            ];

            const shapeTags = new Set([
                "path", "circle", "rect",
                "ellipse", "polygon",
                "polyline", "line"
            ]);

            originalNodes.forEach((node, index) => {
                const target = clonedNodes[index];
                if (!target) return;

                if (!shapeTags.has(node.tagName.toLowerCase())) {
                    return;
                }

                const style = getComputedStyle(node);

                target.style.setProperty(
                    "fill",
                    style.fill === "none" ? "none" : "white",
                    "important"
                );

                target.style.setProperty(
                    "stroke",
                    style.stroke === "none" ? "none" : "white",
                    "important"
                );

                target.style.setProperty(
                    "stroke-width",
                    style.strokeWidth
                );

                target.style.setProperty(
                    "opacity",
                    "1",
                    "important"
                );
            });

            const svgString = new XMLSerializer()
                .serializeToString(clone);

            svgURL =
                "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(svgString);

        } else {
            // Use the linked SVG directly as the mask
            svgURL = img.currentSrc || img.src;
        }

        // Position the cutout over the actual icon
        const itemRect = item.getBoundingClientRect();
        const iconRect = icon.getBoundingClientRect();

        const scaleX = item.offsetWidth
            ? itemRect.width / item.offsetWidth
            : 1;

        const scaleY = item.offsetHeight
            ? itemRect.height / item.offsetHeight
            : 1;

        item.style.setProperty(
            "--icon-cutout",
            `url("${svgURL}")`
        );

        item.style.setProperty(
            "--cutout-x",
            `${(iconRect.left - itemRect.left) / scaleX}px`
        );

        item.style.setProperty(
            "--cutout-y",
            `${(iconRect.top - itemRect.top) / scaleY}px`
        );

        item.style.setProperty(
            "--cutout-width",
            `${iconRect.width / scaleX}px`
        );

        item.style.setProperty(
            "--cutout-height",
            `${iconRect.height / scaleY}px`
        );

        item.classList.add("glass-cutout-ready");
    });
}



export { styles };
