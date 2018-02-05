export default (Keyframes) => {
    Keyframes.prototype.proximity = function (onMove) {
        this.onMouseMove = (e) => {
            const mouse = {
                x: e.pageX,
                y: e.pageY,
            };

            // Target edge
            const target = this.elem.getBoundingClientRect();

            const targetCenter = {
                x: Math.floor(target.left + (target.width / 2)),
                y: Math.floor(target.top + (target.height / 2)),
            };

            const angle = Math.atan2(mouse.y - targetCenter.y, mouse.x - targetCenter.x);

            const cosAngle = Math.abs(Math.cos(angle));
            const sinAngle = Math.abs(Math.sin(angle));

            const magnitude = target.width / 2 * sinAngle <= target.height / 2 * cosAngle ?
                target.width / 2 / cosAngle :
                target.height / 2 / sinAngle;

            const targetEdge = {
                x: targetCenter.x + Math.cos(angle) * magnitude,
                y: targetCenter.y + Math.sin(angle) * magnitude,
            };

            // Viewport edge
            const viewport = {
                x: 0,
                y: 0,
                width: window.innerWidth,
                height: window.innerHeight,

                get left() { return this.x; },
                get right() { return this.x + this.width; },
                get top() { return this.y; },
                get bottom() { return this.y + this.height; },
            };

            const notZero = v => +v || Number.MIN_VALUE;

            const vx = mouse.x - targetCenter.x;
            const vy = mouse.y - targetCenter.y;

            const t = Math.min(
                ((vx < 0 ? viewport.left : viewport.right) - targetCenter.x) / notZero(vx),
                ((vy < 0 ? viewport.top : viewport.bottom) - targetCenter.y) / notZero(vy),
            );

            const viewPortEdge = {
                x: targetCenter.x + vx * t,
                y: targetCenter.y + vy * t,
            };

            // Distances

            const calculateDistance = (vector) => {
                const offsets = {
                    top: target.top - vector.y,
                    right: vector.x - (target.left + target.width),
                    bottom: vector.y - (target.top + target.height),
                    left: target.left - vector.x,
                };
                const dx = Math.max(offsets.left, 0, offsets.right) ** 2;
                const dy = Math.max(offsets.top, 0, offsets.bottom) ** 2;
                return Math.sqrt(dx + dy);
            };
            const mouseDistance = calculateDistance(mouse);
            const viewPortDistance = calculateDistance(viewPortEdge);

            const distancePercentage = 100 - Math.round((mouseDistance / viewPortDistance) * 100);

            onMove({
                mouse,
                mouseDistance,
                viewPortDistance,
                distancePercentage,
                targetEdge,
                viewPortEdge,
                collision: !mouseDistance,
            });
        };

        window.addEventListener('mousemove', this.onMouseMove);
    };
};
