export class User {
    id: string;
    userName: string;
    email: string;
    passwordHash: string;

    private constructor(id: string, userName: string, email: string, passwordHash: string) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public static create(id: string, userName: string, email: string, passwordHash: string): User {
        return new User(id, userName, email, passwordHash);
    }
}