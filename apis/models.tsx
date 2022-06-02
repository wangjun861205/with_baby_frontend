export interface User {
    id: number,
    name: string,
}

export interface Playing {
    id: number,
    name: string
    latitude: number,
    longitude: number,
    discoverer: User,
    update_on: string,
    create_on: string,
    distance: number,
}

