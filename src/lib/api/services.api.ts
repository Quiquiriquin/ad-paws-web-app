import { gql } from "@apollo/client";

export const SERVICES_BY_COMPANY = gql`
  query ServicesByCompany($input: ServicesByCompanyInput) {
    servicesByCompany(input: $input) {
      id
      name
      type
      price
      duration
      startTime
      endTime
      daysAvailable
      active
      companyId
      createdAt
    }
  }
`;

export interface Service {
  id: string;
  name: string;
  type: "HOTEL" | "DAYCARE" | "TRAINING" | "GROOMING";
  price: number;
  duration: number;
  startTime: string;
  endTime: string;
  daysAvailable: string[];
  active: boolean;
  companyId: number;
  createdAt: string;
}

export interface ServicesByCompanyInput {
  companyId: number;
  active?: boolean;
  name?: string;
}

