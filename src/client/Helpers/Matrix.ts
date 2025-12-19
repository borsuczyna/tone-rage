interface Matrix3x3 {
    rightVector: Vector3;
    forwardVector: Vector3;
    upVector: Vector3;
    position: Vector3;
}

export default class Matrix {
    private entity: EntityMp;
    private matrixCache: Matrix3x3 | null = null;
    public dontUpdate: boolean = false;

    constructor(entity: EntityMp) {
        this.entity = entity;
    }

    public getMatrix(): Matrix3x3 {
        if (this.dontUpdate && this.matrixCache) {
            return this.matrixCache;
        }
        
        const dummyVector = new mp.Vector3(0, 0, 0);
        const matrix = this.entity.getMatrix(dummyVector, dummyVector, dummyVector, dummyVector) as Matrix3x3;

        if (this.dontUpdate) {
            this.matrixCache = matrix;
        }

        return matrix;
    }

    public getOffsetPosition(offset: Vector3): Vector3 {
        const matrix = this.getMatrix();
        const x = offset.x * matrix.rightVector.x + offset.y * matrix.forwardVector.x + offset.z * matrix.upVector.x + matrix.position.x;
        const y = offset.x * matrix.rightVector.y + offset.y * matrix.forwardVector.y + offset.z * matrix.upVector.y + matrix.position.y;
        const z = offset.x * matrix.rightVector.z + offset.y * matrix.forwardVector.z + offset.z * matrix.upVector.z + matrix.position.z;
        return new mp.Vector3(x, y, z);
    }
}