export interface ResponseMessage {
  type: string;
  message: string;
}

export interface APIResponse<T> {
  status: string;
  message: ResponseMessage[];
  data: T;
}

export interface Specie {
  species_id: string;
  name: string;
  scientific_name: string;
  image_url: string;
  color: string;
  vol: number;
  freq: number;
  raw: number;
  created_at: string;
}

export interface SpecieCreateDTO {
  name: string;
  scientific_name: string;
  image_url: string;
  color: string;
  vol: number;
  freq: number;
  raw: number;
}

export interface SpecieUpdateDTO {
  name?: string;
  scientific_name?: string;
  image_url?: string;
  color?: string;
  vol?: number;
  freq?: number;
  raw?: number;
}