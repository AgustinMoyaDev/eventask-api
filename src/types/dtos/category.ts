export interface ICategoryCreateDto {
  name: string
  createdBy: string
}

export interface ICategoryUpdateDto {
  id: string
  name?: string
  createdBy?: string
}
