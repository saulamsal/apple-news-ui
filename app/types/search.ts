export interface SearchEntity {
    id: string;
    title: string;
    logo?: string | { default: string };
    icon?: string;
    entity_type?: string;
    items: any[];
}

export interface SearchData {
    categories: SearchEntity[];
    sections: {
        id: string;
        title: string;
        items: SearchEntity[];
    }[];
} 