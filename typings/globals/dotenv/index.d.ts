// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/822864b08cee6821527183b097ba996c715641b5/dotenv/dotenv.d.ts
interface dotenvOptions {
    silent?: boolean;
    path?: string;
    encoding?: string;
}

declare module 'dotenv' {
    export function config(options?: dotenvOptions): boolean;
}