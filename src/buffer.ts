export class myBuffer {

    private _buffer:Uint8Array;
    private _lastOffset:number;
    private _size:number;

    constructor(_size:number=100)
    {
        this._size = _size | 100;
        this._lastOffset = 0;

        this._buffer = new Uint8Array(_size);
    }

    public get lastOffset() :number {
        return this._lastOffset;
    }

    public get buffer() :Uint8Array {
        return this._buffer;
    }

    public clean() :void {
        this._buffer = new Uint8Array(this._size);
        this._lastOffset = 0;
    }

    public copy (bytes: Uint8Array ) {
        this._buffer.set(bytes, this._lastOffset)
        this._lastOffset = bytes.byteLength;
        return this;
    }

    public toString(encoding='hex'):string {
        return Buffer.from(this._buffer).toString('hex');
    }

    public isEmpty():boolean{
        return this._lastOffset == 0;
    }

    public toBuffer() :Buffer {
        return Buffer.from(this._buffer);
    }
}