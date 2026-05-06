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
      {
        id: 'pdf-rotate',
        title: 'Rotate Pages',
        route: ROUTES.ROTATE_PDF as HomeToolCard['route'],
        iconBg: '#6366F1',
        abbreviation: 'R',
        iconName: 'pdf-rotate',
        iconImage: 'tool-rotate-pages',
      },
      {
        id: 'pdf-watermark',
        title: 'Watermark PDF',
        route: ROUTES.WATERMARK_PDF as HomeToolCard['route'],
        iconBg: '#7C3AED',
        abbreviation: 'W',
        iconName: 'pdf-watermark',
        iconImage: 'tool-watermark-pdf',
      },
      {
        id: 'pdf-lock',
        title: 'Lock PDF',
        route: ROUTES.LOCK_PDF as HomeToolCard['route'],
        iconBg: '#DB2777',
        abbreviation: 'L',
        iconName: 'pdf-lock',
        iconImage: 'tool-lock-pdf',
      },
      {
        id: 'pdf-unlock',
        title: 'Unlock PDF',
        route: ROUTES.UNLOCK_PDF as HomeToolCard['route'],
        iconBg: '#EC4899',
        abbreviation: 'U',
        iconName: 'pdf-unlock',
        iconImage: 'tool-unlock-pdf',
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
        id: 'c-word-pdf',
        title: 'Word to PDF',
        route: ROUTES.DOCUMENT_CONVERTER as HomeToolCard['route'],
        iconBg: '#0369A1',
        abbreviation: 'W→P',
        iconName: 'converter',
        iconImage: 'tool-word-to-pdf',
      },
      {
        id: 'c-pdf-word',
        title: 'PDF to Word',
        route: ROUTES.DOCUMENT_CONVERTER as HomeToolCard['route'],
        iconBg: '#0284C7',
        abbreviation: 'P→W',
        iconName: 'converter',
        iconImage: 'tool-pdf-to-word',
      },
      {
        id: 'c-pdf-ppt',
        title: 'PDF to PowerPoint',
        route: ROUTES.DOCUMENT_CONVERTER as HomeToolCard['route'],
        iconBg: '#0891B2',
        abbreviation: 'P→S',
        iconName: 'converter',
        iconImage: 'tool-pdf-to-ppt',
      },
      {
        id: 'c-pdf-xls',
        title: 'PDF to Excel',
        route: ROUTES.DOCUMENT_CONVERTER as HomeToolCard['route'],
        iconBg: '#0E7490',
        abbreviation: 'P→X',
        iconName: 'converter',
        iconImage: 'tool-pdf-to-excel',
      },
      {
        id: 'c-img-pdf',
        title: 'Image to PDF',
        route: ROUTES.DOCUMENT_CONVERTER as HomeToolCard['route'],
        iconBg: '#155E75',
        abbreviation: 'I→P',
        iconName: 'converter',
        iconImage: 'tool-image-to-pdf',
      },
      {
        id: 'c-pdf-img',
        title: 'PDF to Image',
        route: ROUTES.DOCUMENT_CONVERTER as HomeToolCard['route'],
        iconBg: '#0F766E',
        abbreviation: 'P→I',
        iconName: 'converter',
        iconImage: 'tool-pdf-to-image',
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
        id: 'qr-scan',
        title: 'QR / Barcode Scanner',
        route: ROUTES.QR_SCANNER as HomeToolCard['route'],
        iconBg: '#A16207',
        abbreviation: '▣',
        iconName: 'qr-scan',
        iconImage: 'tool-qr-scanner',
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
  { key: 'convert', title: 'Convert', route: ROUTES.DOCUMENT_CONVERTER },
] as const;
