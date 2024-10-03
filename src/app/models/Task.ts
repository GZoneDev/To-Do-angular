export class Task {
    id: string;
    categoryId: string;
    name: string;
    description: string;

    private constructor(id: string, categoryId: string, name: string, description: string) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
    }

    public static create(id: string, categoryId: string, name: string, description: string): Task {
        return new Task(id, categoryId, name, description);
    }
}