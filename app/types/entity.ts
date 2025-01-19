export interface BaseEntity {
    id: string;
    title: string;
    type: string;
    description?: string;
}

export interface CategoryEntity extends BaseEntity {
    type: 'category';
    icon: string;
}

export interface TopicEntity extends BaseEntity {
    type: 'topic';
    logo: string;
    entity_type: string;
}

export interface TeamEntity extends BaseEntity {
    type: 'team';
    logo: string;
    entity_type: string;
}

export interface LeagueEntity extends BaseEntity {
    type: 'league';
    logo: string;
    entity_type: string;
}

export type Entity = CategoryEntity | TopicEntity | TeamEntity | LeagueEntity; 