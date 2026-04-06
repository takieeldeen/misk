export interface BrandType {
  _id: string;
  nameAr: string;
  nameEn: string;
  imageUrl: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandCreationDto {
  nameAr: string;
  nameEn: string;
  imageUrl?: string;
}

export interface BrandInfoDto {
  _id: string;
  nameAr: string;
  nameEn: string;
  status: "ACTIVE" | "INACTIVE";
  imageUrl: string;
}
