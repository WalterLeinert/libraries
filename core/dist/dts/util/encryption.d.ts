export declare class Encryption {
    private static LEN;
    private static SALT_LEN;
    private static ITERATIONS;
    private static DIGEST;
    static hashPassword(password: string, salt: string, callback?: any): void;
}
