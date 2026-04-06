export interface CategoryType {
  _id: string;
  nameAr: string;
  nameEn: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreationDto {
  nameAr: string;
  nameEn: string;
  imageUrl?: string;
}

export interface CategoryInfoDto {
  _id: string;
  nameAr: string;
  nameEn: string;
  status: "ACTIVE" | "INACTIVE";
  imageUrl: string;
}
