import type {
  Inquiry,
  InquiryInput,
  Property,
  PropertyFilters,
  PropertyInput,
} from "@/lib/types";

export interface PropertyRepository {
  readonly name: "local" | "supabase";
  list(filters?: PropertyFilters): Promise<Property[]>;
  featured(limit?: number): Promise<Property[]>;
  bySlug(slug: string): Promise<Property | null>;
  byId(id: string): Promise<Property | null>;
  cities(): Promise<string[]>;
  create(input: PropertyInput): Promise<Property>;
  update(id: string, input: PropertyInput): Promise<Property>;
  remove(id: string): Promise<void>;
  createInquiry(input: InquiryInput): Promise<Inquiry>;
  listInquiries(): Promise<Inquiry[]>;
}
