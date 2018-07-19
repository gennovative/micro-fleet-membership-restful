
declare module 'scrypt' {
	export function params(num: number): Promise<any>;
	export function kdf(unhashed: string, opts?: any): Promise<any>;
	export function verifyKdf(hashed: Buffer, key: string): Promise<any>;
}