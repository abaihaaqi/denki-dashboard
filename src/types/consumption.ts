export interface Consumption {
  id: string;
  appliance: string;
  consumption_date: Date;
  energy_consumption: number;
  room: string;
  status: string;
}
