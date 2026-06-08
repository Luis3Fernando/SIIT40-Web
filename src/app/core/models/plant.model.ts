import { Specie } from './specie.model';

export interface Plant {
  id: number;
  greenhouse_id: number;
  species_id: string;
  zone: string;
  stage: string;
  count: number;
  is_critical: boolean;
  last_watered: string | null;
  status: string;
  planted_at: string;
  specie: Specie;
}

export interface PlantCreateDTO {
  greenhouse_id: number;
  species_id: string;
  zone: string;
  stage: string;
  count: number;
}

export interface PlantUpdateDTO {
  stage: string;
}