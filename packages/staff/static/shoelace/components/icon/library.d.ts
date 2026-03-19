import { SlIcon } from '../../shoelace';
export declare type IconLibraryResolver = (name: string) => string;
export declare type IconLibraryMutator = (svg: SVGElement) => void;
interface IconLibraryRegistry {
    name: string;
    resolver: IconLibraryResolver;
    mutator?: IconLibraryMutator;
}
export declare function watchIcon(icon: SlIcon): void;
export declare function unwatchIcon(icon: SlIcon): void;
export declare function getIconLibrary(name?: string): IconLibraryRegistry;
export declare function registerIconLibrary(name: string, options: {
    resolver: IconLibraryResolver;
    mutator?: IconLibraryMutator;
}): void;
export declare function unregisterIconLibrary(name: string): void;
export {};
