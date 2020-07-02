export interface Permission {
	id: number, 
	type: string,
    seats: number,
    cargo_capacity: number,
    cargo_unit: string,
    status: number,
    created_at: string,
    updated_at: string
}