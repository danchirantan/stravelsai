export type DestinationType =
  | 'beach'
  | 'mountain'
  | 'cultural'
  | 'desert'
  | 'monsoon'
  | 'safari'
  | 'business'
  | 'custom';

export type ItemCategory =
  | 'clothing'
  | 'toiletries'
  | 'electronics'
  | 'documents'
  | 'gear'
  | 'medical'
  | 'misc';

export type ItemPriority = 'essential' | 'recommended' | 'optional';

export interface PackingItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  packed: boolean;
  priority: ItemPriority;
  notes?: string;
  weightGrams?: number;
  aiSuggested?: boolean;
  aiReason?: string;
}

export interface PackingList {
  id: string;
  name: string;
  destinationType: DestinationType;
  destinationName?: string;
  targetTripTitle?: string;
  items: PackingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DestinationPresetMeta {
  type: DestinationType;
  title: string;
  icon: string;
  description: string;
  climateNote: string;
  color: string;
  defaultItems: Omit<PackingItem, 'id' | 'packed'>[];
}
