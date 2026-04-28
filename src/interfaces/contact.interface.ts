export type CardItemType = "phone" | "address" | "hours";

export interface CardItem {
  type: CardItemType;
  text: string;
}
