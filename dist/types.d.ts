export type ParamType = string | number | boolean;
export type ParamFindPredicate = (value: [string, ParamType], index: number, obj: [string, ParamType][]) => boolean;
export interface IFile {
    name: string;
    ext: string;
}
