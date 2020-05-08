const euclideanDistanceSquared = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = x1 - x2;
    const deltaY = y1 - y2;
    return deltaX * deltaX + deltaY * deltaY;
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

const randIndex = (array: any[]) =>  Math.floor(Math.random() * array.length);

export {
    euclideanDistanceSquared,
    rand,
    randIndex
}