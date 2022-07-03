export type User = {
    id: number,
    name: string,
    phone: string,
    password: string,
    salt: string,
    create_on: string,
    update_on: string,
    avatar: number | null
}

export type Comment = {
    id: number,
    rank: number,
    content: string,
    user: number,
    location: number,
    create_on: string,
    update_on: string,
}

export type Location = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    category: number,
    description: string,
    discoverer: number,
    create_on: string,
    update_on: string,
}

export type Upload = {
    id: number,
    fetch_code: string,
    owner: number,
    create_on: string,
    update_on: string,
}

export type Memory = {
    id: number,
    title: string,
    content: string,
    owner: number,
    location: number,
    create_on: string,
    update_on: string,
}
