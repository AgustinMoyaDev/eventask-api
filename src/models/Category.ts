export class Category {
  constructor(
    public id: string,
    public name: string
  ) {}

  rename(newName: string) {
    if (!newName.trim()) throw new Error('Name cannot be empty')
    this.name = newName
  }
}
