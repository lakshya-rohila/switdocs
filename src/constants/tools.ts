import { ROUTES } from '../navigation/routes';

export type ToolCategoryTitle =
  | 'PDF Tools'
  | 'Signature'
  | 'Converter'
  | 'Image Tools'
  | 'More Tools';

export type HomeToolCard = {
  id: string;
  title: string;
  subtitle?: string;
  route: keyof import('../types/navigation').HomeStackParamList;
  iconBg: string;
  abbreviation: string;
  iconName?: string;
  iconImage?: string;
};

export type HomeToolSection = {
  title: ToolCategoryTitle;
  items: HomeToolCard[];
};

export const HOME_TOOL_SECTIONS: HomeToolSection[] = [
  {
    title: 'PDF Tools',
    items: [
      {
        id: 'pdf-create',
        title: 'Create PDF',
        route: ROUTES.CREATE_PDF as HomeToolCard['route'],
        iconBg: '#2563EB',
        abbreviation: 'CP',
        iconName: 'pdf-create',
        iconImage: 'tool-create-pdf',
      },
      {
        id: 'pdf-merge',
        title: 'Merge PDF',
        route: ROUTES.MERGE_PDF as HomeToolCard['route'],
        iconBg: '#1D4ED8',
        abbreviation: 'M',
        iconName: 'pdf-merge',
        iconImage: 'tool-merge-pdf',
      },
      {
        id: 'pdf-split',
        title: 'Split PDF',
        route: ROUTES.SPLIT_PDF as HomeToolCard['route'],
        iconBg: '#3B82F6',
        abbreviation: 'S',
        iconName: 'pdf-split',
        iconImage: 'tool-split-pdf',
      },
      {
        id: 'pdf-compress',
        title: 'Compress PDF',
        route: ROUTES.COMPRESS_PDF as HomeToolCard['route'],
        iconBg: '#0EA5E9',
        abbreviation: 'Z',
        iconName: 'pdf-compress',
        iconImage: 'tool-compress-pdf',
      },
    ],
  },
  {
    title: 'Signature',
    items: [
      {
        id: 'signature',
        title: 'E-Signature',
        route: ROUTES.E_SIGNATURE as HomeToolCard['route'],
        iconBg: '#0D9488',
        abbreviation: '✎',
        iconName: 'signature',
        iconImage: 'tool-signature',
      },
    ],
  },
  {
    title: 'Converter',
    items: [
      {
        id: 'c-img-pdf',
        title: 'Image to PDF',
        route: ROUTES.DOCUMENT_CONVERTER as HomeToolCard['route'],
        iconBg: '#155E75',
        abbreviation: 'I→P',
        iconName: 'converter',
        iconImage: 'tool-image-to-pdf',
      },
    ],
  },
  {
    title: 'Image Tools',
    items: [
      {
        id: 'img-conv',
        title: 'Convert Image',
        route: ROUTES.IMAGE_CONVERTER as HomeToolCard['route'],
        iconBg: '#C026D3',
        abbreviation: 'IC',
        iconName: 'image-convert',
        iconImage: 'tool-convert-image',
      },
      {
        id: 'img-compress',
        title: 'Compress Image',
        route: ROUTES.IMAGE_COMPRESS as HomeToolCard['route'],
        iconBg: '#A21CAF',
        abbreviation: 'Z',
        iconName: 'image-compress',
        iconImage: 'tool-compress-image',
      },
      {
        id: 'img-resize',
        title: 'Resize Image',
        route: ROUTES.IMAGE_RESIZE as HomeToolCard['route'],
        iconBg: '#86198F',
        abbreviation: 'R',
        iconName: 'image-resize',
        iconImage: 'tool-resize-image',
      },
      {
        id: 'img-crop',
        title: 'Crop Image',
        route: ROUTES.IMAGE_CROP as HomeToolCard['route'],
        iconBg: '#701A75',
        abbreviation: 'C',
        iconName: 'image-crop',
        iconImage: 'tool-crop-image',
      },
    ],
  },
  {
    title: 'More Tools',
    items: [
      {
        id: 'qr-gen',
        title: 'QR Generator',
        route: ROUTES.QR_GENERATOR as HomeToolCard['route'],
        iconBg: '#CA8A04',
        abbreviation: 'QR',
        iconName: 'qr-generate',
        iconImage: 'tool-qr-generator',
      },
      {
        id: 'wc',
        title: 'Word Counter',
        route: ROUTES.WORD_COUNTER as HomeToolCard['route'],
        iconBg: '#475569',
        abbreviation: '#',
        iconName: 'word-counter',
        iconImage: 'tool-word-counter',
      },
    ],
  },
];

export const QUICK_ACTIONS = [
  { key: 'sign', title: 'E-Sign', route: ROUTES.E_SIGNATURE },
  { key: 'scan', title: 'Scan to PDF', route: ROUTES.CREATE_PDF },
  { key: 'compress', title: 'Compress', route: ROUTES.COMPRESS_PDF },
  { key: 'convert', title: 'Image to PDF', route: ROUTES.DOCUMENT_CONVERTER },
] as const;
