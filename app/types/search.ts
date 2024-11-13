export interface SearchEntity {
    id: string;
    title: string;
    icon?: string;
    logo?: string;
    entity_type?: string;
}

export interface SearchSection {
    id: string;
    title: string;
    items: SearchEntity[];
}

export interface SearchData {
    categories: SearchEntity[];
    sections: SearchSection[];
} 