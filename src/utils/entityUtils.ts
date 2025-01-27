import entities from '@/app/data/entities.json';
import searchEntities from '@/app/data/search_entities.json';

type Entity = typeof entities[keyof typeof entities];

export function lookupEntity(id: string): Entity | undefined {
    return entities[id as keyof typeof entities];
}

export function getAllEntitiesForSection(sectionId: string): Entity[] {
    const section = searchEntities.sections.find(s => s.id === sectionId);
    if (!section) return [];
    
    return section.items
        .map(id => lookupEntity(id))
        .filter((entity): entity is Entity => entity !== undefined);
}

export function getAllCategories(): Entity[] {
    return searchEntities.categories
        .map(cat => lookupEntity(cat.id))
        .filter((entity): entity is Entity => entity !== undefined);
}

export function getAllEntities(): Entity[] {
    const categoryEntities = getAllCategories();
    const sectionEntities = searchEntities.sections.flatMap(section => 
        getAllEntitiesForSection(section.id)
    );
    
    return [...categoryEntities, ...sectionEntities];
} 