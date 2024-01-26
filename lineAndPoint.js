import { Point } from "./point.js";

export function distance(p1, p2) {
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
}

export function dot(p, q) {
    return p.x * q.x + p.y * q.y;
}

export function cross(p, q) {
    return p.x * q.y - p.y * q.x;
}

export function scalar(n, v) {
    return new Point(v.x * n, v.y * n, 0, 0);
}

export function vector(p, q) {
    return new Point(q.x - p.x, q.y - p.y, 0, 0);
}

export function add(p, q) {
    return new Point(p.x + q.x, p.y + q.y, 0, 0);
}

export function subtract(p, q) {
    return new Point(p.x - q.x, p.y - q.y, p.vx - q.vx, p.vy - q.vy);
}

export function disLP(p, q, x) {
    var vec1 = vector(x, p);
    var vec2 = vector(x, q);

    // x1, y1, 0
    // x2, y2, 0
    // 0, 0, x1y2 - y1x2

    var area = Math.abs(cross(vec1, vec2));
    return area / distance(p, q);
}

export function footOfPerpendicular(p, q, x) {
    var pq = vector(p, q);
    var px = vector(p, x);

    // projection 
    // (pq . px / pq . pq) * px

    var ph = scalar(dot(pq, px) / dot(pq, pq), pq);
    return new Point(p.x + ph.x, p.y + ph.y, 0, 0);
}