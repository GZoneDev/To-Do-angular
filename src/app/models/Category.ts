export class Category {
    id: string;
    userId: string;
    name: string;

    private constructor(id: string, userId: string, name: string) {
        this.id = id;
        this.userId = userId;
        this.name = name;
    }

    public static create(id: string, userId: string, name: string): Category {
        return new Category(id, userId, name);
    }
}