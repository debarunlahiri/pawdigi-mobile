import type { TrustIconName } from '../components/TrustIcon';

export type FeatureIconName = 'medical-bag' | 'earth' | 'chart-line';

export type Feature = {
  title: string;
  body: string;
  icon: FeatureIconName;
};

export const features: Feature[] = [
  {
    title: 'Vaccination Vault',
    body: 'Encrypted storage for immunization records and clinic certifications.',
    icon: 'medical-bag'
  },
  {
    title: 'Digital Passport',
    body: 'International travel compliant documentation generated in seconds.',
    icon: 'earth'
  },
  {
    title: 'Health Metrics',
    body: 'Track weight, activity, and vitals with clinical precision tools.',
    icon: 'chart-line'
  }
];

export const trustItems = [
  { icon: 'global-vet', label: 'GlobalVet' },
  { icon: 'pet-cert', label: 'PetCert' },
  { icon: 'data-safe', label: 'DataSafe' }
] satisfies { icon: TrustIconName; label: string }[];
