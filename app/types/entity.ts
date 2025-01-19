interface Theme {
    backgroundColor: string;
    textColor: string;
}

export interface BaseEntity {
    id: string;
    title: string;
    type: string;
    description?: string;
    theme?: Theme;
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

export type Entity = CategoryEntity | TopicEntity; 