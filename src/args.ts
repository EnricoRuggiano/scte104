import * as syntax from './syntax';
import * as Protocol from './protocol';
import { exec } from 'child_process';

export interface ConfigArgs {
    host:string;
    port:number;
    logLevel?:string;
    bufferSize?:number;
    wait?:number;
    messageNumber?:number;
}

export interface Scte104Args {
    dpiPidIndex:number;
}

export interface InitArgs extends Scte104Args {}

export interface SpliceArgs extends InitArgs {
    spliceInsertType:number;
    spliceEventId:number;
    uniqueProgramId:number;
    preRollTime:number;
    breakDuration:number;
    availNum:number;
    availsExpected:number;
    autoReturnFlag:number;
}

export class Config implements ConfigArgs {
    public host:string;
    public port:number = 5167;
    public logLevel:string = 'info';
    public bufferSize:number = 1000;
    public wait:number = 1000;
    public messageNumber:number = 1; 
    public constructor(init?:Partial<Config>) {
        Object.assign(this, init);
    }
}

export class Init implements InitArgs {
    public dpiPidIndex: number = 100;
    public constructor(init?:Partial<Splice>) {
        Object.assign(this, init);
    }   
}

export class Alive extends Init {
    public time:syntax.Time = this._time;

    get _time():syntax.Time {
        let epoch = new Date('1980-01-06T00:00:00Z').getTime();
        let elapsed = Date.now() - epoch;
        let seconds = elapsed / 1000 | 0;
        let microseconds = (elapsed - seconds * 1000) * 1000;
        return new syntax.Time().with(
            {
                seconds: seconds, 
                microseconds: microseconds,
            });
    }

    public constructor(init?:Partial<Alive>) {
        super(init)
    }
}

export class Splice extends Init implements SpliceArgs {
    public spliceInsertType : number = Protocol.SPLICE_START_NORMAL;
    public spliceEventId : number = 1;
    public uniqueProgramId   = 1;
    public preRollTime : number = 4000;
    public breakDuration : number = 2400;
    public availNum : number = 0;
    public availsExpected : number = 0;
    public autoReturnFlag : number = 0;
    public timestamp : syntax.Timestamp = this._timestamp;

    get _timestamp () : syntax.Timestamp {
        let now = new Date()
        let hours = now.getUTCHours(); 
        let minutes = now.getUTCMinutes()
        let seconds = now.getUTCSeconds() + 30
        return new syntax.SmpteVitcTimestamp().with(
        {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            frames: 0,
        });
    }

    public constructor(init?:Partial<Splice>) {
        super(init)
        Object.assign(this, init);
    }
}