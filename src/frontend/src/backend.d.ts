import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserStatistics {
    totalListens: bigint;
    totalUploads: bigint;
}
export interface AudioPost {
    id: string;
    listens: bigint;
    title: string;
    audio: ExternalBlob;
    description: string;
    audioPath: string;
    author: Principal;
    replyTo?: string;
    kidFriendly: boolean;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAudioPost(title: string, description: string, audio: ExternalBlob, replyTo: string | null, kidFriendly: boolean): Promise<string>;
    addToFavorites(postId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    editAudioPost(postId: string, title: string, description: string): Promise<boolean>;
    getAudioBlob(id: string): Promise<ExternalBlob | null>;
    getAudioPost(postId: string): Promise<AudioPost | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFavoritePosts(): Promise<Array<AudioPost>>;
    getKidFriendlyPosts(): Promise<Array<AudioPost>>;
    getMyContent(): Promise<Array<AudioPost>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStatistics(): Promise<UserStatistics>;
    isCallerAdmin(): Promise<boolean>;
    listenToAudioPost(postId: string): Promise<void>;
    removeAudioPost(postId: string): Promise<boolean>;
    removeFromFavorites(postId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
