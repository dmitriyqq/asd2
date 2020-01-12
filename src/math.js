const area = (a, b, c) => {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

const intersect_1 = (a, b, c, d) => {
    if (a > b) {
        [a, b] = [b, a]
    }

    if (c > d) {
        [c, d] = [d, c]
    }

    return Math.max(a, c) < Math.min(b, d);
}

export const isLinesIntersect = (a, b, c, d) => {
    return intersect_1(a.x, b.x, c.x, d.x)
        && intersect_1(a.y, b.y, c.y, d.y)
        && area(a, b, c) * area(a, b, d) < 0
        && area(c, d, a) * area(c, d, b) < 0;
}

export const isPointsNear = (v1, v2, eps) => {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;

    return Math.sqrt(dx * dx + dy * dy) < eps;
}